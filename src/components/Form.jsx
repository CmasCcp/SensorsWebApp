import React, { useEffect, useState } from 'react';
import useForeignKeyValidator from '../hooks/useForeignKeyValidator';
import { useFetch } from '../hooks/useFetch';

export const Form = ({ properties, data, onChange }) => {
  const { isPrimaryKey, getTableNameSingular, getValue } = useForeignKeyValidator();
  const { data: clavesForaneas } = useFetch(`${import.meta.env.VITE_API_URL}/clavesForaneas`);
  const [formData, setFormData] = useState();


  useEffect(() => {
    console.log(formData);
  }, [])



  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };



  return (
    <div className="container">
      <h2>Formulario</h2>
      <form>
        {properties.map(prop => {
          return (
            <div className="mb-3" key={prop}>
              <label htmlFor={prop} className="form-label">{getTableNameSingular(prop)}</label>
              
              {

                (Array.isArray(getValue(clavesForaneas?.data, prop))) 
                    ? (<select
                      className="form-control"
                      id={data?.[prop] || ""}
                      name={prop}
                      value={data?.[prop] || ""} // Utiliza `value` en lugar de `defaultValue` para reflejar el valor seleccionado
                      onChange={handleChange}
                    >
                      
                        <option value={"selecciona"}>
                          Selecciona...
                        </option>
                      {getValue(clavesForaneas.data, prop).map((option, index) => (
                        <option key={index} value={option.value}>
                          {option.label} {/* Muestra el texto de la opción */}
                        </option>
                      ))}
                    </select>)
                    : <input 
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

// TODO: que la casilla de id no se pueda modificar




// {(Array.isArray(options))
//   ? (
//     <Select
//       id={prop}
//       options={options}
//       onChange={handleChange}
//       placeholder="Seleccione un proyecto"
//       value={formData[prop]}
//       // onMenuOpen={()=>console.log("first")}
//       // onMenuOpen={handleChange}
//       className="mt-2"
//     // styles={customStyles}
//     />

//   )
//   : <input
//     className="form-control"
//     id={data?.[prop] || ""}
//     name={prop}
//     value={data?.[prop] || ""}
//     onChange={() => handleChange(e.target)}
//     disabled={isPrimaryKey(prop) ? true : false} />
// }

