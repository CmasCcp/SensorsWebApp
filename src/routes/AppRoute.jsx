import { Routes, Route } from "react-router-dom"
import { Spinner } from "../components/Spinner"
import {Home } from "../pages/"
import { SensoresPage } from "../pages/SensoresPage"
import { ProjectsRoute } from "./ProjectsRoute"
import {Grupos} from "../pages/Grupos.jsx";
import {Herramientas} from "../pages/Tools.jsx";
import { AdministradorPage } from "../pages/AdministradorPage"
import LoginPage from "../pages/LoginPage.jsx"

export const AppRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="*" element={<Home/>}/>
            <Route path="/SensorsWebApp" element={<Home/>}/>
            <Route path="/dashboard" element={<SensoresPage/>}/>
            <Route path="/proyectos/*" element={<ProjectsRoute/>}/>
            <Route path="/grupos" element={<Grupos/>}/>
            <Route path="/administrador" element={<AdministradorPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
        </Routes>
    )
}
