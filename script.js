document.addEventListener('DOMContentLoaded', () => {
    var Version = "1.0.4";

    const formSelect = document.getElementById('formSelect');
    const nameSelect = document.getElementById('nameSelect');
    const dataDisplay = document.getElementById('dataDisplay');
    const tabList = document.getElementById('tabList');
    const imageDisplay = document.getElementById('imageDisplay');
    const selectedList = document.getElementById('selectedList');
    const dataSummary = document.getElementById('dataSummary');
    console.log("Current version: " + Version);

    const clearListButton = document.createElement('button');
    clearListButton.textContent = 'Clear List';
    clearListButton.addEventListener('click', clearSelectedList);
    dataSummary.parentNode.insertBefore(clearListButton, dataSummary.nextSibling); // Insert before dataSummary

    function clearSelectedList() {
        selectedItems.length = 0; // Clear the array
        selectedList.innerHTML = ''; // Clear the list display
        updateDataSummary(); // Update the summary
    }

    const data = []; // Initialize an empty array to store CSV data
    const selectedItems = []; // Array to store selected items

    const items = [
        { color: "Rarity",                index: 4,  category: undefined },
        { color: "Acquired by",           index: 5,  category: undefined },
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


    fetch('BCDATA/UPDATEDUNITDATA.csv')
        .then(response => response.text())
        .then(text => {
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

    function updateNameOptions() {
        const formType = formSelect.value;
        nameSelect.innerHTML = ''; // Clear existing options

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
    
        const renderItem = (item, dataValue, imagePath) => {
            const text = `${item.color} ${item.category ? item.category : ""}: ${dataValue}`;
            const p = document.createElement('p');
            p.textContent = text;
    
            if (item.category) {
                const img = document.createElement('img');
                img.src = imagePath;
                p.appendChild(img);
            }
    
            return p;
        };
    
        items.forEach(item => {
            const dataValue = rowData[item.index];
            if (dataValue) {
                const imagePath = `BCDATA/materials/${item.category}/${item.color}.png`;
                dataDisplay.appendChild(renderItem(item, dataValue, imagePath));
            }
        });
    
        // Create foldout menu for empty data items
        const detailsElement = document.createElement('details');
        const summaryElement = document.createElement('summary');
        summaryElement.textContent = 'See less relevant data';
        detailsElement.appendChild(summaryElement);
    
        items.forEach(item => {
            const dataValue = rowData[item.index];
            if (!dataValue) {
                const imagePath = `BCDATA/materials/${item.category}/No_${item.color}.png`;
                detailsElement.appendChild(renderItem(item, dataValue, imagePath));
            }
        });
    
        dataDisplay.appendChild(detailsElement);
    
        // Add button to add current selection to the list
        const addButton = document.createElement('button');
        addButton.textContent = 'Add to List';
        addButton.addEventListener('click', () => addToSelectedList(selectedIndex));
        dataDisplay.appendChild(addButton);
    }
    

    function addToSelectedList(index) {
        const item = data[index];
        selectedItems.push(item);

        const li = document.createElement('li');
        li.textContent = item[3]; // Display the name or identifier of the item

        // Add click event listener to the list item
        li.addEventListener('click', () => {
            // Find the index of the clicked item in the original data array
            const clickedIndex = data.indexOf(item);
            if (clickedIndex !== -1) {
                nameSelect.value = clickedIndex; // Set the nameSelect dropdown
                displayData(); // Display the data for the clicked item
                loadUnitImages(clickedIndex); //Load the images for the clicked item
            }
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent the list item click event from firing
            selectedItems.splice(selectedItems.indexOf(item), 1);
            selectedList.removeChild(li);
            updateDataSummary();
        });
        li.appendChild(removeButton);
        selectedList.appendChild(li);

        updateDataSummary();
    }

    function updateDataSummary() {
        dataSummary.innerHTML = ''; // Clear existing summary
    
        const summary = {};
        selectedItems.forEach(item => {
            items.forEach(itemData => {
                const dataValue = item[itemData.index];
                if (dataValue && !isNaN(parseInt(dataValue))) {
                    const summaryKey = `${itemData.color} (${itemData.category || 'Other'})`; // Key includes category
                    if (!summary[summaryKey]) {
                        summary[summaryKey] = 0;
                    }
                    summary[summaryKey] += parseInt(dataValue);
                }
            });
        });
    
        for (const [key, value] of Object.entries(summary)) {
            const p = document.createElement('p');
            p.textContent = `${key}: ${value}`;
    
            // Add image to the summary
            const parts = key.match(/(.*) \((.*)\)/); // Extract color and category
            if (parts) {
              const color = parts[1];
              const category = parts[2];
              let imgSrc;
              if (category === 'Other') {
                  imgSrc = `BCDATA/materials/No_${color}.png`
              } else {
                  imgSrc = `BCDATA/materials/${category}/${color}.png`;
              }
                const img = document.createElement('img');
                img.src = imgSrc;
                img.style.width = "20px"; //added styling to the image to not be too large
                img.style.height = "20px";
                img.style.marginLeft = "5px";
                p.appendChild(img);
            }
            dataSummary.appendChild(p);
        }
    }
        
        function displayImage(link) {
            imageDisplay.innerHTML = `<img src="${link}" alt="Unit Image">`;
        }
    });

