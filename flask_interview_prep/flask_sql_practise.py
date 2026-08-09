from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import jwt
app = Flask(__name__)

app.config['SECRET_KEY'] = 'super_secret_interview_key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///interview_sql.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

@app.route('/')
def home():
    return 'Hello World!'

def token_validate(f):
    @wraps(f)
    def decorated(*args,**kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            parts = auth_header.split(' ')
            if len(parts) == 2 and parts[0] == 'Bearer':
                token = parts[1]
        if not token:
            return jsonify({'message':'token is missing'}), 401
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms = ['HS256'])
            g.user_id = data['user_id']
        except jwt.ExpiredSignatureError:
            return jsonify({'message':'token has expired'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message':'token is invalid'}), 401
        return f(*args,**kwargs)
    return decorated
class User(db.Model):
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(100),nullable = False)
    email = db.Column(db.String(100),unique=True,nullable=False)
    password = db.Column(db.String(200),nullable = False)

@app.route('/api/auth/signup', methods = ['POST'])
@token_validate
def signup():
    data = request.get_json()
    if not data or not data.get('name') or not data.get('email') or not data.get('password'):
        return jsonify({'message':'name, email, and password are required'}),400
    user_exists = User.query.filter_by(email=data['email']).first()
    if user_exists:
        return jsonify({'message':'user with this email already exists'}),400
    hashed_password = generate_password_hash(data['password'],method='pbkdf2:sha256')
    new_user = User(name=data['name'],email=data['email'],password=hashed_password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message':'user registered successfully'}),201

