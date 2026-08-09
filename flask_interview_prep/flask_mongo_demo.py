from flask import Flask, request, jsonify, g
from pymongo import MongoClient
from bson.objectid import ObjectId
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from functools import wraps

app = Flask(__name__)
app.config['SECRET_KEY'] = 'super_secret_interview_key'

# ----------------- MONGO CONNECTION -----------------
# Connecting to local MongoDB instance
client = MongoClient("mongodb://localhost:27017/")
db = client["interview_mongo_db"]
# Collections: db.users and db.products

# ----------------- JWT MIDDLEWARE (DECORATOR) -----------------

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            parts = auth_header.split(" ")
            if len(parts) == 2 and parts[0] == "Bearer":
                token = parts[1]

        if not token:
            return jsonify({"message": "Token is missing!"}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
            # In Mongo, we deal with stringified ObjectIds for tokens
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
    user_exists = db.users.find_one({"email": data['email']})
    if user_exists:
        return jsonify({"message": "User with this email already exists!"}), 400

    # Hash the password
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')

    # Save to MongoDB
    new_user = {
        "name": data['name'],
        "email": data['email'],
        "password": hashed_password
    }
    db.users.insert_one(new_user)

    return jsonify({"message": "User registered successfully!"}), 201


@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"message": "Email and password are required!"}), 400

    # Query user
    user = db.users.find_one({"email": data['email']})
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({"message": "Invalid email or password!"}), 401

    # Generate JWT (convert ObjectId to string)
    token = jwt.encode({"user_id": str(user['_id'])}, app.config['SECRET_KEY'], algorithm="HS256")
    return jsonify({
        "message": "Login successful",
        "token": token,
        "user": {
            "id": str(user['_id']),
            "name": user['name'],
            "email": user['email']
        }
    }), 200

# ----------------- PRODUCT CRUD ROUTES -----------------

# 1. READ ALL (Public)
@app.route('/api/products', methods=['GET'])
def get_products():
    products = db.products.find()
    output = []
    for product in products:
        output.append({
            "id": str(product['_id']),
            "name": product['name'],
            "price": product['price'],
            "user_id": product['user_id']
        })
    return jsonify(output), 200

# 2. CREATE (Protected)
@app.route('/api/products', methods=['POST'])
@token_required
def create_product():
    data = request.get_json()
    if not data or not data.get('name') or not data.get('price'):
        return jsonify({"message": "Product name and price are required!"}), 400

    new_product = {
        "name": data['name'],
        "price": float(data['price']),
        "user_id": g.user_id # Saved as a string during JWT decode
    }
    result = db.products.insert_one(new_product)

    return jsonify({"message": "Product created!", "product_id": str(result.inserted_id)}), 201

# 3. UPDATE (Protected)
@app.route('/api/products/<string:id>', methods=['PUT'])
@token_required
def update_product(id):
    product = db.products.find_one({"_id": ObjectId(id)})
    if not product:
        return jsonify({"message": "Product not found!"}), 404

    # Ownership check
    if product['user_id'] != g.user_id:
        return jsonify({"message": "Unauthorized to update this product!"}), 403

    data = request.get_json()
    updated_fields = {}
    if 'name' in data:
        updated_fields['name'] = data['name']
    if 'price' in data:
        updated_fields['price'] = float(data['price'])

    db.products.update_one({"_id": ObjectId(id)}, {"$set": updated_fields})
    return jsonify({"message": "Product updated successfully!"}), 200

# 4. DELETE (Protected)
@app.route('/api/products/<string:id>', methods=['DELETE'])
@token_required
def delete_product(id):
    product = db.products.find_one({"_id": ObjectId(id)})
    if not product:
        return jsonify({"message": "Product not found!"}), 404

    # Ownership check
    if product['user_id'] != g.user_id:
        return jsonify({"message": "Unauthorized to delete this product!"}), 403

    db.products.delete_one({"_id": ObjectId(id)})
    return jsonify({"message": "Product deleted successfully!"}), 200

if __name__ == '__main__':
    app.run(port=5002, debug=True)
