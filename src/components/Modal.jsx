import React from 'react'
import { Form } from './Form'

export const Modal = ({ type, title,id, action, properties, data }) => {
    return (
        <div className="container mt-5">

            <div className="modal fade" id={id} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header text-center">
                            <h5 className="modal-title" id="exampleModalLabel">{title}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">

                            {action=="Editar" && <Form properties={properties} data={data}/>}
                            {action=="Eliminar" && <p className='text-center'>¿Estás seguro de eliminar la fila?</p>}

                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                            <button type="button" className={`btn btn-${type}`} data-dismiss="modal">{action}</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
