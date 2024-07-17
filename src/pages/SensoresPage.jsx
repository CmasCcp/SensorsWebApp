import { AreaChartGraphic } from '../components/graphics/AreaChartGraphic';
import { BarGraphic } from '../components/graphics/BarGraphic';
import { CardGraphic } from '../components/graphics/CardGraphic';
import { DataTableGraphic } from "../components/graphics/DataTableGraphic"




export const SensoresPage = ({ widthClose }) => {
    return (
        <div className="container-fluid m-0" id="layoutSidenav_content" style={widthClose ? {} : { "marginLeft": "-225px" }}>
            <main>
                <div className="container-fluid px-4">
                    <h1 className="mt-4">Dashboard de prueba eliminar aqui</h1>

                    <div className="row mt-4">
                        <div className="col-md-12">
                            <iframe
                                title="Dashboard"
                                width="100%"
                                height="600"
                                src="https://lookerstudio.google.com/embed/reporting/6b1d3791-542f-4c15-8c6e-5fcb0a7664f6/page/WuE6D"
                                allowFullScreen
                                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                            ></iframe>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xl-6">
                            <div className="card mb-4">
                                <div className="card-header">
                                    <i className="fas fa-chart-area me-1"></i>
                                    Area Chart Example
                                </div>
                                <div className="card-body">
                                    <AreaChartGraphic apiUrl={"https://mindicador.cl/api/dolar"} />
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
                    <DataTableGraphic apiUrl={import.meta.env.VITE_API_URL} />
                    {/* //TODO: HACER LO DE ABAJO - QUIZAS SE DEBERIA HACER EN EL BACKEND */}
                    {/* <DataTableGraphic apiUrl={"https://jsonplaceholder.typicode.com/posts"} instructions={ [{}], key = data => [] }/> */}
                    {/* <DataTableGraphic apiUrl={"https://mindicador.cl/api/dolar"}/> */}

                </div>
            </main>
        </div>
    )
}
