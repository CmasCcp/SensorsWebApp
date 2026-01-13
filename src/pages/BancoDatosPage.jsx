import React, { useEffect, useState } from "react";
import TablaArchivos from "../components/TablaArchivos";

const API_URL = `${import.meta.env.VITE_API_URL}/listarArchivosCSV`;

export const BancoDatosPage = () => {
  const [estructura, setEstructura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch(API_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener los archivos");
        return res.json();
      })
      .then((data) => {
        setEstructura(data.estructura);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Cargando archivos...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;
  if (!estructura) return <div>No hay datos para mostrar.</div>;

  return (
    <div style={{ padding: 24 }}>
      <h2>Archivos CSV por Proyecto y Sensor</h2>
      {Object.entries(estructura).map(([proyecto, sensores]) => (
        <div key={proyecto} style={{ marginBottom: 48 }}>
          <h2>{proyecto}</h2>
          {Object.entries(sensores).map(([sensor, archivos]) => (
            <TablaArchivos
              key={sensor}
              archivos={archivos}
              nombreTabla={`Sensor: ${sensor}`}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

