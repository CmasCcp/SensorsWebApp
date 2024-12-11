import React from 'react';

export const Probando = ({ tableName, dataProperties, clavesForaneas }) => {
    const tabla_id = [
        "id_sesion",
        "id_variable",
        "id_grupo",
        "id_estado",
        "id_proyecto",
        "id_persona",
        "id_sensor",
        "id_sensor_tipo",
        "id_persona_responsable_ingreso",
        "id_persona_responsable_salida",
        "id_persona_responsable"
    ];

    const id_tabla = {
        "id_sesion": "sesiones",
        "id_variable": "variables",
        "id_grupo": "grupos",
        "id_estado": "estados",
        "id_proyecto": "proyectos",
        "id_persona": "personas",
        "id_sensor": "sensores",
        "id_sensor_tipo": "sensores_tipo",
        "id_persona_responsable_ingreso": "personas",
        "id_persona_responsable_salida": "personas",
        "id_persona_responsable": "personas"
    };

    // Validar si clavesForaneas.data es un array válido
    if (!Array.isArray(clavesForaneas.data)) {
        return <div>Error: `clavesForaneas.data` no es un array válido.</div>;
    }

    const resultUI = dataProperties.map((prop, index) => {
        const isKey = tabla_id.includes(prop); // Verifica si `prop` es una clave foránea
        const isTablaForanea = tableName !== id_tabla[prop]; // Verifica si pertenece a otra tabla

        if (isKey && isTablaForanea) {
            const valores = clavesForaneas.data.map((x, idx) => {
                const datosForaneos = x[id_tabla[prop]]; // Obtiene datos de la tabla foránea
                if (datosForaneos) {
                    // Convertir el objeto en una representación legible
                    return (
                        <div key={idx}>
                            {Object.entries(datosForaneos).map(([key, value], i) => (
                                <div key={i}>
                                    <strong>{key}:</strong> {String(Object.entries(value))}
                                </div>
                            ))}
                        </div>
                    );
                }
                return null;
            });

            return (
                <div key={index}>
                    <b>{prop}</b>: {valores}
                </div>
            );
        }

        return (
            <div key={index}>
                {prop} no es clave foránea o pertenece a la misma tabla
            </div>
        );
    });

    return <div>{resultUI}</div>;
};
