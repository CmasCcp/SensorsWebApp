import React, { useState } from 'react';

export const BasicDataTableGraphic = ({ tableData = [], tableTitle = "", sortTable }) => {
  const [sortedData, setSortedData] = useState(tableData); // Datos ordenados
  const [sortOrder, setSortOrder] = useState('asc'); // Estado para el orden (asc o desc)

  // Verificar si tableData es un arreglo
  if (!Array.isArray(tableData) || tableData.length === 0) {
    return <p>No hay datos disponibles para mostrar.</p>;
  }



  return (
    <div style={{ overflowX: 'auto' }}>
      <h3 style={{ fontSize: '1.5rem' }}>{tableTitle}</h3>
      
      {/* Select para ordenar por fecha */}
      <div className="mb-3">
        <label htmlFor="sortOrder" className="form-label">Ordenar por fecha:</label>
        <select
          id="sortOrder"
          className="form-select"
          value={sortOrder}
          onChange={(e) => sortTable(e.target.value)}
        >
          <option value="asc">Fecha Ascendente</option>
          <option value="desc">Fecha Descendente</option>
        </select>
      </div>
      
      <table className="table table-bordered">
        <thead style={{ fontSize: '1.25rem' }}>
          <tr>
            {Object.keys(tableData[0]).map((key, index) => (
              <th key={index}>{key}</th>
            ))}
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {Object.values(row).map((value, colIndex) => (
                <td key={colIndex}>{value}</td>
              ))}
              <td><button className='btn text-primary' onClick={() => console.log("editar")}>Editar</button></td>
              <td><button className='btn text-danger' onClick={() => console.log("eliminar")}>Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
