document.addEventListener('DOMContentLoaded', () => {
    var Version = "1.0.7";

    const formSelect = document.getElementById('formSelect');
    const nameSelect = document.getElementById('nameSelect');
    const dataDisplay = document.getElementById('dataDisplay');
    const tabList = document.getElementById('tabList');
    const imageDisplay = document.getElementById('imageDisplay');
    const selectedList = document.getElementById('selectedList');
    const dataSummary = document.getElementById('dataSummary');
    const unitselector = document.getElementById('UnitSelector');
    const SearchBar = document.getElementById('searchInput');
    const SearchResults = document.getElementById('searchResults');
    console.log("Current version: " + Version);

    const clearListButton = document.createElement('button');
    clearListButton.textContent = 'Clear List';
    clearListButton.addEventListener('click', clearSelectedList);
    dataSummary.parentNode.insertBefore(clearListButton, dataSummary.nextSibling);

    function clearSelectedList() {
        selectedItems.length = 0;
        selectedList.innerHTML = '';
        updateDataSummary();
    }



    var coll = document.getElementsByClassName("collapsible");
    for (var i = 0; i < coll.length; i++) {
        coll[i].addEventListener("click", function () {
            this.classList.toggle("active");
            var content = this.nextElementSibling;
            if (content.style.display === "block") {
                content.style.display = "none";
            } else {
                content.style.display = "block";
            }
        });
        coll[i].nextElementSibling.style.display = "none";
    }
    const Unitdata = [];
    const SmallUnitImages = [];
    const selectedItems = [];

    const items = [
        { color: "Rarity", index: 4, category: undefined },
        { color: "Acquired by", index: 5, category: undefined },
        { color: "XP", index: 35, category: "other" },
        { color: "Red", index: 6, category: "catfruit" },
        { color: "Purple", index: 7, category: "catfruit" },
        { color: "Blue", index: 8, category: "catfruit" },
        { color: "Green", index: 9, category: "catfruit" },
        { color: "Yellow", index: 10, category: "catfruit" },
        { color: "Ancient", index: 11, category: "catfruit" },
        { color: "Gold", index: 12, category: "catfruit" },
        { color: "Aku", index: 13, category: "catfruit" },
        { color: "Epic", index: 14, category: "catfruit" },
        { color: "Red", index: 15, category: "seeds" },
        { color: "Green", index: 16, category: "seeds" },
        { color: "Purple", index: 17, category: "seeds" },
        { color: "Blue", index: 18, category: "seeds" },
        { color: "Yellow", index: 19, category: "seeds" },
        { color: "Ancient", index: 20, category: "seeds" },
        { color: "Gold", index: 21, category: "seeds" },
        { color: "Aku", index: 22, category: "seeds" },
        { color: "Epic", index: 23, category: "seeds" },
        { color: "Purple", index: 24, category: "stones" },
        { color: "Red", index: 25, category: "stones" },
        { color: "Blue", index: 26, category: "stones" },
        { color: "Green", index: 27, category: "stones" },
        { color: "Yellow", index: 28, category: "stones" },
        { color: "Epic", index: 29, category: "stones" },
        { color: "Purple", index: 30, category: "gems" },
        { color: "Blue", index: 31, category: "gems" },
        { color: "Red", index: 32, category: "gems" },
        { color: "Green", index: 33, category: "gems" },
        { color: "Yellow", index: 34, category: "gems" },

    ];


    fetch('BCDATA/UPDATEDUNITDATA.csv')
        .then(response => response.text())
        .then(text => {
            const rows = text.split('\n');
            for (let row of rows) {
                Unitdata.push(row.split(','));
            }
            updateNameOptions();
        });

    function loadUnitSelectionImages() {
        fetch('BCDATA/mini_units.csv')
            .then(response => response.text())
            .then(text => {
                const rows = text.split('\n');
                const imageLinks = rows.filter(row => !row.startsWith('SUMMON'))
                    .map(row => row.split(',')[0]);


                const unitOptions = unitselector.querySelectorAll('option');
                unitOptions.forEach((option, index) => {
                    if (imageLinks[index]) {
                        option.style.backgroundImage = `url(${imageLinks[index]})`;
                        option.style.backgroundSize = 'cover';
                        option.style.backgroundPosition = 'center';
                    } else {

                        option.style.backgroundImage = 'none';
                    }
                });
            })
            .catch(error => {
                console.error('Error loading mini_units.csv:', error);
            });
    }
    loadUnitSelectionImages();
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

                tabList.innerHTML = '';
                imageDisplay.innerHTML = '';


                unitImages.forEach(({ Form, Link }) => {
                    if (Link) {
                        const tab = document.createElement('li');
                        tab.textContent = `Form ${Form}`;
                        tab.addEventListener('click', () => displayImage(Link));
                        tabList.appendChild(tab);
                    }
                });


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
        nameSelect.innerHTML = '';

        for (let row of Unitdata.slice(2)) {
            let optionText = '';
            let optionValue = Unitdata.indexOf(row);
            if (formType === 'number') {
                optionText = row[0];
            } else {
                const formIndex = formType === 'normal' ? 1 : formType === 'evolved' ? 2 : 3;
                optionText = row[formIndex];
            }
            if (optionText) {
                const option = document.createElement('option');
                option.value = optionValue;
                option.textContent = optionText;
                nameSelect.appendChild(option);
            }
        }
        displayData();
    }

    function displayData() {
        const selectedIndex = nameSelect.value;
        const rowData = Unitdata[selectedIndex];
        dataDisplay.innerHTML = '';

        const renderItem = (item, dataValue, imagePath) => {
            const text = `${item.color} ${item.category != undefined && item.category != "other" ? item.category : ""}: ${dataValue}`;
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


        const addButton = document.createElement('button');
        addButton.textContent = 'Add to List';
        addButton.addEventListener('click', () => addToSelectedList(selectedIndex));
        dataDisplay.appendChild(addButton);
    }


    function addToSelectedList(index) {
        const item = Unitdata[index];
        selectedItems.push(item);

        const li = document.createElement('li');
        li.textContent = item[3];


        li.addEventListener('click', () => {

            const clickedIndex = Unitdata.indexOf(item);
            if (clickedIndex !== -1) {
                nameSelect.value = clickedIndex;
                displayData();
                loadUnitImages(clickedIndex);
            }
        });

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            selectedItems.splice(selectedItems.indexOf(item), 1);
            selectedList.removeChild(li);
            updateDataSummary();
        });
        li.appendChild(removeButton);
        selectedList.appendChild(li);

        updateDataSummary();
    }

    function updateDataSummary() {
        dataSummary.innerHTML = '';

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


            const parts = key.match(/(.*) \((.*)\)/);
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
                img.style.width = "20px";
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

    function Search() {
        let input = SearchBar.value;
        console.log(SearchBar.value);
        if (input == "" || input == null
        ) {
            SearchResults.innerHTML = '';
            return;
        }
        input = input.toLowerCase();
        const results = Unitdata.filter(row => 
            row.slice(0, 4).some(cell => cell.toLowerCase().includes(input))
        );

        const uniqueResults = [];
        results.forEach(result => {
            const existing = uniqueResults.find(uniqueResult => uniqueResult[0] === result[0]);
            if (!existing) {
                uniqueResults.push(result);
            }
        });

        const resultList = document.createElement('ul');
        uniqueResults.forEach(result => {
            const li = document.createElement('li');
            li.textContent = result.slice(0, 4).join(', ');
            resultList.appendChild(li);
        });

        SearchResults.innerHTML = '';
        SearchResults.appendChild(resultList);
    }
    function SetNumber(number) {
        nameSelect.value = number + 1;
        const event = new Event('change');
        nameSelect.dispatchEvent(event);
    }
});