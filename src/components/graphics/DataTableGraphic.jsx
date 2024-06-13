import React, { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch';
import {DataTable} from 'simple-datatables'; // Importing the simple-datatables library
import 'simple-datatables/dist/style.css';

export const DataTableGraphic = ({ apiUrl }) => {
    const { data, error, loading } = useFetch(apiUrl);
    const [dataProperties, setDataProperties] = useState([]);
    
    let isArray = Array.isArray(data);


    console.log("array? ", isArray);
    console.log(data);

    useEffect(() => {
        if (data && Array.isArray(data) && data.length > 0) {
            setDataProperties(Object.keys(data[0]));

            const datatablesSimple = document.getElementById('datatablesSimple');

            if (datatablesSimple) {
                
                // const dataTable = new simpleDatatables.DataTable(datatablesSimple);
                
                // npm
                let dataTable = new DataTable(datatablesSimple);


                return () => {
                    dataTable.destroy(); // Cleanup the table on component unmount
                };
            }
        }
    }, [data]);

    return (
        <div className="card mb-4">
            <div className="card-header">
                <i className="fas fa-table me-1"></i>
                DataTable Example
            </div>
            <div className="card-body">
                {loading && (<div className="error-message">Cargando...</div>)}

                {!!error && (<div className="error-message">{error.message}</div>)}

                {data !== null && dataProperties.length > 0 && (
                    <table id="datatablesSimple">
                        <>
                            <thead>
                                <tr>
                                    {dataProperties.map(prop => (
                                        <th key={prop}>{prop}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((item, index) => (
                                    <tr key={index}>
                                        {dataProperties.map(prop => (
                                            <td key={prop}>
                                                {typeof item[prop] === 'object' ? JSON.stringify(item[prop]) : item[prop]}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </>
                    </table>
                )}
            </div>
        </div>
    );
};
