import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'

export const Home = () => {

    // SERVER SIDE RENDERING ROUTES

    const valores = window.location.search;
    //Creamos la instancia
    const urlParams = new URLSearchParams(valores);

    //Accedemos a los valores
    var go_to = urlParams.get('go_to');

    //Verificar si existe el parámetro
    console.log(urlParams.has(go_to));
    console.log(go_to)

    if (go_to === "herramientas") {
        // useNavigate(go_to)
        return (<Navigate to="/herramientas"/>);
    }

    // PORTADA


    const [portada, setPortada] = useState('1');

    setTimeout(() => {
        switch (portada) {
            case "1":
                setPortada("2");
                break;
            case "2":
                setPortada("3");

                break;
            case "3":
                setPortada("4");
                break;

            case "4":
                setPortada("1");
                break;
        }
    }, 5000);

    return (
        <div>
            <div className={`row m-0 py-0 px-0 container-fluid bg-fixed-${portada} vh-50`}>

                <div
                    className=" vh-50 py-5 box-shadow opacity-2 px-4 bg-customprimary col-md-12 text-center position-relative">
                </div>
                <div className='opacity-5 position-relative vh-50 col-md-12 d-flex flex-column justify-content-center '
                     style={{"top": "-50vh"}}>
                    <h2 className="mt-1 text-white position-relative text-center animate__animated animate__fadeIn animate__faster" style={{"font-weight": "700", "font-size":"43px"}}>Bienvenido
                        a C+ Concepción</h2>
                </div>

            </div>

            <div className="container-fluid px-0 p-0 m-0 min-vh-75">
                <div className="page-header bg-fixed p-0 m-0 text-white vh-25">
                    <div className='opacity-3 bg-customprimary vh-25 m-0'>
                    </div>
                    <div
                        className="text-center m-0 p-0 vh-25 position-relative d-flex flex-column justify-content-center"
                        style={{"zIndex": "9999", "top": "-25vh"}}>
                        <h2 style={{"fontSize": "2.5rem"}}>Centro de investigación Concepción C+</h2>
                    </div>
                </div>
                <section className="col-md-6 mx-auto my-5 animate__animated animate__fadeIn animate__faster">
                    <h3 className='text-customprimary text-center'>¿Quiénes somos?</h3>
                    <p className='text-center px-5'>El Centro de Investigación en Tecnologías para la Sociedad (C+)
                        apunta a fomentar la investigación, desarrollo e innovación que permite comprender y abordar
                        desafíos, problemas y oportunidades que el país enfrenta para su desarrollo, a nivel nacional y
                        regional. Este centro comprende un alto nivel de desarrollo científico, tecnológico y de
                        innovación para resolver desafíos tanto productivos, como sociales y culturales. Además, busca
                        encaminar su accionar en función de entregar respuestas concretas a las problemáticas y
                        necesidades del país, obteniendo así, un impacto en la sociedad.</p>
                </section>
            </div>

            <div className="container-fluid px-0 p-0 m-0 min-vh-75">
                <div className="page-header bg-fixed p-0 m-0 text-white vh-25">
                    <div className='opacity-3 bg-customprimary vh-25 m-0'>
                    </div>
                    <div
                        className="text-center m-0 p-0 vh-25 position-relative d-flex flex-column justify-content-center"
                        style={{"zIndex": "9999", "top": "-25vh"}}>
                        <h2 style={{"fontSize": "2.5rem"}}>Sobre la web</h2>
                    </div>
                </div>
                <section className="col-md-6 mx-auto my-5 animate__animated animate__fadeIn animate__faster">
                    <h3 className='text-customprimary text-center'>¿Para que sirve?</h3>
                    <p className='text-center px-5'>Nuestra WebApp está diseñada para ofrecer una visualización integral de los sensores, proyectos, grupos y personas dentro del centro de investigación. Además, permite la manipulación de bases de datos de manera fácil y sencilla, facilitando la gestión y el acceso a la información crucial para los investigadores. Con esta herramienta, se optimiza la organización y el análisis de los datos, mejorando la eficiencia y colaboración dentro del centro.</p>
                </section>
            </div>
        </div>
    )
}