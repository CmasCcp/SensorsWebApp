import { useMsal } from '@azure/msal-react';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useFetch } from '../hooks/useFetch';
import { Modal } from '../components/Modal';
import useForeignKeyValidator from '../hooks/useForeignKeyValidator';

export const DataPage = () => {
  const { accounts } = useMsal();
  const username = accounts.length > 0;
  const projectsTableName = "proyectos";
  const devicesTableName = "dispositivos";

  const [projectOptions, setProjectOptions] = useState([]);
  const [deviceOptions, setDeviceOptions] = useState([]);//['Dispositivo 1', 'Dispositivo 2', 'Dispositivo 3'];
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deviceKeys, setDeviceKeys] = useState([]);

  const { data: projectsData, hasError: projectsHasError } = useFetch(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=${projectsTableName}`);
  const { data: devicesData, hasError: devicesHasError, setUrl: devicesSetUrl } = useFetch('');
  const { data: sensorsData, hasError: sensorsHasError, setUrl: sensorsSetUrl, url: sensorsUrl } = useFetch('');

  const { getTableName,getTableNameSingular } = useForeignKeyValidator();


  useEffect(() => {
    devicesSetUrl(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=${devicesTableName}&id_proyecto=${selectedProject?.value || ''}`);
    sensorsSetUrl(`${import.meta.env.VITE_API_URL}/listarDatosEstructurados?tabla=datos&disp.id_proyecto=${selectedProject?.value || ''}`);
  }, [selectedProject])

  useEffect(() => {
    sensorsSetUrl(`${import.meta.env.VITE_API_URL}/listarDatosEstructurados?tabla=datos&disp.id_proyecto=${selectedProject?.value || ''}&codigo_interno=${selectedDevice?.label || ''}`);
  }, [selectedDevice])

  useEffect(() => {
    try {
      if (projectsData && projectsData.status === 'success') {
        const options = projectsData.data.tableData.map((project) => ({
          value: project.id_proyecto,
          label: `${project.id_proyecto}. ${project.nombre}`
        }));
        setProjectOptions(options);
      } else {
        console.error('Error fetching projects by request:', projectsHasError);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }

  }, [projectsData]);


  useEffect(() => {
    try {
      if (devicesData && devicesData.status === 'success') {
        const options = devicesData.data.tableData.map((device) => ({
          value: device.id_dispositivo,
          label: device.codigo_interno,
        }));
        setDeviceOptions(options);
      } else {
        console.error('Error fetching projects by request:', devicesHasError);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }

  }, [devicesData]);

  useEffect(() => {
    try {
      if (sensorsData && sensorsData.status === 'success') {
        const options = sensorsData.data.tableData;
        setTableData(options);
      } else {
        console.error('Error fetching projects by request:', sensorsHasError);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }, [sensorsData])

  const handleProjectChange = (selectedProject) => {
    setSelectedProject(selectedProject);
    setSelectedDevice(null); // Reset filter when project changes
  };

  const handleDeviceChange = (selectedDevice) => {
    setSelectedDevice(selectedDevice);
  };

  const handleCloseModal = () => {
    setShowAddModal(prev=>!prev);
  };

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: '300px',
      zIndex: 3, // Ensure dropdown is on top

    }),
    menu: (provided) => ({
      ...provided,
      width: '300px',
      zIndex: 5, // Ensure dropdown is on top

    }),
  };

  return (
    <>
      <Modal
        type={"warning"}
        action={"Agregar"}
        title={"Agregar fila"}
        id="addModal"
        properties={deviceKeys}
        isOpen={showAddModal}
        onClose={handleCloseModal}
        tableName={"dispositivos"}
      />
      <div className="container-fluid d-flex justify-content-center align-items-center">
        <div className="card w-100">
          <h2 className="card-title">Datos</h2>
          <div className="card-content">
            {username && (
              <div>
                <p>Utilice esta página para visualizar y descargar sus datos.</p>
                <div className="row d-flex justify-content-around">
                  <div className="dropdown mb-4">
                    <Select
                      id="project-select"
                      options={projectOptions}
                      onChange={handleProjectChange}
                      value={selectedProject}
                      placeholder="Seleccione un proyecto"
                      className="mt-2"
                      styles={customStyles}
                    />
                  </div>
                  <div className="dropdown mb-4">
                    <Select
                      id="device-select"
                      options={deviceOptions}
                      onChange={handleDeviceChange}
                      value={selectedDevice}
                      placeholder="Seleccione un dispositivo"
                      className="mt-2"
                      styles={customStyles}
                    />
                  </div>
                  <div>
                    <button className="btn m-1 ml-auto custom-button" onClick={() => {useFetch(`${sensorsUrl}&formato=csv`)}}>
                      <span className="btn-text">Descargar CSV</span>
                      <i className="fas fa-plus-circle"></i>
                    </button>
                  </div>

                </div>

                <div className="row">
                    {selectedProject && tableData.length > 0 ? (
                      <div style={{ overflowX: 'auto' }}>
                        <table className="table table-bordered">
                          <thead>
                          <tr>
                            {tableData.length > 0 &&
                              Object.keys(tableData[0]).map((key, index) => (
                                <th key={index}>{key}</th>
                              ))}
                          </tr>
                          </thead>
                          <tbody>
                            {tableData.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {Object.values(row).map((value, colIndex) => (
                                  <td key={colIndex}>{value}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="row my-4">
                        </div>
                      </div>
                    ) : (
                      <p>Seleccione un proyecto para ver los datos.</p>
                    )}
                </div>
              </div>
            )}
            {!username && (
              <>
                <h2>Acceso Restringido</h2>
                <p>Para ver este contenido, es necesario que inicies sesión.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};


// TODO: por qué no se muestran los nuevos dispositivos?? Por "data", el id del proyecto y estado se guardan como nulos