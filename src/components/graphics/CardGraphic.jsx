import React from 'react'

export const CardGraphic = ({title, url, type}) => {
    return (
        <div className="col-xl-3 col-md-6">
            <div className={`card bg-${type} text-white mb-4`}>
                <div className="card-body">{title}</div>
                <div className="card-footer d-flex align-items-center justify-content-between">
                    <a className="small text-white stretched-link" href={url}>View Details</a>
                    <div className="small text-white"><i className="fas fa-angle-right"></i></div>
                </div>
            </div>
        </div>
    )
}
