from dotenv import load_dotenv

from flask import Flask, jsonify, request, Response, stream_with_context
from flask_cors import CORS

import mysql.connector
import pandas as pd
import csv, decimal, io, os, json
from datetime import datetime, date

load_dotenv()
app = Flask(__name__)
CORS(app)

ALLOWED_TABLES_PROP = [
{'displayName':'Datos','dataName':'datos'},
{'displayName':'Dispositivos','dataName':'dispositivos'},
{'displayName':'Estados','dataName':'estados'},
{'displayName':'Grupos','dataName':'grupos'},
{'displayName':'Personas','dataName':'personas'},
{'displayName':'Proyectos','dataName':'proyectos'},
{'displayName':'Roles','dataName':'roles'},
{'displayName':'Roles en grupos','dataName':'roles_en_grupos'},
{'displayName':'Roles en proyectos','dataName':'roles_en_proyectos'},
{'displayName':'Sensores','dataName':'sensores'},
{'displayName':'Sensores en dispositivo','dataName':'sensores_en_dispositivo'},
{'displayName':'Sensores tipo','dataName':'sensores_tipo'},
{'displayName':'Sesiones','dataName':'sesiones'},
{'displayName':'Variables','dataName':'variables'},
{'displayName':'Variables en sensores','dataName':'variables_en_sensores'},
]

FOREIGN_KEYS_PROP = {
    "id_sesion": {"table": "sesiones","columns": ["id_sesion", "descripcion"]}, 
    "id_variable": {"table": "variables", "columns":["id_variable", "descripcion"]}, 
    "id_grupo": {"table": "grupos", "columns":["id_grupo", "nombre"]}, 
    "id_estado": {"table": "estados", "columns":["id_estado", "nombre"]}, 
    "id_proyecto": {"table": "proyectos", "columns":["id_proyecto", "nombre"]}, 
    "id_persona": {"table": "personas", "columns":["id_persona", "nombre", "apellido"]}, 
    "id_persona_responsable_ingreso": {"table": "personas", "columns":["id_persona", "nombre", "apellido"]}, 
    "id_persona_responsable_salida": {"table": "personas", "columns":["id_persona", "nombre", "apellido"]}, 
    "id_sensor": {"table": "sensores", "columns":["id_sensor", "numero_serial"]}, 
    "id_sensor_tipo": {"table": "sensores_tipo", "columns":["id_sensor_tipo", "marca"]}
    }

ALLOWED_TABLES = [table['dataName'] for table in ALLOWED_TABLES_PROP]
config = {
    "user": os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
    "host": os.getenv("DB_HOST"),
    "database": os.getenv("DB_NAME"),
    "port": int(os.getenv("DB_PORT", 3306)),  # Valor por defecto: 3306
}
print(config)

 
@app.route('/endovenosaDummy', methods=['GET'])
def endovenosa_dummy():
    return jsonify({
    'name': "Dispositivo 1",
    'license': "JLZJ41",
    'password': "3508239",
    'firmwareVersion': "v10.3",
    'status': "Transmitting",
    'lastConnection': "07/10/2024",
    'alertMsg': "Burbuja de aire detectada",
    'alertType': "Danger"}), 200

