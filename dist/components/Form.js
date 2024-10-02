import React from 'react';
export const Form = ({ properties, data }) => {
    return (<div className="container">
      <h2>Formulario</h2>
      <form>
        {properties.map(prop => (<div className="mb-3" key={prop}>
            <label htmlFor={prop} className="form-label">{prop}</label>
            <input className="form-control" id={data[prop]} name={data[prop]} defaultValue={JSON.stringify(data[prop])}/>
          </div>))}
      </form>
    </div>);
};
