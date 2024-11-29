from flask import Flask, jsonify, request, Response
from flask_cors import CORS

import mysql.connector
import csv
import json
import decimal
from datetime import datetime, date
import io

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




ALLOWED_TABLES = [table['dataName'] for table in ALLOWED_TABLES_PROP]

#config = {"user": "root", "password": "", "host": "localhost", "database": "sensores_dev", "port": 3306}
config = {"user": "root", "password": "root", "host": "localhost", "database": "sensores_dev", "port": 3306}

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
    sensor_ids = request.args.get('idsSensores', '').split(',')
    variable_ids = request.args.get('idsVariables', '').split(',')
    values = request.args.get('valores', '').split(',')

    if not (len(timestamps) == len(sensor_ids) == len(variable_ids) == len(values)):
        return jsonify({'status': 'fail', 'error': 'Las longitudes de los parametros no coinciden'}), 400
    
    measurements = []

    for i in range(len(sensor_ids)):
        timestamp_float = float(timestamps[i])
        datetime_obj = datetime.fromtimestamp(timestamp_float)
        formatted_datetime = datetime_obj.strftime('%Y-%m-%d %H:%M:%S')

        measurements.append({
            "timestamp":formatted_datetime, #timestamps[i],
            "sensorId": sensor_ids[i],
            "variableId": variable_ids[i],
            "value": values[i]
        })

    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()

        for measurement in measurements:
            valores = [measurement['sensorId'], measurement['value'], measurement['timestamp'], measurement['variableId']]
            sql_query = f"INSERT INTO Datos (idSensor, valorMedicion, FechaMedicion, idVariable) VALUES (%s, %s, %s, %s)"
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
    tabla = args.get('tabla')  # El nombre de la tabla viene como un parámetro
    limit = int(args.get('limite',100))
    offset = int(args.get('offset',0))
    formato = args.get('formato', 'json')

    args_dict = request.args.to_dict()
    not_primary_keys = ['tabla','limite', 'offset', 'formato']

    filtered_args = {key: value for key, value in args_dict.items() if key not in not_primary_keys}
    where_clause  = ' AND '.join([f"{key}=%s" for key in filtered_args.keys()])
    where_clause = f"WHERE {where_clause}" if where_clause else ""

    if tabla not in ALLOWED_TABLES:
        return jsonify({'status': 'fail', 'error': 'Tabla no permitida'}), 403

    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        
        sql_query = f"SELECT * FROM {tabla} {where_clause} LIMIT %s OFFSET %s"
        params = list(filtered_args.values())+[limit, offset]
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
                    'tabla':tabla
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


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8084)