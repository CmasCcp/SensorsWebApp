import React, { useState } from 'react'
import { Navbar } from '../components/basics/Navbar';
import { SideBar } from '../components/basics/SideBar';
import { DashboardView } from '../views/DashboardView';

export const MainLayout = () => {

    const [showSideBar, setShowSideBar] = useState(false);



    const toggleSideBar=()=>{
        setShowSideBar(prevState => !prevState);
    };


    return (
        <>
            <Navbar toggleSideBar={toggleSideBar}/>
            
            <div id="layoutSidenav">
                <SideBar show={showSideBar}/>
                <DashboardView widthClose={showSideBar}/>
            </div>

        </>
    )
}
