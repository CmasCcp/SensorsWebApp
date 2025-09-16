import React, { useEffect, useState } from 'react';

// Hook para obtener variables en sensores y variables
export const useSensoresHelper = () => {
  const [sensorTipo, setSensorTipo] = useState(null);
  const [variablesEnSensoresData, setVariablesEnSensoresData] = useState(null);
  const [variablesData, setVariablesData] = useState(null);
  
  useEffect(() => {
    const fetchVariablesEnSensores = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=variables_en_sensores`);
        const data = await response.json();
        setVariablesEnSensoresData(data);
      } catch (error) {
        console.error('Error fetching variables_en_sensores:', error);
      }
    };
    const fetchVariables = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/listarDatos?tabla=variables`);
        const data = await response.json();
        setVariablesData(data);
      } catch (error) {
        console.error('Error fetching variables:', error);
      }
    };
    fetchVariablesEnSensores();
    fetchVariables();
  }, []);


  // Función para obtener información de variables por sensor
  // function getIdVariable(id_sensor_tipo, id_sensor, variablesEnSensoresData, variablesData) {
  //   if (!variablesEnSensoresData || !variablesData) return [];
  //   const data = variablesEnSensoresData;
  //   const label_variable = variablesData;
  //   return data?.data?.tableData
  //     .filter(item => item.idSensorTipo === id_sensor_tipo)
  //     .map(item => ({
  //       s: id_sensor,
  //       t: id_sensor_tipo,
  //       v: item.idVariable,
  //       l:
  //         (label_variable.data.tableData.find(x => x["id_variable"] === item.idVariable)?.descripcion || "") +
  //         " " +
  //         (label_variable.data.tableData.find(x => x["id_variable"] === item.idVariable)?.unidad || "") +
  //         `(${id_sensor})`
  //     }));
  // }

  const getVariablesBySensorTipo = (id_sensor_tipo) => {
    if (!variablesEnSensoresData || !variablesData) return [];
    const data = variablesEnSensoresData.data?.tableData || [];
    const label_variable = variablesData.data?.tableData || [];
    console.log("data", data)
    return data
      .filter(item => item.idSensorTipo === parseInt(id_sensor_tipo))
      .map(item => {
        const variable = label_variable.find(x => x["id_variable"] === item.idVariable);
        return {
          idVariable: item.idVariable,
          descripcion: variable?.descripcion || "",
          unidad: variable?.unidad || ""
        };
      });
  }

  return { variablesEnSensoresData, variablesData, setSensorTipo, getVariablesBySensorTipo };
};

