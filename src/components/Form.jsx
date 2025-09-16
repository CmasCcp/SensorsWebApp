import React, { useEffect, useState } from 'react';
import { VariablesSelector } from './VariablesSelector';

// TODO: las tablas que tienen claves primarias cruzadas ( muchas a muchas) tienen que tener 
// habilitados los campos para seleccionar las claves primarias como si fueran foraneas

export const Form = ({ properties = [], data, onChange, tableName, pkValue }) => {
  // console.log("tableName", tableName);
  // console.log("pkValue", pkValue);
  // console.log(properties);

  // Estado para almacenar los datos de las columnas foráneas
  const [foreignData, setForeignData] = useState({});

  useEffect(() => {
    const fetchForeignData = async () => {
      const results = {};
      for (const prop of properties) {
        // Poner condicional de que la prop.Field no debe ser la id primaria de la tabla que se esta editando
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/columnaForanea?columna=${prop.Field}`);
          // console.log(response.status);
          if (response.status == 200) {
            const result = await response.json();
            results[prop.Field] = result['data']; // Almacena los datos de la columna en el estado
          }
        } catch (error) {
          console.error(`Error fetching data for ${prop.Field}:`, error);
        }
      }
      // console.log(results);
      setForeignData(results); // Actualiza el estado con todos los resultados
    };

    fetchForeignData();
  }, [properties]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };


  const inputType = (prop, options) => {
    const countPri = properties.filter(obj => obj.Key === "PRI").length;
    // console.log(countPri);

    let result;


    switch (true) {
      case (countPri > 1 && prop.Key === "PRI"):
        result = "compuesta"
        break;
      case (countPri === 1 && prop.Key === "PRI"):
        result = "primaria"
        break;

      case (prop.Key === "MUL" && Array.isArray(options)):
        result = "foranea"
        break;
      
      case (prop.Field === "variables_usadas"):
        result = "variables_usadas"
        break;

      default:
        result = "normal"
        break;
    }

    return result;
  }

  return (
    <div className="container">
      <form>
        {
          properties?.map(prop => {
            const options = foreignData[prop.Field] || []; // Acceso correcto a la propiedad en foreignData
            const inputRenderType = inputType(prop, options); // obtener el tipo de input que se va a renderizar

            return (
              <div className="mb-3" key={prop.Field}> {/* Usa prop.Field para clave única */}
                <label htmlFor={prop.Field} className="form-label">{prop.Field.toUpperCase()}</label>

                {inputRenderType === "compuesta" && (
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
                )}

                {inputRenderType === "primaria" && (
                  <input type="text" className="form-control" id={prop.Field} disabled={true} name={prop.Field} />
                )}
                {inputRenderType === "foranea" && (
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
                )}

                {inputRenderType === "variables_usadas" && (
                  <>
                    <input
                      type={"text"}
                      disabled={true}
                      className={`form-control`}
                      id={prop.Field}
                      name={prop.Field}
                      value={data?.[prop.Field] || ""}
                      onChange={handleChange}
                    />
                  <VariablesSelector data={data} handleChange={handleChange} variablesValueString={data?.["variables_usadas"]} onChange={handleChange} sensorTipo={data?.["id_sensor_tipo"]} />

                  </>
                )}
                {inputRenderType === "normal" && (
                  <>
                    {prop.Field === "codigo_interno" && (
                      <small className="form-text text-muted">
                        Sigue el siguiente formato: nombre + guión + número.
                        <br />
                        Ejemplo: SOIL-01
                      </small>
                    )}
                    <input
                      type={(prop.Type === "datetime") ? "datetime-local" : (prop.Type === "date") ? "date" : "text"}
                      className={`form-control ${prop.Key === "PRI" && "primary-key"}`}
                      id={prop.Field}
                      name={prop.Field}
                      value={data?.[prop.Field] || ""}
                      onChange={handleChange}
                    />
                  </>
                )}


                {
              /* {
                (prop.Key === "MUL" && 
                Array.isArray(options)) // Verifica si hay opciones disponibles para el select
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
                  ) 
                  
                  
                  : ( 
                    <input
                      type={(prop.Type === "datetime") ? "datetime-local" : (prop.Type === "date") ? "date" : "text"}
                      className={`form-control ${prop.Key === "PRI" && "primary-key"}`} 
                      id={prop.Field}
                      name={prop.Field}
                      value={data?.[prop.Field] || ""}
                      onChange={handleChange}
                      disabled={prop.Key === "PRI" && prop.Field.toUpperCase() == "primaria"} // Deshabilita si la propiedad es clave primaria
                    />
                  ) 
                  

                  
                  // (
                    <input
                      type={(prop.Type === "datetime") ? "datetime-local" : (prop.Type === "date") ? "date" : "text"}
                      className={`form-control ${prop.Key === "PRI" && "primary-key"}`} 
                      id={prop.Field}
                      name={prop.Field}
                      value={data?.[prop.Field] || ""}
                      onChange={handleChange}
                      disabled={prop.Key === "PRI" && prop.Field.toUpperCase() !== "IDSENSORTIPO"} // Deshabilita si la propiedad es clave primaria
                    />
                  // )
              } */}
              </div>
            )
          })
        }
      </form>
    </div>
  );
};
