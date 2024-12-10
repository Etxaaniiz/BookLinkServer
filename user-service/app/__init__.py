from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)

    # Register blueprints
    from .routes.auth import auth_bp
    from .routes.favorites import favorites_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(favorites_bp, url_prefix='/favorites')

    with app.app_context():
        print(app.url_map)

    return app

