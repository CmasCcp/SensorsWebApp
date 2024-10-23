import React from 'react';

export const Form = ({ properties, data, onChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Llamar a la función onChange con los nuevos datos actualizados
    onChange({ ...data, [name]: value });
  };
  
  return (
    <div className="container">
      <h2>Formulario</h2>
      <form>
        {properties.map(prop => (
          <div className="mb-3" key={prop}>
            <label htmlFor={prop} className="form-label">{prop}</label>
            <input className="form-control" id={data[prop]} name={prop} defaultValue={data[prop]} onChange={handleChange}/>
          </div>
        ))}
      </form>
    </div>
  );
};
