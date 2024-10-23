import React, { useEffect, useRef, useState } from 'react';
import { Form } from './Form';


export const Modal = ({ type, title, id, action, properties, data, isOpen, onClose, pkValue, tableName }) => {
    const modalRef = useRef(null);
    const [formData, setFormData] = useState();

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

    // Manejar el cambio en los datos del formulario
    const handleSend = async () => {
        try {
            const payload = {
                tableName: tableName,
                primaryKeys: pkValue,
                formData: formData  // Los datos del formulario
            };

            const response = await fetch(`http://localhost:8080/modificarDatos`, {
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

    // Actualizar el estado del formulario cuando cambia
    const handleFormChange = (newData) => {
        setFormData(newData);
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
                            <h5 className="modal-title" id="exampleModalLabel">{title}</h5>
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
                            {action === "Editar" && 
                              <Form 
                                properties={properties} 
                                data={formData} 
                                onChange={handleFormChange}  // Pasar la función para actualizar el formulario
                              />}
                            {action === "Eliminar" && <p className='text-center'>¿Estás seguro de eliminar la fila {JSON.stringify(data.id)}?</p>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                            <button 
                              type="button" 
                              className={`btn btn-${type}`} 
                              onClick={() => {
                                  onClose();
                                  handleSend();  // Llamar a la función para enviar los datos
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
