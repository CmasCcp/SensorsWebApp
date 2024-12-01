import { useMsal } from '@azure/msal-react';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useFetch } from '../hooks/useFetch';

export const RegisterPage = () => {
  const { accounts } = useMsal();
  const username = accounts[0] && accounts[0].username;
  const proyectsTableName = "proyectos";
  const devicesTableName = "dispositivos";
  const sensorsTableName = "sensores_en_dispositivo";
  const [projectOptions, setProjectOptions] = useState([]);
  const [deviceOptions, setDeviceOptions] = useState([]);//['Dispositivo 1', 'Dispositivo 2', 'Dispositivo 3'];
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [tableData, setTableData] = useState([]);

  const { data: proyectsData, hasError: proyectsHasError, isLoading: proyectsIsLoading } = useFetch(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=${proyectsTableName}`);
  const { data: devicesData, hasError: devicesHasError, isLoading: devicesIsLoading, setUrl: devicesSetUrl } = useFetch(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=${devicesTableName}&id_proyecto=${selectedProject}`);
  const { data: sensorsData, hasError: sensorsHasError, isLoading: sensorsIsLoading, setUrl: sensorsSetUrl } = useFetch(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=${sensorsTableName}&id_dispositivo=${selectedDevice}`);

  useEffect(() =>{
    devicesSetUrl(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=${devicesTableName}&id_proyecto=${selectedProject?.value || ''}`);
  },[selectedProject])

  useEffect(() =>{
    console.log(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=${sensorsTableName}&id_dispositivo=${selectedDevice?.value || ''}`);
    sensorsSetUrl(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=${sensorsTableName}&id_dispositivo=${selectedDevice?.value || ''}`);
  }, [selectedDevice])

  useEffect(() => {
    try{    
        if (proyectsData && proyectsData.status === 'success') {
        const options = proyectsData.data.tableData.map((project) => ({
            value: project.id_proyecto,
            label: `${project.id_proyecto}. ${project.nombre}`,
          }));
          setProjectOptions(options);
    } else {
        console.error('Error fetching projects by request:', proyectsHasError);
      }} catch (error) {
        console.error('Error fetching projects:', error);
      }

  }, [proyectsData]);


  useEffect(() => {
    try{    
        if (devicesData && devicesData.status === 'success') {
        const options = devicesData.data.tableData.map((device) => ({
            value: device.id_dispositivo,
            label: device.codigo_interno,
          }));
          setDeviceOptions(options);
    } else {
        console.error('Error fetching projects by request:', devicesHasError);
      }} catch (error) {
        console.error('Error fetching projects:', error);
      }

  }, [devicesData]);

  useEffect(()=>{
    try{    
        if (sensorsData && sensorsData.status === 'success') {
        const options = sensorsData.data.tableData;
        console.log(options);
        setTableData(options);
    } else {
        console.error('Error fetching projects by request:', sensorsHasError);
      }} catch (error) {
        console.error('Error fetching projects:', error);
      } 
  },[sensorsData])

  const handleProjectChange = (selectedProject) => {
    setSelectedProject(selectedProject);
    setSelectedDevice(null); // Reset filter when project changes
  };

  const handleFilterClick = (filter) => {
    setSelectedDevice(filter);
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
                    {deviceOptions.map((device) => (
                      <li
                        key={device}
                        className={`list-group-item ${
                          device === selectedDevice ? 'active' : ''
                        }`}
                        onClick={() => handleFilterClick(device)}
                        style={{ cursor: 'pointer' }}
                      >
                        {device.label}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Right Column: Data Table */}
                <div className="col-10">
                  <h5>Sensores</h5>
                  {selectedDevice &&tableData.lenght>0 ? (
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData[selectedDevice]?.map((row) => (
                          <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>{row.name}</td>
                            <td>{row.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>Seleccione un filtro para ver los datos.</p>
                  )}
                </div>
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
  );
};
