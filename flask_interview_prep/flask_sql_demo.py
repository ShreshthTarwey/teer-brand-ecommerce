from flask import Flask, request, jsonify, g
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from functools import wraps
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = 'super_secret_interview_key'
# Using an in-memory SQLite database for demonstration
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///interview_sql.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# ----------------- DATABASE MODELS -----------------

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

class Product(db.Model):
    __tablename__ = 'products'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    price = db.Column(db.Float, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

# Create tables
with app.app_context():
    db.create_all()

# ----------------- JWT MIDDLEWARE (DECORATOR) -----------------

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        # Check authorization header
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            # Expected format: "Bearer <token>"
            parts = auth_header.split(" ")
            if len(parts) == 2 and parts[0] == "Bearer":
                token = parts[1]

        if not token:
            return jsonify({"message": "Token is missing!"}), 401

        try:
            # Decode payload
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            # Save user identity globally in context
            g.user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({"message": "Token expired!"}), 401
        except jwt.InvalidTokenError:
            return jsonify({"message": "Token is invalid!"}), 401

        return f(*args, **kwargs)
    return decorated

# ----------------- AUTHENTICATION ROUTES -----------------

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if not data or not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Name, email, and password are required!"}), 400

    # Check if user already exists
    user_exists = User.query.filter_by(email=data['email']).first()
    if user_exists:
        return jsonify({"message": "User with this email already exists!"}), 400

    # Hash the password
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

    # Create and save user
    new_user = User(name=data['name'], email=data['email'], password=hashed_password)
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Email and password are required!"}), 400

    # Query user by email
    user = User.query.filter_by(email=data['email']).first()
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({"message": "Invalid email or password!"}), 401

    # Generate JWT
    token = jwt.encode({"user_id": user.id}, app.config['SECRET_KEY'], algorithm="HS256")
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email
        }
    }), 200

# ----------------- PRODUCT CRUD ROUTES -----------------

# 1. READ ALL (Public)
@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    output = []
    for product in products:
        output.append({
            "id": product.id,
            "name": product.name,
            "price": product.price,
            "user_id": product.user_id
        })
    return jsonify(output), 200

# 2. CREATE (Protected)
@app.route('/api/products', methods=['POST'])
@token_required
def create_product():
    data = request.get_json()
    if not data or not data.get('name') or not data.get('price'):
        return jsonify({"message": "Product name and price are required!"}), 400

    new_product = Product(
        name=data['name'],
        price=float(data['price']),
        user_id=g.user_id
    )
    db.session.add(new_product)
    db.session.commit()

    return jsonify({"message": "Product created!", "product_id": new_product.id}), 201

# 3. UPDATE (Protected)
@app.route('/api/products/<int:id>', methods=['PUT'])
@token_required
def update_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"message": "Product not found!"}), 404

    # Ownership check: Only user who created it can update
    if product.user_id != g.user_id:
        return jsonify({"message": "Unauthorized to update this product!"}), 403

    data = request.get_json()
    if 'name' in data:
        product.name = data['name']
    if 'price' in data:
        product.price = float(data['price'])

    db.session.commit()
    return jsonify({"message": "Product updated successfully!"}), 200

# 4. DELETE (Protected)
@app.route('/api/products/<int:id>', methods=['DELETE'])
@token_required
def delete_product(id):
    product = Product.query.get(id)
    if not product:
        return jsonify({"message": "Product not found!"}), 404

    # Ownership check
    if product.user_id != g.user_id:
        return jsonify({"message": "Unauthorized to delete this product!"}), 403

    db.session.remove(product) # Or db.session.delete(product) depending on SQLAlchemy version
    # Standard Flask-SQLAlchemy deletion:
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted successfully!"}), 200

if __name__ == '__main__':
    app.run(port=5001, debug=True)
