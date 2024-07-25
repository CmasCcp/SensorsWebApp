import React from 'react';

export const Form = ({ properties,data }) => {
  return (
    <div className="container">
      <h2>Formulario</h2>
      <form>
        {properties.map(prop => (
          <div className="mb-3" key={prop}>
            <label htmlFor={prop} className="form-label">{prop}</label>
            <input type="text" className="form-control" id={prop} name={prop} />
          </div>
        ))}
        <button type="submit" className="btn btn-primary">Enviar</button>
      </form>
    </div>
  );
};
