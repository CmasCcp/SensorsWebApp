import React, { useEffect, useState } from 'react'
import { DataTableGraphic } from '../components/graphics/DataTableGraphic'


export const AdministradorPage = () => {

  const [option, setOption] = useState("Todos");

  const handleClick = (option)=>{
    setOption(option);
  }

  return (
    <div className='col-12 p-5'>
        <h2>Administrador</h2>

        
        <div className="row">
        <button className='btn' onClick={()=>handleClick("Mediciones")}>Mediciones</button>
        <button className='btn' onClick={()=>handleClick("Sensores")}>Sensores</button>
        <button className='btn' onClick={()=>handleClick("Dispositivos")}>Dispositivos</button>
        <button className='btn' onClick={()=>handleClick("Proyectos")}>Proyectos</button>

        </div>
        <hr className='m-0'/>

        {option === "Mediciones" && <DataTableGraphic title={option} apiUrl={`http://localhost:8080/listarDatos?tabla=medicion`} />}
        {option === "Sensores" && <DataTableGraphic title={option} apiUrl={`http://localhost:8080/listarDatos?tabla=sensores`} />}
        {option === "Dispositivos" && <DataTableGraphic title={option} apiUrl={`http://localhost:8080/listarDatos?tabla=dispositivos`} />}
        {option === "Proyectos" && <DataTableGraphic title={option} apiUrl={`http://localhost:8080/listarDatos?tabla=proyectos`} />}

    </div>
  )
}
