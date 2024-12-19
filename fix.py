from bs4 import BeautifulSoup

# Read the first HTML file
with open('Selections.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Read the second file into a dictionary for quick lookup
data = {}
with open('BCDATA/UPDATEDUNITDATA.csv', 'r', encoding='utf-8') as f:
    for line in f:
        columns = line.strip().split(',')
        if columns[0].isdigit():
            data[columns[1]] = columns[0]

# Parse the HTML content
soup = BeautifulSoup(html_content, 'html.parser')

# Find all <a> elements
a_elements = soup.find_all('a')

# Iterate through <a> elements and modify their href
for a in a_elements:
    title = a['title']
    if title in data:
        id_value = data[title]
        # Create the new href value
        new_href = f"javascript:document.getElementById('nameSelect').value='{id_value}';"
        a['href'] = new_href

# Save the modified HTML content
with open('file1_modified.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))

print("HTML file updated successfully!")
