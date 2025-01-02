from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS

import logging

# Configuración de logging
logging.basicConfig(level=logging.DEBUG)  # Nivel de logging detallado
logger = logging.getLogger("flask.app")  # Logger principal para Flask

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    # Inicialización de extensiones
    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)
    CORS(app)  # Habilitar CORS para todas las rutas

    # Importar modelos para que SQLAlchemy los registre
    from app.models.user import User
    from app.models.favorite import Favorite

    # Registrar blueprints
    from app.routes.auth import auth_bp
    from app.routes.favorites import favorites_bp
    from app.routes.details import details_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(favorites_bp, url_prefix='/favorites')
    app.register_blueprint(details_bp, url_prefix='/api')

    with app.app_context():
        print(app.url_map)  # Imprime las rutas registradas para depuración

    return app
