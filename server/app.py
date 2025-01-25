from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
from config import DATABASE_CONFIG
import os
from dotenv import load_dotenv 
from werkzeug.security import generate_password_hash, check_password_hash
from psycopg2.extras import RealDictCursor
import jwt
import datetime

load_dotenv()

app = Flask(__name__)
CORS(app)

app.config['SECRET_KEY'] = os.getenv("SECRET_KEY")

def get_db_connection():
    try: 
        conn = psycopg2.connect(**DATABASE_CONFIG)
        return conn
    except Exception as e:
        print("Database connection failed:", e)
        return None
    
# Create tables if they don't exist
def initialize_database():
    conn = get_db_connection()
    if conn:
        try:
            cur = conn.cursor()
            
            # Create users table
            cur.execute('''
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(80) UNIQUE NOT NULL,
                    email VARCHAR(120) UNIQUE NOT NULL,
                    password VARCHAR(255) NOT NULL,
                    high_score INTEGER DEFAULT 0
                );
            ''')
            
            conn.commit()
            cur.close()
            conn.close()
            print("Database initialized successfully")
        except Exception as e:
            print("Database initialization failed:", e)

@app.route('/register', methods=['POST'])
def register():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        data = request.get_json()
        username = data['username']
        email = data['email']
        password = generate_password_hash(data['password'])

        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        # Check if user already exists
        cur.execute("SELECT * FROM users WHERE email = %s OR username = %s", (email, username))
        if cur.fetchone():
            return jsonify({'message': 'User already exists'}), 400

        # Insert new user
        cur.execute(
            "INSERT INTO users (username, email, password) VALUES (%s, %s, %s) RETURNING id, username, email, high_score",
            (username, email, password)
        )
        new_user = cur.fetchone()
        conn.commit()

        # Generate token
        token = jwt.encode({
            'user_id': new_user['id'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
        }, app.config['SECRET_KEY'])

        return jsonify({
            'token': token,
            'user': {
                'id': new_user['id'],
                'username': new_user['username'],
                'email': new_user['email'],
                'highScore': new_user['high_score']
            }
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/login', methods=['POST'])
def login():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        data = request.get_json()
        email = data['email']
        password = data['password']

        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()

        if user and check_password_hash(user['password'], password):
            token = jwt.encode({
                'user_id': user['id'],
                'exp': datetime.datetime.utcnow() + datetime.timedelta(days=1)
            }, app.config['SECRET_KEY'])

            return jsonify({
                'token': token,
                'user': {
                    'id': user['id'],
                    'username': user['username'],
                    'email': user['email'],
                    'highScore': user['high_score']
                }
            })

        return jsonify({'message': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()
        conn.close()
    
def verify_token(token):
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return data['user_id']
    except:
        return None

@app.route('/update-score', methods=['POST'])
def update_score():
    auth_header = request.headers.get('Authorization')
    if not auth_header or 'Bearer ' not in auth_header:
        return jsonify({'message': 'Invalid token'}), 401

    token = auth_header.split(' ')[1]
    user_id = verify_token(token)
    if not user_id:
        return jsonify({'message': 'Invalid token'}), 401

    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        data = request.get_json()
        new_score = data['score']

        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute(
            "UPDATE users SET high_score = %s WHERE id = %s AND high_score < %s RETURNING high_score",
            (new_score, user_id, new_score)
        )
        updated = cur.fetchone()
        conn.commit()

        return jsonify({
            'message': 'Score updated successfully',
            'newHighScore': updated['high_score'] if updated else None
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/leaderboard', methods=['GET'])
def get_leaderboard():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Database connection failed'}), 500

    try:
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("""
            SELECT username, high_score 
            FROM users 
            ORDER BY high_score DESC 
            LIMIT 10
        """)
        leaderboard = cur.fetchall()
        return jsonify(leaderboard)

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cur.close()
        conn.close()

@app.route('/')
def home():
    conn = get_db_connection()
    if not conn:
        return jsonify({'error': 'Failed to connect to the database'}), 500
    
    try:
        cur = conn.cursor()
        cur.execute('SELECT version();')
        db_version = cur.fetchone()
        cur.close()
        conn.close()
        return jsonify({'PostgreSQL Version': db_version[0]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    print("Here")
    initialize_database()
    app.run(debug=True)


