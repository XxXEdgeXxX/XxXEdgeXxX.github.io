document.addEventListener('DOMContentLoaded', () => {
    var Version = "1.0.3";


    const formSelect = document.getElementById('formSelect');
    const nameSelect = document.getElementById('nameSelect');
    const dataDisplay = document.getElementById('dataDisplay');
    const tabList = document.getElementById('tabList');
    const imageDisplay = document.getElementById('imageDisplay');
    console.log("Current version: " + Version);

    const data = []; // Initialize an empty array to store CSV data

    // Load the CSV data (replace 'data.csv' with your CSV file path)
    fetch('BCDATA/UPDATEDUNITDATA.csv')
        .then(response => response.text())
        .then(text => {
            // Parse the CSV data
            const rows = text.split('\n');
            for (let row of rows) {
                data.push(row.split(','));
            }
            updateNameOptions(); // Initialize the name dropdown
        });

    formSelect.addEventListener('change', updateNameOptions);
    nameSelect.addEventListener('change', () => {
        displayData();
        loadUnitImages(nameSelect.value);
    });

    function updateNameOptions() {
        const formType = formSelect.value;
        nameSelect.innerHTML = ''; // Clear existing options

        // Populate name options based on form type, skipping the first two rows
        for (let row of data.slice(2)) {
            let optionText = '';
            let optionValue = data.indexOf(row);
            if (formType === 'number') {
                optionText = row[0]; // Use the Number field
            } else {
                const formIndex = formType === 'normal' ? 1 : formType === 'evolved' ? 2 : 3;
                optionText = row[formIndex]; // Use the form name field
            }
            if (optionText) {
                const option = document.createElement('option');
                option.value = optionValue; // Use the actual index of the row
                option.textContent = optionText;
                nameSelect.appendChild(option);
            }
        }
        displayData(); // Update displayed data
    }


    function displayData() {
        const selectedIndex = nameSelect.value;
        const rowData = data[selectedIndex];
    
        dataDisplay.innerHTML = ''; // Clear existing data display
    
        const items = [
            { color: "Rarity",       index: 4,  category: undefined },
            { color: "Acquired by",  index: 5,  category: undefined },
            { color: "Red",          index: 6,  category: "catfruit" },
            { color: "Purple",       index: 7,  category: "catfruit" },
            { color: "Blue",         index: 8,  category: "catfruit" },
            { color: "Green",        index: 9,  category: "catfruit" },
            { color: "Yellow",       index: 10, category: "catfruit" },
            { color: "Ancient",      index: 11, category: "catfruit" },
            { color: "Gold",         index: 12, category: "catfruit" },
            { color: "Aku",          index: 13, category: "catfruit" },
            { color: "Epic",         index: 14, category: "catfruit" },
            { color: "Red",          index: 15, category: "seeds" },
            { color: "Green",        index: 16, category: "seeds" },
            { color: "Purple",       index: 17, category: "seeds" },
            { color: "Blue",         index: 18, category: "seeds" },
            { color: "Yellow",       index: 19, category: "seeds" },
            { color: "Ancient",      index: 20, category: "seeds" },
            { color: "Gold",         index: 21, category: "seeds" },
            { color: "Aku",          index: 22, category: "seeds" },
            { color: "Epic",         index: 23, category: "seeds" },
            { color: "Purple",       index: 24, category: "stones" },
            { color: "Red",          index: 25, category: "stones" },
            { color: "Blue",         index: 26, category: "stones" },
            { color: "Green",        index: 27, category: "stones" },
            { color: "Yellow",       index: 28, category: "stones" },
            { color: "Epic",         index: 29, category: "stones" },
            { color: "Purple",       index: 30, category: "gems" },
            { color: "Blue",         index: 31, category: "gems" },
            { color: "Red",          index: 32, category: "gems" },
            { color: "Green",        index: 33, category: "gems" },
            { color: "Yellow",       index: 34, category: "gems" },
        ];
    
        items.forEach(item => {
            const dataValue = rowData[item.index];
            if (dataValue !== "") {
                const text = `${item.color} ${item.category ? item.category : ""}: ${dataValue}`;
                
                const p = document.createElement('p');
                p.textContent = text;
                if (item.category !== undefined) {
                    const imgSrc = `BCDATA/materials/${item.category}/${item.color}.png`;
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    p.appendChild(img);
                }
                dataDisplay.appendChild(p);
            }
        });
    
        // Create foldout menu for empty data items
        const detailsElement = document.createElement('details');
        const summaryElement = document.createElement('summary');
        summaryElement.textContent = 'See less relevant data';
        detailsElement.appendChild(summaryElement);
    
        items.forEach(item => {
            const dataValue = rowData[item.index];
            if (dataValue === "") {
                const text = `${item.color} ${item.category ? item.category : ""}: ${dataValue}`;
                
                const p = document.createElement('p');
                p.textContent = text;
                if (item.category !== undefined) {
                    const imgSrc = `BCDATA/materials/${item.category}/No_${item.color}.png`;
                    const img = document.createElement('img');
                    img.src = imgSrc;
                    p.appendChild(img);
                }
                detailsElement.appendChild(p);
            }
        });
    
        dataDisplay.appendChild(detailsElement);
    }
    
    
    
    

    function loadUnitImages(unitIndex) {
        const jsonPath = 'BCDATA/unit_images.json';
        console.log(`Fetching JSON from: ${jsonPath}`);
        
        fetch(jsonPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(imageData => {
                const unitImages = imageData[unitIndex - 2]; // Adjust index as needed
                
                console.log('Image data loaded:', unitImages);

                tabList.innerHTML = ''; // Clear existing tabs
                imageDisplay.innerHTML = ''; // Clear existing image display

                // Create tabs and load images
                unitImages.forEach(({ Form, Link }) => {
                    if (Link) { // Only create tabs for available forms
                        const tab = document.createElement('li');
                        tab.textContent = `Form ${Form}`;
                        tab.addEventListener('click', () => displayImage(Link));
                        tabList.appendChild(tab);
                    }
                });

                // Display the first image by default
                if (unitImages[0] && unitImages[0].Link) {
                    displayImage(unitImages[0].Link);
                }
            })
            .catch(error => {
                console.error('Error loading JSON:', error);
            });
    }

    function displayImage(link) {
        imageDisplay.innerHTML = `<img src="${link}" alt="Unit Image">`;
    }

    
});
