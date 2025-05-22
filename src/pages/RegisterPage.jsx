import { useMsal } from '@azure/msal-react';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useFetch } from '../hooks/useFetch';
import { Modal } from '../components/Modal';
import { BasicDataTableGraphic } from "../components/graphics/BasicDataTableGraphic"

export const RegisterPage = () => {
  // login
  const { accounts } = useMsal();
  const username = accounts.length > 0;

  // datos estaticos para la pagina
  const projectsTableName = "proyectos";
  const devicesTableName = "dispositivos";
  const sensorTableName = "sensores";

  // Para agregar dispositivo o sensor 
  const [selectedHiddenData, setSelectedHiddenData] = useState({});
  const [selectedTable, setSelectedTable] = useState("");
  const [selectedAction, setSelectedAction] = useState('');
  
  // Formatos para la UI de las opciones a seleccionar: {value: id, label: }
  const [projectOptions, setProjectOptions] = useState([]);
  const [deviceOptions, setDeviceOptions] = useState([]);
  

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddSensorModal, setShowAddSensorModal] = useState(false);
  const [formKeys, setFormKeys] = useState([]);

  // Datos para tabla sensores
  const [options, setOptions] = useState([]);
  const { data: tableData, setUrl: tableDataSetUrl } = useFetch('');
  

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const itemsPerPage = rowsPerPage;
  const primaryKey = 0;

  const { data: projectsData } = useFetch(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=${projectsTableName}`);
  const { data: devicesData, setUrl: devicesSetUrl } = useFetch('');
  const { data: sensorsData, setUrl: sensorsSetUrl } = useFetch('');
  const { data: tableDataSchema, setUrl: tableDataSchemaSetUrl } = useFetch('');
  const { data: sensorTableSchema, setUrl: sensorTableSchemaSetUrl } = useFetch('');
  // const sensorDataSchema = [{id_sensor: PRI}]


  useEffect(() => {
    // if (tableName !== "" && tableDataSetUrl) {  
    // Obtener el esquema de la tabla
    let urlSchema = `${import.meta.env.VITE_API_URL}/schema?tabla=${devicesTableName}`;
    let urlSensorSchema = `${import.meta.env.VITE_API_URL}/schema?tabla=${sensorTableName}`;
    tableDataSchemaSetUrl(urlSchema);
    sensorTableSchemaSetUrl(urlSensorSchema);
    // setFormKeys(tableDataSchema);

    console.log("tableData", tableData);
    console.log("tableData state", sensorTableSchema);
    // }
  }, []);

  useEffect(() => {
    devicesSetUrl(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=${devicesTableName}&id_proyecto=${selectedProject?.value || ''}`);
  }, [selectedProject])
  
  useEffect(() => {
    sensorsSetUrl(`${import.meta.env.VITE_API_URL}/listarSensores?id_dispositivo=${selectedDevice?.value || ''}`);
    // console.log("Disparando fetch para:", !tableName && tableName, "con clave primaria:", primaryKey);
    const url = `${import.meta.env.VITE_API_URL}/listarDatos?tabla=sensores_en_dispositivo&id_dispositivo=${selectedProject?.value}&limite=${rowsPerPage}&offset=${(currentPage - 1) * rowsPerPage}`;
    tableDataSetUrl(url);
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
    console.log(tableData);
  }, [tableData]);



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
    setSelectedHiddenData({ 'id_dispositivo': selectedDevice?.value || '' });
    let formKeys = sensorTableSchema.map(x => x.Field);
    // sensorsData no tiene la misma estructura que la tabla sensores, por eso no puedo utilizar las keys como en devicesData...
    // let formKeys = ['id_sensor_tipo', 'id_estado', 'numero_serial', 'fecha_compra', 'proveedor', 'precio'];
    setFormKeys(formKeys);
    setShowAddSensorModal(prev => !prev);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowAddSensorModal(false);
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
      {/* <Modal
        type={"warning"}
        action={selectedAction}
        title={"Agregar dispositivo"}
        id="addModal"
        properties={dev}
        isOpen={showAddModal}
        onClose={handleCloseModal}
        tableName={selectedTable}
        hiddenData={selectedHiddenData}
      /> */}
      {/* <Modal
        type={"warning"}
        action={selectedAction}
        title={"Agregar sensor"}
        id="addModal"
        // properties={["Hola","sfjslf"]}

        properties={sensorTableSchema}
        isOpen={showAddSensorModal}
        onClose={handleCloseModal}
        tableName={"sensores"}
        hiddenData={selectedHiddenData}
      /> */}
      <div className="container-fluid d-flex justify-content-center align-items-center">
        <div className="card w-100">
          <h2 className="card-title">Dispositivos</h2>
          <div className="card-content">
            {username && (
              <div>
                <p>Utilice esta página para gestionar sus sensores y dispositivos.</p>
                <div className="dropdown row mb-4 col-3 align-items-start">
                  <Select
                    id="project-select"
                    options={projectOptions}
                    onChange={handleProjectChange}
                    value={selectedProject}
                    placeholder="Seleccione un proyecto"
                    className="mt-2 w-100"
                    styles={customStyles}
                  />
                </div>
                <div className="row">
                  {/* Left Column: Filters */}
                  <div className="col-3">
                    <h5>Dispositivos</h5>
                    {/* Pagination Controls */}
                    {deviceOptions.length > 10 && (
                      <div className="row d-flex justify-content-center align-items-center">
                        <div className="pagination my-3">
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
                    <ul className="list-group">
                      {paginatedOptions.map((device) => (
                        <li
                          key={device.value}
                          className={`list-group-item mx-0 ${device === selectedDevice ? 'active' : ''}`}
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
                  <div className="col-9">
                    { tableData &&
                      options && 
                      // tableName && 
                      username && 
                      tableData  
                      //  ? (options.map((opt) => (
                      // tableName === opt.dataName && 
                      ?(
                        <BasicDataTableGraphic tableTitle={"Sensores en el dispositivo"}  tableData={tableData.data.tableData} tablePrimaryKey={primaryKey} onDelete={()=>{console.log(handleDelete)}} handleOnClickEdit={()=> console.log(handleOnClickEdit)} onEdit={()=>console.log(handleEdit)} />
                ) 
                : (
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
    </>
  );
};
