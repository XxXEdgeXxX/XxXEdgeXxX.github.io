import csv
from bs4 import BeautifulSoup

# Load the CSV data
def load_csv(file_path):
    with open(file_path, mode='r', newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        return [row for row in reader]

# Load and parse the HTML
def load_html(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return BeautifulSoup(file, 'html.parser')

# Save the modified HTML
def save_html(soup, file_path):
    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(str(soup))

# Modify the HTML based on CSV data
def modify_html(soup, csv_data):
    for a_tag in soup.find_all('a'):
        title = a_tag.get('title')
        # Find the corresponding row in CSV data
        for i, row in enumerate(csv_data):
            if row['Normal Form'] == title:
                a_tag['onclick'] = f"SetNumber({i});"
                a_tag['title'] = row['Evolved Form']  # Example: change title to evolved form
                a_tag.img['alt'] = row['Evolved Form']
                a_tag.img['width'] = "64"  # Example: change image width
                a_tag.img['height'] = "64"  # Example: change image height
                break

# Main function
def main(csv_file, html_file):
    csv_data = load_csv(csv_file)
    soup = load_html(html_file)
    modify_html(soup, csv_data)
    save_html(soup, html_file)

# Run the main function
if __name__ == "__main__":
    main('BCDATA/UPDATEDUNITDATA.csv', 'normal_special_rare_superrare_legend.html')
