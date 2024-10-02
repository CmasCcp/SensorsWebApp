import React from 'react';
import { Navigate } from 'react-router-dom';
export const Home = () => {
    // SERVER SIDE RENDERING ROUTES
    const valores = window.location.search;
    //Creamos la instancia
    const urlParams = new URLSearchParams(valores);
    //Accedemos a los valores
    var go_to = urlParams.get('go_to');
    //Verificar si existe el parámetro
    console.log(urlParams.has(go_to));
    console.log(go_to);
    if (go_to === "herramientas") {
        // useNavigate(go_to)
        return (<Navigate to="/herramientas"/>);
    }
    return (<div>
            <div className="container-fluid d-flex justify-content-center align-items-center">
                <div className="card">
                    <h2 className="card-title">Centro de investigación en tecnologías para la sociedad</h2>
                    <p className="card-content">Nuestra WebApp está diseñada para ofrecer una visualización integral de los sensores, proyectos, grupos y personas dentro del centro de investigación. Además, permite la manipulación de bases de datos de manera fácil y sencilla, facilitando la gestión y el acceso a la información crucial para los investigadores. Con esta herramienta, se optimiza la organización y el análisis de los datos, mejorando la eficiencia y colaboración dentro del centro.</p>
                </div>
            </div>
        </div>);
};
