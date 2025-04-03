import React, { useEffect, useState } from 'react';

export const Form = ({ properties=[], data, onChange }) => {
  console.log(properties)

// formato necesario de properties
// [
//   {
//     "Count": 1322846,
//     "Default": null,
//     "Extra": "auto_increment",
//     "Field": "id_dato",
//     "Key": "PRI",
//     "Null": "NO",
//     "Type": "int(11)"
//   }
// ] 
  // const { isPrimaryKey, getTableNameSingular, isForeignKey } = useForeignKeyValidator();
  const [foreignData, setForeignData] = useState({});

  useEffect(() => {
    const fetchForeignData = async () => {
      const results = {};
      for (const prop of properties) {
        try {
          if (prop.Key === "MUL"){
            const response = await fetch(`${import.meta.env.VITE_API_URL}/columnaForanea?columna=${prop.Field}`);
            console.log(response);
            const result = await response.json();
            results[prop.Field] = result['data']; // Almacena los datos de la columna en el estado
          }
        } catch (error) {
          console.error(`Error fetching data for ${prop}:`, error);
        }
      }
      console.log(results);
      setForeignData(results); // Actualiza el estado con todos los resultados
    };

    fetchForeignData();
    console.log(foreignData);
  
  }, [properties]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };

  return (
    <div className="container">
      <form>
        {properties?.map(prop => {
          const options = foreignData[prop] || [];

          return (
            <div className="mb-3" key={prop}>
              <label htmlFor={prop.Field} className="form-label">{prop.Field.toUpperCase()}</label>
              {
                prop.Key === "MUL" && Array.isArray(options) 
                
                ? (
                <select
                  className="form-control"
                  id={data?.[prop] || ""}
                  name={prop}
                  placeholder="Seleccione"
                  value={data?.[prop] || ""} // Utiliza `value` en lugar de `defaultValue` para reflejar el valor seleccionado
                  onChange={handleChange}>
                      
                  <option value={"noValueSelected"}>
                    Seleccione un valor
                  </option>
                  {options.map((option, index) => {
                      console.log(option);
                    
                    return(
                    <option key={index} value={option.value}>
                      {/* {option.label} */}
                    </option>
                  )})}
                </select>
                ) : 
                
                <input 
                  className="form-control" 
                  id={data?.[prop] || ""} 
                  name={prop}
                  value={data?.[prop] || ""}
                  onChange={handleChange}
                  disabled={prop.Key== "PRI" ? true : false} />
              }

            </div>
          )
        })}
      </form>
    </div>
  );
};