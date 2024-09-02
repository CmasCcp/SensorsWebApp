import React, { useState, useEffect } from 'react';
import { useProjectsStore } from '../hooks';
import { Spinner } from './Spinner';
import "./styles/paginationStyle.css"

export const Pagination = ({ totalPages=1, currentPage, nextPage, prevPage, goToPage }) => {
    const [activePage, setActivePage] = useState(currentPage); // Estado para mantener la página activa
    let anchoPantalla = window.innerWidth;
    let numero_de_botones = anchoPantalla / 100;
    // const [loading, setLoading] = useState(false);
    const {isLoading} = useProjectsStore();


    
    useEffect(() => {
        // Actualizar la clase "active" del botón al cambiar la página activa
        const buttons = document.getElementsByClassName("button");
        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            if (Number(button.innerText) === activePage) {
                button.classList.add("active");
            } else {
                button.classList.remove("active");
            }
        }
    }, [activePage, currentPage]);


    const handlePageClick = (pageNumber) => {
        setActivePage(pageNumber); // Actualizar el estado de la página activa
        if (typeof goToPage === 'function') {
            goToPage(pageNumber); // Invocar la función de devolución de llamada para cambiar de página
        }
    }

    const handleClick=(instruccion)=>{
        if(instruccion==="prevPage"){
            prevPage();
            setActivePage(currentPage-1); // Actualizar el estado de la página activa
            console.log(currentPage);
            console.log(totalPages);
        }else{
            nextPage();
            setActivePage(currentPage+1); // Actualizar el estado de la página activa
            console.log(currentPage);
        }
    }

    return (
        <div className='col-lg-10 mx-auto max-width-100 col-md-12 col-sm-12 row justify-content-around p-0 mb-4 m-0 flex-nowrap'>
            <button className="button bg-secondary" onClick={()=>handleClick("prevPage")} disabled={(currentPage<2) ? true :false}>{"<"}</button>
            {/* Renderizar los botones de paginación */}
            {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;
                return (
                    <div
                        key={pageNumber}
                        className={`button ${(totalPages>numero_de_botones && (pageNumber>currentPage+numero_de_botones) || (pageNumber<currentPage-numero_de_botones)) ? "hidden" : ""}`}
                        onClick={() => handlePageClick(pageNumber)}
                    >
                        {pageNumber}
                    </div>
                );
            })}
            <button className='button bg-secondary' onClick={()=>handleClick("nextPage")} disabled={(currentPage>=totalPages) ? true :false}>{">"}</button>
            {/* {isLoading ? <Spinner/> : ""} */}
        </div>
    )
}