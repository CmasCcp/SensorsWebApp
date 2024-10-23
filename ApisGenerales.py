from flask import Flask, jsonify, request, Response
from flask_cors import CORS

import mysql.connector
import json
import csv
import decimal
from datetime import datetime, date
import io
import os

app = Flask(__name__)
CORS(app)

ALLOWED_TABLES = [
'datos',
'dispositivos',
'estados',
'laboratorios',
'personas',
'proyectos',
'roles',
'rolesenlaboratorios',
'rolesenproyectos',
'sensores',
'sensoresendispositivo',
'sensorestipo',
'sesiones',
'variables'
]
config = {"user": "root", "password": "root", "host": "localhost", "database": "sensores_dev", "port": 3306}


@app.route('/listarDatos', methods=['GET'])
def listar_datos():
    args = request.args
    tabla = args.get('tabla')  # El nombre de la tabla viene como un parámetro
    formato = args.get('format', 'json')

    args_dict = request.args.to_dict()
    not_primary_keys = ['tabla', 'formato']

    filtered_args = {key: value for key, value in args_dict.items() if key not in not_primary_keys}
    concatenated_filter = 'AND'.join([f"{key}={value}" for key, value in filtered_args.items()])
    if concatenated_filter != '':
        concatenated_filter = 'WHERE '+concatenated_filter

    if tabla not in ALLOWED_TABLES:
        return jsonify({'status': 'fail', 'error': 'Tabla no permitida'}), 403

    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()
        
        sql_query = f"SELECT * FROM {tabla} {concatenated_filter}"
        cursor.execute(sql_query)

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

@app.route('/schema/<table_name>', methods=['GET'])
def get_table_schema(table_name):
    try:
        conn = mysql.connector.connect(**config)
        if not conn:
            return jsonify({"error": "Error de conexión a la base de datos"}), 500
        
        cursor = conn.cursor()
        
        # Ejecutar una consulta para obtener la información del esquema de la tabla
        cursor.execute(f"DESCRIBE {table_name}")
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
                "Extra": column[5]
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

    concatenated_filter = 'AND'.join([f"{key}={value}" for key, value in primary_keys.items()])

    if table_name not in ALLOWED_TABLES:
        return jsonify({'status': 'fail', 'error': 'Tabla no permitida'}), 403
    
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()

        # Generar dinámicamente la consulta SQL para actualizar los campos
        set_clause = ", ".join([f"{key} = %s" for key in form_data.keys()])
        valores = list(form_data.values())

        # Construir la consulta de actualización
        sql_query = f"UPDATE {table_name} SET {set_clause} WHERE {concatenated_filter}"

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

@app.route('/eliminarDatos', methods=['PUT'])
def eliminar_datos(idDispositivo):
    args = request.args
    tabla = args.get('tabla')  # El nombre de la tabla viene como un parámetro
    idValor = args.get('id')  # El valor de la clave primaria

    if tabla not in ALLOWED_TABLES:
        return jsonify({'status': 'fail', 'error': 'Tabla no permitida'}), 403
    
    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()

        primary_key_query = """
                SELECT COLUMN_NAME
                FROM information_schema.KEY_COLUMN_USAGE
                WHERE TABLE_SCHEMA = %s
                AND TABLE_NAME = %s
                AND CONSTRAINT_NAME = 'PRIMARY'
                """
        cursor.execute(primary_key_query, (config['database'], tabla))
        primary_key_column = cursor.fetchone()

        if not primary_key_column:
            return jsonify({'status': 'fail', 'error': 'No se encontró clave primaria para esta tabla'}), 400

        primary_key_column = primary_key_column[0]

        datos = request.json

        if not datos or not isinstance(datos, dict):
            return jsonify({'status': 'fail', 'error': 'Datos no válidos o faltantes'}), 400

        # Generar dinámicamente la consulta SQL para actualizar los campos
        set_clause = ", ".join([f"{key} = %s" for key in datos.keys()])
        valores = list(datos.values())
        valores.append(idValor)  # Agregar el valor del ID para la cláusula WHERE

        # Construir la consulta de actualización
        sql_query = f"UPDATE {tabla} SET {set_clause} WHERE {primary_key_column} = %s"
        
        # Ejecutar la consulta
        cursor.execute(sql_query, valores)
        conn.commit()

        if cursor.rowcount == 0:
            return jsonify({'status': 'fail', 'error': 'Registro no encontrado o sin cambios'}), 404

        return jsonify({'status': 'success', 'message': f'{cursor.rowcount} registro(s) actualizado(s) correctamente'}), 200

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
    app.run(host='0.0.0.0', port=8080)