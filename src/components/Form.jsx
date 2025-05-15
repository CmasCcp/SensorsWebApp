import React, { useEffect, useState } from 'react';

// TODO: las tablas que tienen claves primarias cruzadas ( muchas a muchas) tienen que tener 
// habilitados los campos para seleccionar las claves primarias como si fueran foraneas

export const Form = ({ properties = [], data, onChange }) => {
  console.log(data);

  // Estado para almacenar los datos de las columnas foráneas
  const [foreignData, setForeignData] = useState({});

  useEffect(() => {
    const fetchForeignData = async () => {
      const results = {};
      for (const prop of properties) {
        try {
          if (prop.Key === "MUL") {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/columnaForanea?columna=${prop.Field}`);
            console.log(response);
            const result = await response.json();
            results[prop.Field] = result['data']; // Almacena los datos de la columna en el estado
          }
        } catch (error) {
          console.error(`Error fetching data for ${prop.Field}:`, error);
        }
      }
      console.log(results);
      setForeignData(results); // Actualiza el estado con todos los resultados
    };

    fetchForeignData();
  }, [properties]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="container">
      <form>
        {properties?.map(prop => {
          const options = foreignData[prop.Field] || []; // Acceso correcto a la propiedad en foreignData

          return (
            <div className="mb-3" key={prop.Field}> {/* Usa prop.Field para clave única */}
              <label htmlFor={prop.Field} className="form-label">{prop.Field.toUpperCase()}</label>
              
              {
                prop.Key === "MUL" && Array.isArray(options) // Verifica si hay opciones disponibles para el select
                  ? (
                    <select
                      className="form-control"
                      id={prop.Field} // Utiliza prop.Field como id
                      name={prop.Field}
                      value={data?.[prop.Field] || ""}
                      onChange={handleChange}
                    >
                      <option value="noValueSelected">Seleccione un valor</option>
                      {options.map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.value} - {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={(prop.Type === "datetime") ? "datetime-local" : (prop.Type === "date") ? "date" : "text"}
                      className={`form-control ${prop.Key === "PRI" && "primary-key"}`} 
                      id={prop.Field}
                      name={prop.Field}
                      value={data?.[prop.Field] || ""}
                      onChange={handleChange}
                      disabled={prop.Key === "PRI"} // Deshabilita si la propiedad es clave primaria
                    />
                  )
              }
            </div>
          )
        })}
      </form>
    </div>
  );
};
