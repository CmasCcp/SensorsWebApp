import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { DashboardView } from '../views/pages/DashboardView'
import { ProyectosPage, SensoresPage } from '../views/pages'

export const MainRoutes = () => {
  return (

    <MainLayout>

        <Routes>
            <Route index element={<DashboardView />} />
            <Route path="sensores" element={<SensoresPage />} />
            <Route path="proyectos" element={<ProyectosPage />} />
        </Routes>
        
    </MainLayout>
  )
}
