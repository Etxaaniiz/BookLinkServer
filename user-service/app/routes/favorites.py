import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models.favorite import Favorite
from app.models.user import User
from app import db

# 🔹 Asegura que la URL base no cause redirecciones 308
favorites_bp = Blueprint("favorites", __name__, url_prefix="/favorites")

@favorites_bp.route("", methods=["GET"], strict_slashes=False)  # ✅ Evita redirección 308
@jwt_required()
def get_favorites():
    try:
        user_id = get_jwt_identity()
        print(f"📌 Usuario autenticado solicitando favoritos: {user_id}")

        favorites = Favorite.query.filter_by(user_id=user_id).all()

        response_data = [
            {
                "id": fav.id,
                "book_id": fav.book_id,
                "book_title": fav.book_title,
                "book_author": fav.book_author,
                "book_cover": fav.book_cover,  
                "added_date": fav.added_date.strftime("%Y-%m-%d"),
            }
            for fav in favorites
        ]

        print(f"✅ Favoritos recuperados correctamente: {len(response_data)} encontrados")
        return jsonify(response_data), 200

    except Exception as e:
        print(f"🚨 Error al obtener favoritos: {str(e)}")
        return jsonify({"error": "No se pudieron cargar favoritos"}), 500

@favorites_bp.route("", methods=["POST"], strict_slashes=False)  # ✅ Evita redirección 308
@jwt_required()
def add_favorite():
    try:
        user_id = get_jwt_identity()
        data = request.get_json()

        if not data:
            print("🚨 ERROR: No se recibió JSON en la solicitud")
            return jsonify({"error": "No se recibió JSON en la solicitud"}), 400 
        
        print(f"📌 Datos recibidos en el backend: {data}")

        book_id = data.get("book_id")
        book_title = data.get("book_title")
        book_author = data.get("book_author", "Autor desconocido")
        book_cover = data.get("book_cover", "/placeholder.svg")

        if not book_id or not book_title:
            print("🚨 ERROR: ID y título del libro son obligatorios")
            return jsonify({"error": "ID y título del libro son obligatorios"}), 400  

        existing_favorite = Favorite.query.filter_by(user_id=user_id, book_id=book_id).first()
        if existing_favorite:
            print("🚨 ERROR: El libro ya está en favoritos")
            return jsonify({"error": "El libro ya está en favoritos"}), 409 

        new_favorite = Favorite(
            user_id=user_id,
            book_id=book_id,
            book_title=book_title,
            book_author=book_author,
            book_cover=book_cover
        )
        db.session.add(new_favorite)
        db.session.commit()

        print(f"✅ Libro agregado correctamente con book_id={book_id}, title={book_title}")
        return jsonify({"message": "Libro agregado a favoritos"}), 201  # ✅ Código de estado correcto

    except Exception as e:
        print(f"🚨 Error en el backend: {str(e)}")
        return jsonify({"error": "No se pudo agregar el favorito", "details": str(e)}), 500

@favorites_bp.route("/<int:id>", methods=["DELETE"], strict_slashes=False)  # ✅ Evita redirección 308
@jwt_required()
def remove_favorite(id):
    try:
        user_id = get_jwt_identity()  
        print(f"📌 Usuario autenticado en DELETE: {user_id}")
        print(f"📌 Intentando eliminar favorito con ID recibido en la URL: {id}")

        if not id:
            print("🚨 ERROR: No se recibió un ID en la URL")
            return jsonify({"error": "No se recibió un ID válido"}), 400

        favorite = Favorite.query.filter_by(id=id, user_id=user_id).first()

        if not favorite:
            print(f"🚨 Favorito con ID {id} no encontrado para el usuario {user_id}")
            return jsonify({"error": "Favorito no encontrado"}), 404

        db.session.delete(favorite)
        db.session.commit()

        print(f"✅ Favorito con ID {id} eliminado correctamente.")
        return jsonify({"message": f"Favorito con ID {id} eliminado"}), 200
    except Exception as e:
        print(f"🚨 Error eliminando favorito: {str(e)}")
        return jsonify({"error": "No se pudo eliminar el favorito", "details": str(e)}), 500
