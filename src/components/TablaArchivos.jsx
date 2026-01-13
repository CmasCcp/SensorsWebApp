import React from "react";

const TablaArchivos = ({ archivos, nombreTabla }) => {
  if (!archivos || archivos.length === 0) return null;
  return (
    <div style={{ marginBottom: 32 }}>
      <h3>{nombreTabla}</h3>
      <div style={{ overflowX: "auto" }}>
        <table className="tabla-archivos" style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Ruta relativa</th>
              <th>Tamaño (bytes)</th>
              <th>Tamaño legible</th>
            </tr>
          </thead>
          <tbody>
            {archivos.map((archivo, idx) => (
              <tr key={archivo.nombre + idx}>
                <td>
                  <a
                    href={`${import.meta.env.VITE_API_URL}/descargarArchivoCSV?archivo=${encodeURIComponent(archivo.nombre)}`}
                    download
                    style={{ color: '#007bff', textDecoration: 'underline' }}
                  >
                    {archivo.nombre}
                  </a>
                </td>
                <td>{archivo.ruta_relativa}</td>
                <td>{archivo.tamaño_bytes}</td>
                <td>{archivo.tamaño_legible}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TablaArchivos;
