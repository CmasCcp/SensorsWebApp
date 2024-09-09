import React from 'react'
import { Link } from 'react-router-dom'
import { IconHorizontal } from './IconHorizontal'

export const Navbar = () => {
    return (
        <>
            <div className="container-fluid text-white bg-customprimary font-weight-light p-3 d-flex flex-row justify-content-between">
                <span className='header-text'>FACULTAD DE INGENIERÍA</span>
                <img height="20" className='' src='https://centrodeinvestigacioningenieria.udd.cl/wp-content/uploads/2021/09/logo-udd-blanco.png'/>
            </div>
            <nav className="navbar navbar-expand-lg p-0 box-shadow navbar-light bg-white overflow-hidden">
                <div className="container-fluid p-0 flex-wrap">

                    <Link to="" style={{"textDecoration":"none"}} className="mx-auto text-dark">
                        <IconHorizontal/>
                    </Link>

                    <div className="row col-md-12 m-0 p-0 bg-customprimary">
                        <button className="navbar-toggler bg-primary m-3" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                    </div>

                    <div className="collapse navbar-collapse px-4 py-2 bg-customprimary text-white" id="navbarSupportedContent">
                        <ul className="navbar-nav col-md-6 mr-auto font-weight-normal">
                            <li className="nav-item active">
                                <Link to="" className="nav-link text-white">INICIO<span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item active">
                                <Link to="dashboard" className="nav-link text-white">DASHBOARD<span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item active">
                                <Link to="proyectos" className="nav-link text-white">PROYECTOS</Link>
                            </li>
                            <li className="nav-item active">
                                <Link to="grupos" className="nav-link text-white">GRUPOS</Link>
                            </li>
                            <li className="nav-item active">
                                <Link to="administrador" className="nav-link text-white">ADMINISTRADOR</Link>
                            </li>
                        </ul>
                        <Link to="login" className="nav-link text-white text-center">Login</Link>
                        <div className="d-flex row"></div>
                    </div>
                </div>
            </nav>
        </>
    )
}
