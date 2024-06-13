import { AreaChartGraphic } from '../components/graphics/AreaChartGraphic';
import { BarGraphic } from '../components/graphics/BarGraphic';
import { CardGraphic } from '../components/graphics/CardGraphic';
import {DataTableGraphic} from "../components/graphics/DataTableGraphic"
import MyComponent from '../components/graphics/Prueba';
import useFetch from '../hooks/useFetch';




export const DashboardView = ({widthClose}) => {
    // const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/users');

    return (


        <>
        <div id="layoutSidenav_content" style={widthClose ? {} : {"marginLeft":"-225px"}}>
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">Dashboard</h1>
                    <ol className="breadcrumb mb-4">
                        <li className="breadcrumb-item active">Dashboard</li>
                    </ol>
                    <div className="row">
                        <CardGraphic title="Primary Card" url={"#"} type="primary"/>
                        <CardGraphic title="Warning Card" url={"#"} type="warning"/>
                        <CardGraphic title="Success Card" url={"#"} type="success"/>
                        <CardGraphic title="Danger Card" url={"#"} type="danger"/>
                        
                    </div>
                    <div className="row">
                        <div className="col-xl-6">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <i className="fas fa-chart-area me-1"></i>
                                    Area Chart Example
                                </div>
                                <div className="card-body">
                                    <AreaChartGraphic apiUrl={"https://mindicador.cl/api/dolar"}/>
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <i className="fas fa-chart-bar me-1"></i>
                                    Bar Chart Example
                                </div>
                                <div className="card-body">
                                    <BarGraphic />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <DataTableGraphic apiUrl={"https://southamerica-west1-fic-aysen-412113.cloudfunctions.net/listarSensores"}/> */}
                    <DataTableGraphic apiUrl={"https://jsonplaceholder.typicode.com/posts"}/>
                    {/* //TODO: HACER LO DE ABAJO - QUIZAS SE DEBERIA HACER EN EL BACKEND */}
                    {/* <DataTableGraphic apiUrl={"https://jsonplaceholder.typicode.com/posts"} instructions={ [{}], key = data => [] }/> */}
                    {/* <DataTableGraphic apiUrl={"https://mindicador.cl/api/dolar"}/> */}

                </div>
            </main>
            <footer className="py-4 bg-light mt-auto">
                <div className="container-fluid px-4">
                    <div className="d-flex align-items-center justify-content-between small">
                        <div className="text-muted">Copyright &copy; Your Website 2023</div>
                        <div>
                            <a href="#">Privacy Policy</a>
                            &middot;
                            <a href="#">Terms &amp; Conditions</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
        
        </>
    )
}
