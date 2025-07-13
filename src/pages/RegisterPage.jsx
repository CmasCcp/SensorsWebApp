import { useMsal } from '@azure/msal-react';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useFetch } from '../hooks/useFetch';
import { Modal } from '../components/Modal';
import { BasicDataTableGraphic } from "../components/graphics/BasicDataTableGraphic"
import { data as variables } from "../variables.json"
import { data as variablesEnSensoresTipo } from "../variables_en_sensores.json"

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

  // Estados para construir URL GET

  const [variablesEnSensores, setVariablesEnSensores] = useState([]) // [{idSensor: 1, idSensorTipo: 2, idVariable: 3, }]

  // Datos para tabla sensores
  // const [options, setOptions] = useState([]);
  // const { data: tableData, setUrl: tableDataSetUrl } = useFetch('');


  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const itemsPerPage = rowsPerPage;
  const primaryKey = "Id Sensor";

  const { data: projectsData } = useFetch(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=${projectsTableName}`);
  const { data: devicesData, setUrl: devicesSetUrl } = useFetch('');
  const { data: sensorsData, setUrl: sensorsSetUrl } = useFetch('');
  const { data: deviceSchema, setUrl: deviceSchemaSetUrl } = useFetch('');
  const { data: sensorTableSchema, setUrl: sensorTableSchemaSetUrl } = useFetch('');
  // const { data: variablesEnSensoresTipo, setUrl: variablesEnSensoresTipoSetUrl } = useFetch('');


  useEffect(() => {
    let urlSchema = `${import.meta.env.VITE_API_URL}/schema?tabla=${devicesTableName}`;
    let urlSensorSchema = `${import.meta.env.VITE_API_URL}/schema?tabla=${sensorTableName}`;
    deviceSchemaSetUrl(urlSchema);
    sensorTableSchemaSetUrl(urlSensorSchema);

  }, []);

  useEffect(() => {

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
    if (devices_ids != "") {
      sensorsSetUrl(`${import.meta.env.VITE_API_URL}/listarSensores?id_dispositivo=${devices_ids || '0'}`);
    } else {
      sensorsSetUrl(`${import.meta.env.VITE_API_URL}/listarSensores?id_dispositivo=${'0'}`);
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
    setSelectedProject(selectedProject);
    setSelectedDevice(""); // Reset filter when project changes
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


  // Buscar las variables para cada sensor tipo

  function getIdVariable(id_sensor_tipo, id_sensor) {
    // Aquí está el JSON que tienes
    const data = {
      "data": {
        "tabla": "variables_en_sensores",
        "tableData": [
          { "idSensorTipo": 1, "idVariable": 1 },
          { "idSensorTipo": 2, "idVariable": 2 },
          { "idSensorTipo": 3, "idVariable": 3 },
          { "idSensorTipo": 4, "idVariable": 4 },
          { "idSensorTipo": 5, "idVariable": 10 },
          { "idSensorTipo": 6, "idVariable": 3 },
          { "idSensorTipo": 6, "idVariable": 6 },
          { "idSensorTipo": 6, "idVariable": 7 },
          { "idSensorTipo": 6, "idVariable": 8 },
          { "idSensorTipo": 7, "idVariable": 11 },
          { "idSensorTipo": 7, "idVariable": 12 },
          { "idSensorTipo": 8, "idVariable": 3 },
          { "idSensorTipo": 8, "idVariable": 6 },
          { "idSensorTipo": 8, "idVariable": 13 },
          { "idSensorTipo": 9, "idVariable": 3 },
          { "idSensorTipo": 9, "idVariable": 6 },
          { "idSensorTipo": 10, "idVariable": 3 },
          { "idSensorTipo": 10, "idVariable": 6 },
          { "idSensorTipo": 11, "idVariable": 3 },
          { "idSensorTipo": 11, "idVariable": 6 },
          { "idSensorTipo": 12, "idVariable": 3 },
          { "idSensorTipo": 12, "idVariable": 14 },
          { "idSensorTipo": 13, "idVariable": 15 },
          { "idSensorTipo": 14, "idVariable": 1 },
          { "idSensorTipo": 17, "idVariable": 3 },
          { "idSensorTipo": 17, "idVariable": 16 },
          { "idSensorTipo": 18, "idVariable": 3 },
          { "idSensorTipo": 18, "idVariable": 5 },
          { "idSensorTipo": 18, "idVariable": 6 },
          { "idSensorTipo": 18, "idVariable": 8 },
          { "idSensorTipo": 18, "idVariable": 9 },
          { "idSensorTipo": 18, "idVariable": 17 },
          { "idSensorTipo": 19, "idVariable": 19 },
          { "idSensorTipo": 20, "idVariable": 18 },
          { "idSensorTipo": 21, "idVariable": 21 },
          { "idSensorTipo": 22, "idVariable": 20 },
          { "idSensorTipo": 23, "idVariable": 22 },
          { "idSensorTipo": 24, "idVariable": 23 },
          { "idSensorTipo": 25, "idVariable": 24 }
        ]
      }
    };

    const label_variable = {
      "data": {
        "tabla": "variables",
        "tableData": [
          {
            "descripcion": "pH ambiental",
            "id_variable": 1,
            "unidad": "pH"
          },
          {
            "descripcion": "Electroconductividad ambiental",
            "id_variable": 2,
            "unidad": "µS/cm"
          },
          {
            "descripcion": "Grados celcius",
            "id_variable": 3,
            "unidad": "°C"
          },
          {
            "descripcion": "Voltaje",
            "id_variable": 4,
            "unidad": "V"
          },
          {
            "descripcion": "Velocidad del viento",
            "id_variable": 5,
            "unidad": "m/s"
          },
          {
            "descripcion": "Humedad",
            "id_variable": 6,
            "unidad": "%"
          },
          {
            "descripcion": "Material particulado PM 1.0",
            "id_variable": 7,
            "unidad": "µg/m³"
          },
          {
            "descripcion": "Material particulado PM 2.5",
            "id_variable": 8,
            "unidad": "µg/m³"
          },
          {
            "descripcion": "Material particulado PM 10",
            "id_variable": 9,
            "unidad": "µg/m³"
          },
          {
            "descripcion": "Miliamperios hora",
            "id_variable": 10,
            "unidad": "mAh"
          },
          {
            "descripcion": "Latitud",
            "id_variable": 11,
            "unidad": "°"
          },
          {
            "descripcion": "Longitud",
            "id_variable": 12,
            "unidad": "°"
          },
          {
            "descripcion": "Presión atmosférica",
            "id_variable": 13,
            "unidad": "hPa"
          },
          {
            "descripcion": "Humedad relativa del Suelo",
            "id_variable": 14,
            "unidad": "% R.H."
          },
          {
            "descripcion": "Intensidad señal telefónica",
            "id_variable": 15,
            "unidad": "Adimensional"
          },
          {
            "descripcion": "Dióxido de Carbono (CO2)",
            "id_variable": 16,
            "unidad": "ppm"
          },
          {
            "descripcion": "Dirección del Viento",
            "id_variable": 17,
            "unidad": "Grados"
          },
          {
            "descripcion": "Óxido Nítrico (NO)",
            "id_variable": 18,
            "unidad": "ppb"
          },
          {
            "descripcion": "Dióxido de Nitrógeno (NO2)",
            "id_variable": 19,
            "unidad": "ppb"
          },
          {
            "descripcion": "Ozono (O3)",
            "id_variable": 20,
            "unidad": "ppb"
          },
          {
            "descripcion": "Monóxido de Carbono (CO)",
            "id_variable": 21,
            "unidad": "ppb"
          },
          {
            "descripcion": "Distancia",
            "id_variable": 22,
            "unidad": "m"
          },
          {
            "descripcion": "Profundidad",
            "id_variable": 23,
            "unidad": "m"
          },
          {
            "descripcion": "Dióxido de Azufre (SO2)",
            "id_variable": 24,
            "unidad": "RAW"
          }
        ]
      },
      "status": "success"
    }

    // const data = variablesEnSensoresTipo;
    // Filtrar el array 'tableData' para obtener los idVariable correspondientes al idSensorTipo
    const result = data.data.tableData.filter(item => item.idSensorTipo === id_sensor_tipo)
      .map(item => { return { "s": id_sensor, "t": id_sensor_tipo, "v": item.idVariable, "l": label_variable.data.tableData.filter(x => x["id_variable"] === item.idVariable).map(y => y.unidad)[0] + "(" + id_sensor + ")" } });

    return result;  // Devuelve un array con los idVariable encontrados
  }

  let idsSensores = sensorsData?.data?.tableData.map(x => { return { "idSensor": x["Id Sensor"], "idSensorTipo": x["Id Sensor Tipo"] } })

  let dataURL = idsSensores?.map(idSensorTipo => { return getIdVariable(idSensorTipo.idSensorTipo, idSensorTipo.idSensor) })

  let idsSensoresString = JSON.stringify(dataURL?.map(sensor => sensor.map(sensorProperties => sensorProperties.s)))
  // Eliminar corchetes, comillas y barras
  let idsSensoresFormated = idsSensoresString
    ?.replace(/\[|\]/g, "") // Elimina los corchetes []
    .replace(/"/g, "")      // Elimina las comillas "
    .replace(/"/g, "")      // Elimina las comillas "
    .replace(/\//g, "")    // Elimina las barras /
  
  
  let idsVariablesString = JSON.stringify(dataURL?.map(sensor => sensor.map(sensorProperties => sensorProperties.v)))
  // Eliminar corchetes, comillas y barras
  let idsVariablesFormated = idsVariablesString
    ?.replace(/\[|\]/g, "") // Elimina los corchetes []
    .replace(/"/g, "")      // Elimina las comillas "
    .replace(/"/g, "")      // Elimina las comillas "
    .replace(/\//g, "")    // Elimina las barras /

  let idsValoresString = JSON.stringify(dataURL?.map(sensor => sensor.map(sensorProperties => sensorProperties.l)))
  // Eliminar corchetes, comillas y barras
  let idsValoresFormated = idsValoresString
    ?.replace(/\[|\]/g, "") // Elimina los corchetes []
    .replace(/"/g, "")      // Elimina las comillas "
    .replace(/"/g, "")      // Elimina las comillas "
    .replace(/\//g, "")    // Elimina las barras /


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
                    {/* https://api-sensores.cmasccp.cl/insertarMedicion?idsSensores=120&idsVariables=10&valores=120 */}

                    <br />
                    <br />
                    NO MOSTRAR LINK SI NO SE SELECCIONA UN DISPOSITIVO
                    <br />
                    <br />


                    {

                      JSON.stringify(dataURL)
                    }



                    <br />
                    <br />
                    idsSensores {

                      JSON.stringify(idsSensoresFormated)?.slice(1, -1)
                      
                    }
                    <br />
                    <br />
                    variables {
                      
                      JSON.stringify(idsVariablesFormated)?.slice(1, -1)
                    }
                    <br />
                    <br />
                    valores {
                      
                      JSON.stringify(idsValoresFormated)?.slice(1, -1)
                    }

                    <br />
                    <br />
                    
                    {sensorsData?.data.tableData.length > 0 && (
                      <>{`LINK: https://api-sensores.cmasccp.cl/insertarMedicion?idsSensores=${JSON.stringify(idsSensoresFormated)?.slice(1, -1)}&idsVariables=${JSON.stringify(idsVariablesFormated)?.slice(1, -1)}&valores=${JSON.stringify(idsValoresFormated)?.slice(1, -1)}`}</>
                    )}
                    <br />
                    <br />

                    {(!!sensorsData && sensorsData?.data.tableData.length > 0)
                      ? (<>
                        {/* TODO cuando selecciono un proyecto sin dispositivos, este renderiza todos los sensores de la base de datos. Hay que revisar el flujo. */}
                        <BasicDataTableGraphic tableTitle={selectedDevice !== "" ? `Sensores en el dispositivo: ${selectedDevice?.label}` : (selectedProject !== "" ? `Sensores en el proyecto: ${selectedProject?.label.substring(3)}` : "Sensores totales")} tableData={sensorsData?.data?.tableData || []} tablePrimaryKey={primaryKey} onDelete={() => { console.log("delete", sensorsData?.data?.tableData) }} handleOnClickEdit={() => console.log(handleOnClickEdit)} onEdit={() => console.log(handleEdit)} />
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
