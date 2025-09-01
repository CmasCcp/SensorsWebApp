import { useMsal } from '@azure/msal-react';
import React, { useEffect, useState } from 'react';

// tablePrimaryKey: parámetro del tableData para usar de Id de cada fila de la tabla (ej: "id_sensor")

export const BasicDataTableGraphic = ({
  tableData = [],
  tableTitle = "",
  tablePrimaryKey = null,
  tablePrimaryKey_secondary = null,
  onDelete = false,
  onEdit = false,
  handleOnClickEdit = false,
  order="desc"
}) => {
  const { accounts } = useMsal();
  const username = accounts.length > 0;
  const visitorLoggedIn = localStorage.getItem("visitorLoggedIn") === "true";
  const [selectedRows, setSelectedRows] = useState([]);

  if (!Array.isArray(tableData) || tableData.length === 0) {
    return <p>No hay datos disponibles para mostrar.</p>;
  }


  const handleCheckboxChange = (id) => {
    setSelectedRows((prevSelected) =>
      prevSelected?.includes(id)
        ? prevSelected.filter((item) => item !== id)
        : [...prevSelected, id]
    );
  };

  const handleSelectAll = () => {
    const allIds = tableData.map(row => row[tablePrimaryKey]);
    const allSelected = allIds.every(id => selectedRows.includes(id));
    setSelectedRows(allSelected ? [] : allIds);
  };


  // Estado para almacenar los datos de las columnas foráneas
  const [foreignData, setForeignData] = useState({});

  useEffect(() => {
    const fetchForeignData = async () => {
      const properties = Object.keys(tableData[0]);

      const results = {};
      for (const prop of properties) {
        // Poner condicional de que la prop.Field no debe ser la id primaria de la tabla que se esta editando
        try {

          // TODO: controlar respuestas 400
          const response = await fetch(`${import.meta.env.VITE_API_URL}/columnaForanea?columna=${prop}`);
          if (response.status == 200) {
            const result = await response.json();
            results[prop] = result['data']; // Almacena los datos de la columna en el estado
          }
        } catch (error) {
          console.error(`Error fetching data for ${prop}:`, error);
        }
      }
      setForeignData(results); // Actualiza el estado con todos los resultados
    };

    fetchForeignData();
    // console.log("tableData", tableData);
  }, [tableData]);


  // Lista de columnas a ocultar
  const hiddenColumns = ["id_sesion", "sesion_descripcion", "fecha_inicio", "ubicacion", "id_dato_concatenado"];

  // Filtra las columnas visibles
  const visibleKeys = Object.keys(tableData[0]).filter(key => !hiddenColumns.includes(key));


  // Renderiza los datos en orden inverso
  const renderedTableData = (order === "desc") ? [...tableData].reverse() : [...tableData];

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
            {visibleKeys.map((key, index) => (
              <th key={index}>{key}</th>
            ))}
            {username && (
              <>
                {onEdit && <th>Editar</th>}
                {onDelete && <th>Eliminar</th>}
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {renderedTableData.map((row, rowIndex) => {
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
                {visibleKeys.map((key, colIndex) => {
                  let value = row[key];
                  let label = "None";
                  if (Object.entries(foreignData).length !== 0) {
                    const options = foreignData[key] || [];
                    const item = options.find(obj => obj.value === value);
                    label = item ? "(" + item.value + ") " + item.label : null;
                  }
                  return (
                    <td key={colIndex}>
                      {
                        (!!label && label !== "None")
                          ? label
                          : (typeof value === "string" && value.startsWith("http")
                            ? <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
                            : value)
                      }
                    </td>
                  );
                })}
                {username && (
                  <>
                    {onEdit && (
                      <td>
                        <button className="btn text-primary" onClick={() => handleOnClickEdit([rowId, row])}>
                          Editar
                        </button>
                      </td>
                    )}
                    {onDelete && (
                      <td>
                        <button className="btn text-danger" onClick={() => onDelete(row[tablePrimaryKey], row[tablePrimaryKey_secondary])}>
                          Eliminar
                        </button>
                      </td>
                    )}
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {(selectedRows.length > 0 && username) && (
        <div className="mt-3">
          <p><strong>Filas seleccionadas:</strong> {selectedRows.join(",")}</p>
          <button onClick={() => onDelete(selectedRows.join(","))} className='btn btn-danger'>Eliminar filas seleccionadas</button>
        </div>
      )}
    </div>
  );
};
