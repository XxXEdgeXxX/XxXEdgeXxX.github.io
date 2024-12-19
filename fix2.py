import csv
import re

# Function to read the CSV file and create a mapping of names to indices
def create_mapping(csv_file):
    mapping = {}
    with open(csv_file, 'r', encoding='utf-8') as file:
        reader = csv.reader(file)
        header = next(reader)  # Skip header
        for index, row in enumerate(reader):
            if len(row) > 1:  # Ensure the row has enough columns
                name = row[1].strip()
                mapping[name] = index
    return mapping

# Function to update the SetNumber values in the HTML based on the mapping
def update_set_numbers(html_content, mapping):
    def replace_set_number(match):
        name = match.group(2).strip()
        number = mapping.get(name, match.group(1))  # Use the mapped index or the original SetNumber if not found
        return f'<a onclick="SetNumber({number});" title="{name}"><img {match.group(3)}'

    updated_html = re.sub(r'<a onclick="SetNumber\((\d+)\);" title="([^"]+)"><img (.+?)>', replace_set_number, html_content)
    return updated_html

# Read HTML content from a file
def read_html_file(html_file):
    with open(html_file, 'r') as file:
        return file.read()

# Write updated HTML content to a file
def write_html_file(html_file, content):
    with open(html_file, 'w') as file:
        file.write(content)

# Path to your CSV and HTML files
csv_file = 'BCDATA/UPDATEDUNITDATA.csv'
html_file = 'normal_special_rare_superrare_legend.html'
output_html_file = 'path_to_your_output_html_file.html'

# Read the HTML content from the file
html_content = read_html_file(html_file)

# Create the mapping and update the HTML
name_to_index_mapping = create_mapping(csv_file)
updated_html_content = update_set_numbers(html_content, name_to_index_mapping)

# Write the updated HTML content back to a file
write_html_file(output_html_file, updated_html_content)

print("HTML content updated successfully!")
