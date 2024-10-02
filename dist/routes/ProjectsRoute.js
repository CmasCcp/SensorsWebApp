import { Route, Routes } from "react-router-dom";
import { Trabajos, ActiveProject } from "../pages";
export const ProjectsRoute = () => {
    return (<Routes>
        <Route path="" element={<Trabajos />}/>
        <Route path="/:category/:table_name" element={<ActiveProject />}/>
        <Route path="*" element={<>Not Found</>}/>
    </Routes>);
};
