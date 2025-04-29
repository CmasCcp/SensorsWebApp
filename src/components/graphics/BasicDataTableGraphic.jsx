import React, { useState } from 'react';

export const BasicDataTableGraphic = ({
  tableData = [],
  tableTitle = "",
  tablePrimaryKey = null,
  onDelete = () => {},
  onEdit = () => {},
  handleOnClickEdit = () => {},
}) => {

  const [selectedRows, setSelectedRows] = useState([]);

  if (!Array.isArray(tableData) || tableData.length === 0) {
    return <p>No hay datos disponibles para mostrar.</p>;
  }

  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    const allIds = tableData.map(row => row[tablePrimaryKey]);
    const allSelected = allIds.every(id => selectedRows.includes(id));
    setSelectedRows(allSelected ? [] : allIds);
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <h3 style={{ fontSize: '1.5rem' }}>{tableTitle}</h3>
      <table className="table table-bordered">
        <thead style={{ fontSize: '1.25rem' }}>
          <tr>
            <th>
              <input
                type="checkbox"
                onChange={handleSelectAll}
                checked={
                  selectedRows.length === tableData.length &&
                  tableData.length > 0
                }
              />
            </th>
            {Object.keys(tableData[0]).map((key, index) => (
              <th key={index}>{key}</th>
            ))}
            <th>Editar</th>
            <th>Eliminar</th>
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, rowIndex) => {
            const rowId = row[tablePrimaryKey];
            return (
              <tr key={rowIndex}>
                <td>
                  <input
                    type="checkbox"
                    value={rowId}
                    checked={selectedRows.includes(rowId)}
                    onChange={() => handleCheckboxChange(rowId)}
                  />
                </td>
                {Object.values(row).map((value, colIndex) => (
                  <td key={colIndex}>{value}</td>
                ))}
                <td>
                  <button className="btn text-primary" onClick={() => handleOnClickEdit([rowId,row])}>
                    Editar
                  </button>
                </td>
                <td>
                  <button className="btn text-danger" onClick={() => onDelete(rowId)}>
                    Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {selectedRows.length > 0 && (
        <div className="mt-3">
          <p><strong>Filas seleccionadas:</strong> {selectedRows.join(",")}</p>
          <button onClick={()=>onDelete(selectedRows.join(","))} className='btn btn-danger'>Eliminar filas seleccionadas</button>
        </div>
      )}
    </div>
  );
};
