import React, { useState } from 'react';
import { DataTableGraphic } from '../components/graphics/DataTableGraphic'
import { useFetch } from '../hooks/useFetch';
import { useMsal } from '@azure/msal-react';


export const AdministradorPage = () => {
  const [option, setOption] = useState();
  const { data: options } = useFetch(`${import.meta.env.VITE_API_URL}/listarTablas`);
  const { accounts } = useMsal();
  const username = accounts[0] && accounts[0].username;
  
  const handleClick = (option) => {
    setOption(option);
  };


  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="card">
        <h2 className="card-title">Administrador</h2>
        <div className="card-content">
          <div className="row">
            {options !== null && username && options.map((opt) => (
              <button
              key={opt.dataName}
              className='btn m-1'
              onClick={() => handleClick(opt.displayName)}
              >
                {opt.displayName}
              </button>
            ))}
          </div>


          {options !== null && username && options.map((opt) => (
            option === opt.displayName && (
              <DataTableGraphic
              key={opt.dataName}
              title={opt.displayName}
              tableName={opt.dataName}
              />
            )
          ))}

          {!username &&(
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

