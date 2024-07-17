import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom'
import { ProjectTable } from '../components/ProjectTable';
import { Spinner } from '../components/Spinner';
import { useProjectsStore } from '../hooks/useProjectsStore';
import { startGetProjectListDataless, startSetActiveProject } from "../store/projects/thunks"
import { Blog } from './Blog';

export const ActiveProject = () => {


    const { category, table_name } = useParams();
    const { activeProject } = useProjectsStore();
    const data = activeProject?.data;

    const [filter, setFilter] = useState({
        search: "",
        date: ""
    });


    const handleFilterChange = (event) => {
        const input = event.target.name;

        if (input == "date" && !!event.target.value) {
            const dateParts = event.target.value.split("-"); // Split the date into parts (year, month, day)
            const day = parseInt(dateParts[2]); // Get the day as integer
            const month = parseInt(dateParts[1]); // Get the month as integer
            const year = parseInt(dateParts[0]); // Get the year as integer
            const formattedDate = `${day}/${month}/${year}`; // Create the formatted string
            console.log("formatted:", formattedDate); // Output: "21/4/2023"

            setFilter({
                ...filter, [input]: formattedDate
            });
        } else {
            setFilter({
                ...filter, [input]: event.target.value
            });
        }
    }


    const dispatch = useDispatch();

    useEffect(() => {
        console.log(table_name);
        dispatch(startGetProjectListDataless());
        dispatch(startSetActiveProject(table_name));

    }, [])



    return (
        <div className="container-fluid m-0 p-0" style={{ "minHeight": "50vh" }}>
            <div className="page-header bg-fixed p-0 m-0 text-white vh-25">
                <div className='opacity-3 bg-customprimary vh-25 m-0'>
                </div>
                <div className="text-center m-0 p-0 vh-25 position-relative d-flex flex-column justify-content-center" style={{ "zIndex": "9999", "top": "-25vh" }}>
                    {/* <h2 style={{ "fontSize": "2.5rem" }}>Centro de investigación Concepción C+</h2> */}
                    <h2 className="text-center">
                        {activeProject?.name}
                    </h2>
                </div>
            </div>

            {/* TODO: Debo hacer esto escalable, agregar alguna propiedad a los trabajos para distinguir entre banco de datos y vlog */}

            <div className="" style={{ "minHeight": "50vh" }}>
                {
                    activeProject?.name !== "[FIC] Salud Adulto mayor"
                        ?
                        <div className="col-12 mx-auto">
                            <h6 className="text-left">Filtros</h6>
                            <input onChange={handleFilterChange} className="form-control my-1" type="text" name="search" id="search" placeholder="Buscar" />
                            <input onBlur={handleFilterChange} className="form-control my-1" type="date" name="date" id="date" />

                        </div>
                        : ""
                }
                {
                    !!data && activeProject?.name !== "[FIC] Salud Adulto mayor"
                        // ? <Spinner/>
                        ? <ProjectTable data={data} filter={filter} />
                        : (activeProject?.name == "[FIC] Salud Adulto mayor") ? <Blog /> : <Spinner />
                }

            </div>
        </div>

    )
}