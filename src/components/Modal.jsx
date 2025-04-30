import React, { useEffect, useRef, useState } from 'react';
import { Form } from './Form';

export const Modal = ({title, id, action, properties, data, isOpen, onClose, pkValue, tableName, hiddenData}) => {
    const modalRef = useRef(null);
    const [formData, setFormData] = useState();
    const [_, setErrors] = useState({});

    useEffect(() => {
        setFormData(data);
    }, [data]);

    useEffect(() => {
        if (isOpen) {
            $(modalRef.current).modal('show');
        } else {
            $(modalRef.current).modal('hide');
        }
    }, [isOpen]);

    const validateForm = (formData) => {

        const formDataArray = Object.values(formData);
        const newErrors = {};
        let isValid = true;
        console.log("formDataArray", formDataArray);

        for (const prop of formDataArray) {
            console.log("prop", prop);
            const value = formData[prop.Field];
            console.log(value);
            if (!value || value === "noValueSelected") { // Verifica inputs vacíos o selects en opción por defecto
                isValid = false;
                newErrors[prop] = "Este campo es obligatorio.";

                console.log("falta este campo", prop.Field);
            }
        }

        setErrors(newErrors); // Almacena los errores en el estado
        return isValid;
    };

    // Manejar el cambio en los datos del formulario
    const handleSend = async () => {
        // if (!validateForm(formData)) return;

        try {
            const payload = {
                tableName: tableName,
                primaryKeys: pkValue,
                formData: { ...formData, ...hiddenData }  // Los datos del formulario
            };

            console.log(payload);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/modificarDatos`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),  // Enviar los datos del formulario como JSON
            });

            if (response.ok) {
                console.log('Dispositivo actualizado correctamente');
            } else {
                console.error('Error al actualizar el dispositivo');
            }
        } catch (error) {
            console.error('Error al hacer la solicitud:', error);
        }
    };

    const handleAdd = async (assignedTableName, assignedFormData) => {
        console.log(assignedTableName);
        console.log(assignedFormData);
        // if (!validateForm(formData)) return;
        try {
            const payload = {
                tableName: assignedTableName,
                formData: assignedFormData // Los datos del formulario
            };
            console.log("payload", JSON.stringify(payload));

            const response = await fetch(`${import.meta.env.VITE_API_URL}/agregarDatos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),  // Enviar los datos del formulario como JSON
            });

            if (response.ok) {
                console.log('Dispositivo actualizado correctamente');
                onClose();
                setFormData({});
            } else {
                console.error('Error al actualizar el dispositivo');
            }
        } catch (error) {
            console.error('Error al hacer la solicitud:', error);
        }
    };

    const handleAddSensor = async () => {
        await handleAdd(tableName, formData);

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/ultimoValor?tabla=${tableName}&columna=id_sensor`,{
            headers:{
                accept: 'application/json',
                'User-agent': 'learning app',
            }
            });
            const responseData = await response.json();

            if(responseData.status === 'success'){
                await handleAdd('sensores_en_dispositivo', { ...hiddenData,'id_sensor': responseData.data});
            }

        } catch (error) {
            console.error('Error al hacer la solicitud:', error);
        }
    };

    const handleRemove = async () => {
        try {
            const queryString = Object.keys(pkValue)
                .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(pkValue[key])}`)
                .join('&');

            const response = await fetch(`${import.meta.env.VITE_API_URL}/eliminarDatos?tabla=${tableName}&${queryString}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log('Dispositivo actualizado correctamente');
            } else {
                console.error('Error al actualizar el dispositivo');
            }
        } catch (error) {
            console.error('Error al hacer la solicitud:', error);
        }
    };

    // Actualizar el estado del formulario cuando cambia
    const handleFormChange = (newData) => {
        setFormData(newData);
        console.log("formData", formData)
    };

    return (
        <div className="container mt-5">
            <div
                className="modal fade"
                id={id}
                tabIndex="-1"
                role="dialog"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
                ref={modalRef}
            >
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header text-center">
                            <h2 className="modal-title" id="exampleModalLabel">{title}</h2>
                            <button
                                type="button"
                                className="close"
                                aria-label="Close"
                                onClick={onClose}
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {action !== "Eliminar" && 
                              <Form 
                                properties={properties} 
                                data={formData} 
                                onChange={handleFormChange}  // Pasar la función para actualizar el formulario
                                />}

                            {action === "Eliminar" && <p className='text-center'>¿Estás seguro de eliminar la fila {JSON.stringify(data.id)}?</p>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn m-1 btn-secondary" onClick={onClose}>Cerrar</button>
                            <button 
                              type="button" 
                              className={`btn m-1 custom-button`} 
                              onClick={() => {
                                   if(action==="Editar"){
                                        handleSend();  // Llamar a la función para enviar los datos
                                        onClose();
                                        alert("Fila actualizada correctamente. Presiona aceptar para recargar la página.");
                                        window.location.reload(); // 🚀 Esto recarga toda la página después de eliminar
                                    } else if(action==="Eliminar"){
                                        handleRemove();
                                    } else if(action==="Agregar"){
                                        handleAdd(tableName, {...formData, ...hiddenData});
                                        onClose();
                                        alert("Agregados correctamente. Presiona aceptar para recargar la página.");
                                        window.location.reload(); // 🚀 Esto recarga toda la página después de eliminar
                                   } else if(action==="Agregar Sensor"){
                                        handleAddSensor();
                                   }
                              }}>
                              {action}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
