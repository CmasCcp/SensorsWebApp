import React, { useEffect, useState } from 'react';
import { DataTable } from 'simple-datatables';
import 'simple-datatables/dist/style.css';
import { useFetch } from '../../hooks/useFetch';
import { Modal } from '../Modal';

export const DataTableGraphic = ({ tableName, title, reloadFlag, onReload }) => {

    const { data:schemaData, hasError:schemaHasError, isLoading:schemaIsLoading } = useFetch(`http://localhost:8080/schema?tabla=${tableName}`); 
    const { data, hasError, isLoading } = useFetch(`http://localhost:8080/listarDatos?tabla=${tableName}`, reloadFlag);

    const [dataProperties, setDataProperties] = useState([]);

    const [filteredKeys, setFilteredKeys] = useState([]);
    const [itemPK, setItemPK] = useState({});

    const [editData, setEditData] = useState({});
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal ] = useState(false);

    useEffect(() => {
        if ( schemaData && schemaData.length > 0) {
          const keys = schemaData
            .filter(field => field.Key === 'PRI') // Solo los campos con "PRI"
            .map(field => field.Field);           // Obtenemos solo el nombre del campo (Field)
          
          setFilteredKeys(keys); // Actualizamos el estado con los campos filtrados
        }
      }, [schemaData]);

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
        const filteredItem = Object.fromEntries(
            Object.entries(item).filter(([key]) => filteredKeys.includes(key))
        );
        setItemPK(filteredItem);
        setEditData(item);
        setShowEditModal(true);
    };

    const handleOnClickDelete = (item) => {
        const filteredItem = Object.fromEntries(
            Object.entries(item).filter(([key]) => filteredKeys.includes(key))
        );
        setItemPK(filteredItem);
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
                pkValue={itemPK}
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
                pkValue={itemPK}
                tableName={data?.data?.tabla ?? "noTableValue"}
            />

           <div>
                <div className="card-header">
                    <i className="fas fa-table me-1 mr-2"></i>
                    {title}
                </div>

                <div className=" table-responsive">
                    {isLoading && (<div className="error-message">Cargando...</div>)}
                    {!!hasError && (<div className="error-message">{hasError.message}</div>)}

                    {data !== null && dataProperties.length > 0 && (
                        <table id="datatablesSimple" className='table table-bordered'>
                            <thead>
                                <tr>
                                    {dataProperties.map(prop => (
                                        <th>{prop}</th>
                                    ))}
                                    <th>Editar</th>
                                    <th>Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.tableData.map((item, index) => (
                                    <tr>
                                        {dataProperties.map(prop => (
                                            <td name={prop}>
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
