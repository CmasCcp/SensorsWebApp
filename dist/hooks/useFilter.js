import { useEffect, useState } from "react";
import { useProjectsStore } from "./useProjectsStore";
export const useFilter = ({ data = [], filter = {}, itemsPerPage = 100, currentPage = 1 }) => {
    const [filteredData, setFilteredData] = useState([]);
    const [totalPages, setTotalPages] = useState();
    const { startSetIsLoading, isLoading } = useProjectsStore();
    useEffect(() => {
        startSetIsLoading(true);
        const options = {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
        };
        const filtered = data.filter(obj => {
            // const date = new Date(value).toLocaleString('es-ES', options);
            obj = { ...obj, ingreso: new Date(obj.ingreso).toLocaleString('es-ES', options), timestamp: new Date(obj.timestamp).toLocaleString('es-ES', options) };
            return Object.values(filter).every((filterValue) => {
                const filterValueString = String(filterValue).toLowerCase();
                return Object.values(obj).some(objValue => {
                    const objValueString = String(objValue).toLowerCase();
                    return objValueString.includes(filterValueString);
                });
            });
        });
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedData = filtered.slice(startIndex, endIndex);
        setFilteredData(paginatedData);
        setTotalPages(Math.ceil(filtered.length / itemsPerPage));
        startSetIsLoading(false);
    }, [data, filter, itemsPerPage, currentPage]);
    return {
        filteredData,
        totalPages,
    };
};
