import { models } from 'powerbi-client';
import { PowerBIEmbed } from 'powerbi-client-react';

const filter = {
  $schema: "http://powerbi.com/product/schema#basic",
  target: {
      table: "dbAysen dataAysen",
      column: "idSensor"
  },
  operator: "In",
  values: [40, 29]
};

export const SensoresPage = ({ widthClose }) => {
  const embedToken = localStorage.getItem('embedToken');

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="card">
        <h2 className="card-title">Dashboard</h2>
        <div className="card-content">

        <PowerBIEmbed
          embedConfig = {{
            type: 'report',   // Supported types: report, dashboard, tile, visual, qna, paginated report and create
            id: 'af0cd53d-4c4b-4ce8-b6d8-f7d85483408e',
            embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=af0cd53d-4c4b-4ce8-b6d8-f7d85483408e&groupId=869a590a-0426-48e3-8c31-ea20c5e79c6c&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUNFTlRSQUwtVVMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7InVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlfX0%3d',
            accessToken: embedToken,
            tokenType: models.TokenType.Embed, // Use models.TokenType.Aad for SaaS embed
            settings: {
              panes: {
                filters: {
                  expanded: false,
                  visible: false
                },
                pageNavigation: {
                  visible: false // Oculta la navegación entre páginas
                }
              },
              background: models.BackgroundType.Transparent,
            },
            filters:[filter]
          }}

          eventHandlers = {
            new Map([
              ['loaded', function () {
                console.log('Report loaded');
                const iframe = document.querySelector("iframe");
                if (iframe) {
                  iframe.style.border = "none"; // Eliminar el borde del iframe
                }
                console.log("Se cargó el iframee");
              }
              ],
              ['rendered', function () {console.log('Report rendered');}],
              ['error', function (event) {console.log(event.detail);}],
              ['visualClicked', () => console.log('visual clicked')],
              ['pageChanged', (event) => console.log(event)],
            ])
          }

          cssClassName = { "reportClass" }

          getEmbeddedComponent = { (embeddedReport) => {
            //window.report = embeddedReport;

          }}
        />
        </div>
      </div>
    </div>
  );
};
