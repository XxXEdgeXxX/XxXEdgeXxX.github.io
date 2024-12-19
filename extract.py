import sys
from bs4 import BeautifulSoup

def extract_a_tags(html_content):
    soup = BeautifulSoup(html_content, 'html.parser')
    a_tags = soup.find_all('a')

    # Create a new div with a button at the top
    new_div = soup.new_tag('div')

    # Add the button
    button = soup.new_tag('button', **{'class': 'collapsible'})
    button.string = 'Button'
    new_div.append(button)

    # Add the a tags, each on a new line
    for tag in a_tags:
        new_div.append("\n")
        new_div.append(tag)
        new_div.append("\n")
    
    # Return the string representation of the new div
    return new_div.prettify()

def process_file(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as file:
        content = file.read()
    
    segments = content.split('\n\n')
    processed_segments = [extract_a_tags(segment) for segment in segments if segment.strip()]
    
    with open(output_file, 'w', encoding='utf-8') as file:
        for segment in processed_segments:
            file.write(segment + '\n\n')

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: python script.py <input_file> <output_file>")
        sys.exit(1)

    input_file = sys.argv[1]
    output_file = sys.argv[2]
    process_file(input_file, output_file)
