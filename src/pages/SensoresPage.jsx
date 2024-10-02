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
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="card">
        <h2 className="card-title">Dashboard</h2>
        <div className="card-content">

        <PowerBIEmbed
          embedConfig = {{
            type: 'report',   // Supported types: report, dashboard, tile, visual, qna, paginated report and create
            id: '37eb4f69-8a87-4b75-a1a5-e6aa1fa2134d',
            embedUrl: 'https://app.powerbi.com/reportEmbed?reportId=37eb4f69-8a87-4b75-a1a5-e6aa1fa2134d&groupId=7c708aba-16e9-42ed-82aa-2557d3d47e69&w=2&config=eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUNFTlRSQUwtVVMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJlbWJlZEZlYXR1cmVzIjp7InVzYWdlTWV0cmljc1ZOZXh0Ijp0cnVlfX0%3d',
            accessToken: 'H4sIAAAAAAAEACWTxw6zaBJF3-Xf0hIZQ0u9IJtgct595JzBwGjefdyabemqdHWqzn_-WODuJ5D_-fsPBvW6pT5sI5izooUsyDVFsWFujF5B9z2LTMUMllxgvu0opRSbgk5Iz2bUzOnIh-CMNiZfMOhKhT6QiXrB88u7hBsBrXMB1jdBhAu-jkUtbL6aJcB3OZaH2HGtYRFUnD5jfknTnqPn3L38V7o38wnHeOHWnS9iqp113uWA8OHT-B5xuIpk0PXSg9bRkx6ZsT_FaQ6zalp4xe5E3SdBCD9J731BVGSstCyJX67qowmFLEWh_oWu-TqGUbVt2O933zWe3v_M-lnIePrdEeLivzG8H58l6LlqL5bXQg8ggYmeIfh2KLXkJlogUN6N89ZS1bBfpkc8ia7vKUYjvPeO531cHtJhQ2iMH6xxVlGUnl5a8rb07cNa6L0l18DScHYuDc1EVeEqyFaXRPTV260PP0PLy1-nmKpITEXjYmKJaDJ0vN5i-yvW2PpbsRVHfXK_5SL_WVh3r4TA7fVI6T1BRLh3iVO38RJ_G85Pf7hn5ykltjz1LTxk7qPAn_PMKb8OJbElhW91G1bodzbwV4FLRMKRojsWM0cXDNy5n020G9Z0y0HCzGCH6Wah_VLTUbPynPK8lA5s4kZeXwcNP0zH9QlF5x2Zges99cvFwjBbSaJFK7MZjOlMvZzs0BPeOIYyCuu3i3KaGqU7f-Ldq4ivz-M9y4Ew9TbUKxhJiZSvMir0NgM-_JzCOSqmJCPMw21sU-03c5nujefCvMKoA6koLsKFkySm39q4d0SSTuEDZVRmyZhvAW10n3vRnr0jp2jmCIvYO5qkYjqjvfkEsOZqyAGXkG10EA98WkfgngipBAeBkDajdUdpUr-TQX8xd5kC8KCWhQx__vrDr_e8T1px_3SSBlehgtaXoHTQmp9iGwN8FN4uYW0upGcweMoXWIp0e7iwxdh8f5yI5uhXMW04D8jeqmsLZj-hMUiyBzr6up4cV1rAuoqQm6j_1o7w6s851mXumrESCNG3JVg_iLXzgX5i6qYMi-l4F-aiYGuCNUBZm4j6Pe7QFBetLa_kISYLkSphHenw3gJI4B_bflWJ_ZGEYrGUAb0nwfRHW8f8F5Gv7lmF3jJWCjUaXVnmN0p0EK2m2ok5aPPW8wyZp2FyjrXcoSPfvm_Yjip8BnEhNryQ18a67mNVkRf0lCx-B168OVGIZJjpkb56dDHtuB9pYvcrol3OOi9K5_prHkjwiDXJVf_88y_me66LVQl-lBd3sC7VStUReBqPUN83Bwv_T7lNNYL9WItfzO_VxFzK5nfWacmTOiSdRQo-t3xwaVAblKcbRza0AI0N8ClrqNEGnESpjNY2XGmq-jHt-M3wbu6O40om10T8CjjBnA_d6Crft3wohTszhHU7dRzK4Ud3rSA-8BD0jGiYfT_nV9emVdgHoblp5fhIinGMobW5U_c4qrlR2s0q1PnxOR1a9-Gr4Hz2m5kw-ELTc3ydvMOwHceOYVvBki_dB_f5HJXSuVxp8lAN7YjkFkrY1GObcAMTcVztGkYSAeTaHDujwPke-3RsCgc8FDOdxvSsrbPb4IrqhF0Pk1kfgycgzl365X2FUNguMe-TUIaYfQ2Maaoj5b1SUDjtsbQ9l_sv5v_-D7K_LcxCBgAA.eyJjbHVzdGVyVXJsIjoiaHR0cHM6Ly9XQUJJLVNPVVRILUNFTlRSQUwtVVMtcmVkaXJlY3QuYW5hbHlzaXMud2luZG93cy5uZXQiLCJleHAiOjE3Mjc4OTYwMTQsImFsbG93QWNjZXNzT3ZlclB1YmxpY0ludGVybmV0Ijp0cnVlfQ==',
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
