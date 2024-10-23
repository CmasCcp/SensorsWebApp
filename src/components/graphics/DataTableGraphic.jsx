import React, { useEffect, useState } from 'react';
import { DataTable } from 'simple-datatables';
import 'simple-datatables/dist/style.css';
import { useFetch } from '../../hooks/useFetch';
import { Modal } from '../Modal';

export const DataTableGraphic = ({ apiUrl, title }) => {

    const { data, hasError, isLoading } = useFetch(apiUrl); 

    const [dataProperties, setDataProperties] = useState([]);
    const [editData, setEditData] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal ] = useState(false);

    useEffect(() => {
        if (data && Array.isArray(data.data.tableData) && data.data.tableData.length > 0) {
            setDataProperties(Object.keys(data.data.tableData[0]));
    
            const initializeDataTable = () => {
                const datatablesSimple = document.getElementById('datatablesSimple');
                if (datatablesSimple instanceof HTMLTableElement) {
                    new DataTable(datatablesSimple);
                }
            };
    
            initializeDataTable();
        }
    }, [data]);
    
    const handleOnClickEdit = (item) => {
        console.log("edit");
        setEditData(item);
        setShowEditModal(true);
    };

    const handleOnClickDelete = (item) => {
        console.log("delete");
        setEditData(item);
        setShowDeleteModal(true);
    };
    
    const handleCloseModal = () => {
        setEditData({});
        setShowEditModal(false);
        setShowDeleteModal(false);
    };

    return (
        <>
            <Modal
                type={"primary"}
                action="Editar"
                title="Editar fila"
                id="insertModal"
                properties={dataProperties}
                data={editData}
                isOpen={showEditModal}
                onClose={handleCloseModal}
                pkValue={data?.data?.id ?? "noPkValue"}
                tableName={data?.data?.tabla ?? "noTableValue"}
                />
            <Modal
                type={"danger"}
                action="Eliminar"
                title="Eliminar fila"
                id="deleteModal"
                data={editData}
                isOpen={showDeleteModal}
                onClose={handleCloseModal}
            />

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
                                {data.data.tableData.map((item, index) => (
                                    <tr key={item.id} name={item.id}>
                                        {dataProperties.map(prop => (
                                            <td key={prop} name={prop}>
                                                {typeof item[prop] === 'object' ? JSON.stringify(item[prop]) : item[prop]}
                                            </td>
                                        ))}
                                        <td>
                                            <button className='btn' onClick={() => handleOnClickEdit(item)}>
                                                Editar
                                            </button>
                                        </td>
                                        <td>
                                            <button className='btn text-danger' onClick={() => handleOnClickDelete(item)}>
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </>
    );
};
