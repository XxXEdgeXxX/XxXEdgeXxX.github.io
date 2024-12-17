const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const basePageUrl = 'https://battlecats.miraheze.org/wiki/File:';
const outputDirectory = './units/';

async function fetchImageLink(unit, form) {
    const pageUrl = `${basePageUrl}${unit}_${form}.png`;
    console.log(`Fetching page: ${pageUrl}`);

    try {
        const response = await axios.get(pageUrl);
        const $ = cheerio.load(response.data);
        const imageUrl = $('div.fullImageLink a').attr('href');

        if (!imageUrl) {
            console.log(`Image URL not found on page ${pageUrl}. Skipping...`);
            return null;
        }

        const fullImageUrl = `https:${imageUrl}`;
        console.log(`Found image URL: ${fullImageUrl}`);
        return fullImageUrl;
    } catch (error) {
        console.log(`Could not fetch image URL from ${pageUrl}: ${error.message}`);
        return null;
    }
}

async function fetchImageLinks(startUnit, endUnit) {
    for (let unit = startUnit; unit <= endUnit; unit++) {
        const unitStr = unit.toString().padStart(3, '0');
        console.log(`Processing unit ${unitStr}...`);
        const links = [];
        for (let form = 1; form <= 4; form++) {
            console.log(`  Fetching form ${form}...`);
            const link = await fetchImageLink(unitStr, form);
            if (link) {
                links.push({ form, link });
            }
        }
        await saveLinksToCSV(unitStr, links);
    }
}

async function saveLinksToCSV(unit, links) {
    const csvContent = links.map(({ form, link }) => `${form},${link}`).join('\n');
    const outputFilePath = path.join(outputDirectory, `unit_${unit}.csv`);
    fs.writeFileSync(outputFilePath, `Form,Link\n${csvContent}`);

    console.log(`CSV saved to ${outputFilePath}`);
}

async function main() {
    const startUnit = 0;
    const endUnit = 777;

    if (!fs.existsSync(outputDirectory)) {
        fs.mkdirSync(outputDirectory);
    }

    console.log('Fetching image links...');
    await fetchImageLinks(startUnit, endUnit);
    console.log('All done!');
}

main();
