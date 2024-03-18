"""
File: app.py

Brief:
    This is a simple Python flask application for responding to Codle
    backend requests.
"""

import argparse
import csv
import json
import os
import sys
from datetime import datetime

from flask import Flask, request, jsonify
from flask_cors import CORS
from waitress import serve

app = Flask(__name__)
CORS(app)

PROBLEM_CSV_FILE = 'codle_problems.csv'

def get_todays_problem() -> dict:
    """
    Brief:
        This function returns the row from the CSV data containing the problem
        based on today's date.

    Returns: dict
        A dict of 3 str fields indicating:
            - problem language
            - problem code
            - problem answer
    """
    # Get today's date.
    today = datetime.now().date()
    
    # Check if today's problem has already been generated.
    cache_dir = os.path.expanduser('~')
    cache_file = os.path.expanduser(f"~/{today}.json")
    if os.path.exists(cache_file):
        # Read problem and return data.
        try:
            with open(cache_file, 'r') as f:
                data = json.load(f)
            return data
        except OSError:
            # Cache failed, try to regen below.
            pass
    
    fixed_date = datetime(2020, 1, 1).date()
    diff = (today - fixed_date).days

    # Read the CSV file.
    try:
        with open(PROBLEM_CSV_FILE, 'r') as f:
            reader = csv.DictReader(f)
            rows = [row for row in reader]
    except OSError:
        return None

    # Use the hash value to pick a row.
    day_idx = diff % len(rows)
    todays_row = rows[day_idx]
    
    # Delete all other cache files for other dates.
    for file in os.listdir(cache_dir):
        if file.endswith(".json") and file != f"{today}.json":
            try:
                os.remove(os.path.join(cache_dir, file))
            except OSError:
                continue

    # Write cache.
    try:
        with open(cache_file, 'w') as f:
            json.dump(todays_row, f)
    except OSError:
        pass

    # Extract values.
    return todays_row

@app.route('/', methods=('POST', ))
def handle_post_request():
    if request.method == 'POST':
        # Get response data.
        response_data = get_todays_problem()
        if response_data is not None:
            return jsonify(response_data), 200

    err_data = {
        'error': 'Invalid request',
    }
    return jsonify(err_data), 400

if __name__=='__main__':
    parser = argparse.ArgumentParser(
        description='The Codle Backend'
    )

    parser.add_argument(
        '--debug',
        action='store_true',
        help='Run without a WSGI server',
    )
    parser.add_argument(
        '--no-serve',
        action='store_true',
        help='Dont serve the application, just give todays problem data',
    )

    args = parser.parse_args()

    if args.no_serve:
        data = get_todays_problem()
        print(data)
        sys.exit(1)

    if args.debug:
        app.run(debug=True)
    else:
        serve(app, host='0.0.0.0', port=5000)
