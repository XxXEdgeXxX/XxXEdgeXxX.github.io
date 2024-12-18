import os
import csv
import json

def combine_csv_to_json(directory, output_file):
    combined_data = []

    for filename in os.listdir(directory):
        if filename.endswith(".csv"):
            file_path = os.path.join(directory, filename)
            with open(file_path, mode='r') as csvfile:
                csv_reader = csv.DictReader(csvfile)
                data = [row for row in csv_reader]
                combined_data.append(data)

    with open(output_file, mode='w') as jsonfile:
        json.dump(combined_data, jsonfile, indent=4)

# Set your directory path and output file name
csv_directory = 'units'
output_json_file = 'combined_data.json'

combine_csv_to_json(csv_directory, output_json_file)
