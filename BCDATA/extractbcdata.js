const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const readlineSync = require('readline-sync');
const path = require('path');

let interrupt = false;

// Ensure the Units folder exists
const unitsFolder = path.join(__dirname, 'Units');
if (!fs.existsSync(unitsFolder)) {
    fs.mkdirSync(unitsFolder);
}

const colorMapping = {
    '#ffa0a0': 'red',
    '#a0ffa0': 'green',
    '#ffa0ff': 'purple',
    '#a0a0ff': 'blue',
    '#ffffa0': 'yellow',
    '#80C080': 'ancient',
    '#E0B000': 'gold',
    '#c0c0c0': 'Epic'
};

async function fetchData(unitNumber) {
    const url = `https://battlecats-db.com/unit/${unitNumber}.html`;
    try {
        const { data } = await axios.get(url, { timeout: 5000 }); // Add timeout to handle slow responses
        const $ = cheerio.load(data);
        let targetElement;
        let result = [];
        let FoundTitle = false;
        let isCatfruit = true; // Flag to differentiate between Catfruit and Catfruit Seed

        // Find the element containing the text "開放条件" and "No."
        $('td').each((i, element) => {
            if ($(element).text().includes("開放条件")) {
                targetElement = element;
            }
            if ($(element).text().includes("No.") && !FoundTitle) {
                FoundTitle = true;
                result.push($(element).text().trim());
            }
        });

        if (!targetElement) throw new Error('Element containing "開放条件" not found');

        let parentElement = $(targetElement).parent();
        let children = Array.from(parentElement.children());
        let index = children.indexOf(targetElement);
        let nextClassElement = children[index + 1];

        if (!$(nextClassElement).hasClass("kai")) throw new Error('Next class element with "kai" class not found');

        $(nextClassElement).contents().each((i, content) => {
            if (content.nodeType === 3 && content.nodeValue.includes("種")) {
                isCatfruit = false; // Switch to Catfruit Seed
            } else if (content.name === 'font') {
                let colorHex = $(content).attr("color");
                let color = colorMapping[colorHex] || colorHex;
                let text = $(content).text().trim().match(/\d+/);
                if (text) {
                    result.push({ type: isCatfruit ? 'Catfruit' : 'Catfruit Seed', text: text[0], color });
                }
            }
        });

        return { number: result[0], data: result.slice(1) };
    } catch (error) {
        console.error(`Error fetching data for unit ${unitNumber}:`, error.message);
        return null;
    }
}

async function fetchSpecificUnit() {
    let unitNumber = readlineSync.question('Enter the unit number (e.g., 001, 002, ... 778): ');
    unitNumber = unitNumber.padStart(3, '0'); // Ensure unit number is 3 digits
    let data = await fetchData(unitNumber);
    if (data) {
        console.log(`Extracted data for unit ${unitNumber}:`, data);
        fs.writeFileSync(path.join(unitsFolder, `${unitNumber}_data.json`), JSON.stringify(data, null, 2));
        console.log(`Data for unit ${unitNumber} saved to ${unitsFolder}/${unitNumber}_data.json`);
    }
}

async function fetchAllUnits() {
    for (let i = 0; i <= 778; i++) {
        let unitNumber = i.toString().padStart(3, '0');
        console.log(`Fetching data for unit ${unitNumber}...`);
        let data = await fetchData(unitNumber);
        if (data) {
            console.log(`Extracted data for unit ${unitNumber}:`, data);
            fs.writeFileSync(path.join(unitsFolder, `${unitNumber}_data.json`), JSON.stringify(data, null, 2));
            console.log(`Data for unit ${unitNumber} saved to ${unitsFolder}/${unitNumber}_data.json`);
        } else {
            console.log(`Failed to extract data for unit ${unitNumber}`);
        }
        await new Promise(r => setTimeout(r, 200)); // Delay between requests
    }
    console.log("Data extraction completed!");
}

// Choose mode
const mode = readlineSync.question('Do you want to fetch data for a specific unit (s) or all units (a)? ');

if (mode.toLowerCase() === 's') {
    fetchSpecificUnit();
} else if (mode.toLowerCase() === 'a') {
    fetchAllUnits();
} else {
    console.log('Invalid choice. Exiting.');
}
