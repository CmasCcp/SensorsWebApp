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
  order = "desc"
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

  const [allColumns, setAllColumns] = useState([]);

  useEffect(() => {
    if (Array.isArray(tableData) && tableData.length > 0) {
      setAllColumns(Object.keys(tableData[0]));
    }
  }, [tableData]);

  // Lista de columnas a ocultar
  const [hiddenColumns, setHiddenColumns] = useState(["sesion_descripcion", "fecha_inicio", "ubicacion", "id_dato_concatenado"]);

  // Filtra las columnas visibles
  const visibleKeys = Object.keys(tableData[0]).filter(key => !hiddenColumns.includes(key));

  // Maneja el cambio de visibilidad de columnas
  const handleColumnVisibilityChange = (col) => {
    setHiddenColumns((prev) =>
      prev.includes(col)
        ? prev.filter(c => c !== col) // Mostrar columna (quitar de ocultas)
        : [...prev, col]              // Ocultar columna (agregar a ocultas)
    );
  };

  // Renderiza los datos en orden inverso
  // const renderedTableData = (order === "desc") ? [...tableData].reverse() : [...tableData];

  const [showFilters, setShowFilters] = useState(false);

  return (
    <div style={{ overflowX: 'auto' }}>

      <div className="col-12 px-0 d-flex flex-row justify-content-between bg-light">
        <button onClick={() => setShowFilters(!showFilters)} className='btn btn-secondary'>Filtros:</button>
        {allColumns.includes("fecha") && (
          <button className='btn btn-secondary ms-auto'>Ordenar por fecha:</button>
        )}
      </div>

      {/* Componente para filtros */}
      {showFilters && (
        <div className='card mx-0 col-12'>
          <label><small><strong>Columnas visibles:</strong></small></label>
          <div className='col-12' style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', margin: '8px 0', fontSize: '0.875rem' }}>
            {allColumns.map((col, idx) => (
              <label key={idx} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <input
                  type="checkbox"
                  checked={visibleKeys.includes(col)}
                  onChange={() => handleColumnVisibilityChange(col)}
                // disabled={hiddenColumns.includes(col)}
                // readOnly
                />
                {col}
              </label>
            ))}
          </div>
        </div>
      )}



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
