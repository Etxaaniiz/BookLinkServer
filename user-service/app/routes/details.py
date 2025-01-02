from flask import Blueprint, jsonify
import requests
import os
from dotenv import load_dotenv

# Cargar las variables de entorno desde el archivo .env
load_dotenv()

details_bp = Blueprint("details", __name__)

GOOGLE_BOOKS_API = "https://www.googleapis.com/books/v1/volumes"
GOOGLE_BOOKS_API_KEY = os.getenv("GOOGLE_BOOKS_API_KEY")  # Obtener la clave de API desde el archivo .env

@details_bp.route("/details/<string:book_id>", methods=["GET"])
def get_book_details(book_id):
    try:
        response = requests.get(f"https://www.googleapis.com/books/v1/volumes/{book_id}")
        if response.status_code != 200:
            return jsonify({"error": "No se pudo obtener los detalles del libro"}), response.status_code

        book_data = response.json()

        book_details = {
            "id": book_data.get("id"),
            "title": book_data["volumeInfo"].get("title", "Título no disponible"),
            "author": ", ".join(book_data["volumeInfo"].get("authors", ["Autor no disponible"])),
            "description": book_data["volumeInfo"].get("description", "Descripción no disponible"),
            "publisher": book_data["volumeInfo"].get("publisher", "Editorial no disponible"),
            "publishedDate": book_data["volumeInfo"].get("publishedDate", "Fecha de publicación no disponible"),
            "pageCount": book_data["volumeInfo"].get("pageCount", "N/A"),
            "language": book_data["volumeInfo"].get("language", "Idioma no disponible"),
            "cover": book_data["volumeInfo"].get("imageLinks", {}).get("thumbnail", "/placeholder.svg"),
        }

        return jsonify(book_details), 200
    except Exception as e:
        return jsonify({"error": "Error al obtener los detalles del libro", "details": str(e)}), 500