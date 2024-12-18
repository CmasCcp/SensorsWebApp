import React, { useState } from 'react';
import useForeignKeyValidator from '../hooks/useForeignKeyValidator';
import { useFetch } from '../hooks/useFetch';


export const Form = ({ properties = [], data, onChange }) => {
  const { isForeignKey, isPrimaryKey, getTableName, getTableNameSingular, validateForm, foreignKeys, getValue } = useForeignKeyValidator();
  const { data: clavesForaneas } = useFetch(`${import.meta.env.VITE_API_URL}/clavesForaneas`);

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange({ ...data, [name]: value });
  };


  return (
    <div className="container">
      <h2>Formulario</h2>
      <form>
        {properties.map(prop => (
          <div className="mb-3" key={prop}>
            <label htmlFor={prop} className="form-label">{getTableNameSingular(prop)}</label>
            {!!data
              ? (Array.isArray(getValue(clavesForaneas.data, prop)))
                ? (<select
                  className="form-control"
                  id={data[prop] || ""}
                  name={prop}
                  value={data[prop] || ""} // Utiliza `value` en lugar de `defaultValue` para reflejar el valor seleccionado
                  onChange={handleChange}
                >
                  {getValue(clavesForaneas.data, prop).map((option, index) => (
                    <option key={index} value={option.id}>
                      {option.value} {/* Muestra el texto de la opción */}
                    </option>
                  ))}
                </select>)
                : <input 
                  className="form-control" 
                  id={data[prop] || ""} name={prop}
                  value={data[prop] || ""}
                  onChange={handleChange}
                  disabled={isPrimaryKey(prop) ? true : false} />
              : (Array.isArray(getValue(clavesForaneas?.data, prop)))
                ? (<select
                  className="form-control"
                  // id={data[prop]}
                  name={prop}
                  // value={data[prop]} // Utiliza `value` en lugar de `defaultValue` para reflejar el valor seleccionado
                  defaultValue={null}
                  onChange={handleChange}
                >
                  {getValue(clavesForaneas.data, prop).map((option, index) => (
                    <option key={index} value={option.id}>
                      {option.value} {/* Muestra el texto de la opción */}
                    </option>
                  ))}
                </select>)
                : <input
                  className="form-control"
                  name={prop}
                  value={isPrimaryKey(prop) ? null : ""}
                  onChange={handleChange}
                  disabled={isPrimaryKey(prop) ? true : false} />

            }

          </div>
        ))}
      </form>
    </div>
  );
};

// TODO: que la casilla de id no se pueda modificar