from flask import Flask, request, jsonify, send_from_directory
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)

# Definir el directorio donde se guardarán las imágenes
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Extensiones permitidas para la imagen
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}

# Función para verificar las extensiones de archivo permitidas
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/agregarImagen', methods=['POST'])
def agregar_imagen():
    """
    Recibe una imagen y la guarda en el servidor.
    """

    # Verificar si la solicitud contiene un archivo
    if 'image' not in request.files:
        return jsonify({"error": "No image part"}), 400

    file = request.files['image']

    # Si no se seleccionó un archivo, devolver un error
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Si el archivo tiene una extensión permitida
    if file and allowed_file(file.filename):
        # Asegurarse de que el nombre del archivo sea seguro
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)

        # Guardar el archivo en el directorio
        file.save(filepath)

        return jsonify({"mensaje": "Imagen recibida y guardada con éxito", "filename": filename}), 201

    return jsonify({"error": "Invalid file format"}), 400

@app.route('/verImagenes', methods=['GET'])
def ver_imagenes():
    """
    Devuelve una lista de los nombres de las imágenes almacenadas en la carpeta 'uploads'.
    """
    try:
        # Obtener una lista de todos los archivos en la carpeta uploads
        imagenes = os.listdir(app.config['UPLOAD_FOLDER'])
        imagenes = [img for img in imagenes]  # Filtrar solo imágenes
        return jsonify({"imagenes": imagenes}), 200
    except Exception as e:
        return jsonify({"error": f"Error al obtener las imágenes: {e}"}), 500


@app.route('/verImagen/<filename>', methods=['GET'])
def ver_imagen(filename):
    """
    Sirve una imagen desde el servidor para que pueda ser vista en el navegador.
    """
    try:
        # Enviar el archivo solicitado desde la carpeta uploads
        return send_from_directory(app.config['UPLOAD_FOLDER'], filename)
    except FileNotFoundError:
        return jsonify({"error": "Imagen no encontrada"}), 404

if __name__ == '__main__':
    app.run(debug=True)
