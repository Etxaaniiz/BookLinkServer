import os
import datetime

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'tu_clave_secreta_segura')
    SQLALCHEMY_DATABASE_URI = 'sqlite:///user_service.db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT configurations
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'tu_clave_secreta_segura')
    JWT_ACCESS_TOKEN_EXPIRES = datetime.timedelta(minutes=45)
    JWT_REFRESH_TOKEN_EXPIRES = datetime.timedelta(days=30)
    JWT_COOKIE_SECURE = False  # Set to True in production
    JWT_TOKEN_LOCATION = ['headers']
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_CSRF_IN_COOKIES = True
    JWT_COOKIE_SAMESITE = 'Lax'