import { DataTable } from 'simple-datatables'; // Importing the simple-datatables library
import 'simple-datatables/dist/style.css';
import React, { useEffect, useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { Modal } from '../Modal';

export const DataTableGraphic = ({ apiUrl, title }) => {
    const { data, hasError, isLoading } = useFetch(apiUrl);
    const [dataProperties, setDataProperties] = useState([]);

    let isArray = Array.isArray(data);


    useEffect(() => {
        if (data && Array.isArray(data) && data.length > 0) {
            setDataProperties(Object.keys(data[0]));

            const datatablesSimple = document.getElementById('datatablesSimple');
            if (datatablesSimple && datatablesSimple instanceof HTMLTableElement) {
                new DataTable(datatablesSimple);
            }
        }
    }, [data]);

    const handleOnClickEdit = (e) => {
        e.preventDefault();
        // const key = e.target.getAttribute("key");
        const parent = e.currentTarget.closest('tr').getAttribute("name");
        const childs = e.currentTarget.closest('tr').childNodes;
        console.log(childs);
        console.log(e);
        console.log("e");

        // childs.map(x=> console.log(x.getAttribute("name")));
    }

    return (
        <>
            <Modal type={"primary"} action="Editar" title="Editar fila" id="insertModal" properties={dataProperties} />
            <Modal type={"danger"} action="Eliminar" title="Eliminar fila" id="deleteModal" />
            <div className="card my-4">
                <div className="card-header">
                    <i className="fas fa-table me-1 mr-2"></i>
                    {title}
                </div>


                <div className="card-body table-responsive">
                    {isLoading && (<div className="error-message">Cargando...</div>)}
                    {!!hasError && (<div className="error-message">{hasError.message}</div>)}

                    {data !== null && dataProperties.length > 0 && (
                        <table id="datatablesSimple" className='table table-bordered'>
                            <>
                                <thead>
                                    <tr>
                                        {dataProperties.map(prop => (
                                            <th key={prop}>{prop}</th>
                                        ))}
                                        <th>Editar</th>
                                        <th>Eliminar</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((item, index) => (
                                        <tr key={index} name={index}>
                                            {dataProperties.map(prop => (
                                                <td key={prop} name={prop}>
                                                    {typeof item[prop] === 'object' ? JSON.stringify(item[prop]) : item[prop]}
                                                </td>
                                            ))}
                                            <td>
                                                <a href="#insertModal" data-toggle="modal" data-target="#insertModal" onClick={handleOnClickEdit}>
                                                    Editar
                                                </a>
                                            </td>
                                            <td><a data-toggle="modal" data-target="#deleteModal" className='text-danger' href='#'>Eliminar</a></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </>
                        </table>
                    )}
                </div>
            </div></>
    );
};
