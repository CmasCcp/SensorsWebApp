import { useMsal } from '@azure/msal-react';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useFetch } from '../hooks/useFetch';
import { Modal } from '../components/Modal';
import { BasicDataTableGraphic } from "../components/graphics/BasicDataTableGraphic"

export const RegisterPage = () => {
  // login
  const { accounts } = useMsal();
  // const username = accounts.length > 0;
  const username = true;

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


  const [selectedProject, setSelectedProject] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAddSensorModal, setShowAddSensorModal] = useState(false);
  const [formKeys, setFormKeys] = useState([]);

  // Datos para tabla sensores
  // const [options, setOptions] = useState([]);
  // const { data: tableData, setUrl: tableDataSetUrl } = useFetch('');


  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const itemsPerPage = rowsPerPage;
  const primaryKey = 0;

  const { data: projectsData } = useFetch(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=${projectsTableName}`);
  const { data: devicesData, setUrl: devicesSetUrl } = useFetch('');
  const { data: sensorsData, setUrl: sensorsSetUrl } = useFetch('');
  const { data: deviceSchema, setUrl: deviceSchemaSetUrl } = useFetch('');
  const { data: sensorTableSchema, setUrl: sensorTableSchemaSetUrl } = useFetch('');


  useEffect(() => {
    // if (tableName !== "" && tableDataSetUrl) {  
    // Obtener el esquema de la tabla
    let urlSchema = `${import.meta.env.VITE_API_URL}/schema?tabla=${devicesTableName}`;
    let urlSensorSchema = `${import.meta.env.VITE_API_URL}/schema?tabla=${sensorTableName}`;
    deviceSchemaSetUrl(urlSchema);
    sensorTableSchemaSetUrl(urlSensorSchema);
    // setFormKeys(tableDataSchema);

    // console.log("tableData", tableData);
    // console.log("tableData state", sensorTableSchema);
    // }
  }, []);

  useEffect(() => {
    console.log("sensorsdata", sensorsData?.data);
  }, [sensorsData])

  useEffect(() => {
    console.log(selectedProject);

    devicesSetUrl(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=${devicesTableName}&id_proyecto=${selectedProject?.value || ''}`);
    
    //TODO: AGREGAR ESTE FILTRO ID PROYECTO EN API 
    // http://localhost:8084/listarSensores?id_proyecto=9
    // REVISAR EFECTO DE deviceOptions
    // sensorsSetUrl(`${import.meta.env.VITE_API_URL}/listarSensores?id_dispositivo=${selectedDevice?.value || ''}`);

    // const url = `${import.meta.env.VITE_API_URL}/listarDatos?tabla=sensores_en_dispositivo&id_dispositivo=${selectedProject?.value}&limite=${rowsPerPage}&offset=${(currentPage - 1) * rowsPerPage}`;
  }, [selectedProject])

  useEffect(() => {
    let devices_ids = deviceOptions.map(x => x.value);
    devices_ids = JSON.stringify(devices_ids)
    devices_ids = devices_ids.slice(1, -1)
    if(devices_ids != ""){
      sensorsSetUrl(`${import.meta.env.VITE_API_URL}/listarSensores?id_dispositivo=${devices_ids || '0'}`);
      console.log("devices_ids", devices_ids);
    }else{
      sensorsSetUrl(`${import.meta.env.VITE_API_URL}/listarSensores?id_dispositivo=${'0'}`);
      console.log("devices_ids", devices_ids);
    }
    // else if(){}
  }, [deviceOptions])

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

  const handleProjectChange = (selectedProject) => {
    console.log("selectedProject", selectedProject);
    setSelectedProject(selectedProject);
    setSelectedDevice(""); // Reset filter when project changes
  };

  const handleFilterClick = (filter) => {
    setSelectedDevice(filter);
  };

  const handleOnClickAddDevice = () => {
    // console.log("add")
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
      <Modal
        type={"warning"}
        action={selectedAction}
        title={"Agregar dispositivo"}
        id="addModal"
        properties={deviceSchema}
        isOpen={showAddModal}
        onClose={handleCloseModal}
        tableName={selectedTable}
        hiddenData={selectedHiddenData}
      />
      <Modal
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
      />
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
                    {(!!sensorsData && sensorsData?.data.tableData.length > 0)
                      ? (<>
                        {/* TODO cuando selecciono un proyecto sin dispositivos, este renderiza todos los sensores de la base de datos. Hay que revisar el flujo. */}
                        <BasicDataTableGraphic tableTitle={selectedDevice !== "" ? `Sensores en el dispositivo: ${selectedDevice?.label}` : (selectedProject !== "" ? `Sensores en el proyecto: ${selectedProject?.label.substring(3)}` : "Sensores totales")} tableData={sensorsData?.data?.tableData || []} tablePrimaryKey={primaryKey} onDelete={() => { console.log(handleDelete) }} handleOnClickEdit={() => console.log(handleOnClickEdit)} onEdit={() => console.log(handleEdit)} />
                        {/* <BasicDataTableGraphic tableTitle={selectedDevice !== "" ? `Sensores en el dispositivo: ${selectedDevice?.label}` : ( selectedProject !== "" ?  `Sensores en el proyecto: ${selectedProject?.label.substring(3)}` : "Sensores totales")}  tableData={[]} tablePrimaryKey={primaryKey} onDelete={()=>{console.log(handleDelete)}} handleOnClickEdit={()=> console.log(handleOnClickEdit)} onEdit={()=>console.log(handleEdit)} /> */}

                      </>
                      )
                      :
                      (
                        <p>Seleccione un filtro para ver los datos.</p>
                      )
                    }

                    {<div className="row my-4">
                      {selectedDevice !== "" &&
                        <button className="btn m-1 ml-auto custom-button" onClick={handleOnClickAddSensor}>
                          <span className="btn-text">Agregar Sensor</span>
                          <i className="fas fa-plus-circle"></i>
                        </button>
                      }
                    </div>}
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