@app.route('/generarSesion', methods=['GET'])
def generar_sesion():
    id_proyecto = request.args.get('id_proyecto')  # Obligatorio
    id_persona_responsable = request.args.get('id_persona_responsable')  # Opcional
    descripcion = request.args.get('descripcion', '')  # Predeterminado a cadena vacía
    fecha_inicio = request.args.get('fecha_inicio', datetime.now().strftime('%Y-%m-%d %H:%M:%S'))  # Predeterminado a la fecha actual
    version = request.args.get('version', '1.0')  # Predeterminado a "1.0"
    ubicacion = request.args.get('ubicacion', '')  # Predeterminado a cadena vacía

    # Validar parámetros obligatorios
    if not id_proyecto:
        return jsonify({'status': 'fail', 'error': 'El parámetro id_proyecto es obligatorio'}), 400

    valores = [
        None,
        id_proyecto,
        id_persona_responsable if id_persona_responsable else None,  # Si no se proporciona, usar NULL
        descripcion,
        fecha_inicio,
        version,
        ubicacion
    ]

    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()

        sql_query = """
            INSERT INTO sesiones (id_sesion, id_proyecto, id_persona_responsable, descripcion, fecha_inicio, version, ubicacion)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """

        cursor.execute(sql_query, valores)
        conn.commit()
        generated_id = cursor.lastrowid

        return jsonify({
            'status': 'success',
            'message': 'Sesión creada correctamente',
            'generated_id': generated_id
        }), 201
    except Exception as e:
        return jsonify({'status': 'fail', 'error': str(e)}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/columnaForanea', methods=['GET'])
def columna_foranea():
    args = request.args
    column = args.get('columna')
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor(dictionary=True)

        if column in FOREIGN_KEYS_PROP.keys():
            table_name = FOREIGN_KEYS_PROP[column]["table"]
            columns = FOREIGN_KEYS_PROP[column]["columns"]

            columnas_str = ", ".join(columns)
            query = f"SELECT {columnas_str} FROM {table_name}"

            cursor.execute(query)
            filas = cursor.fetchall()

            transformed_data = [
                {
                    "value": fila[column],  # El valor de la columna principal
                    "label": " ".join(str(fila[col]) for col in columns if col != column)  # Concatenar otras columnas
                }
                for fila in filas
            ]

            return jsonify({"status": "success", "data": transformed_data}), 200

        return jsonify({"status": "fail", "error": "No se han obtenido los datos"}), 400
    
    except mysql.connector.Error as e:
        mensaje_error = f"Error al conectarse a la base de datos: {e}"
        print(mensaje_error)
        return jsonify({"status": "fail", "error": mensaje_error}), 500

    except Exception as e:
        mensaje_error = f"Error desconocido: {e}"
        print(mensaje_error)
        return jsonify({"status": "fail", "error": mensaje_error}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()         

@app.route('/clavesForaneas', methods=['GET'])
def claves_foraneas():
    tablas_foraneas = [
        {"sesiones": ["id_sesion", "descripcion"]},
        {"variables": ["id_variable", "descripcion"]},
        {"grupos": ["id_grupo", "nombre"]},
        {"estados": ["id_estado", "nombre"]},
        {"proyectos": ["id_proyecto", "nombre"]},
        {"personas": ["id_persona", "nombre", "apellido"]},
        {"Id_persona_responsable_ingreso": ["id_persona", "nombre", "apellido"]},  # "personas"
        {"Id_persona_responsable_salida": ["id_persona", "nombre", "apellido"]},  # "personas"
        {"Id_persona_responsable": ["id_persona", "nombre", "apellido"]},  # "personas"
        {"sensores": ["id_sensor", "numero_serial"]},
        {"sensores_tipo": ["id_sensor_tipo", "marca"]},
    ]

    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor(dictionary=True)

        resultado = []
        for tabla in tablas_foraneas:
            for nombre_tabla, columnas in tabla.items():
                if nombre_tabla in ["Id_persona_responsable_ingreso", "Id_persona_responsable_salida", "Id_persona_responsable"]:
                    # Estas tablas corresponden a "personas"
                    nombre_tabla_real = "personas"
                else:
                    nombre_tabla_real = nombre_tabla

                # Construir la consulta SQL
                columnas_str = ", ".join(columnas)
                query = f"SELECT {columnas_str} FROM {nombre_tabla_real}"

                # Ejecutar la consulta y obtener los datos
                cursor.execute(query)
                filas = cursor.fetchall()

                # Formatear cada tabla como un objeto dentro del array de resultados
                # [{sesiones: [{id_sesion: id_sesion_1, descripcion: descripcion_1}]}]
                resultado.append({
                    nombre_tabla: filas 
                })

        return jsonify({"status": "success", "data": resultado}), 200

    except mysql.connector.Error as e:
        mensaje_error = f"Error al conectarse a la base de datos: {e}"
        print(mensaje_error)
        return jsonify({"status": "fail", "error": mensaje_error}), 500

    except Exception as e:
        mensaje_error = f"Error desconocido: {e}"
        print(mensaje_error)
        return jsonify({"status": "fail", "error": mensaje_error}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()            

@app.route('/insertarMedicion', methods=['GET'])
def insertar_medicion():
    timestamps = request.args.get('times', '').split(',')
    sesiones_ids = request.args.get('idsSesiones', '').split(',')
    sensor_ids = request.args.get('idsSensores', '').split(',')
    variable_ids = request.args.get('idsVariables', '').split(',')
    values = request.args.get('valores', '').split(',')

    # Si timestamps tiene un solo valor
    if len(timestamps) == 1 and timestamps[0]:  # Un solo valor
        timestamps = [timestamps[0]] * len(sensor_ids)

    # Si timestamps NO tiene valor
    elif not timestamps[0]:  
        current_timestamp = datetime.now().timestamp()
        timestamps = [str(current_timestamp)] * len(sensor_ids)

    # Si sesiones_ids tiene un solo valor
    if len(sesiones_ids) == 1 and sesiones_ids[0]:  # Un solo valor
        sesiones_ids = [sesiones_ids[0]] * len(sensor_ids)

    # Si sesiones_ids NO tiene valor
    elif not sesiones_ids[0]:  
        sesiones_ids = [None] * len(sensor_ids)


    if not (len(timestamps) == len(sensor_ids) == len(variable_ids) == len(values) == len(sesiones_ids)):
        return jsonify({'status': 'fail', 'error': 'Las longitudes de los parametros no coinciden'}), 400
    
    measurements = []

    for i in range(len(sensor_ids)):
        timestamp_float = float(timestamps[i])
        datetime_obj = datetime.fromtimestamp(timestamp_float)
        formatted_datetime = datetime_obj.strftime('%Y-%m-%d %H:%M:%S')

        measurements.append({
            "timestamp":formatted_datetime, #timestamps[i],
            "sesionId": sesiones_ids[i],
            "sensorId": sensor_ids[i],
            "variableId": variable_ids[i],
            "value": values[i]
        })

    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()

        for measurement in measurements:
            valores = [measurement['sensorId'], measurement['value'], measurement['timestamp'], measurement['variableId'], measurement['sesionId']]
            sql_query = f"INSERT INTO datos (id_sensor, valor, fecha, id_variable, id_sesion) VALUES (%s, %s, %s, %s, %s)"
            log_query = sql_query % tuple(valores)  # Para fines de depuración
            print("Consulta SQL para depuración:", log_query)
            cursor.execute(sql_query, valores)

        conn.commit()

        return jsonify({'status': 'success', 'message': 'Registro insertado correctamente'}), 201, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}

    except mysql.connector.Error as e:
        mensaje_error = f"Error al conectarse a la base de datos: {e}"
        print(mensaje_error)
        return jsonify({'status': 'fail', 'error': mensaje_error}), 500

    except Exception as e:
        mensaje_error = f"Error desconocido: {e}"
        print(mensaje_error)
        return jsonify({'status': 'fail', 'error': mensaje_error}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()



@app.route('/listarTablas', methods=['GET'])
def listar_tablas():
    return jsonify(ALLOWED_TABLES_PROP)

@app.route('/listarDatos', methods=['GET'])
def listar_datos():
    args = request.args
    tabla = args.get('tabla')
    limit = args.get('limite')
    offset = int(args.get('offset', 0))
    formato = args.get('formato', 'json')

    args_dict = request.args.to_dict()
    not_primary_keys = ['tabla', 'limite', 'offset', 'formato']

    # Filtrar los argumentos relevantes
    filtered_args = {key: value.split(',') for key, value in args_dict.items() if key not in not_primary_keys}

    # Construir la cláusula WHERE con OR y AND
    where_clauses = []
    params = []

    for key, values in filtered_args.items():
        or_conditions = " OR ".join([f"{key}=%s" for _ in values])
        where_clauses.append(f"({or_conditions})")
        params.extend(values)  # Agregar los valores a los parámetros

    where_clause = ' AND '.join(where_clauses)
    where_clause = f"WHERE {where_clause}" if where_clause else ""

    if tabla not in ALLOWED_TABLES:
        return jsonify({'status': 'fail', 'error': 'Tabla no permitida'}), 403

    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()


        sql_query = f"SELECT * FROM {tabla} {where_clause}"
        if limit is not None:
            sql_query += " LIMIT %s OFFSET %s"
            params.extend([int(limit), offset])

        print("Consulta SQL:", sql_query)
        print("Parámetros:", params)
        cursor.execute(sql_query, params)

        filas = cursor.fetchall()

        respuesta = []
        for fila in filas:
            datos_dict = {key: value for key, value in zip(cursor.column_names, fila)}
            for key, value in datos_dict.items():
                if isinstance(value, decimal.Decimal):
                    datos_dict[key] = float(value)
                elif isinstance(value, (datetime, date)):
                    datos_dict[key] = value.isoformat()
            respuesta.append(datos_dict)

        if formato == 'json':
            json_respuesta = jsonify({
                'status': 'success',
                'data': {
                    'tableData': respuesta,
                    'tabla': tabla
                }
            })
            return json_respuesta, 200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        elif formato == 'csv':
            csv_respuesta = generar_csv(respuesta)
            return Response(csv_respuesta, mimetype='text/csv')
        else:
            mensaje_error = f"Formato '{formato}' no soportado. Use 'json' o 'csv'."
            return jsonify({'status': 'fail', 'error': mensaje_error}), 400

    except mysql.connector.Error as e:
        mensaje_error = f"Error al conectarse a la base de datos: {e}"
        print(mensaje_error)
        return jsonify({'status': 'fail', 'error': mensaje_error}), 500

    except Exception as e:
        mensaje_error = f"Error desconocido: {e}"
        print(mensaje_error)
        return jsonify({'status': 'fail', 'error': mensaje_error}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/listarDatosEstructurados', methods=['GET'])
def listar_datos_estructurados():
    args = request.args
    tabla = "datos" #args.get('tabla')  # El nombre de la tabla viene como un parámetro
    limit = args.get('limite')
    offset = int(args.get('offset', 0))
    formato = args.get('formato', 'json')

    args_dict = request.args.to_dict()
    not_primary_keys = ['tabla', 'limite', 'offset', 'formato']

    # Filtrar los argumentos relevantes
    filtered_args = {key: value.split(',') for key, value in args_dict.items() if key not in not_primary_keys}

    # Construir la cláusula WHERE con OR y AND
    where_clauses = []
    params = []

    for key, values in filtered_args.items():
        or_conditions = " OR ".join([f"{key}=%s" for _ in values])
        where_clauses.append(f"({or_conditions})")
        params.extend(values)  # Agregar los valores a los parámetros

    where_clause = ' AND '.join(where_clauses)
    where_clause = f"WHERE {where_clause}" if where_clause else ""

    if tabla not in ALLOWED_TABLES:
        return jsonify({'status': 'fail', 'error': 'Tabla no permitida'}), 403

    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()


        #sql_query = f"SELECT * FROM {tabla} {where_clause}"
        sql_query = f"""SELECT
                        d.fecha,
                        d.id_sesion,
                        d.valor,
                        CONCAT(v.descripcion,' (',v.unidad,')') AS unidad_medida,
                        s.descripcion AS sesion_descripcion,
                        s.fecha_inicio,
                        s.ubicacion,
                        disp.id_proyecto,
                        disp.codigo_interno,
                        disp.descripcion AS dispositivo_descripcion
                    FROM
                        sensores_dev.datos AS d
                    LEFT JOIN
                        sensores_dev.variables AS v
                    ON
                        d.id_variable = v.id_variable
                    LEFT JOIN
                        sensores_dev.sesiones AS s
                    ON
                        d.id_sesion = s.id_sesion
                    LEFT JOIN
                        sensores_dev.sensores AS sens
                    ON
                        d.id_sensor = sens.id_sensor
                    LEFT JOIN
                        sensores_dev.sensores_en_dispositivo AS sed
                    ON
                        sens.id_sensor = sed.id_sensor
                    LEFT JOIN
                        sensores_dev.dispositivos AS disp
                    ON
                        sed.id_dispositivo = disp.id_dispositivo
                    {where_clause}
                    """
        
        if limit is not None:
            sql_query += " LIMIT %s OFFSET %s"
            params.extend([int(limit), offset])

        cursor.execute(sql_query, params)

        filas = cursor.fetchall()

        respuesta = []
        for fila in filas:
            datos_dict = {key: value for key, value in zip(cursor.column_names, fila)}
            for key, value in datos_dict.items():
                if isinstance(value, decimal.Decimal):
                    datos_dict[key] = float(value)
                elif isinstance(value, (datetime, date)):
                    datos_dict[key] = value.isoformat()
            respuesta.append(datos_dict)

        df = pd.DataFrame(respuesta)
        df = df.fillna(value={"id_sesion": "Sin sesión", "sesion_descripcion": "", "fecha_inicio": "", "ubicacion": ""})
        df_pivoted = df.pivot_table(
            index=["fecha", "id_sesion", "sesion_descripcion","fecha_inicio", "ubicacion", "id_proyecto", "codigo_interno", "dispositivo_descripcion"],
            columns="unidad_medida",
            values="valor",
            aggfunc="first"
        ).reset_index()

        columnas_excluidas = [
            "fecha", "id_sesion", "sesion_descripcion", "fecha_inicio",
            "ubicacion", "id_proyecto", "codigo_interno", "dispositivo_descripcion", "unidad_medida"
            ]

        # Identificar las columnas que se deben convertir a float
        columnas_a_convertir = [col for col in df_pivoted.columns if col not in columnas_excluidas]

        # Convertir las columnas seleccionadas a float
        df_pivoted[columnas_a_convertir] = df_pivoted[columnas_a_convertir].astype(float)

        # Opcional: Renombrar las columnas para quitar el índice generado
        df_pivoted.columns.name = None

        if formato == 'json':
            json_response  = df_pivoted.to_dict(orient="records")
            json_respuesta = json.dumps({
                'status': 'success',
                'data': {
                    'tableData': json_response,
                    'tabla': tabla
                }
            }, ensure_ascii=False)
            return json_respuesta, 200, {'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*'}
        elif formato == 'csv':                    
            return Response(
                stream_with_context(build_csv(df_pivoted)),
                mimetype="text/csv",
                headers={"Content-Disposition": "attachment;filename=output.csv"}
            )
        else:
            mensaje_error = f"Formato '{formato}' no soportado. Use 'json' o 'csv'."
            return jsonify({'status': 'fail', 'error': mensaje_error}), 400

    except mysql.connector.Error as e:
        mensaje_error = f"Error al conectarse a la base de datos: {e}"
        print(mensaje_error)
        return jsonify({'status': 'fail', 'error': mensaje_error}), 500

    except Exception as e:
        mensaje_error = f"Error desconocido: {e}"
        print(mensaje_error)
        return jsonify({'status': 'fail', 'error': mensaje_error}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/listarSensores', methods=['GET'])
def listar_sensores():
    args = request.args
    limit = int(args.get('limite', 100))
    offset = int(args.get('offset', 0))
    id_dispositivo = args.get('id_dispositivo')

    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()

        # Consulta SQL con uniones
        sql_query = """
        SELECT 
            sensores.id_sensor,	
            sensores.id_sensor_tipo,
            sensores.numero_serial,
            sensores_tipo.codigo_interno,
            sensores_tipo.marca,	
            sensores_tipo.modelo,
            sensores_tipo.descripcion	
        FROM sensores
        LEFT JOIN sensores_tipo ON sensores.id_sensor_tipo = sensores_tipo.id_sensor_tipo
        LEFT JOIN sensores_en_dispositivo ON sensores.id_sensor = sensores_en_dispositivo.id_sensor
       """
        if id_dispositivo:
            sql_query += "WHERE sensores_en_dispositivo.id_dispositivo = %s "
        
        sql_query += "LIMIT %s OFFSET %s"

        params = []
        if id_dispositivo:
            params.append(id_dispositivo)
        params.extend([limit, offset])

        # Ejecutar la consulta
        cursor.execute(sql_query, params)
        filas = cursor.fetchall()

        columnas = [
            "Id Sensor",
            "Id Sensor Tipo",
            "N° de Serie",
            "Código Interno",
            "Marca",
            "Modelo",
            "Descripcion",
        ]

        # Construir los diccionarios con el orden deseado
        respuesta = [columnas]+filas


        # Manejar formato de respuesta
        json_respuesta = jsonify({
            'status': 'success',
            'data': {
                'tableData': respuesta,
                'tabla': 'sensores_combinados'
            }
        })
        return json_respuesta, 200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}


    except mysql.connector.Error as e:
        mensaje_error = f"Error al conectarse a la base de datos: {e}"
        print(mensaje_error)
        return jsonify({'status': 'fail', 'error': mensaje_error}), 500

    except Exception as e:
        mensaje_error = f"Error desconocido: {e}"
        print(mensaje_error)
        return jsonify({'status': 'fail', 'error': mensaje_error}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()


@app.route('/schema', methods=['GET'])
def get_table_schema():
    args = request.args
    tabla = args.get('tabla')

    try:
        conn = mysql.connector.connect(**config)
        if not conn:
            return jsonify({"error": "Error de conexión a la base de datos"}), 500
        
        cursor = conn.cursor()
        
        cursor.execute(f"SELECT COUNT(*) FROM {tabla}")
        total_count = cursor.fetchone()[0]

        # Ejecutar una consulta para obtener la información del esquema de la tabla
        cursor.execute(f"DESCRIBE {tabla}")
        schema = cursor.fetchall()
        
        # Transformar el resultado en un formato más legible
        columns = []
        for column in schema:
            column_info = {
                "Field": column[0],
                "Type": column[1],
                "Null": column[2],
                "Key": column[3],
                "Default": column[4],
                "Extra": column[5],
                "Count": total_count
            }
            columns.append(column_info)

        return jsonify(columns), 200

    except mysql.connector.Error as e:
        return jsonify({"error": f"Error al obtener esquema: {e}"}), 400

    except Exception as e:
        mensaje_error = f"Error desconocido: {e}"
        print(mensaje_error)
        return jsonify({'status': 'fail', 'error': mensaje_error}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/modificarDatos', methods=['PUT'])
def modificar_datos():
    data = request.get_json()
    table_name = data.get('tableName')  # Las valores del formulario SIN las primary keys
    primary_keys = data.get('primaryKeys')  
    form_data = data.get('formData')

    concatenated_filter = ' AND'.join([f"{key}={value}" for key, value in primary_keys.items()])
    if concatenated_filter != '':
        concatenated_filter = 'WHERE '+concatenated_filter

    if table_name not in ALLOWED_TABLES:
        return jsonify({'status': 'fail', 'error': 'Tabla no permitida'}), 403
    
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()

        # Generar dinámicamente la consulta SQL para actualizar los campos
        set_clause = ", ".join([f"{key} = %s" for key in form_data.keys()])
        valores = list(form_data.values())

        # Construir la consulta de actualización
        sql_query = f"UPDATE {table_name} SET {set_clause} {concatenated_filter}"

        log_query = sql_query % tuple(valores)  # Sustituye los %s por los valores reales
        print("Consulta SQL para depuración:", log_query)

        # Ejecutar la consulta
        cursor.execute(sql_query, valores)
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({'status': 'fail', 'error': 'Registro no encontrado o sin cambios'}), 404

        return jsonify({'status': 'success', 'message': f'{cursor.rowcount} registro(s) actualizado(s) correctamente'}), 200, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}

    except mysql.connector.Error as e:
        mensaje_error = f"Error al conectarse a la base de datos: {e}"
        print(mensaje_error)
        return jsonify({'status': 'fail', 'error': mensaje_error}), 500

    except Exception as e:
        mensaje_error = f"Error desconocido: {e}"
        print(mensaje_error)
        return jsonify({'status': 'fail', 'error': mensaje_error}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/eliminarDatos', methods=['GET'])
def eliminar_datos():
    args = request.args
    tabla = args.get('tabla')  # El nombre de la tabla viene como un parámetro

    args_dict = request.args.to_dict()
    not_primary_keys = ['tabla']

    filtered_args = {key: value for key, value in args_dict.items() if key not in not_primary_keys}
    concatenated_filter = ' AND'.join([f"{key}={value}" for key, value in filtered_args.items()])
    if concatenated_filter != '':
        concatenated_filter = 'WHERE '+concatenated_filter

    if concatenated_filter == '':
        return jsonify({'status': 'fail', 'error': 'Se requiere un ID'}), 403

    if tabla not in ALLOWED_TABLES:
        return jsonify({'status': 'fail', 'error': 'Tabla no permitida'}), 403
    
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()

        sql_query = f"DELETE FROM {tabla} {concatenated_filter}"
        cursor.execute(sql_query)
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({'status': 'fail', 'error': 'Registro no encontrado o sin cambios'}), 404

        return jsonify({'status': 'success', 'message': f'{cursor.rowcount} registro(s) actualizado(s) correctamente'}), 200

    except mysql.connector.Error as e:
        mensaje_error = f"Error al conectarse a la base de datos: {e}"

        if(e.errno == 1451):
            mensaje_error = f"Error: No es posible eliminar el registro pues existe una referencia a este en otra tabla\n{e}"
            
        print(mensaje_error)        
        return jsonify({'status': 'fail', 'error': mensaje_error}), 500

    except Exception as e:
        mensaje_error = f"Error desconocido: {e}"
        print(mensaje_error)
        return jsonify({'status': 'fail', 'error': mensaje_error}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/agregarDatos', methods=['POST'])
def agregar_datos():
    data = request.get_json()
    table_name = data.get('tableName')  # El nombre de la tabla
    form_data = data.get('formData')  # Los valores del formulario
    if table_name not in ALLOWED_TABLES:
        return jsonify({'status': 'fail', 'error': 'Tabla no permitida'}), 403

    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()

        # Generar dinámicamente la consulta SQL para insertar los campos
        columns = ", ".join(form_data.keys())
        placeholders = ", ".join(["%s"] * len(form_data))
        valores = list(form_data.values())

        # Construir la consulta de inserción
        sql_query = f"INSERT INTO {table_name} ({columns}) VALUES ({placeholders})"
        
        log_query = sql_query % tuple(valores)  # Para fines de depuración
        print("Consulta SQL para depuración:", log_query)

        # Ejecutar la consulta
        cursor.execute(sql_query, valores)
        conn.commit()

        return jsonify({'status': 'success', 'message': 'Registro insertado correctamente'}), 201, {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}

    except mysql.connector.Error as e:
        mensaje_error = f"Error al conectarse a la base de datos: {e}"
        print(mensaje_error)
        return jsonify({'status': 'fail', 'error': mensaje_error}), 500

    except Exception as e:
        mensaje_error = f"Error desconocido: {e}"
        print(mensaje_error)
        return jsonify({'status': 'fail', 'error': mensaje_error}), 500

    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()


def generar_csv(data):
    if not data:
        return ''

    output = io.StringIO()
    writer = csv.DictWriter(output, fieldnames=data[0].keys())
    writer.writeheader()
    for row in data:
        writer.writerow(row)
    return output.getvalue()

def build_csv(df_pivoted):
    output = io.BytesIO()
    df_pivoted.to_csv(output, index=False, encoding="utf-8-sig")
    output.seek(0)
    for line in output:
        yield line    
    output.close()


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8084)