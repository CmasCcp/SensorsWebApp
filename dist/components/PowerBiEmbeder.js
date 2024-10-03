import { FC, useEffect, useState } from 'react';
import { models } from 'powerbi-client';
import { PowerBIEmbed } from 'powerbi-client-react';
const PowerBiPOC = () => {
    const [reportConfig, setReportConfig] = useState < models.IReportEmbedConfiguration > ({
        type: 'report',
        embedUrl: undefined,
        accessToken: undefined,
        id: undefined,
        tokenType: models.TokenType.Embed,
        settings: {
            panes: {
                filters: {
                    expanded: false,
                    visible: true
                }
            },
            background: models.BackgroundType.Transparent,
        }
    });
    useEffect(() => {
        axios.get('api URL to get the Power Bi details ').then((response) => {
            setReportConfig({});
        });
    });
};
reportConfig,
    embedUrl;
response.value.embedUrl,
    accessToken;
response.value.token,
    id;
response.value.id;
;
[];
;
return (<>
    <div>
      <PowerBIEmbed embedConfig={reportConfig} cssClassName='power-bi-report-class'/>
    </div>
  </>);
export default PowerBiPOC;
