import { useMsal } from '@azure/msal-react';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useFetch } from '../hooks/useFetch';
import { Modal } from '../components/Modal';

export const RegisterPage = () => {
  const { accounts } = useMsal();
  const username = accounts.length > 0;
  const projectsTableName = "proyectos";
  const devicesTableName = "dispositivos";
  const [selectedHiddenData, setSelectedHiddenData] = useState({});
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedAction, setSelectedAction] = useState('');

  const [projectOptions, setProjectOptions] = useState([]);
  const [deviceOptions, setDeviceOptions] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [formKeys, setFormKeys] = useState([]);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { data: projectsData } = useFetch(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=${projectsTableName}`);
  const { data: devicesData, setUrl: devicesSetUrl } = useFetch('');
  const { data: sensorsData, setUrl: sensorsSetUrl } = useFetch('');

  useEffect(() => {
    devicesSetUrl(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=${devicesTableName}&id_proyecto=${selectedProject?.value || ''}`);
  }, [selectedProject])

  useEffect(() => {
    sensorsSetUrl(`${import.meta.env.VITE_API_URL}/listarSensores?id_dispositivo=${selectedDevice?.value || ''}`);
  }, [selectedDevice])

  useEffect(() => {
    if (projectsData && projectsData.status === 'success') {
      const options = projectsData.data.tableData.map((project) => ({
        value: project.id_proyecto,
        label: `${project.id_proyecto}. ${project.nombre}`,
      }));
      setProjectOptions(options);
    }
  }, [projectsData]);

  useEffect(() => {
    if (devicesData && devicesData.status === 'success') {
      const options = devicesData.data.tableData.map((device) => ({
        value: device.id_dispositivo,
        label: device.codigo_interno,
      }));
      setDeviceOptions(options);
      setCurrentPage(1); // Reset to the first page on data change
    }
  }, [devicesData]);

  useEffect(() => {
    if (sensorsData && sensorsData.status === 'success') {
      const options = sensorsData.data.tableData;
      setTableData(options);
    }
  }, [sensorsData]);

  const handleProjectChange = (selectedProject) => {
    setSelectedProject(selectedProject);
    setSelectedDevice(null); // Reset filter when project changes
  };

  const handleFilterClick = (filter) => {
    setSelectedDevice(filter);
  };

  const handleOnClickAddDevice = () => {
    setSelectedTable("dispositivos");
    setSelectedAction("Agregar");
    setSelectedHiddenData({ "id_proyecto": selectedProject?.value || '' });
    let excludedKeys = ['id_proyecto', 'id_dispositivo'];
    let formKeys = Object.keys(devicesData?.data?.tableData[0] || {}).filter(key => !excludedKeys.includes(key));
    setFormKeys(formKeys);
    setShowAddModal(prev => !prev);
  };

  const handleOnClickAddSensor = () => {
    //let excludedKeys = ['id_proyecto', 'id_dispositivo'];
    setSelectedTable("sensores");
    setSelectedAction("Agregar Sensor");
    setSelectedHiddenData({'id_dispositivo': selectedDevice?.value || ''});
    // sensorsData no tiene la misma estructura que la tabla sensores, por eso no puedo utilizar las keys como en devicesData...
    let formKeys = ['id_sensor_tipo', 'id_estado', 'numero_serial', 'fecha_compra', 'proveedor', 'precio'];
    setFormKeys(formKeys);
    setShowAddModal(prev => !prev);
  };

  const handleCloseModal = () => {
    setShowAddModal(prev => !prev);
  };

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? 'black' : 'gray', // Cambia el color del borde
      boxShadow: state.isFocused ? '0 0 0 2px rgba(44, 44, 44, 0.3)' : 'none', // Sombra en focus
      '&:hover': {
        borderColor: 'black', // Color al pasar el mouse
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected
        ? 'rgb(44, 44, 44)' // Color de la opción seleccionada
        : state.isFocused
        ? 'rgba(44, 44, 44, 0.1)' // Color al pasar el mouse sobre una opción
        : 'white',      
      color: state.isSelected
      ? 'white'
      : 'black', // Color del texto de las opciones
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'gray', // Cambia el color del texto del placeholder
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'black', // Cambia el color del texto seleccionado
    }),
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

  // Pagination logic
  const totalPages = Math.ceil(deviceOptions.length / itemsPerPage);
  const paginatedOptions = deviceOptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <Modal
        type={"warning"}
        action={selectedAction}
        title={"Agregar fila"}
        id="addModal"
        properties={formKeys}
        isOpen={showAddModal}
        onClose={handleCloseModal}
        tableName={selectedTable}
        hiddenData={selectedHiddenData}
      />
      <div className="container-fluid d-flex justify-content-center align-items-center">
        <div className="card w-100">
          <h2 className="card-title">Dispositivos</h2>
          <div className="card-content">
            {username && (
              <div>
                <p>Utilice esta página para gestionar sus sensores y dispositivos.</p>
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
                <div className="row">
                  {/* Left Column: Filters */}
                  <div className="col-2">
                    <h5>Dispositivos</h5>
                    <ul className="list-group">
                      {paginatedOptions.map((device) => (
                        <li
                          key={device.value}
                          className={`list-group-item ${device === selectedDevice ? 'active' : ''}`}
                          onClick={() => handleFilterClick(device)}
                          style={{ cursor: 'pointer' }}
                        >
                          {device.label}
                        </li>
                      ))}
                      {selectedProject && (
                        <li className='list-group-item' onClick={handleOnClickAddDevice} style={{ cursor: 'pointer' }}>Agregar Dispositivo</li>
                      )}
                    </ul>
                  </div>
                  {/* Right Column: Data Table */}
                  <div className="col-10">
                    <h5>Sensores</h5>
                    {selectedDevice && tableData.length > 0 ? (
                      <div style={{ overflowX: 'auto' }}>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              {tableData[0].map((header, index) => (
                                <th key={index}>{header}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {tableData.slice(1).map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.map((value, colIndex) => (
                                  <td key={colIndex}>{value}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        <div className="row my-4">
                          <button className="btn m-1 ml-auto custom-button" onClick={handleOnClickAddSensor}>
                            <span className="btn-text">Agregar Sensor</span>
                            <i className="fas fa-plus-circle"></i>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p>Seleccione un filtro para ver los datos.</p>
                    )}
                  </div>
                  {/* Pagination Controls */}
                  {deviceOptions.length > 10 && (
                    <div className="row w-100 d-flex justify-content-center align-items-center">
                      <div className="pagination mt-3">
                        <button 
                          className="btn btn-outline-dark mx-1" 
                          onClick={() => goToPage(1)} 
                          disabled={currentPage === 1}
                        >
                          {'<<'}
                        </button>
                        <button 
                          className="btn btn-outline-dark mx-1" 
                          onClick={() => goToPage(currentPage - 1)} 
                          disabled={currentPage === 1}
                        >
                          {'<'}
                        </button>
                        <span className="px-3 d-flex align-items-center">
                          <strong>{currentPage}</strong>
                        </span>
                        <button 
                          className="btn btn-outline-dark mx-1" 
                          onClick={() => goToPage(currentPage + 1)} 
                          disabled={currentPage === totalPages}
                        >
                          {'>'}
                        </button>
                        <button 
                          className="btn btn-outline-dark mx-1" 
                          onClick={() => goToPage(totalPages)} 
                          disabled={currentPage === totalPages}
                        >
                          {'>>'}
                        </button>
                      </div>
                      </div>
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
