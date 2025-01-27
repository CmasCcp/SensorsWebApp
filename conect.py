import mysql.connector

config = {
    "user": "root",
    "password": "root",
    "host": "localhost",
    "database": "sensores_dev",
    "port": 3306,
}

try:
    conn = mysql.connector.connect(**config)
    print("hola")
    if conn.is_connected():
        print("Conexión exitosa.")
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES;")
        for table in cursor:
            print(table)
except mysql.connector.Error as e:
    print({'status': 'fail', 'error': f'Error en la base de datos: {str(e)}'})
except Exception as e:
    print({'status': 'fail', 'error': f'Error inesperado: {str(e)}'})
    
finally:
    if conn.is_connected():
        cursor.close()
        conn.close()
