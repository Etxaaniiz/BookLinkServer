from flask import Blueprint, jsonify

favorites_bp = Blueprint('favorites', __name__)

@favorites_bp.route('/', methods=['GET'])
def get_favorites():
    # Aquí recuperamos los favoritos de un usuario
    return jsonify({"message": "Favorites endpoint"}), 200