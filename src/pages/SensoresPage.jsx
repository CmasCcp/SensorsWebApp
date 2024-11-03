import { models } from 'powerbi-client';
import { PowerBIEmbed } from 'powerbi-client-react';
import * as config from "../helpers/config";
import { useMsal } from '@azure/msal-react';

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
  const { accounts } = useMsal();
  const username = accounts[0] && accounts[0].username;

  const embedToken = sessionStorage.getItem('embedToken');

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="card">
        <h2 className="card-title">Dashboard</h2>
        <div className="card-content">
        {username && (        <PowerBIEmbed
          embedConfig = {{
            type: 'report',   // Supported types: report, dashboard, tile, visual, qna, paginated report and create
            id: config.reportId,
            embedUrl: config.embedUrl,
            accessToken: embedToken,
            tokenType: models.TokenType.Aad, // Use models.TokenType.Aad for SaaS embed
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
        />)}
        {!username &&(
            <>
            <h2>Acceso Restringido</h2>
            <p>Para ver este contenido, es necesario que inicies sesión.</p>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
