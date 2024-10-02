import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
export const Item = ({ img, table_name, name, id, description, category }) => {
    const navigate = useNavigate();
    const see_more = `${category}/${table_name}`;
    return (<div className="card m-1" style={{ "width": "18rem" }}>
                <img className="card-img-top" src={img} alt="Card image cap"/>
                <div className="card-body">
                    <h5 className="card-title" style={{ "fontSize": "1.2rem" }}>{name}</h5>
                    <p className="card-text font-weight-bold lead" style={{ "fontSize": "0.8rem" }}>{category}</p>
                    <p className="card-text lead" style={{ "fontSize": "0.85rem" }}><small>{description}</small></p>
                    {/* <p className="card-text lead" style={{"fontSize":"0.85rem"}}><small>Código: {id}</small></p> */}
                </div>
                <div className="card-footer d-flex flex-row justify-content-around">
                    <Link className="btn btn-info d-block col-md-12" to={see_more}>
                        Ver más
                    </Link>
                    <hr />
                    <Outlet />
                </div>
            </div>);
};
