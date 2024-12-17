const fs = require('fs');
const path = require('path');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Load RealNames.json
const realNames = JSON.parse(fs.readFileSync(path.join(__dirname, 'RealNames.json'), 'utf-8'));

// Directory containing the JSON files
const unitsFolder = path.join(__dirname, 'Units');

// CSV Writer setup
const csvWriter = createCsvWriter({
    path: 'units_data_with_names.csv',
    header: [
        { id: 'number', title: 'Number' },
        { id: 'name', title: 'Name' },
        { id: 'rarity', title: 'Rarity' },
        { id: 'catfruit_red', title: 'Red Catfruit' },
        { id: 'catfruit_green', title: 'Green Catfruit' },
        { id: 'catfruit_purple', title: 'Purple Catfruit' },
        { id: 'catfruit_blue', title: 'Blue Catfruit' },
        { id: 'catfruit_yellow', title: 'Yellow Catfruit' },
        { id: 'catfruit_ancient', title: 'Ancient Catfruit' },
        { id: 'catfruit_gold', title: 'Gold Catfruit' },
        { id: 'catfruit_epic', title: 'Epic Catfruit' },
        { id: 'catseed_red', title: 'Red Catfruit Seed' },
        { id: 'catseed_green', title: 'Green Catfruit Seed' },
        { id: 'catseed_purple', title: 'Purple Catfruit Seed' },
        { id: 'catseed_blue', title: 'Blue Catfruit Seed' },
        { id: 'catseed_yellow', title: 'Yellow Catfruit Seed' },
        { id: 'catseed_ancient', title: 'Ancient Catfruit Seed' },
        { id: 'catseed_gold', title: 'Gold Catfruit Seed' },
        { id: 'catseed_epic', title: 'Epic Catfruit Seed' }
    ]
});

// Function to read JSON files and convert to CSV
async function jsonToCsv() {
    try {
        const files = fs.readdirSync(unitsFolder);
        let records = [];

        for (const file of files) {
            if (path.extname(file) === '.json') {
                const filePath = path.join(unitsFolder, file);
                const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

                // Extract ID from the number field and apply offset
                const idMatch = data.number.match(/\d+/);
                let id = idMatch ? parseInt(idMatch[0], 10) - 1 : null; // Apply offset

                // Convert id back to string for matching
                id = id !== null ? id.toString() : null;

                let record = {
                    number: data.number,
                    name: '',
                    rarity: '',
                    catfruit_red: 0,
                    catfruit_green: 0,
                    catfruit_purple: 0,
                    catfruit_blue: 0,
                    catfruit_yellow: 0,
                    catfruit_ancient: 0,
                    catfruit_gold: 0,
                    catfruit_epic: 0,
                    catseed_red: 0,
                    catseed_green: 0,
                    catseed_purple: 0,
                    catseed_blue: 0,
                    catseed_yellow: 0,
                    catseed_ancient: 0,
                    catseed_gold: 0,
                    catseed_epic: 0
                };

                // Populate the name and rarity from RealNames.json
                const unitInfo = realNames.find(unit => unit.id === id);
                if (unitInfo) {
                    record.name = unitInfo.name;
                    record.rarity = unitInfo.rarity;
                }

                data.data.forEach(item => {
                    let key = (item.type === 'Catfruit' ? 'catfruit_' : 'catseed_') + item.color.toLowerCase();
                    record[key] = item.text;
                });

                records.push(record);
            }
        }

        await csvWriter.writeRecords(records);
        console.log('CSV file created successfully!');
    } catch (error) {
        console.error('Error converting JSON to CSV:', error);
    }
}

jsonToCsv();
