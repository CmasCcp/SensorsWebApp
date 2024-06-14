import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { MainLayout } from './layouts/MainLayout.jsx'
import { DashboardView } from './views/DashboardView.jsx';
import { SensoresPage, ProyectosPage } from './views/pages';

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout></MainLayout>,
    children: [
      // {
      //   index: true,
      //   element: <DashboardView/>,
      // },
    //   {
    //     path: "proyectos",
    //     element: <ProyectosPage/>,
    //   },
    //   {
    //     path: "personas",
    //     element: <SensoresPage />,
    //   },
    //   {
    //     path: "grupos",
    //     element: <SensoresPage />,
    //   },
    //   {
    //     path: "sensores",
    //     element: <SensoresPage />,
    //   },
    //   {
    //     path: "dispositivos",
    //     element: <SensoresPage />,
    //   },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider
      router={router}
      fallbackElement={<>esperando...</>}
    />
  </React.StrictMode>,
)
