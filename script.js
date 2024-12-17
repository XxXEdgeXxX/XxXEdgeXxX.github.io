document.addEventListener('DOMContentLoaded', () => {
    const formSelect = document.getElementById('formSelect');
    const nameSelect = document.getElementById('nameSelect');
    const dataDisplay = document.getElementById('dataDisplay');

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
    nameSelect.addEventListener('change', displayData);

    function updateNameOptions() {
        const formType = formSelect.value;
        nameSelect.innerHTML = ''; // Clear existing options

        // Populate name options based on form type, skipping the first two rows
        for (let row of data.slice(2)) {
            const formIndex = formType === 'normal' ? 1 : formType === 'evolved' ? 2 : 3;
            const name = row[formIndex];
            if (name) {
                const option = document.createElement('option');
                option.value = data.indexOf(row); // Use the actual index of the row
                option.textContent = name;
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
});
