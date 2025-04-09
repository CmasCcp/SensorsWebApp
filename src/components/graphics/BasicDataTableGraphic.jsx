import React from 'react';

export const BasicDataTableGraphic = ({ tableData = [], tableTitle= "" }) => {

    // console.log(tableData);
  // Verificar si tableData es un arreglo
  if (!Array.isArray(tableData) || tableData.length === 0) {
    return <p>No hay datos disponibles para mostrar.</p>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
        <h3 style={{ fontSize: '1.5rem' }} >{tableTitle}</h3>
      <table className="table table-bordered">
        <thead style={{ fontSize: '1.25rem' }}>
          <tr>
            {Object.keys(tableData[0]).map((key, index) => (
              <th key={index}>{key}</th>
            ))}
            <th >editar</th>
            <th >eliminar</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
              {Object.values(row).map((value, colIndex) => (
                  <td key={colIndex}>{value}</td>
                ))}
                <th ><button className='btn text-primary' onClick={()=>console.log("editar")}>Editar</button></th>
                <th ><button className='btn text-danger' onClick={()=>console.log("eliminar")}>Eliminar</button></th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
