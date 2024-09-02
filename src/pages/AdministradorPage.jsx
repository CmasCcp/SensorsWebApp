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
          <button className='btn' onClick={()=>handleClick("Users")}>Users</button>
          <button className='btn' onClick={()=>handleClick("Todos")}>Todos</button>
          <button className='btn' onClick={()=>handleClick("Posts")}>Posts</button>
        </div>
        <hr className='m-0'/>

        
        {option === "Todos" && <DataTableGraphic title={option} apiUrl={`https://jsonplaceholder.typicode.com/todos`} />}
        {option === "Users" && <DataTableGraphic title={option} apiUrl={`https://jsonplaceholder.typicode.com/users`} />}
        {option === "Posts" && <DataTableGraphic title={option} apiUrl={`https://jsonplaceholder.typicode.com/posts`} />}

    </div>
  )
}
