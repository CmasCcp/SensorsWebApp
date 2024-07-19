import React, { useEffect, useState } from 'react'
import { DataTableGraphic } from '../components/graphics/DataTableGraphic'
import { Modal } from '../components/Modal';


export const AdministradorPage = () => {

  const [option, setOption] = useState("Todos");

  const handleClick = (option)=>{
    setOption(option);
  }

  return (
    <div className='col-12 p-5'>
        <h2>Administrador</h2>

        <Modal type={"primary"} title="Editar fila"/>

        
        <div className="row">
          <button className='btn' onClick={()=>handleClick("Users")}>Users</button>
          <button className='btn' onClick={()=>handleClick("Todos")}>Todos</button>
          <button className='btn' onClick={()=>handleClick("Posts")}>Posts</button>
        </div>
        <hr className='m-0'/>

        {/* <div className="row">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate similique eos quidem aliquid sunt, nostrum architecto possimus in aut, dicta magnam pariatur repellendus sequi! Voluptates, sit? Dolor accusantium dignissimos velit?
        </div> */}

        
        {option === "Todos" && <DataTableGraphic title={option} apiUrl={`https://jsonplaceholder.typicode.com/todos`} />}
        {option === "Users" && <DataTableGraphic title={option} apiUrl={`https://jsonplaceholder.typicode.com/users`} />}
        {option === "Posts" && <DataTableGraphic title={option} apiUrl={`https://jsonplaceholder.typicode.com/posts`} />}

    </div>
  )
}
