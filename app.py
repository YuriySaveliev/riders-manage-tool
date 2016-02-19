from flask import Flask, render_template, jsonify, request
import sqlite3

DATABASE = 'riders.db'

app = Flask(__name__)

riders = [
    {   
        'id': 0,
        'firstName': 'John',
        'lastName': 'Doe',
        'size': 'Large',
        'brand': 'Norco',
        'riderClass': 'Heavy',
        'number': 7
    },
    {
        'id': 1,
        'firstName': 'Test',
        'lastName': 'Test',
        'size': 'None',
        'brand': 'None',
        'riderClass': 'None',
        'number': 0
    },
    {
        'id': 2,
        'firstName': 'Dave',
        'lastName': 'Cage',
        'size': 'Medium',
        'brand': 'Jamis',
        'riderClass': 'Light',
        'number': 2
    }
]

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/rmt/riders', methods=['GET'])
def get_riders():
    return jsonify({'riders': riders})

@app.route('/api/rmt/riders/<int:rider_id>', methods=['GET'])
def get_rider(rider_id):
    rider = [rider for rider in riders if rider['id'] == rider_id]
    return jsonify({'rider': rider})

@app.route('/api/rmt/riders/<int:rider_id>', methods=['DELETE'])
def remove_rider(rider_id):
    rider = [rider for rider in riders if rider['id'] == rider_id]
    riders.remove(rider[0])
    return jsonify({'result': True})

@app.route('/api/rmt/riders', methods=['POST'])
def post_rider():
    content = request.get_json(force=True)
    rider = {
        'id': len(riders) + 1,
        'firstName': content['firstName'],
        'lastName': content['lastName'],
        'size': content['size'],
        'brand': content['brand'],
        'riderClass': content['riderClass'],
        'number': content['number']
    }
    riders.append(rider)
    return jsonify({'rider': rider}), 201

@app.route('/api/rmt/riders/<int:rider_id>', methods=['PUT'])
def update_rider(rider_id):
    content = request.get_json(force=True)
    rider = [rider for rider in riders if rider['id'] == rider_id]
    rider[0]['firstName'] = content['firstName']
    rider[0]['lastName'] = content['lastName']
    rider[0]['size'] = content['size']
    rider[0]['brand'] = content['brand']
    rider[0]['riderClass'] = content['riderClass']
    rider[0]['number'] = content['number']
    return jsonify({'rider': rider[0]})

if __name__ == '__main__':
    app.run(debug=True)