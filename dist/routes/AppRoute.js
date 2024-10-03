import { Routes, Route } from "react-router-dom";
import { Home } from "../pages/";
import { SensoresPage } from "../pages/SensoresPage";
import { AdministradorPage } from "../pages/AdministradorPage";
export const AppRoute = () => {
    return (<Routes>
            <Route path="/" element={<Home />}/>
            <Route path="*" element={<Home />}/>
            <Route path="/SensorsWebApp" element={<Home />}/>
            <Route path="/dashboard" element={<SensoresPage />}/>
            <Route path="/administrador" element={<AdministradorPage />}/>
        </Routes>);
};
