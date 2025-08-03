import { useMsal } from '@azure/msal-react';

export const SensoresPage = () => {
  const { accounts } = useMsal();
  const username = accounts.length > 0;

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="card">
        <h2 className="card-title">Dashboard</h2>
        <div className="card-content">
        {/* {username && (         */}
          <iframe className='custom-iframe' title="DashboardPRODv2" width="100%" height="600" src="https://app.powerbi.com/view?r=eyJrIjoiNWZiNDAwNTYtMTc0My00ZWVmLTljMjktNjg2ZDMyNTE4YzI4IiwidCI6ImI1ZDc4OTI3LTI1ZDAtNDRhOS04MzcwLWQ4NmU1N2M3YmE5NiIsImMiOjR9&pageName=a6725ea5db51d7e84517" allowFullScreen={true}></iframe>
       {/* )} */}
        {/* {!username &&(
            <>
            <h2>Acceso Restringido</h2>
            <p>Para ver este contenido, es necesario que inicies sesión.</p>
            </>
          )} */}

        </div>
      </div>
    </div>
  );
};
