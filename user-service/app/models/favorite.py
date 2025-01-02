from app import db

class Favorite(db.Model):
    __tablename__ = 'favorite'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Relación con el usuario
    book_id = db.Column(db.String(120), nullable=False)  # ID del libro
    book_title = db.Column(db.String(200), nullable=False)  # Título del libro
    book_author = db.Column(db.String(120), nullable=True)  # Autor del libro
    added_date = db.Column(db.DateTime, default=db.func.current_timestamp())  # Fecha de añadido
