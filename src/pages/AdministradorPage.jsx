import React, { useState, useEffect } from 'react';
import { BasicDataTableGraphic } from '../components/graphics/BasicDataTableGraphic';
import { useFetch } from '../hooks/useFetch';
import { useMsal } from '@azure/msal-react';

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

  const handleClick = (tableName) => {
    setTableName(tableName);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    if (tableName !== "" && tableDataSetUrl) {
      let url = `${import.meta.env.VITE_API_URL}/listarDatos?tabla=${tableName}&limite=${rowsPerPage}&offset=${(currentPage - 1) * rowsPerPage}`;
      tableDataSetUrl(url);
      let urlSchema = `${import.meta.env.VITE_API_URL}/schema?tabla=${tableName}`;
      tableDataSchemaSetUrl(urlSchema);
      const totalCount = tableDataSchema?.[0].Count || 0;
      console.log("totalCount", totalCount);
      setTotalPages(Math.ceil(totalCount / rowsPerPage));

    }
  }, [tableName,tableData,currentPage, tableDataSetUrl,tableDataSchemaSetUrl]);

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="card">
        <h2 className="card-title">Administrador</h2>
        <div className="card-content">
          <div className="row">
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
          {options && tableName && username && tableData && options.map((opt) => (
            tableName === opt.dataName && (
              <BasicDataTableGraphic tableTitle={opt.displayName} tableData={tableData.data.tableData} />
            )
          ))}

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
    </div>
  );
};
