import React, { useEffect, useState } from 'react';
import useForeignKeyValidator from '../hooks/useForeignKeyValidator';
import { useFetch } from '../hooks/useFetch';

export const Form = ({ properties, data, onChange }) => {
  const { isPrimaryKey, getTableNameSingular, isForeignKey } = useForeignKeyValidator();
  const [foreignData, setForeignData] = useState({});

  useEffect(() => {
    const fetchForeignData = async () => {
      const results = {};
      for (const prop of properties) {
        try {
          if (isForeignKey(prop)){
            const response = await fetch(`${import.meta.env.VITE_API_URL}/columnaForanea?columna=${prop}`);
            const result = await response.json();
            results[prop] = result['data']; // Almacena los datos de la columna en el estado
          }
        } catch (error) {
          console.error(`Error fetching data for ${prop}:`, error);
        }
      }
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
        {properties.map(prop => {
          const options = foreignData[prop] || [];

          return (
            <div className="mb-3" key={prop}>
              <label htmlFor={prop} className="form-label">{getTableNameSingular(prop)}</label>
              {
                isForeignKey(prop) && Array.isArray(options) ? (
                <select
                  className="form-control"
                  id={data?.[prop] || ""}
                  name={prop}
                  placeholder="Seleccione"
                  value={data?.[prop] || ""} // Utiliza `value` en lugar de `defaultValue` para reflejar el valor seleccionado
                  onChange={handleChange}>
                      
                  <option value={"selecciona"}>
                    Seleccione...
                  </option>
                  {options.map((option, index) => (
                    <option key={index} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                ) : 
                <input 
                  className="form-control" 
                  id={data?.[prop] || ""} 
                  name={prop}
                  value={data?.[prop] || ""}
                  onChange={handleChange}
                  disabled={isPrimaryKey(prop) ? true : false} />
              }

            </div>
          )
        })}
      </form>
    </div>
  );
};