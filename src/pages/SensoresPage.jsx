import IframeResizer from '@iframe-resizer/react';

export const SensoresPage = ({ widthClose }) => {
  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="card">
        <h2 className="card-title">Dashboard</h2>
        <div className="card-content">
        <iframe title="EDA" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=42af7c04-324d-422f-bc69-6d3718b9e09b&autoAuth=true&embeddedDemo=true" frameborder="0" allowFullScreen="true"></iframe>
        </div>
      </div>
    </div>
  );
};
