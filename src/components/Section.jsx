import React from 'react';
import { useProjectsStore } from '../hooks/useProjectsStore';
import CardItem from "./CardItem.jsx";

export const Section = ({ section_name }) => {
    const { startGetProjectsByCategory } = useProjectsStore();
    const listByCategory = startGetProjectsByCategory(section_name);
    return (
        <>
            <div className="row mx-auto py-2 my-3 text-dark justify-content-center h-15 w-50">
                <h3 className="my-auto w-100 text-center text-customprimary">{section_name}</h3>
            </div>
            <div className="card-container container w-75 mx-auto p-0 d-flex flex-row justify-content-center flex-wrap align-items-lg-center">
                {
                    !!listByCategory
                        ? listByCategory.map(item => <CardItem img={item.img} name={item.name} bodyText={item.category} className="card-custom" />)
                        : "cargando"
                }
            </div>
        </>
    );
};
