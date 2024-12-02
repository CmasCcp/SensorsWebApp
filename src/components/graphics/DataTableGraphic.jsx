import React, { useEffect, useState } from 'react';
import { DataTable } from 'simple-datatables';
import 'simple-datatables/dist/style.css';
import { useFetch } from '../../hooks/useFetch';
import { Modal } from '../Modal';
import { Probando } from './Probando';

export const DataTableGraphic = ({ tableName, title, reloadFlag, clavesForaneas }) => {

    const { data: schemaData} = useFetch(`${import.meta.env.VITE_API_URL}/schema?tabla=${tableName}`);
    const { data, hasError, isLoading } = useFetch(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=${tableName}`, reloadFlag);

    // Función para cargar los datos desde la API
    const [dataProperties, setDataProperties] = useState([]);

    const [filteredKeys, setFilteredKeys] = useState([]);
    const [itemPK, setItemPK] = useState({});

    const [editData, setEditData] = useState({});

    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);


    useEffect(() => {
        if (schemaData && schemaData.length > 0) {
            const keys = schemaData
                .filter(field => field.Key === 'PRI') // Solo los campos con "PRI"
                .map(field => field.Field);           // Obtenemos solo el nombre del campo (Field)

            setFilteredKeys(keys); // Actualizamos el estado con los campos filtrados
            
            const dataKeys = schemaData
                .map(field => field.Field);

            setDataProperties(dataKeys); // En caso de no tener datos, puedo establecer los keys desde el schema data
        }
    }, [schemaData]);

    useEffect(() => {
        if (data && Array.isArray(data.data.tableData)) {
            const initializeDataTable = () => {
                const datatablesSimple = document.getElementById('datatablesSimple');
                if (datatablesSimple instanceof HTMLTableElement) {
                    new DataTable(datatablesSimple);
                }
            };

            initializeDataTable();
            console.log("data", data);
        }
    }, [data]);


    const handleOnClickEdit = (item) => {
        const filteredItem = Object.fromEntries(
            Object.entries(item).filter(([key]) => filteredKeys.includes(key))
        );
        setItemPK(filteredItem);
        setEditData(item);
        setShowEditModal(prev => !prev);
    };

    const handleOnClickDelete = (item) => {
        console.log("delete1");
        const filteredItem = Object.fromEntries(
            Object.entries(item).filter(([key]) => filteredKeys.includes(key))
        );
        setItemPK(filteredItem);
        setEditData(item);
        setShowDeleteModal(prev => !prev);
    };

    const handleOnClickAdd = () => {
        setShowAddModal(prev => !prev);
    };

    const handleCloseModal = () => {
        setEditData({});
        setShowEditModal(false);
        setShowDeleteModal(false);
    };

    return (
        <>
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
                <Modal
                    type={"warning"}
                    action={"Agregar"}
                    title={"Agregar fila"}
                    id="addModal"
                    properties={dataProperties}
                    isOpen={showAddModal}
                    onClose={handleCloseModal}
                    tableName={data?.data?.tabla ?? "noTableValue"}
                />              
            </>

            <div>
                <div className="card-header">
                    <i className="fas fa-table me-1 mr-2"></i>
                    {title}
                </div>

                <div className=" table-responsive">
                    {isLoading && (<div className="error-message">Cargando...</div>)}
                    {!!hasError && (<div className="error-message">{hasError.message}</div>)}

                    <Probando tableName={tableName} dataProperties={dataProperties} clavesForaneas={clavesForaneas}/>

                    {data !== null && dataProperties.length > 0 && (
                        <table id="datatablesSimple" className='table table-bordered'>
                            <thead>
                                <tr>
                                    {dataProperties.map(prop => (
                                        <th key={prop}>{prop}</th>
                                    ))}
                                    <th key={'editar'}>Editar</th>
                                    <th key={'eliminar'}>Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.data.tableData.map((item, index) => (
                                    <tr key={index}>
                                        {dataProperties.map((prop, propIdx) => (
                                            <td key={propIdx}>
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
            <>
            <div className="row my-4">
                <button className="btn m-1 ml-auto custom-button" onClick={() => handleOnClickAdd(title)}>
                    <span className="btn-text">Agregar {title}</span>
                    <i className="fas fa-plus-circle"></i>
                </button>
            </div>  
            </>
        </>
    );
};
