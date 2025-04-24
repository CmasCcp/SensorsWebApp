import React, { useState, useEffect } from 'react';
import { BasicDataTableGraphic } from '../components/graphics/BasicDataTableGraphic';
import { useFetch } from '../hooks/useFetch';
import { useMsal } from '@azure/msal-react';
import { Modal } from '../components/Modal';

export const AdministradorPage = () => {
  const { accounts } = useMsal();
  const [tableName, setTableName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const rowsPerPage = 25; // Número máximo de filas por página
  const { data: options } = useFetch(`${import.meta.env.VITE_API_URL}/listarTablas`);
  const { data: tableData, setUrl: tableDataSetUrl } = useFetch('');
  const { data: tableDataSchema, setUrl: tableDataSchemaSetUrl } = useFetch('');
  const username = accounts.length > 0;
  const [primaryKey, setPrimaryKey] = useState(null);


  // MODALS
  const [showAddModal, setShowAddModal] = useState(false);
  const [properties, setProperties] = useState([]);


  const handleClick = (tableName) => {
    setTableName(tableName);
    setCurrentPage(1); // Resetear la página al seleccionar una nueva tabla
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleOnClickAdd = () => {
    let properties = Object.keys(tableData.data.tableData[0]);
    setProperties(properties);
    setShowAddModal(prev => !prev);
  };

  const handleCloseModal = () => { setShowAddModal(false) }

  useEffect(() => {
    if (tableName !== "") {
      const urlSchema = `${import.meta.env.VITE_API_URL}/schema?tabla=${tableName}`;
      tableDataSchemaSetUrl(urlSchema);
    }
  }, [tableName]);

  useEffect(() => {
    if (
      tableName !== "" &&
      Array.isArray(tableDataSchema) &&
      tableDataSchema.length > 0
    ) {
      const keys = tableDataSchema.filter(x => x.Key === "PRI").map(x => x.Field);
      setPrimaryKey(keys[0] || null); // puede ser null si no hay clave primaria
    }
  }, [tableDataSchema]);

  useEffect(() => {
    if (primaryKey !== null) {
      console.log("Nuevo primaryKey:", primaryKey);
    }
  }, [primaryKey]);

  useEffect(() => {
    if (tableName !== "" && primaryKey !== null) {
      const url = `${import.meta.env.VITE_API_URL}/listarDatos?tabla=${tableName}&limite=${rowsPerPage}&offset=${(currentPage - 1) * rowsPerPage}&primarykey=${primaryKey}`;
      tableDataSetUrl(url);
    }
  }, [tableName, currentPage, primaryKey]);
  
 
  // Establecer el total de páginas en función del esquema de la tabla
  useEffect(() => {
    if (tableDataSchema && tableDataSchema[0]?.Count) {
      const totalCount = tableDataSchema[0].Count;
      setTotalPages(Math.ceil(totalCount / rowsPerPage)); // Actualizar total de páginas
    }
  }, [tableDataSchema]);

  const handleDelete = async (id) => {
    if (!tableName || !primaryKey) return;
  
    const confirmed = window.confirm("¿Estás seguro que quieres eliminar este registro?");
    if (!confirmed) return;
  
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/eliminarDatos?tabla=${tableName}&${primaryKey}=${id}`);
  
      if (!response.ok) {
        throw new Error("Error al eliminar el dato");
      }
  
      // Actualizar la tabla luego de eliminar
      const url = `${import.meta.env.VITE_API_URL}/listarDatos?tabla=${tableName}&limite=${rowsPerPage}&offset=${(currentPage - 1) * rowsPerPage}&primarykey=${primaryKey}`;
      tableDataSetUrl(url);
    } catch (error) {
      console.error("Error eliminando dato:", error);
      alert("Ocurrió un error al intentar eliminar el dato.");
    }
  };
  


  return (
    <>
      <Modal
        type={"warning"}
        action={"Agregar"}
        title={"Agregar fila"}
        id="addModal"
        properties={tableDataSchema}
        isOpen={showAddModal}
        onClose={handleCloseModal}
        tableName={tableName}
      />
      <div className="container-fluid d-flex justify-content-center align-items-center">
        <div className="card">
          <h2 className="card-title">Administrador</h2>
          <hr />
          <div className="card-content mt-2 shadow">
            <div className="row mb-2">
              {options && options.length > 0 && username && options.map((opt, index) => (
                <button
                  key={index}
                  className='btn m-1'
                  onClick={() => handleClick(opt.dataName)}
                >
                  {opt.displayName}
                </button>
              ))}
            </div>
            <hr />
            {/* Selección de ordenación */}
            <div className="mb-3">
              <label htmlFor="sortOrder" className="form-label"><small>(En desarrollo)</small> Ordenar por fecha:</label>
              
              <select
                id="sortOrder"
                className="form-select"
                value={"sortOrder"}
                onChange={() => console.log(handleSortChange)}
              >
                <option value="asc">Fecha Ascendente</option>
                <option value="desc">Fecha Descendente</option>
              </select>
              
            </div>
            {options && tableName && username && tableData && options.map((opt) => (
              tableName === opt.dataName && (
                <BasicDataTableGraphic tableTitle={opt.displayName} tableData={tableData.data.tableData} tablePrimaryKey={primaryKey} onDelete={handleDelete}/>
              )
            ))}
            {tableName !== "" && (<div className="row my-4">
              <button className="btn m-1 ml-auto custom-button" onClick={() => handleOnClickAdd()}>
                <span className="btn-text">Agregar {tableName}</span>
                <i className="fas fa-plus-circle"></i>
              </button>
            </div>)}

            {totalPages > 0 && (<div className="pagination">
              {Array.from({ length: totalPages }, (_, index) => {
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
                  (currentPage < 7 && pageNumber < 10)
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


            {!username && (
              <>
                <h2>Acceso Restringido</h2>
                <p>Para ver este contenido, es necesario que inicies sesión.</p>
              </>
            )}
          </div>

        </div>
      </div></>
  );
};