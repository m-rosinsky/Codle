"""
File: app.py

Brief:
    This is a simple Python flask application for responding to Codle
    backend requests.
"""

from flask import Flask, request, jsonify
from waitress import serve

app = Flask(__name__)

def get_response_data():
    resp_data = {
        'message' : 'hi',
    }
    return resp_data

@app.route('/', methods=('POST', ))
def handle_post_request():
    if request.method == 'POST':
        # Get response data.
        response_data = get_response_data()
        return jsonify(response_data), 200
    else:
        err_data = {
            'error': 'Invalid request',
        }
        return jsonify(err_data), 400

if __name__=='__main__':
    serve(app, host='0.0.0.0', port=5000)
