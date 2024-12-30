import { useMsal } from '@azure/msal-react';

export const ProtocolosPage = () => {
  const { accounts } = useMsal();
  const username = accounts.length > 0;
  // Lista de archivos simulada
  const files = [
    {
      id: 1,
      title: "Protocolo 1",
      description: "Descripción breve del Protocolo 1.",
      fileUrl: "/files/protocolo1.pdf", // URL del archivo
    },
    {
      id: 2,
      title: "Protocolo 2",
      description: "Descripción breve del Protocolo 2.",
      fileUrl: "/files/protocolo2.pdf",
    },
    {
      id: 3,
      title: "Protocolo 3",
      description: "Descripción breve del Protocolo 3.",
      fileUrl: "/files/protocolo3.pdf",
    },
  ];

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center">
      <div className="card">
        <h2 className="card-title">Protocolos</h2>
        <div className="card-content">
          {username && (
            <div className="file-list">
              {files.map((file) => (
                <div key={file.id} className="file-item">
                    <h4 style={{ color: "#333" }}>{file.title}</h4>
                    <p>{file.description}</p>
                    <div style={{ textAlign: "right" }}>
                        <a
                        href={file.fileUrl}
                        download
                        className="btn m-1 custom-button">
                        Descargar <i className="fas fa-download me-2"></i>
                        </a>
                    </div>
                </div>
                ))}
            </div>
          )}
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