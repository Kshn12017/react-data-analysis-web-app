from flask import Flask, request, jsonify, send_file
from flask_restful import Api, Resource
from flask_cors import CORS
import os
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

app = Flask(__name__)
api = Api(app)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

class FileUpload(Resource):
    def post(self):
        if 'file' not in request.files:
            return jsonify({"error": "No file part"})
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"})
        if file:
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
            file.save(filepath)
            return jsonify({"message": f"File {file.filename} uploaded successfully", "file_path": filepath})

class DataCleaning(Resource):
    def post(self):
        data = request.get_json()
        filepath = data.get('file_path')
        operation = data.get('operation')
        column = data.get('column')

        if not filepath or not os.path.exists(filepath):
            return jsonify({"error": "File not found"})

        df = pd.read_csv(filepath)

        if operation == 'dropna':
            df = df.dropna(subset=[column])
        elif operation == 'fillna':
            fill_value = data.get('fill_value', 0)
            df[column] = df[column].fillna(fill_value)
        elif operation == 'filter':
            condition = data.get('condition')
            if condition:
                df = df.query(condition)

        cleaned_filepath = os.path.join(app.config['UPLOAD_FOLDER'], 'cleaned_' + os.path.basename(filepath))
        df.to_csv(cleaned_filepath, index=False)

        return jsonify({"message": "Data cleaned successfully", "cleaned_file_path": cleaned_filepath})

class DataVisualization(Resource):
    def post(self):
        data = request.get_json()
        filepath = data.get('file_path')
        chart_type = data.get('chart_type')
        x_column = data.get('x_column')
        y_column = data.get('y_column')

        if not filepath or not os.path.exists(filepath):
            return jsonify({"error": "File not found"})

        df = pd.read_csv(filepath)

        plt.figure(figsize=(10, 6))

        if chart_type == 'bar':
            sns.barplot(data=df, x=x_column, y=y_column)
        elif chart_type == 'line':
            sns.lineplot(data=df, x=x_column, y=y_column)
        elif chart_type == 'scatter':
            sns.scatterplot(data=df, x=x_column, y=y_column)
        elif chart_type == 'histogram':
            sns.histplot(df[x_column], bins=20)
        else:
            return jsonify({"error": "Unsupported chart type"})

        # Save the plot
        plot_filepath = os.path.join(app.config['UPLOAD_FOLDER'], 'plot.png')
        plt.savefig(plot_filepath)
        plt.close()

        return send_file(plot_filepath, mimetype='image/png')

api.add_resource(FileUpload, '/upload')
api.add_resource(DataCleaning, '/clean')
api.add_resource(DataVisualization, '/visualize')

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the Data Analysis App!"})

@app.route('/columns', methods=['POST'])
def get_columns():
    data = request.get_json()
    filepath = data.get('file_path')  # Expecting a single file path

    if not filepath or not os.path.exists(filepath):
        return jsonify({"error": "File not found"}), 404

    df = pd.read_csv(filepath)
    columns = df.columns.tolist()

    return jsonify({"columns": columns})


if __name__ == '__main__':
    app.run(debug=True)
