#!/usr/bin/env python

from flask import Flask, render_template, jsonify, request, make_response
from flask import session, g, redirect, url_for, abort, flash

from contextlib import closing
#from flask.ext.httpauth import HTTPBasicAuth
import sqlite3

# configuration
DATABASE = 'riders.db'
DEBUG = True
SECRET_KEY = 'development key'
USERNAME = 'admin'
PASSWORD = 'default'

app = Flask(__name__)
#auth = HTTPBasicAuth()
app.config.from_object(__name__)
app.config.from_envvar('RMT_SETTINGS', silent=True)

def connect_db():
    return sqlite3.connect(app.config['DATABASE'])

'''def init_db():
    with closing(connect_db()) as db:
        with app.open_resource('schema.sql', mode='r') as f:
            db.cursor().executescript(f.read())
        db.commit()'''

@app.before_request
def before_request():
    g.db = connect_db()

@app.teardown_request
def teardown_request(exception):
    db = getattr(g, 'db', None)
    if db is not None:
        db.close()

'''@auth.get_password
def get_password(username):
    if username == 'Yury':
        return 'qwerty'
    return None

@auth.error_handler
def unauthorized():
    return make_response(jsonify({'error': 'Unauthorized access'}), 401)'''

@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        if request.form['login'] != 'Vasya':
            error = 'Invalid username'
        elif request.form['password'] != '1111':
            error = 'Invalid password'
        else:
            session['logged_in'] = True
            return redirect(url_for('main'))
    return render_template('login.html', error=error)

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))

@app.route('/index')
def main():
    return render_template('main.html')

@app.route('/api/rmt/riders', methods=['GET'])
#@auth.login_required
def get_riders():
    cur = g.db.execute('select id, firstName,lastName, size, brand, riderClass, numberRider from riders order by id desc')
    riders = [dict(id=row[0], firstName=row[1], lastName=row[2], size=row[3], brand=row[4], riderClass=row[5], numberRider=row[6]) for row in cur.fetchall()]
    return jsonify({'riders': riders})

@app.route('/api/rmt/riders/<int:rider_id>', methods=['GET'])
def get_rider(rider_id):
    cur = g.db.execute('select id, firstName, lastName, size, brand, riderClass, numberRider from riders where id=' + str(rider_id))
    rider =  cur.fetchall()
    if len(rider) == 0:
        abort(404)
    rider = dict(id=rider[0][0], firstName=rider[0][1], lastName=rider[0][2], size=rider[0][3], brand=rider[0][4], riderClass=rider[0][5], numberRider=rider[0][6])
    return jsonify({'rider': rider})

@app.route('/api/rmt/riders/<int:rider_id>', methods=['DELETE'])
def remove_rider(rider_id):
    cur = g.db.execute('select id, firstName, lastName, size, brand, riderClass, numberRider from riders where id=' + str(rider_id))
    if len(cur.fetchall()) == 0:
        abort(404)
    cur = g.db.execute('delete from riders where id=' + str(rider_id))
    g.db.commit()
    return jsonify({'result': True})

@app.route('/api/rmt/riders', methods=['POST'])
def post_rider():
    if not request.json:
        abort(400)
    content = request.get_json(force=True)
    #if not session.get('logged_in'):
    #    abort(401)
    g.db.execute('insert into riders (firstName, lastName, size, brand, riderClass, numberRider) values (?, ?, ?, ?, ?, ?)', 
                [content['firstName'], content['lastName'], content['size'], content['brand'], content['riderClass'], content['numberRider']])
    g.db.commit()
    
    rider = {
        'firstName': content['firstName'],
        'lastName': content['lastName'],
        'size': content['size'],
        'brand': content['brand'],
        'riderClass': content['riderClass'],
        'number': content['numberRider']
    }
    return jsonify({'rider': rider}), 201

@app.route('/api/rmt/riders/<int:rider_id>', methods=['PUT'])
def update_rider(rider_id):
    if not request.json:
        abort(400)
    rider = {}
    content = request.get_json(force=True)
    cur = g.db.execute('select id, firstName, lastName, size, brand, riderClass, numberRider from riders where id=' + str(rider_id))
    if len(cur.fetchall()) == 0:
        abort(404)
    cur = g.db.execute('update riders set firstName=?, lastName=?, size=?, brand=?, riderClass=?, numberRider=? where id=?', 
                    [content['firstName'], content['lastName'], content['size'], content['brand'], content['riderClass'], content['numberRider'], str(rider_id)])
    g.db.commit()
    rider['firstName'] = content['firstName']
    rider['lastName'] = content['lastName']
    rider['size'] = content['size']
    rider['brand'] = content['brand']
    rider['riderClass'] = content['riderClass']
    rider['numberRider'] = content['numberRider']
    return jsonify({'rider': rider})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')