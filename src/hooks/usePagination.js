import { useState } from "react";
import { useProjectsStore } from "./useProjectsStore";

export const usePagination = (initialPage = 1, initialItemsPerPage = 100) => {
    
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [itemsPerPage, setitemsPerPage] = useState(initialItemsPerPage);
    const {startSetIsLoading} = useProjectsStore();

    const nextPage = ()=>{
        setCurrentPage(prev => prev + 1);
    }
    
    const prevPage = ()=>{
        setCurrentPage(prev => prev - 1);
    }

    const goToPage = (pageNumber)=>{
        setCurrentPage(pageNumber);
    }

    const changeItemsPerPage = (itemsPerPageNumber)=>{
        setitemsPerPage(itemsPerPageNumber);
    }
  
    return {
        currentPage,
        itemsPerPage,

        nextPage,
        prevPage,
        goToPage,
        changeItemsPerPage,
  }
}
