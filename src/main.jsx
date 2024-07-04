import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import { MainRoutes } from './routes/MainRoutes.jsx';
// import { DashboardPage } from './pages/DashboardPage.jsx';
// import { SensoresPage, ProyectosPage } from './views/pages';
import { MainLayout } from './layouts/MainLayout'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <MainLayout/>
    </Router>
  </React.StrictMode>,
)
