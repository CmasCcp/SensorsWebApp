import React from 'react'

export const Modal = ({ type, title }) => {
    return (
        <div className="container mt-5">

            <div className="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">{title}</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <p>Contenido del modal. Puedes poner lo que necesites aquí.</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Cerrar</button>
                            <button type="button" className={`btn btn-${type}`} data-dismiss="modal">Editar</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
