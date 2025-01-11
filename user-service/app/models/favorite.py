from app import db

class Favorite(db.Model):
    __tablename__ = 'favorite'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    book_id = db.Column(db.String(120), nullable=False)
    book_title = db.Column(db.String(200), nullable=False)
    book_author = db.Column(db.String(120), nullable=True)
    book_cover = db.Column(db.String(500), nullable=True) 
    added_date = db.Column(db.DateTime, default=db.func.current_timestamp())