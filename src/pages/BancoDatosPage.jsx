import { useMsal } from '@azure/msal-react';
import { useState, useEffect } from 'react';

export const BancoDatosPage = () => {
  const { accounts } = useMsal();
  const username = accounts.length > 0;
  const visitorLoggedIn = localStorage.getItem("visitorLoggedIn") === "true";
  
  const [projects, setProjects] = useState([]);
  const [projectsMapping, setProjectsMapping] = useState({}); // Mapeo ID -> nombre
  const [selectedProject, setSelectedProject] = useState('');
  const [csvFiles, setCsvFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]); // Archivos seleccionados para descarga múltiple
  const [isDownloading, setIsDownloading] = useState(false); // Estado de descarga múltiple
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar lista de proyectos desde el backend
  const loadProjects = async () => {
    setIsLoadingProjects(true);
    setError(null);
    try {
      // 1. Obtener información de proyectos desde la API de sensores (nombres y detalles)
      const projectsInfoResponse = await fetch('https://api-sensores.cmasccp.cl/listarDatos?tabla=proyectos');
      if (!projectsInfoResponse.ok) {
        throw new Error(`Error obteniendo info de proyectos: ${projectsInfoResponse.status}`);
      }
      const projectsInfoData = await projectsInfoResponse.json();
      
      // 2. Obtener lista de proyectos con archivos disponibles
      const availableProjectsResponse = await fetch(`${import.meta.env.VITE_API_URL}/listarProyectos`);
      if (!availableProjectsResponse.ok) {
        throw new Error(`Error obteniendo proyectos disponibles: ${availableProjectsResponse.status}`);
      }
      const availableProjectsData = await availableProjectsResponse.json();
      
      console.log('Info de proyectos (BD):', projectsInfoData);
      console.log('Proyectos disponibles (archivos):', availableProjectsData);
      
      // 3. Crear mapeo de ID -> información del proyecto
      const projectsInfo = projectsInfoData.data?.tableData || [];
      const mapping = {};
      projectsInfo.forEach(project => {
        mapping[project.id_proyecto] = {
          id: project.id_proyecto,
          nombre: project.nombre,
          descripcion: project.descripcion,
          fecha_inicio: project.fecha_inicio,
          fecha_fin: project.fecha_fin
        };
      });
      
      // 4. Filtrar solo los proyectos que tienen archivos disponibles
      const availableProjectIds = availableProjectsData.proyectos || [];
      const availableProjectsWithInfo = availableProjectIds
        .map(id => parseInt(id))
        .filter(id => mapping[id])
        .map(id => ({
          id: id,
          nombre: mapping[id].nombre,
          descripcion: mapping[id].descripcion
        }));
      
      setProjectsMapping(mapping);
      setProjects(availableProjectsWithInfo);
      
      // Seleccionar el primer proyecto automáticamente si hay proyectos
      if (availableProjectsWithInfo.length > 0 && !selectedProject) {
        setSelectedProject(availableProjectsWithInfo[0].id.toString());
      }
    } catch (err) {
      console.error('Error cargando proyectos:', err);
      setError(err.message);
      setProjects([]);
      setProjectsMapping({});
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // Cargar lista de archivos CSV desde el backend para el proyecto seleccionado
  const loadCsvFiles = async (projectId = selectedProject) => {
    if (!projectId) {
      setCsvFiles([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      // Usar el endpoint listarArchivosCSV con el parámetro proyecto
      const response = await fetch(`${import.meta.env.VITE_API_URL}/listarArchivosCSV?proyecto=${projectId}`);
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      
      console.log('Archivos CSV:', data);
      // La nueva API devuelve { "proyecto": "nombre", "total_archivos": n, "archivos": [{...}, {...}] }
      const filesData = data.archivos || [];
      const processedFiles = filesData.map(fileInfo => ({
        nombre: fileInfo.nombre || fileInfo,
        proyecto: projectId,
        // Usar el nuevo endpoint de descarga dedicado
        downloadUrl: `${import.meta.env.VITE_API_URL}/descargarArchivo/${projectId}/${encodeURIComponent(fileInfo.nombre || fileInfo)}`,
        tamaño: fileInfo.tamaño_legible || 'No disponible',
        tamañoBytes: fileInfo.tamaño_bytes || 0,
        numeroRegistros: null // Este dato no está disponible en el endpoint actual
      }));
      
      setCsvFiles(processedFiles);
    } catch (err) {
      console.error('Error cargando archivos CSV:', err);
      setError(err.message);
      setCsvFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (username || visitorLoggedIn) {
      loadProjects();
    }
  }, [username, visitorLoggedIn]);

  // Cargar archivos CSV cuando cambie el proyecto seleccionado
  useEffect(() => {
    if (selectedProject && (username || visitorLoggedIn)) {
      loadCsvFiles(selectedProject);
    }
  }, [selectedProject, username, visitorLoggedIn]);

  // Manejar cambio de proyecto
  const handleProjectChange = (projectId) => {
    setSelectedProject(projectId);
    setCsvFiles([]); // Limpiar archivos anteriores
    setSelectedFiles([]); // Limpiar selecciones anteriores
  };

  // Manejar descarga de archivos con control de errores
  const handleFileDownload = async (file) => {
    try {
      // Hacer la petición al endpoint de descarga
      const response = await fetch(file.downloadUrl);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Error ${response.status}: ${response.statusText}`);
      }

      // Obtener el blob del archivo
      const blob = await response.blob();
      
      // Crear URL temporal para el archivo
      const url = window.URL.createObjectURL(blob);
      
      // Crear elemento de descarga temporal
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = file.nombre;
      
      // Añadir al DOM, hacer clic y remover
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      // Limpiar URL temporal
      window.URL.revokeObjectURL(url);
      
      console.log(`Archivo ${file.nombre} descargado exitosamente`);
      
    } catch (err) {
      console.error('Error descargando archivo:', err);
      setError(`Error al descargar ${file.nombre}: ${err.message}`);
    }
  };

  // Manejar selección individual de archivos
  const handleFileSelection = (fileName, isSelected) => {
    if (isSelected) {
      setSelectedFiles(prev => [...prev, fileName]);
    } else {
      setSelectedFiles(prev => prev.filter(name => name !== fileName));
    }
  };

  // Manejar selección de todos los archivos
  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      setSelectedFiles(filteredFiles.map(file => file.nombre));
    } else {
      setSelectedFiles([]);
    }
  };

  // Descargar archivos seleccionados
  const handleMultipleDownload = async () => {
    if (selectedFiles.length === 0) {
      setError('No hay archivos seleccionados para descargar');
      return;
    }

    setIsDownloading(true);
    setError(null);
    
    try {
      // Obtener los archivos seleccionados
      const filesToDownload = csvFiles.filter(file => selectedFiles.includes(file.nombre));
      
      // Descargar cada archivo con un pequeño delay para evitar sobrecargar el servidor
      for (let i = 0; i < filesToDownload.length; i++) {
        const file = filesToDownload[i];
        console.log(`Descargando archivo ${i + 1} de ${filesToDownload.length}: ${file.nombre}`);
        
        try {
          await handleFileDownload(file);
          // Pequeño delay entre descargas
          if (i < filesToDownload.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } catch (err) {
          console.error(`Error descargando ${file.nombre}:`, err);
          // Continuar con los otros archivos aunque uno falle
        }
      }
      
      // Limpiar selección después de descargar
      setSelectedFiles([]);
      console.log(`Descarga múltiple completada: ${filesToDownload.length} archivos`);
      
    } catch (err) {
      console.error('Error en descarga múltiple:', err);
      setError(`Error en descarga múltiple: ${err.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  // Función auxiliar para obtener el nombre del proyecto
  const getProjectName = (projectId) => {
    if (!projectId || !projectsMapping[projectId]) {
      return projectId;
    }
    return projectsMapping[projectId].nombre;
  };

  // Filtrar archivos por término de búsqueda
  const filteredFiles = csvFiles.filter(file =>
    file.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="card w-100">
        <h2 className="card-title">
          <i className="fas fa-database me-2"></i>
          Banco de Datos CSV - Proyectos
        </h2>
        <div className="card-content mt-2">
          {(username || visitorLoggedIn) && (
            <>
              <p className="text-muted mb-4">
                Archivos CSV con datos históricos de sensores organizados por proyectos.
              </p>

              {/* Selector de proyectos */}
              <div className="row mb-4">
                <div className="col-md-4">
                  <label className="form-label fw-bold">
                    <i className="fas fa-folder me-2"></i>
                    Seleccionar Proyecto
                  </label>
                  <select 
                    className="form-select form-control" 
                    value={selectedProject} 
                    onChange={(e) => handleProjectChange(e.target.value)}
                    disabled={isLoadingProjects}
                  >
                    <option value="">-- Seleccione un proyecto --</option>
                    {projects.map(project => (
                      <option key={project.id} value={project.id} title={project.descripcion}>
                        {project.nombre} (ID: {project.id})
                      </option>
                    ))}
                  </select>
                  {isLoadingProjects && (
                    <small className="text-muted">
                      <i className="fas fa-spinner fa-spin me-1"></i>
                      Cargando proyectos...
                    </small>
                  )}
                </div>
                
                {selectedProject && (
                  <>
                    <div className="col-md-4">
                      <label className="form-label fw-bold">
                        <i className="fas fa-search me-2"></i>
                        Buscar Archivos
                      </label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="fas fa-search"></i>
                        </span>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Buscar archivos CSV..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="col-md-4 d-flex flex-column">
                      <label className="form-label fw-bold">
                        <i className="fas fa-cogs me-2"></i>
                        Acciones
                      </label>
                      <div className="d-flex align-items-center h-100 flex-wrap gap-2">
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => loadCsvFiles(selectedProject)}
                          disabled={isLoading}
                        >
                          <i className="fas fa-sync-alt me-1"></i>
                          {isLoading ? 'Cargando...' : 'Actualizar'}
                        </button>
                        
                        {selectedFiles.length > 0 && (
                          <button
                            className="btn btn-success btn-sm"
                            onClick={handleMultipleDownload}
                            disabled={isDownloading}
                          >
                            <i className="fas fa-download me-1"></i>
                            {isDownloading ? 'Descargando...' : `Descargar ${selectedFiles.length}`}
                          </button>
                        )}
                        
                        <small className="text-muted">
                          {filteredFiles.length} archivo{filteredFiles.length !== 1 ? 's' : ''}
                          {selectedFiles.length > 0 && (
                            <span className="text-primary ms-2">
                              ({selectedFiles.length} seleccionado{selectedFiles.length !== 1 ? 's' : ''})
                            </span>
                          )}
                        </small>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Navegación de proyectos con botones
              {projects.length > 0 && (
                <div className="mb-4">
                  <div className="d-flex flex-wrap gap-2">
                    {projects.map(project => (
                      <button
                        key={project.id}
                        className={`btn ${selectedProject === project.id.toString() ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                        onClick={() => handleProjectChange(project.id.toString())}
                        style={{ fontSize: '0.8rem' }}
                        title={project.descripcion}
                      >
                        <i className="fas fa-folder me-1"></i>
                        {project.nombre}
                      </button>
                    ))}
                  </div>
                </div>
              )} */}

              {/* Estados de carga y error */}
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {/* Lista de archivos CSV */}
              {!selectedProject ? (
                <div className="text-center py-5">
                  <i className="fas fa-folder-open fa-3x text-muted mb-3"></i>
                  <p className="text-muted mb-0">Selecciona un proyecto para ver sus archivos CSV.</p>
                  <p className="text-muted">Usa el selector de arriba o los botones de navegación rápida.</p>
                </div>
              ) : isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                  </div>
                  <p className="mt-2 text-muted">Cargando archivos CSV del proyecto {getProjectName(selectedProject)}...</p>
                </div>
              ) : (
                <>
                  {filteredFiles.length === 0 ? (
                    <div className="text-center py-5">
                      <i className="fas fa-file-csv fa-3x text-muted mb-3"></i>
                      <p className="text-muted mb-0">No se encontraron archivos CSV en este proyecto.</p>
                      <p className="text-muted">Intenta actualizar la lista o verifica que el proyecto contenga archivos CSV.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover table-striped align-middle">
                        <thead className="table-dark">
                          <tr>
                            <th scope="col" className="text-center line-height" style={{ width: '50px' }}>
                              <input
                                type="checkbox"
                                // className="mr-auto"
                                // className="form-check-input"
                                checked={selectedFiles.length === filteredFiles.length && filteredFiles.length > 0}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                                title="Seleccionar todos"
                              />
                            </th>
                            <th scope="col" className="text-center" style={{ width: '60px' }}>
                              <i className="fas fa-file-csv"></i>
                            </th>
                            <th scope="col">Archivo</th>
                            <th scope="col" className="d-none d-md-table-cell">Proyecto</th>
                            <th scope="col" className="d-none d-sm-table-cell">Tamaño</th>
                            <th scope="col" className="text-center" style={{ width: '150px' }}>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredFiles.map((file) => (
                            <tr key={file.nombre}>
                              {/* Checkbox de selección */}
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                //   className="form-check-input"
                                  checked={selectedFiles.includes(file.nombre)}
                                  onChange={(e) => handleFileSelection(file.nombre, e.target.checked)}
                                  title={`Seleccionar ${file.nombre}`}
                                />
                              </td>
                              
                              {/* Icono */}
                              <td className="text-center">
                                <i className="fas fa-file-csv fa-lg text-success"></i>
                              </td>
                              
                              {/* Nombre del archivo */}
                              <td>
                                <div className="d-flex flex-column">
                                  <span className="fw-semibold text-truncate" title={file.nombre}>
                                    {file.nombre}
                                  </span>
                                  <small className="text-muted d-md-none">
                                    Proyecto: <span className="badge bg-primary bg-opacity-75 text-white">{getProjectName(selectedProject)}</span>
                                  </small>
                                </div>
                              </td>
                              
                              {/* Proyecto */}
                              <td className="d-none d-md-table-cell">
                                <span className="badge bg-primary text-white">{getProjectName(selectedProject)}</span>
                              </td>
                              
                              {/* Tamaño */}
                              <td className="d-none d-sm-table-cell">
                                <span className="text-muted">
                                  {file.tamaño && file.tamaño !== 'No disponible' ? (
                                    <>
                                      <i className="fas fa-hdd me-1 text-warning"></i>
                                      {file.tamaño}
                                    </>
                                  ) : (
                                    <small className="text-muted">No disponible</small>
                                  )}
                                </span>
                              </td>
                              
                              {/* Acciones */}
                              <td>
                                <button
                                  className="btn btn-primary btn-sm"
                                  onClick={() => handleFileDownload(file)}
                                  title="Descargar archivo CSV"
                                >
                                  <i className="fas fa-download"></i>
                                  <span className="d-none d-sm-inline ms-1">Descargar</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      {/* Información adicional */}
                      <div className="mt-3">
                        <small className="text-muted">
                          <i className="fas fa-info-circle me-1"></i>
                          Mostrando {filteredFiles.length} archivo{filteredFiles.length !== 1 ? 's' : ''} del proyecto {getProjectName(selectedProject)}
                        </small>
                      </div>
                    </div>
                  )}
                </>
              )}
            </>
          )}
          
          {!(username || visitorLoggedIn) && (
            <div className="text-center py-5">
              <i className="fas fa-lock fa-3x text-muted mb-4"></i>
              <h3>Acceso Restringido</h3>
              <p className="text-muted">Para acceder al banco de datos CSV, es necesario que inicies sesión.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};