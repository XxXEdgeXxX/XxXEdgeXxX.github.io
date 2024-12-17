import csv

def convert_csv_to_wikitable(csv_file_path, caption, output_file_path):
    with open(csv_file_path, mode='r', newline='') as file:
        reader = csv.reader(file)
        rows = list(reader)

    headers = rows[0]
    data_rows = rows[1:]

    wikitable = '{| class="wikitable"\n|+ ' + caption + '\n|-\n'
    wikitable += '!! ' + ' !! '.join(headers) + '\n|-\n'

    for row in data_rows:
        wikitable += '| ' + ' || '.join(row) + '\n|-\n'
    
    wikitable += '|}'

    with open(output_file_path, mode='w') as output_file:
        output_file.write(wikitable)

csv_file_path = 'unitdata.csv'
caption = 'Cat Evolutions'
output_file_path = 'outputfile.txt'
convert_csv_to_wikitable(csv_file_path, caption, output_file_path)
print(f"The wikitable has been saved to {output_file_path}")
