import { useMsal } from '@azure/msal-react';
import { useState, useEffect } from 'react';
import { useFetch } from '../hooks/useFetch';

export const PruebaPage = () => {
    const rowsPerPage = 25; // Número máximo de filas por página
    const tableName = "datos";
    const [currentPage, setCurrentPage] = useState(1); // Página actual
    const [totalPages, setTotalPages] = useState(2);
    const { data, isLoading, hasError } = useFetch(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=${tableName}&limite=${rowsPerPage}&offset=${(currentPage - 1) * rowsPerPage}`);
    const { accounts } = useMsal();
    const username = accounts.length > 0;


    //   const [tableData, setTableData] = useState([]);

    !isLoading && console.log("data", data.data.tableData);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <>
            <div className="container-fluid d-flex justify-content-center align-items-center">
                <div className="card w-100">
                    <h2 className="card-title">Datos</h2>
                    <div className="card-content">
                        {username &&(
                            <div>
                                <div className="row d-flex justify-content-around my-4">
                                    {!isLoading ? (
                                        <div style={{ overflowX: 'auto' }}>
                                            <table className="table table-bordered">
                                                <thead>
                                                    <tr>
                                                        {Object.keys(data.data.tableData[0]).map((key, index) => (
                                                            <th key={index}>{key}</th>
                                                        ))}
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {data.data.tableData.map((row, rowIndex) => (
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

                                {!isLoading && (<div className="pagination">
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