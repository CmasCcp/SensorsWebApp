import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PropertyBinding } from 'three';
import noVariables from '../../helpers/noVariables.json';


export const ChartComponent = ({ datos, fechaName = "fecha", title }) => {
  console.log(datos)
  const [chartData, setChartData] = useState([]);
  const [properties, setProperties] = useState([]);
  const [property, setProperty] = useState("");
  useEffect(() => {
    const filteredProperties = Array.from(new Set(datos.flatMap(Object.keys)))
      .filter((prop) =>
        prop &&
        !(
          Array.isArray(noVariables)
            ? noVariables.includes(prop)
            : Object.keys(noVariables).includes(prop)
        )
      )
    setProperties(filteredProperties);
    setProperty(filteredProperties.length > 0 ? filteredProperties[0] : "");

  }, [datos]);

  useEffect(() => {
    let ChartData = datos.map(dato => ({
      date: dato[fechaName],
      [property]: parseFloat(dato[property])
    }))

    setChartData(ChartData);
  }, [property, datos]);

  useEffect(() => {

    console.log("Datos para el gráfico:", chartData);
  }, [chartData]);

  const propertyNames = chartData.length > 0 ? Object.keys(chartData[0]) : [];
  console.log("Propiedades:", propertyNames);
  const filteredProperties = propertyNames.filter(
    prop => prop !== "date" && prop !== "id_dato"
  );
  const remainingProperty = filteredProperties.length > 0 ? filteredProperties[0] : null;
  return (
    <>
      <div className="row mb-3">
        {Array.isArray(datos) && datos.length > 0 && Array.isArray(properties) && properties.length > 0 ? (
          properties
            .map((prop) => (
              <button
                key={prop}
                type="button"
                className={`btn btn-outline-secondary m-1 ${prop === property ? 'active' : ''}`}
                onClick={() => setProperty(prop)}
                title={`Propiedad: ${prop}`}
              >
                {prop}
              </button>
            ))
        ) : (
          <small className="text-muted">No hay propiedades disponibles</small>
        )}

      </div>
      <div className='card'>
        {datos.length > 0 && (<div className='' >
          <p className='text-center mt-4 mb-0'>
            <span className="fw-bolder">{title || property}</span>
          </p>
          <div className="pe-5">

            <ResponsiveContainer className="mt-5" width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: title, angle: -90, position: 'insideLeft', fontSize: 16, fill: '#333', fontWeight: 'bold' }} />
                <Tooltip />
                {/* <Legend /> */}
                <Line type="monotone" dataKey={remainingProperty} stroke="#8884d8" />
                {/* <Line type="monotone" dataKey="value" stroke="#8884d8" /> */}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        )}
      </div>
    </>

  );

}
