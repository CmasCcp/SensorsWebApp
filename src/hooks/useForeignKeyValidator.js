import { useState, useCallback } from "react";

const useForeignKeyValidator = () => {
  // Lista de IDs de tablas
  const tablaId = [
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
    "id_persona_responsable",
  ];

  // Mapeo de IDs a nombres de tablas
  const idTabla = {
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
    "id_persona_responsable": "personas",
  };

  // Estado para almacenar validaciones
  const [foreignKeys, setForeignKeys] = useState({});

  /**
   * Verifica si una propiedad es clave foránea
   * @param {string} prop - Propiedad a validar
   * @returns {boolean} - Si es clave foránea o no
   */
  const isForeignKey = useCallback(
    (prop) => tablaId.includes(prop),
    [tablaId]
  );
  /**
   * Verifica si una propiedad es clave primaria
   * @param {string} prop - Propiedad a validar
   * @returns {boolean} - Si es clave foránea o no
   */
  const isPrimaryKey = useCallback(
    (prop) => prop.startsWith("id"),
    []
  );

  /**
   * Obtiene el nombre de la tabla asociada a una clave foránea
   * @param {string} prop - Propiedad (clave foránea)
   * @returns {string|null} - Nombre de la tabla asociada o `null` si no es clave foránea
   */
  const getTableName = useCallback(
    (prop) => (isForeignKey(prop) ? idTabla[prop] : prop),
    [idTabla, isForeignKey]
  );

  const getTableNameSingular = useCallback(
    (prop) =>{
        let table_name = getTableName(prop);

        if (table_name.endsWith("s")) {
          // Quitamos la última letra
          table_name = table_name.slice(0, -1);
        }

        // return table_name;
        return table_name.charAt(0).toUpperCase() + table_name.slice(1);
       
      },
      [idTabla, isForeignKey]
  );

  /**
   * Valida todas las propiedades de un formulario
   * @param {object} formData - Objeto con las propiedades del formulario
   */
  const validateForm = useCallback(
    (formData) => {
      const newForeignKeys = {};
      Object.keys(formData).forEach((key) => {
        if (isForeignKey(key)) {
          newForeignKeys[key] = getTableName(key);
        }
      });
      setForeignKeys(newForeignKeys);
    },
    [getTableName, isForeignKey]
  );

  /**
   * Obtiene el valor asociado a un ID en la tabla foránea
   * @param {Array} data - Array con los datos de las tablas foráneas
   * @param {number} id - ID del que se desea obtener el valor
   * @param {string} id_table - Nombre de la propiedad id de la tabla (ex: id_dispositivo)
   * @returns {string|null} - Descripción asociada al ID, o `null` si no se encuentra
   */
  const getValue = useCallback((data, id_table) => {
    if (!Array.isArray(data)) {
      // console.log("El parámetro `data` debe ser un array. Data: ", data);
      return null;
    }

    // Nombre de la tabla
    const tabla = getTableName(id_table);
    
    // Buscar en el array data, el objeto que tenga como propiedad el nombre de la tabla "tabla". Esta propiedad tiene como valor un array con objetos que son las filas de la tabla.
    // Hay que buscar cuál de esas filas tiene el valor de la propiedad "id_table" igual a "id"
    // const [ObjTabla] = data.filter(objTable => !!objTable[tabla]);
    // const ObjTabla = data.filter(objTable => !!objTable[tabla]);
    const ObjTabla = data.find(obj => obj.hasOwnProperty(tabla));

    let value = ObjTabla?.[tabla] || null;
    if(Array.isArray(value)){
      value = value.map(fila => {
        const id = fila[id_table]; 
        let valueObj = {...fila};
        delete valueObj[id_table];
        const value = Object.values(valueObj).join(" "); // Concatenamos los valores con espacios
        return {value:`${id}`, label:value};
      });
    }
    

    return value; // Retorna null si no se encuentra el ID
  }, []);


  return {
    isForeignKey,
    isPrimaryKey,
    getTableName,
    getTableNameSingular,
    validateForm,
    foreignKeys,
    getValue,
  };
};

export default useForeignKeyValidator;


// TODO: Poner a prueba con distintos test la el hook de useForeignKeyValidator
