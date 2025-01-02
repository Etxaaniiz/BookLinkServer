from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from app.models.user import User
from app import db, bcrypt

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get("email")
    username = data.get("username")

    # Verificar si el usuario ya existe
    existing_user = User.query.filter((User.email == email) | (User.username == username)).first()
    if existing_user:
        return jsonify({"error": "El email o nombre de usuario ya está registrado"}), 400

    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    user = User(username=username, email=email, password=hashed_password)
    db.session.add(user)
    db.session.commit()

    return jsonify({"message": "Usuario registrado exitosamente"}), 201



@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    # Buscar usuario en la base de datos
    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        # Generar un token JWT con el ID del usuario como string
        access_token = create_access_token(identity=str(user.id))  # Convertir a string
        return jsonify({"token": access_token}), 200
    else:
        return jsonify({"error": "Credenciales inválidas"}), 401
