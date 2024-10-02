import React, { useEffect, useRef } from 'react';
import { Form } from './Form';
export const Modal = ({ type, title, id, action, properties, data, isOpen, onClose }) => {
    const modalRef = useRef(null);
    useEffect(() => {
        if (isOpen) {
            $(modalRef.current).modal('show');
        }
        else {
            $(modalRef.current).modal('hide');
        }
    }, [isOpen]);
    return (<div className="container mt-5">
            <div className="modal fade" id={id} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" ref={modalRef}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header text-center">
                            <h5 className="modal-title" id="exampleModalLabel">{title}</h5>
                            <button type="button" className="close" aria-label="Close" onClick={onClose}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {action === "Editar" && <Form properties={properties} data={data}/>}
                            {action === "Eliminar" && <p className='text-center'>¿Estás seguro de eliminar la fila {JSON.stringify(data.id)}?</p>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>Cerrar</button>
                            <button type="button" className={`btn btn-${type}`} onClick={onClose}>{action}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
};
