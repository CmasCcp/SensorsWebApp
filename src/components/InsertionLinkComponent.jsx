import React, { useEffect, useState } from 'react';

export const InsertionLinkComponent = ({ sensorsData }) => {
    const [variablesEnSensoresData, setVariablesEnSensoresData] = useState(null);
    const [variablesData, setVariablesData] = useState(null);
    console.log(sensorsData)

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

    function getSensorVariables(id_sensor_tipo, id_sensor, variables_usadas="") {
        console.log("variables_usadas", variables_usadas)
        if (!variablesEnSensoresData || !variablesData) return [];
        const label_variable = variablesData;
        if (variables_usadas != "" && variables_usadas != null) {
            const variablesUsadasArray = variables_usadas?.split(',').map(Number);
            console.log("variablesEnSensoresData", variablesEnSensoresData)
            
            return variablesUsadasArray
            // .filter(item => item.idSensorTipo === id_sensor_tipo)
            .map(item => ({
                s: id_sensor,
                t: id_sensor_tipo,
                v: item,
                l:
                    (label_variable.data.tableData.find(x => x["id_variable"] === item)?.descripcion || "") +
                    " " +
                    (label_variable.data.tableData.find(x => x["id_variable"] === item)?.unidad || "") +
                    `(${id_sensor})`
            }));
        }

        return variablesEnSensoresData?.data?.tableData
            .filter(item => item.idSensorTipo === id_sensor_tipo)
            .map(item => ({
                s: id_sensor,
                t: id_sensor_tipo,
                v: item.idVariable,
                l:
                    (label_variable.data.tableData.find(x => x["id_variable"] === item.idVariable)?.descripcion || "") +
                    " " +
                    (label_variable.data.tableData.find(x => x["id_variable"] === item.idVariable)?.unidad || "") +
                    `(${id_sensor})`
            }));
    }

    if (!variablesEnSensoresData || !variablesData) {
        return <p>Cargando datos de variables...</p>;
    }
    if (!sensorsData?.data?.tableData || sensorsData.data.tableData.length === 0) {
        return <p>No hay sensores para mostrar el link.</p>;
    }

    const idsSensores = sensorsData.data.tableData.map(x => ({
        idSensor: x["Id Sensor"],
        idSensorTipo: x["Id Sensor Tipo"],
        variables_usadas: x["Variables Usadas"]
    }));

    const dataURL = idsSensores.map(sensor =>
        getSensorVariables(sensor.idSensorTipo, sensor.idSensor, sensor.variables_usadas)
    );

    // Aplana y filtra valores vacíos
    const idsSensoresArr = dataURL.flat().map(sensor => sensor.s).filter(Boolean);
    const idsVariablesArr = dataURL.flat().map(sensor => sensor.v).filter(Boolean);
    const idsValoresArr = dataURL.flat().map(sensor => sensor.l).filter(Boolean);

    const idsSensoresFormated = idsSensoresArr.join(",");
    const idsVariablesFormated = idsVariablesArr.join(",");
    const idsValoresFormated = idsValoresArr.join(",");

    return (
        <p style={{ fontSize: "0.75rem" }} className="fs-6">
            {`https://api-sensores.cmasccp.cl/insertarMedicion?idsSensores=${idsSensoresFormated}&idsVariables=${idsVariablesFormated}&valores=${idsValoresFormated}`}
        </p>
    );
};