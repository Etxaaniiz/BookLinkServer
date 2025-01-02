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
        user_id = get_jwt_identity()  # Obtener el ID del usuario autenticado
        favorites = Favorite.query.filter_by(user_id=user_id).all()

        return jsonify([{
            "id": favorite.id,
            "book_id": favorite.book_id,
            "book_title": favorite.book_title,
            "book_author": favorite.book_author,
            "added_date": favorite.added_date.strftime("%Y-%m-%d")
        } for favorite in favorites]), 200
    except Exception as e:
        return jsonify({"error": "Error al cargar favoritos", "details": str(e)}), 500

@favorites_bp.route("/", methods=["POST"])
@jwt_required()
def add_favorite():
    try:
        user_id = get_jwt_identity()
        print(f"Token validado, User ID: {user_id}")  # Depuración
        data = request.get_json()

        # Validar los datos enviados
        book_id = data.get("book_id")
        book_title = data.get("book_title")
        book_author = data.get("book_author", "Autor desconocido")

        if not book_id or not book_title:
            return jsonify({"error": "ID y título del libro son obligatorios"}), 400

        # Verificar si el libro ya está en favoritos
        existing_favorite = Favorite.query.filter_by(user_id=user_id, book_id=book_id).first()
        if existing_favorite:
            return jsonify({"error": "El libro ya está en favoritos"}), 409

        # Agregar el libro a favoritos
        new_favorite = Favorite(
            user_id=user_id,
            book_id=book_id,
            book_title=book_title,
            book_author=book_author
        )
        db.session.add(new_favorite)
        db.session.commit()

        return jsonify({"message": "Libro agregado a favoritos"}), 201
    except Exception as e:
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
