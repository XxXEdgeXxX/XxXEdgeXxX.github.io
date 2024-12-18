document.addEventListener('DOMContentLoaded', () => {
    const formSelect = document.getElementById('formSelect');
    const nameSelect = document.getElementById('nameSelect');
    const dataDisplay = document.getElementById('dataDisplay');
    const tabList = document.getElementById('tabList');
    const imageDisplay = document.getElementById('imageDisplay');

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

        // Display data in <p> tags
        for (let i = 4; i < rowData.length; i++) {
            const p = document.createElement('p');
            p.textContent = `${data[0][i]}: ${rowData[i]}`; // Column name: value
            dataDisplay.appendChild(p);
        }
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
