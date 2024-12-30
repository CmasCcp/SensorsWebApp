import { useMsal } from '@azure/msal-react';
import { useState, useEffect } from 'react';
import Select from 'react-select';
import { useFetch } from '../hooks/useFetch';

export const DataPage = () => {
  const { accounts } = useMsal();
  const username = accounts.length > 0;
  const projectsTableName = "proyectos";
  const devicesTableName = "dispositivos";

  const [projectOptions, setProjectOptions] = useState([]);
  const [deviceOptions, setDeviceOptions] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]); // Array para selección múltiple
  const [selectedDevices, setSelectedDevices] = useState([]); // Array para selección múltiple
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(0);
  const [startDate, setStartDate] = useState(''); // Fecha de inicio
  const [endDate, setEndDate] = useState(''); // Fecha de fin

  const rowsPerPage = 25; // Número máximo de filas por página

  const { data: projectsData } = useFetch(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=${projectsTableName}`);
  const { data: devicesData, setUrl: devicesSetUrl } = useFetch('');
  const { data: sensorsData, setUrl: sensorsSetUrl, url: sensorsUrl } = useFetch('');

  // Actualiza la URL para dispositivos y sensores con base en los proyectos seleccionados
  useEffect(() => {
    if (selectedProjects.length > 0) {
      console.log(sensorsUrl);
      const projectIds = selectedProjects.map((project) => project.value).join(',');
      const deviceIds = selectedDevices.map((device) => device.label).join(',');

      let url = `${import.meta.env.VITE_API_URL}/listarDatosEstructurados?tabla=datos&disp.id_proyecto=${projectIds}&limite=${rowsPerPage}&offset=${(currentPage - 1) * rowsPerPage}`;

      if (startDate) url += `&fecha_inicio=${startDate}`;
      if (endDate) url += `&fecha_fin=${endDate}`;
      if (selectedDevices.length > 0) url += `&codigo_interno=${deviceIds}`;

      devicesSetUrl(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=${devicesTableName}&id_proyecto=${projectIds}`);
      sensorsSetUrl(url);
    }
  }, [selectedProjects, selectedDevices, startDate, endDate, currentPage]);

  // Procesa opciones de proyectos
  useEffect(() => {
    if (projectsData && projectsData.status === 'success') {
      const options = projectsData.data.tableData.map((project) => ({
        value: project.id_proyecto,
        label: `${project.id_proyecto}. ${project.nombre}`,
      }));
      setProjectOptions(options);
    }
  }, [projectsData]);

  // Procesa opciones de dispositivos
  useEffect(() => {
    if (devicesData && devicesData.status === 'success') {
      const options = devicesData.data.tableData.map((device) => ({
        value: device.id_dispositivo,
        label: device.codigo_interno,
      }));
      setDeviceOptions(options);
    }
  }, [devicesData]);

  // Procesa datos de sensores
  useEffect(() => {
    if (sensorsData && sensorsData.status === 'success') {
      setTableData(sensorsData.data.tableData);
      const totalCount = sensorsData.data.totalCount || 0;
      setTotalPages(Math.ceil(totalCount / rowsPerPage));
    } else{
      setTableData([]);
      setTotalPages(0);
    }
  }, [sensorsData]);

  const handleProjectChange = (selectedProjects) => {
    setSelectedProjects(selectedProjects || []); // Permite deseleccionar todo
    setSelectedDevices([]); // Restablece los dispositivos seleccionados
    setCurrentPage(1);
  };

  const handleDeviceChange = (selectedDevices) => {
    setSelectedDevices(selectedDevices || []); // Permite deseleccionar todo
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    setCurrentPage(1); // Resetear a la primera página
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    setCurrentPage(1); // Resetear a la primera página
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

  const downloadFile = async () => {
    try {
      const link = document.createElement('a');
      link.href = `${sensorsUrl}&formato=csv`//URL.createObjectURL(blob);

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error al descargar el archivo:', error);
    }
  };

  return (
    <>
      <div className="container-fluid d-flex justify-content-center align-items-center">
        <div className="card w-100">
          <h2 className="card-title">Datos</h2>
          <div className="card-content">
            {username && (
              <div>
                <p>Utilice esta página para visualizar y descargar sus datos.</p>
                <div className="row d-flex justify-content-around my-2 py-4">
                <div className="col-3">
                  <label htmlFor="start-date">Fecha de inicio</label>
                  <input
                    type="date"
                    id="start-date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    className="form-control"
                  />
                </div>
                <div className="col-3">
                  <label htmlFor="end-date">Fecha de fin</label>
                  <input
                    type="date"
                    id="end-date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    className="form-control"
                  />
                </div>
                </div>
                <div className="row d-flex justify-content-around my-2 py-4">
                  <div className="dropdown mb-4 col-3">
                    <label>Proyectos</label>
                    <Select
                      id="project-select"
                      options={projectOptions}
                      onChange={handleProjectChange}
                      value={selectedProjects}
                      placeholder="Seleccione proyectos"
                      className="mt-2"
                      styles={customStyles}
                      isMulti
                    />
                  </div>
                  <div className="dropdown mb-4 col-3">
                    <label>Dispositivos</label>
                    <Select
                      id="device-select"
                      options={deviceOptions}
                      onChange={handleDeviceChange}
                      value={selectedDevices}
                      placeholder="Seleccione dispositivos"
                      className="mt-2"
                      styles={customStyles}
                      isMulti
                    />
                  </div>                
                </div>
                <div className='row d-flex justify-content-around my-2'>
                {selectedProjects.length > 0 && tableData.length > 0 && (
                    <div>
                    <button className="btn m-1 ml-auto custom-button" onClick={downloadFile}>
                      <span className="btn-text">Descargar CSV</span>
                      <i className="fas fa-plus-circle"></i>
                    </button>
                  </div>
                )}

                </div>
                <div className="row d-flex justify-content-around my-4">
                  {selectedProjects.length > 0 && tableData.length > 0 ? (
                    <div style={{ overflowX: 'auto' }}>
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            {Object.keys(tableData[0]).map((key, index) => (
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
                    </div>
                    
                  ) : (
                    <p>Seleccione proyectos para ver los datos.</p>
                  )}
                </div>
                                
                {selectedProjects.length > 0 && tableData.length > 0 && (<div className="pagination">
                  { Array.from({ length: totalPages }, (_, index) => {
                    const pageNumber = index + 1;

                    // Siempre muestra la primera página
                    if (pageNumber === 1) {
                      return (
                        <button
                          key={index}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`btn ${currentPage === pageNumber ? 'btn-primary' : 'btn-secondary'} m-1`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }

                    // Siempre muestra la última página
                    if (pageNumber === totalPages) {
                      return (
                        <button
                          key={index}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`btn ${currentPage === pageNumber ? 'btn-primary' : 'btn-secondary'} m-1`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }

                    if (
                      (pageNumber >= currentPage - 4 && // Desde 4 páginas antes de la actual
                      pageNumber <= currentPage + 4) ||
                      (currentPage<7 && pageNumber<10)
                    ) {
                      return (
                        <button
                          key={index}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`btn ${currentPage === pageNumber ? 'btn-primary' : 'btn-secondary'} m-1`}
                        >
                          {pageNumber}
                        </button>
                      );
                    }

                    // Mostrar puntos suspensivos cuando haya saltos entre páginas
                    if (
                      (pageNumber === 2 && currentPage > 6) || 
                      (pageNumber === totalPages - 1 && currentPage < totalPages - 5) 
                    ) {
                      return (
                        <span key={index} className="btn disabled m-1">
                          ...
                        </span>
                      );
                    }
                    return null; 
                  })}
                </div>)}
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