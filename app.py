from dotenv import load_dotenv

from flask import Flask, jsonify, request, Response, stream_with_context
from flask_cors import CORS
from flasgger import Swagger

import mysql.connector
import pandas as pd
import csv, decimal, io, os, json
from datetime import datetime, date

load_dotenv()
app = Flask(__name__)
app.config['SWAGGER'] = {
    'title': 'API Docs - Sensores',
    'description': 'Esta es la documentación interactiva para la API. Incluye detalles sobre los endpoints disponibles, sus parámetros, y ejemplos de uso.',
    'uiversion': 3,
    'favicon': 'https://example.com/favicon.ico',  # URL de tu favicon personalizado
    'specs': [
        {
            'endpoint': 'apispec_1',
            'route': '/apispec_1.json',
            'rule_filter': lambda rule: True,  # Todos los endpoints están documentados
            'model_filter': lambda tag: True,  # Todos los modelos están incluidos
        }
    ],
    'static_url_path': '/flasgger_static',
    'swagger_ui': True,
    'specs_route': '/apidocs/',  # URL de acceso a la documentación
    'contact': {
        'name': 'Soporte API',
        'url': 'https://example.com/soporte',
        'email': 'soporte@example.com'
    },
    'license': {
        'name': 'MIT License',
        'url': 'https://opensource.org/licenses/MIT'
    },
    'servers': [
        {
            'url': 'http://localhost:8084',
            'description': 'Servidor local de desarrollo'
        },
        {
            'url': 'https://api.example.com',
            'description': 'Servidor de producción'
        }
    ],
    'tags': [
        {'name': 'Datos', 'description': 'Endpoints relacionados con la manipulación de datos.'},
        {'name': 'Sensores', 'description': 'Endpoints relacionados con la gestión de sensores.'},
        {'name': 'Tablas', 'description': 'Endpoints para operaciones sobre tablas.'},
        {'name': 'Esquemas', 'description': 'Endpoints para obtener esquemas de tablas.'}
    ]
}

CORS(app)
swagger = Swagger(app)

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
    "id_sensor_tipo": {"table": "sensores_tipo", "columns":["id_sensor_tipo", "marca", "modelo"]}
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
    """
    Devuelve datos simulados de un dispositivo.
    ---
    tags:
      - Simulaciones
    responses:
      200:
        description: Datos del dispositivo
        examples:
          application/json: {
            "name": "Dispositivo 1",
            "license": "JLZJ41",
            "password": "3508239",
            "firmwareVersion": "v10.3",
            "status": "Transmitting",
            "lastConnection": "07/10/2024",
            "alertMsg": "Burbuja de aire detectada",
            "alertType": "Danger"
          }
    """
    return jsonify({
        'name': "Dispositivo 1",
        'license': "JLZJ41",
        'password': "3508239",
        'firmwareVersion': "v10.3",
        'status': "Transmitting",
        'lastConnection': "07/10/2024",
        'alertMsg': "Burbuja de aire detectada",
        'alertType': "Danger"}), 200

