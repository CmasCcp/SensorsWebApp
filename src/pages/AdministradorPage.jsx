import React, { useState } from 'react';
import { DataTableGraphic } from '../components/graphics/DataTableGraphic'
import { useFetch } from '../hooks/useFetch';

export const AdministradorPage = () => {
  const [option, setOption] = useState();

  const { data:options } = useFetch('http://localhost:8084/listarTablas')

  const handleClick = (option) => {
    setOption(option);
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="card">
        <h2 className="card-title">Administrador</h2>
        <div className="card-content">
          <div className="row">
            {options !== null && options.map((opt) => (
              <button
               key={opt.dataName}
               className='btn m-1'
               onClick={() => handleClick(opt.displayName)}
              >
                {opt.displayName}
              </button>
            ))}
          </div>

        
          {options !== null && options.map((opt) => (
            option === opt.displayName && (
              <DataTableGraphic
                key={opt.dataName}
                title={opt.displayName}
                tableName={opt.dataName}
              />
          )
        ))}
        </div>
      </div>
    </div>
  );
};

