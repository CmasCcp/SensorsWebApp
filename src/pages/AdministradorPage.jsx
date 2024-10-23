import React, { useState } from 'react';
import { DataTableGraphic } from '../components/graphics/DataTableGraphic'

export const AdministradorPage = () => {
  const [option, setOption] = useState("Todos");

  const options = [
    {displayName:'Datos',
    dataName: 'datos',},
    {displayName:'Dispositivos',
    dataName: 'dispositivos',},
    {displayName:'Estados',
    dataName: 'estados',},
    {displayName:'Laboratorios',
    dataName: 'laboratorios',},
    {displayName:'Personas',
    dataName: 'personas',},
    {displayName:'Proyectos',
    dataName: 'proyectos',},
    {displayName:'Roles',
    dataName: 'roles',},
    {displayName:'Roles En Laboratorio',
    dataName: 'rolesenlaboratorios',},
    {displayName:'Roles En Proyecto',
    dataName: 'rolesenproyectos',},
    {displayName:'Sensores',
    dataName: 'sensores',},
    {displayName:'Sensores En dispositivos',
    dataName: 'sensoresendispositivo',},
    {displayName:'Sensores Tipo',
    dataName: 'sensorestipo',},
    {displayName:'Sesiones',
    dataName: 'sesiones',},
    {displayName:'Variables',
      dataName: 'variables',},
    ]

  const handleClick = (option) => {
    setOption(option);
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="card">
        <h2 className="card-title">Administrador</h2>
        <div className="card-content">
          <div className="row">
            {options.map((opt) => (
              <button
               key={opt.dataName}
               className='btn m-1'
               onClick={() => handleClick(opt.displayName)}
              >
                {opt.displayName}
              </button>
            ))}
          </div>

        
          {options.map((opt) => (
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