@app.route('/ultimoValor', methods=['GET'])
def ultimo_valor():
    """
    Obtiene el último valor de una columna específica de una tabla.
    ---
    tags:
      - Consultas
    parameters:
      - name: tabla
        in: query
        type: string
        required: true
        description: Nombre de la tabla desde la que se desea obtener el valor.
      - name: columna
        in: query
        type: string
        required: true
        description: Nombre de la columna de la que se desea obtener el último valor.
    responses:
      200:
        description: Último valor obtenido con éxito.
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
            data:
              type: string
              example: "123.45"
      400:
        description: Faltan parámetros requeridos (tabla o columna).
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: "Debe proporcionar el nombre de la tabla y la columna"
      404:
        description: No se encontraron resultados en la tabla.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: "No se encontraron resultados"
      500:
        description: Error interno en la base de datos o inesperado.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: "Error en la base de datos: Error específico"
    """
    tabla = request.args.get('tabla')
    columna = request.args.get('columna')

    if not tabla or not columna:
        return jsonify({'status': 'fail', 'error': 'Debe proporcionar el nombre de la tabla y la columna'}), 400

    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()

        query = f"SELECT {columna} FROM {tabla} ORDER BY {columna} DESC LIMIT 1"
        cursor.execute(query)
        resultado = cursor.fetchone()

        if resultado:
            ultimo_valor = resultado[0]
            return jsonify({'status': 'success', 'data': ultimo_valor}), 200
        else:
            return jsonify({'status': 'fail', 'error': 'No se encontraron resultados'}), 404

    except mysql.connector.Error as e:
        return jsonify({'status': 'fail', 'error': f'Error en la base de datos: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'status': 'fail', 'error': f'Error inesperado: {str(e)}'}), 500
    finally:
        if conn.is_connected():
            cursor.close()
            conn.close()

@app.route('/generarSesion', methods=['GET'])
def generar_sesion():
    """
    Crea una nueva sesión en la base de datos.
    ---
    tags:
      - Sesiones
    parameters:
      - name: id_proyecto
        in: query
        type: integer
        required: true
        description: ID del proyecto al que pertenece la sesión.
      - name: id_persona_responsable
        in: query
        type: integer
        required: false
        description: ID de la persona responsable de la sesión. Opcional.
      - name: descripcion
        in: query
        type: string
        required: false
        description: Descripción de la sesión. Predeterminado a una cadena vacía.
      - name: fecha_inicio
        in: query
        type: string
        format: datetime
        required: false
        description: Fecha de inicio de la sesión en formato "YYYY-MM-DD HH:MM:SS". Predeterminado a la fecha actual.
      - name: version
        in: query
        type: string
        required: false
        description: Versión de la sesión. Predeterminado a "1.0".
      - name: ubicacion
        in: query
        type: string
        required: false
        description: Ubicación de la sesión. Predeterminado a una cadena vacía.
    responses:
      201:
        description: Sesión creada correctamente.
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
            message:
              type: string
              example: Sesión creada correctamente
            generated_id:
              type: integer
              example: 123
      400:
        description: Parámetro obligatorio "id_proyecto" no proporcionado.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: El parámetro id_proyecto es obligatorio
      500:
        description: Error interno en el servidor o base de datos.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: Error interno
    """
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
    """
    Obtiene los valores relacionados con una columna foránea específica.
    ---
    tags:
      - Relaciones
    parameters:
      - name: columna
        in: query
        type: string
        required: true
        description: Nombre de la columna foránea para obtener los datos relacionados.
    responses:
      200:
        description: Datos obtenidos con éxito.
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
            data:
              type: array
              items:
                type: object
                properties:
                  value:
                    type: string
                    example: "1"
                  label:
                    type: string
                    example: "Nombre - Apellido"
      400:
        description: No se encontraron datos relacionados con la columna proporcionada.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: No se han obtenido los datos
      500:
        description: Error en la base de datos o error interno del servidor.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: Error al conectarse a la base de datos <detalle del error>
    """
    args = request.args
    column = args.get('columna')
    try:
        print("Antes")
        conn = mysql.connector.connect(**config)
        print("Despues")
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
                    "label": " - ".join(str(fila[col]) for col in columns if col != column)  # Concatenar otras columnas
                }
                for fila in filas
            ]

            return jsonify({"status": "success", "data": transformed_data}), 200

        return jsonify({"status": "fail", "error": "No se han obtenido los datos"}), 400
    
    except mysql.connector.Error as e:
        mensaje_error = f"Error al conectarse a la base de datos {e}"
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
    """
    Inserta mediciones asociadas a sensores, variables y sesiones.
    ---
    tags:
      - Datos
    parameters:
      - name: times
        in: query
        type: string
        required: false
        description: Tiempos de las mediciones en formato de timestamp, separados por comas. Si no se especifica, se utilizará el tiempo actual.
      - name: idsSesiones
        in: query
        type: string
        required: false
        description: IDs de las sesiones asociadas a las mediciones, separados por comas. Si no se especifica, se utilizará NULL.
      - name: idsSensores
        in: query
        type: string
        required: true
        description: IDs de los sensores, separados por comas.
      - name: idsVariables
        in: query
        type: string
        required: true
        description: IDs de las variables, separados por comas.
      - name: valores
        in: query
        type: string
        required: true
        description: Valores de las mediciones, separados por comas.
    responses:
      201:
        description: Mediciones insertadas correctamente.
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
            message:
              type: string
              example: Registro insertado correctamente
      400:
        description: Las longitudes de los parámetros no coinciden.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: Las longitudes de los parámetros no coinciden
      500:
        description: Error en la base de datos o error interno.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: Error al conectarse a la base de datos <detalle del error>
    """

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
        mensaje_error = f"Error al conectarse a la base de datos {e}"
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
    """
    Lista las tablas permitidas en la base de datos.
    ---
    tags:
      - Tablas
    responses:
      200:
        description: Lista de tablas obtenida con éxito.
        schema:
          type: array
          items:
            type: object
            properties:
              displayName:
                type: string
                example: "Datos"
              dataName:
                type: string
                example: "datos"
      500:
        description: Error interno en el servidor.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: Error interno del servidor
    """
    return jsonify(ALLOWED_TABLES_PROP)

