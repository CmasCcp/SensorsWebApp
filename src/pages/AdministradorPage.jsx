import React, { useState, useEffect } from 'react';
import { BasicDataTableGraphic } from '../components/graphics/BasicDataTableGraphic';
import { useFetch } from '../hooks/useFetch';
import { useMsal } from '@azure/msal-react';

export const AdministradorPage = () => {
  const { accounts } = useMsal();
  const [tableName, setTableName] = useState("");
  const rowsPerPage = 25; // Número máximo de filas por página
  const { data: options } = useFetch(`${import.meta.env.VITE_API_URL}/listarTablas`);
  const { data: tableData, setUrl: tableDataSetUrl } = useFetch('');
  const username = accounts.length > 0;

  const handleClick = (tableName) => {
    setTableName(tableName);
    console.log(tableData.data.tableData);
  };

  useEffect(() => {
    if (tableName !== "" && tableDataSetUrl) {
      let url = `${import.meta.env.VITE_API_URL}/listarDatos?tabla=${tableName}&limite=${rowsPerPage}`;
      tableDataSetUrl(url);
    }
  }, [tableName, tableDataSetUrl]);

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
