const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const path = require('path');

const basePageUrl = 'https://battlecats.miraheze.org/wiki/File:Uni';
const outputFile = './units.csv'; // Single CSV file for all links

async function fetchImageLink(unit) {
  const pageUrl = `${basePageUrl}${unit}_f00.png`;
  console.log(`Fetching page: ${pageUrl}`);

  try {
    const response = await axios.get(pageUrl);
    const $ = cheerio.load(response.data);

    // Find the image element using its id
    const imageElement = $('#file img');

    // Check if image element exists
    if (!imageElement.length) {
      console.log(`Image not found on page ${pageUrl}. Skipping...`);
      return null;
    }

    // Extract the href attribute directly from the image element
    const imageUrl = imageElement.attr('src');

    if (!imageUrl) {
      console.log(`Image URL not found on page ${pageUrl}. Skipping...`);
      return null;
    }

    // Extract the base URL by splitting on ".png" and taking the first part
    const fullImageUrl = imageUrl.split('.png')[0] + '.png';

    console.log(`Found image URL: ${fullImageUrl}`);
    return fullImageUrl;
  } catch (error) {
    console.log(`Could not fetch image URL from ${pageUrl}: ${error.message}`);
    return null;
  }
}
// Rest of the code remains the same (fetchImageLinks, saveLinksToCSV, main)

async function fetchImageLinks(startUnit, endUnit) {
  const allLinks = [];
  for (let unit = startUnit; unit <= endUnit; unit++) {
    const unitStr = unit.toString().padStart(3, '0');
    console.log(`Processing unit ${unitStr}...`);

    const link = await fetchImageLink(unitStr);
    if (link) {
      allLinks.push(link);
    }
  }

  await saveLinksToCSV(allLinks);
}

async function saveLinksToCSV(links) {
  const csvContent = links.join('\n');
  const outputFilePath = path.join(__dirname, outputFile); // Ensure absolute path

  fs.writeFileSync(outputFilePath, csvContent); // No header row needed

  console.log(`All image links saved to ${outputFilePath}`);
}

async function main() {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  readline.question('What do you want to do? (a to fetch all links or s to fetch a single unit\'s link): ', async (answer) => {
    if (answer.toLowerCase() === 'a') {
      const startUnit = 0;
      const endUnit = 777;
      console.log('Fetching image links...');
      await fetchImageLinks(startUnit, endUnit);
      console.log('All done!');
      readline.close();
    } else if (answer.toLowerCase() === 's') {
      readline.question('Enter the unit number: ', async (unit) => {
        await fetchImageLink(unit);
        readline.close();
      });
    } else {
      console.error('Invalid choice. Please enter "a" or "s".');
      readline.close();
    }
  });
}

main();