import React, { useEffect, useState } from 'react';
import { useSensoresHelper } from '../hooks/useSensoresHelper';

export const VariablesSelector = ({ data, handleChange, sensorTipo, variablesValueString }) => {
    const [selectedVariables, setSelectedVariables] = useState([]);
    const { getVariablesBySensorTipo } = useSensoresHelper();
    const variables = getVariablesBySensorTipo(sensorTipo);

    useEffect(() => {
        let variables_id = variables.map(v => v.idVariable);
        setSelectedVariables(variables_id);
    }, [sensorTipo])

    const handleCheckboxChange = (idVariable) => {
        setSelectedVariables((prevSelected) =>
            prevSelected.includes(idVariable)
                ? prevSelected.filter((item) => item !== idVariable)
                : [...prevSelected, idVariable]
        );

    };
    useEffect(() => {
        console.log(variablesValueString)
        const e = { target: { name: "variables_usadas", value: selectedVariables.join(",") } };
        handleChange(e);
    
    }, [selectedVariables])

    console.log(selectedVariables)
    console.log("data", data)
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     onChange({ ...data, [name]: value });
    // };

    return (
        <>
            Variables medidas por el sensor {sensorTipo}
            <br />
            <div className="form-check">
                {variables.map(variable => (
                    <><label className="form-check-label" style={{ marginRight: "10px" }} key={variable.idVariable}>
                        <input
                            className="form-check-input"
                            type="checkbox"
                            value={variable.idVariable}
                            checked={selectedVariables.includes(variable.idVariable)}
                            onChange={() => handleCheckboxChange(variable.idVariable)}
                        />
                        {variable.idVariable} - {variable.descripcion} ({variable.unidad})
                    </label>
                        <br />
                    </>
                ))}
            </div>
        </>
    );
};