import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.favorite import Favorite
from app.models.user import User
from app import db

favorites_bp = Blueprint("favorites", __name__)

@favorites_bp.route("/", methods=["GET"])
@jwt_required()
def get_favorites():
    try:
        user_id = get_jwt_identity()
        favorites = Favorite.query.filter_by(user_id=user_id).all()

        response_data = [
            {
                "id": fav.id,
                "book_id": fav.book_id,
                "book_title": fav.book_title,
                "book_author": fav.book_author,
                "book_cover": fav.book_cover,  # ✅ Asegurar que se devuelve book_cover
                "added_date": fav.added_date.strftime("%Y-%m-%d"),
            }
            for fav in favorites
        ]

        print(f"📌 Enviando favoritos al frontend: {response_data}")  # ✅ Verificar los datos antes de enviarlos
        return jsonify(response_data), 200

    except Exception as e:
        print(f"🚨 Error al obtener favoritos: {str(e)}")
        return jsonify({"error": "No se pudieron cargar favoritos"}), 500


@favorites_bp.route("/", methods=["POST"])
@jwt_required()
def add_favorite():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        print(f"📌 Datos recibidos en el backend: {data}")

        book_id = data.get("book_id")
        book_title = data.get("book_title")
        book_author = data.get("book_author", "Autor desconocido")
        book_cover = data.get("book_cover", "/placeholder.svg")  # ✅ Si no hay imagen, usar un placeholder

        print(f"📌 Valores a guardar en la base de datos: book_id={book_id}, book_title={book_title}, book_author={book_author}, book_cover={book_cover}")

        if not book_id or not book_title:
            return jsonify({"error": "ID y título del libro son obligatorios"}), 400

        existing_favorite = Favorite.query.filter_by(user_id=user_id, book_id=book_id).first()
        if existing_favorite:
            return jsonify({"error": "El libro ya está en favoritos"}), 409

        # ✅ Guardamos los valores en la base de datos
        new_favorite = Favorite(
            user_id=user_id,
            book_id=book_id,
            book_title=book_title,
            book_author=book_author,
            book_cover=book_cover
        )
        db.session.add(new_favorite)
        db.session.commit()

        print(f"✅ Libro agregado correctamente con book_author={book_author}, book_cover={book_cover}")
        return jsonify({"message": "Libro agregado a favoritos"}), 201

    except Exception as e:
        print(f"🚨 Error en el backend: {str(e)}")
        return jsonify({"error": "No se pudo agregar el favorito", "details": str(e)}), 500





@favorites_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def remove_favorite(id):
    try:
        user_id = get_jwt_identity()  # Obtener el ID del usuario autenticado
        favorite = Favorite.query.filter_by(id=id, user_id=user_id).first()

        if not favorite:
            return jsonify({"error": "Favorito no encontrado"}), 404

        db.session.delete(favorite)
        db.session.commit()

        return jsonify({"message": f"Favorito con ID {id} eliminado"}), 200
    except Exception as e:
        return jsonify({"error": "No se pudo eliminar el favorito", "details": str(e)}), 500
