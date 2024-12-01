import { Routes, Route } from "react-router-dom"
import {Home } from "../pages/"
import { SensoresPage } from "../pages/SensoresPage"
import { AdministradorPage } from "../pages/AdministradorPage"
import {RegisterPage} from '../pages/RegisterPage'
export const AppRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="*" element={<Home/>}/>
            <Route path="/SensorsWebApp" element={<Home/>}/>
            <Route path="/dashboard" element={<SensoresPage/>}/>
            <Route path="/registrar" element={<RegisterPage/>}/>
            <Route path="/administrador" element={<AdministradorPage/>}/>
        </Routes>
    )
}
