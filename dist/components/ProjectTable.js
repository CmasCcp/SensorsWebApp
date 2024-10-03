import { useEffect } from "react";
import { useFilter, usePagination, useProjectsStore } from "../hooks";
import { Pagination } from "./Pagination";
export const ProjectTable = ({ data = [], filter = {} }) => {
    const { currentPage, itemsPerPage, nextPage, prevPage, goToPage, changeItemsPerPage } = usePagination(1, 100);
    // el parámetro que tenga más parametros para usarlos en el header de la tabla
    const objetoConMasPropiedades = data.reduce((prev, current) => {
        return Object.keys(prev).length < Object.keys(current).length ? current : prev;
    }, {});
    const headers = data.length > 0 ? Object.keys(objetoConMasPropiedades) : [];
    // filtro 
    const { filteredData, totalPages } = useFilter({ data, filter, currentPage, itemsPerPage });
    const options = {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };
    // useEffect(()=>{
    // startSetActiveProjectFilteredData(filteredData);
    // },[filteredData])
    return (<>
            &nbsp;
            <label htmlFor="itemsPerPage">Items por página:</label>
            &nbsp;
            <select id="itemsPerPage" className="mt-1" value={itemsPerPage} onChange={(e) => {
            const inputValue = e.target.value;
            if (!isNaN(inputValue) && inputValue !== "") {
                changeItemsPerPage(parseInt(inputValue));
                return;
            }
        }}>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={150}>150</option>
                <option value={250}>250</option>
            </select>

            <table className="table table-striped">
                <thead className="thead-dark">
                    <tr>
                        {headers.map((header) => (<th scope="col" key={header}>{header}</th>))}
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((x, index) => {
            return (<tr key={x.id}>
                                {Object.entries(x).map(([key, value]) => {
                    if (key == "timestamp" || key == "ingreso") {
                        const date = new Date(value).toLocaleString('es-ES', options);
                        return (<td key={key}>{date}</td>);
                    }
                    else {
                        return (<td key={key}>{value}</td>);
                    }
                })}
                            </tr>);
        })}
                </tbody>
            </table>
            <br />
            <br />
            <br />
            <br />
            <Pagination totalPages={totalPages} currentPage={currentPage} nextPage={nextPage} prevPage={prevPage} goToPage={goToPage}/>
        </>);
};
