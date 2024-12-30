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
    if conn.is_connected():
        print("Conexión exitosa.")
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES;")
        for table in cursor:
            print(table)
finally:
    if conn.is_connected():
        cursor.close()
        conn.close()
