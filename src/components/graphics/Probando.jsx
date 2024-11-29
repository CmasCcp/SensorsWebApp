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

    const id_tabla ={
        "id_sesion":"sesiones",
        "id_variable":"variables",
        "id_grupo":"grupos",
        "id_estado":"estados",
        "id_proyecto":"proyectos",
        "id_persona":"personas",
        "id_sensor":"sensores",
        "id_sensor_tipo":"sensores_tipo",
        "id_persona_responsable_ingreso": "personas",
        "id_persona_responsable_salida": "personas",  
        "id_persona_responsable": "personas"
    }


    console.log(clavesForaneas); // Array de claves foráneas
    console.log(dataProperties); // Array de propiedades
    console.log(tableName); // Array de propiedades

    const result = dataProperties.map((prop, index) => {
        const isKey = tabla_id.some(id => id === prop); // Verifica si `prop` está en `tabla_id`
        return (
            <div key={index}>
                {(tableName !== id_tabla[prop] && isKey) ? id_tabla[prop] : `${prop} no es clave`}
            </div>
        );
    });

    return <div>{result}</div>;
};
