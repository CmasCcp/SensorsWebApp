import { Routes, Route } from "react-router-dom"
import {Home } from "../pages/"
import { SensoresPage } from "../pages/SensoresPage"
import { AdministradorPage } from "../pages/AdministradorPage"
import {RegisterPage} from '../pages/RegisterPage'
import {DataPage} from '../pages/DataPage'
import { ProtocolosPage } from "../pages/ProtocolosPage"
import { PruebaPage } from "../pages/PruebaPage"
import { PruebaObservador } from "../pages/PruebaObservador"
import { BancoDatosPage } from "../pages/BancoDatosPage"

export const AppRoute = () => {
    return (
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="*" element={<Home/>}/>
            <Route path="/SensorsWebApp" element={<Home/>}/>
            <Route path="/dashboard" element={<SensoresPage/>}/>
            <Route path="/registrar" element={<RegisterPage/>}/>
            <Route path="/datos" element={<DataPage/>}/>
            <Route path="/protocolos" element={<ProtocolosPage/>}/>
            <Route path="/administrador" element={<AdministradorPage/>}/>
            <Route path="/prueba" element={<PruebaPage/>}/>
            <Route path="/observador" element={<PruebaObservador/>}/>
            <Route path="/banco-de-datos" element={<BancoDatosPage/>}/>
        </Routes>
    )
}