@app.route('/listarDatos', methods=['GET'])
def listar_datos():
    """
    Lista los datos de una tabla permitida con filtros opcionales.
    ---
    tags:
      - Tablas
    parameters:
      - name: tabla
        in: query
        type: string
        required: true
        description: Nombre de la tabla desde donde se obtendrán los datos.
      - name: limite
        in: query
        type: integer
        required: false
        description: Número máximo de registros a retornar. Sin límite si no se especifica.
      - name: offset
        in: query
        type: integer
        required: false
        description: Desplazamiento inicial para la consulta. Predeterminado a 0.
      - name: formato
        in: query
        type: string
        required: false
        description: Formato de salida 'json' o 'csv'. Predeterminado a 'json'.
      - name: filtros
        in: query
        type: string
        required: false
        description: Filtros opcionales para columnas específicas en la forma 'columna=valor1,valor2'.
    responses:
      200:
        description: Datos obtenidos con éxito.
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
            data:
              type: object
              properties:
                tableData:
                  type: array
                  items:
                    type: object
                    example: { "columna1": "valor1", "columna2": "valor2" }
                tabla:
                  type: string
                  example: datos
      403:
        description: La tabla solicitada no está permitida.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: Tabla no permitida
      400:
        description: Formato no soportado o error en los filtros.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: Formato 'xml' no soportado. Use 'json' o 'csv'.
      500:
        description: Error interno en la base de datos o error inesperado.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: Error al conectarse a la base de datos <detalle del error>
    """

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
        mensaje_error = f"Error al conectarse a la base de datos {e}"
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
    """
    Lista los datos estructurados de la tabla "datos" con filtros opcionales.
    ---
    tags:
      - Tablas
    parameters:
      - name: limite
        in: query
        type: integer
        required: false
        description: Número máximo de registros a retornar. Sin límite si no se especifica.
      - name: offset
        in: query
        type: integer
        required: false
        description: Desplazamiento inicial para la consulta. Predeterminado a 0.
      - name: formato
        in: query
        type: string
        required: false
        description: Formato de salida 'json' o 'csv'. Predeterminado a 'json'.
      - name: fecha_inicio
        in: query
        type: string
        format: date
        required: false
        description: Fecha de inicio para filtrar los datos en formato "YYYY-MM-DD".
      - name: fecha_fin
        in: query
        type: string
        format: date
        required: false
        description: Fecha de fin para filtrar los datos en formato "YYYY-MM-DD".
      - name: filtros
        in: query
        type: string
        required: false
        description: Filtros opcionales para columnas específicas en la forma 'columna=valor1,valor2'.
    responses:
      200:
        description: Datos estructurados obtenidos con éxito.
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
            data:
              type: object
              properties:
                tableData:
                  type: array
                  items:
                    type: object
                    example: { "fecha": "2024-01-01", "id_sesion": 123, "valor": 45.6, "unidad_medida": "Temperatura (°C)" }
                tabla:
                  type: string
                  example: datos
                totalCount:
                  type: integer
                  example: 100
      400:
        description: No se encontraron registros para los filtros solicitados o error en el formato.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: No hay registros para los filtros solicitados
      403:
        description: La tabla solicitada no está permitida.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: Tabla no permitida
      500:
        description: Error interno en la base de datos o error inesperado.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: Error al conectarse a la base de datos <detalle del error>
    """

    args = request.args
    tabla = "datos"  # args.get('tabla')  # Nombre de la tabla como parámetro
    limit = int(args.get('limite', 0))
    offset = int(args.get('offset', 0))
    formato = args.get('formato', 'json')

    fecha_inicio = args.get('fecha_inicio')
    fecha_fin = args.get('fecha_fin')

    args_dict = request.args.to_dict()
    not_primary_keys = ['tabla', 'limite', 'offset', 'formato', 'fecha_inicio', 'fecha_fin']

    # Filtrar los argumentos relevantes
    filtered_args = {key: value.split(',') for key, value in args_dict.items() if key not in not_primary_keys}

    where_clauses = []
    params = []

    # Rango de fechas
    if fecha_inicio:
        where_clauses.append("(d.fecha >= %s)")
        params.append(fecha_inicio)
    if fecha_fin:
        where_clauses.append("(d.fecha <= %s)")
        params.append(fecha_fin)

    for key, values in filtered_args.items():
        or_conditions = " OR ".join([f"{key}=%s" for _ in values])
        where_clauses.append(f"({or_conditions})")
        params.extend(values)

    where_clause = ' AND '.join(where_clauses)
    where_clause = f"WHERE {where_clause}" if where_clause else ""

    if tabla not in ALLOWED_TABLES:
        return jsonify({'status': 'fail', 'error': 'Tabla no permitida'}), 403

    try:
        conn = mysql.connector.connect(**config)
        cursor = conn.cursor()

        sql_query = f"""
            SELECT
                d.fecha,
                d.id_sesion,
                d.valor,
                CONCAT(v.descripcion, ' (', v.unidad, ')') AS unidad_medida,
                s.descripcion AS sesion_descripcion,
                s.fecha_inicio,
                s.ubicacion,
                disp.id_proyecto,
                disp.codigo_interno,
                disp.descripcion AS dispositivo_descripcion
            FROM
                sensores_dev.datos AS d
            LEFT JOIN
                sensores_dev.variables AS v ON d.id_variable = v.id_variable
            LEFT JOIN
                sensores_dev.sesiones AS s ON d.id_sesion = s.id_sesion
            LEFT JOIN
                sensores_dev.sensores AS sens ON d.id_sensor = sens.id_sensor
            LEFT JOIN
                sensores_dev.sensores_en_dispositivo AS sed ON sens.id_sensor = sed.id_sensor
            LEFT JOIN
                sensores_dev.dispositivos AS disp ON sed.id_dispositivo = disp.id_dispositivo
            {where_clause}
        """

        cursor.execute(sql_query, params)
        filas = cursor.fetchall()
        if len(filas) == 0:
            mensaje_error = f"No hay registros para los filtros solicitados"
            return jsonify({'status': 'fail', 'error': mensaje_error}), 400
        # Convertir resultados en DataFrame
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
            index=["fecha", "id_sesion", "sesion_descripcion", "fecha_inicio", "ubicacion", "id_proyecto", "codigo_interno", "dispositivo_descripcion"],
            columns="unidad_medida",
            values="valor",
            aggfunc="first"
        ).reset_index()

        # Calcular total_count antes de aplicar limit y offset
        total_count = len(df_pivoted)

        # Aplicar limit y offset al DataFrame pivotado
        if limit > 0:
            df_pivoted = df_pivoted.iloc[offset:offset + limit]

        if formato == 'json':
            json_response = df_pivoted.to_dict(orient="records")
            json_respuesta = json.dumps({
                'status': 'success',
                'data': {
                    'tableData': json_response,
                    'tabla': tabla,
                    'totalCount': total_count
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
        mensaje_error = f"Error al conectarse a la base de datos {e}"
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

# @app.route('/listarDatosEstructurados', methods=['GET'])
# def listar_datos_estructurados():
#     args = request.args
#     tabla = "datos"  # args.get('tabla')  # Nombre de la tabla como parámetro
#     limit = int(args.get('limite', 0))
#     offset = int(args.get('offset', 0))
#     formato = args.get('formato', 'json')

#     fecha_inicio = args.get('fecha_inicio')
#     fecha_fin = args.get('fecha_fin')

#     args_dict = request.args.to_dict()
#     not_primary_keys = ['tabla', 'limite', 'offset', 'formato', 'fecha_inicio', 'fecha_fin']

#     # Filtrar los argumentos relevantes
#     filtered_args = {key: value.split(',') for key, value in args_dict.items() if key not in not_primary_keys}

#     where_clauses = []
#     params = []

#     # Rango de fechas
#     if fecha_inicio:
#         where_clauses.append("(d.fecha >= %s)")
#         params.append(fecha_inicio)
#     if fecha_fin:
#         where_clauses.append("(d.fecha <= %s)")
#         params.append(fecha_fin)

#     for key, values in filtered_args.items():
#         or_conditions = " OR ".join([f"{key}=%s" for _ in values])
#         where_clauses.append(f"({or_conditions})")
#         params.extend(values)

#     where_clause = ' AND '.join(where_clauses)
#     where_clause = f"WHERE {where_clause}" if where_clause else ""

#     if tabla not in ALLOWED_TABLES:
#         return jsonify({'status': 'fail', 'error': 'Tabla no permitida'}), 403

#     try:
#         conn = mysql.connector.connect(**config)
#         cursor = conn.cursor()

#         # Agregar LIMIT y OFFSET antes del pivotado
#         sql_query = f"""
#             SELECT
#                 d.fecha,
#                 d.id_sesion,
#                 d.valor,
#                 CONCAT(v.descripcion, ' (', v.unidad, ')') AS unidad_medida,
#                 s.descripcion AS sesion_descripcion,
#                 s.fecha_inicio,
#                 s.ubicacion,
#                 disp.id_proyecto,
#                 disp.codigo_interno,
#                 disp.descripcion AS dispositivo_descripcion
#             FROM
#                 sensores_dev.datos AS d
#             LEFT JOIN
#                 sensores_dev.variables AS v ON d.id_variable = v.id_variable
#             LEFT JOIN
#                 sensores_dev.sesiones AS s ON d.id_sesion = s.id_sesion
#             LEFT JOIN
#                 sensores_dev.sensores AS sens ON d.id_sensor = sens.id_sensor
#             LEFT JOIN
#                 sensores_dev.sensores_en_dispositivo AS sed ON sens.id_sensor = sed.id_sensor
#             LEFT JOIN
#                 sensores_dev.dispositivos AS disp ON sed.id_dispositivo = disp.id_dispositivo
#             {where_clause}
#             LIMIT %s OFFSET %s
#         """
#         params.extend([limit, offset])

#         cursor.execute(sql_query, params)
#         filas = cursor.fetchall()
#         if len(filas) == 0:
#             mensaje_error = f"No hay registros para los filtros solicitados"
#             return jsonify({'status': 'fail', 'error': mensaje_error}), 400

#         # Convertir resultados en DataFrame
#         respuesta = []
#         for fila in filas:
#             datos_dict = {key: value for key, value in zip(cursor.column_names, fila)}
#             for key, value in datos_dict.items():
#                 if isinstance(value, decimal.Decimal):
#                     datos_dict[key] = float(value)
#                 elif isinstance(value, (datetime, date)):
#                     datos_dict[key] = value.isoformat()
#             respuesta.append(datos_dict)

#         df = pd.DataFrame(respuesta)
#         df = df.fillna(value={"id_sesion": "Sin sesión", "sesion_descripcion": "", "fecha_inicio": "", "ubicacion": ""})

#         # Pivotear después de limitar los datos
#         df_pivoted = df.pivot_table(
#             index=["fecha", "id_sesion", "sesion_descripcion", "fecha_inicio", "ubicacion", "id_proyecto", "codigo_interno", "dispositivo_descripcion"],
#             columns="unidad_medida",
#             values="valor",
#             aggfunc="first"
#         ).reset_index()

#         total_count = len(filas)  # Basado en los datos consultados

#         if formato == 'json':
#             json_response = df_pivoted.to_dict(orient="records")
#             json_respuesta = json.dumps({
#                 'status': 'success',
#                 'data': {
#                     'tableData': json_response,
#                     'tabla': tabla,
#                     'totalCount': total_count
#                 }
#             }, ensure_ascii=False)
#             return json_respuesta, 200, {'Content-Type': 'application/json; charset=utf-8', 'Access-Control-Allow-Origin': '*'}
#         elif formato == 'csv':
#             return Response(
#                 stream_with_context(build_csv(df_pivoted)),
#                 mimetype="text/csv",
#                 headers={"Content-Disposition": "attachment;filename=output.csv"}
#             )
#         else:
#             mensaje_error = f"Formato '{formato}' no soportado. Use 'json' o 'csv'."
#             return jsonify({'status': 'fail', 'error': mensaje_error}), 400

#     except mysql.connector.Error as e:
#         mensaje_error = f"Error al conectarse a la base de datos {e}"
#         print(mensaje_error)
#         return jsonify({'status': 'fail', 'error': mensaje_error}), 500

#     except Exception as e:
#         mensaje_error = f"Error desconocido: {e}"
#         print(mensaje_error)
#         return jsonify({'status': 'fail', 'error': mensaje_error}), 500

#     finally:
#         if conn.is_connected():
#             cursor.close()
#             conn.close()


@app.route('/listarSensores', methods=['GET'])
def listar_sensores():
    """
    Lista los sensores junto con información detallada de su tipo y dispositivo asociado.
    ---
    tags:
      - Sensores
    parameters:
      - name: limite
        in: query
        type: integer
        required: false
        description: Número máximo de registros a retornar. Predeterminado a 100.
      - name: offset
        in: query
        type: integer
        required: false
        description: Desplazamiento inicial para la consulta. Predeterminado a 0.
      - name: id_dispositivo
        in: query
        type: integer
        required: false
        description: ID del dispositivo para filtrar los sensores relacionados.
    responses:
      200:
        description: Sensores listados con éxito.
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
            data:
              type: object
              properties:
                tableData:
                  type: array
                  items:
                    type: object
                    example: {
                      "Id Sensor": 1,
                      "Id Sensor Tipo": 10,
                      "N° de Serie": "SN123456",
                      "Código Interno": "C123",
                      "Marca": "MarcaX",
                      "Modelo": "ModeloY",
                      "Descripcion": "Sensor de temperatura"
                    }
                tabla:
                  type: string
                  example: sensores_combinados
      500:
        description: Error interno en la base de datos o error inesperado.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: Error al conectarse a la base de datos <detalle del error>
    """

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
        mensaje_error = f"Error al conectarse a la base de datos {e}"
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
    """
    Obtiene el esquema de una tabla específica en la base de datos.
    ---
    tags:
      - Tablas
    parameters:
      - name: tabla
        in: query
        type: string
        required: true
        description: Nombre de la tabla para la cual se solicita el esquema.
    responses:
      200:
        description: Esquema de la tabla obtenido con éxito.
        schema:
          type: array
          items:
            type: object
            properties:
              Field:
                type: string
                example: "id_sensor"
              Type:
                type: string
                example: "int(11)"
              Null:
                type: string
                example: "NO"
              Key:
                type: string
                example: "PRI"
              Default:
                type: string
                example: null
              Extra:
                type: string
                example: "auto_increment"
              Count:
                type: integer
                example: 100
      400:
        description: Error al obtener el esquema de la tabla.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Error al obtener esquema: tabla no existe"
      500:
        description: Error interno o de conexión a la base de datos.
        schema:
          type: object
          properties:
            error:
              type: string
              example: "Error de conexión a la base de datos"
    """

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
    """
    Modifica registros en una tabla específica de la base de datos.
    ---
    tags:
      - Datos
    parameters:
      - name: body
        in: body
        required: true
        description: Datos necesarios para modificar un registro.
        schema:
          type: object
          properties:
            tableName:
              type: string
              example: "sensores"
              description: Nombre de la tabla donde se realizará la modificación.
            primaryKeys:
              type: object
              description: Claves primarias del registro a modificar.
              example: { "id_sensor": 1 }
            formData:
              type: object
              description: Datos que se actualizarán en el registro.
              example: { "descripcion": "Nuevo valor", "estado": "Activo" }
    responses:
      200:
        description: Registro actualizado correctamente.
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
            message:
              type: string
              example: "1 registro(s) actualizado(s) correctamente"
      403:
        description: La tabla especificada no está permitida.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: "Tabla no permitida"
      404:
        description: El registro no fue encontrado o no se realizaron cambios.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: "Registro no encontrado o sin cambios"
      500:
        description: Error interno en la base de datos o error inesperado.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: "Error al conectarse a la base de datos <detalle del error>"
    """

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
        mensaje_error = f"Error al conectarse a la base de datos {e}"
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
    """
    Elimina registros de una tabla específica en la base de datos.
    ---
    tags:
      - Datos
    parameters:
      - name: tabla
        in: query
        type: string
        required: true
        description: Nombre de la tabla desde donde se eliminarán los registros.
      - name: filtros
        in: query
        type: string
        required: true
        description: Filtros para identificar los registros a eliminar en la forma 'columna=valor'.
    responses:
      200:
        description: Registro(s) eliminado(s) correctamente.
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
            message:
              type: string
              example: "1 registro(s) eliminado(s) correctamente"
      403:
        description: Faltan parámetros requeridos o la tabla no está permitida.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: "'Se requiere un ID' o 'Tabla no permitida'"
      404:
        description: Registro no encontrado o no se realizaron cambios.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: "Registro no encontrado o sin cambios"
      500:
        description: Error interno en la base de datos o error inesperado.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: "Error al conectarse a la base de datos <detalle del error>"
    """

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
        mensaje_error = f"Error al conectarse a la base de datos {e}"

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
    """
    Agrega un nuevo registro a una tabla específica en la base de datos.
    ---
    tags:
      - Datos
    parameters:
      - name: body
        in: body
        required: true
        description: Datos necesarios para insertar un nuevo registro.
        schema:
          type: object
          properties:
            tableName:
              type: string
              example: "sensores"
              description: Nombre de la tabla donde se insertará el registro.
            formData:
              type: object
              description: Datos que se insertarán en el registro.
              example: { "descripcion": "Sensor de temperatura", "estado": "Activo" }
    responses:
      201:
        description: Registro insertado correctamente.
        schema:
          type: object
          properties:
            status:
              type: string
              example: success
            message:
              type: string
              example: "Registro insertado correctamente"
      403:
        description: La tabla especificada no está permitida.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: "Tabla no permitida"
      500:
        description: Error interno en la base de datos o error inesperado.
        schema:
          type: object
          properties:
            status:
              type: string
              example: fail
            error:
              type: string
              example: "Error al conectarse a la base de datos <detalle del error>"
    """

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
        mensaje_error = f"Error al conectarse a la base de datos {e}"
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