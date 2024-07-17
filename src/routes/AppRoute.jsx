import { Routes, Route, useNavigate, Navigate } from "react-router-dom"
import { Spinner } from "../components/Spinner"
import {Home } from "../pages/"
import { SensoresPage } from "../pages/SensoresPage"
import { ProjectsRoute } from "./ProjectsRoute"
import {Grupos} from "../pages/Grupos.jsx";
import {Herramientas} from "../pages/Tools.jsx";

export const AppRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/dashboard" element={<SensoresPage/>}/>
            <Route path="/proyectos/*" element={<ProjectsRoute/>}/>
            <Route path="/grupos" element={<Grupos/>}/>
            <Route path="/herramientas" element={<Herramientas/>}/>
        </Routes>
    )
}
