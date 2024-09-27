import React from 'react'
import { Link } from 'react-router-dom'

export const Navbar = () => {
    return (
        <>
            <nav className="navbar navbar-expand-lg p-0 box-shadow navbar-light bg-white overflow-hidden">
                <div className="container-fluid px-0 py-3 ">
                    <Link to="/" className="navbar-brand px-4 py-2">
                        <img src="/logo_lab.png" alt="Logo" className="logo-image" style={{ height: '40px' }} />
                    </Link>

                    <div className="px-4 py-2 bg-customprimary ml-auto">
                        <ul className="navbar-nav font-weight-normal ">
                            <li className="nav-item active">
                                <Link to="" className="nav-link text-customdark">INICIO<span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item active">
                                <Link to="dashboard" className="nav-link text-customdark">DASHBOARD<span className="sr-only">(current)</span></Link>
                            </li>
                            <li className="nav-item active">
                                <Link to="administrador" className="nav-link text-customdark">ADMINISTRADOR</Link>
                            </li>
                            <li className="nav-item active">
                                <Link to="grupos" className="nav-link text-customdark">INGRESAR</Link>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}
