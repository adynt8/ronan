document.addEventListener('DOMContentLoaded', async function() {
    const supabaseUrl = 'https://lcayhsjrmjkwxekutiih.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYXloc2pybWprd3hla3V0aWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUzMjQzNjMsImV4cCI6MjA0MDkwMDM2M30.HO8ykfrFvwxjhFt5XuDJ1aMvbbIRpnvYO4n18NqXqLc';
    const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

    try {
        console.log('Fetching data from Supabase...');

        const { data, error } = await supabaseClient
            .from('visitor_data')
            .select('*');

        if (error) {
            throw new Error(`Failed to fetch data: ${error.message}`);
        }

        console.log('Data fetched successfully:', data);

        // Add sorting dropdown
        const sortSelect = document.createElement('select');
        sortSelect.id = 'sortSelect';
        const sortOptions = [
            { value: 'id', text: 'ID' },
            { value: 'erectLength', text: 'Erect Length' },
            { value: 'erectGirth', text: 'Erect Girth' },
            { value: 'flaccidLength', text: 'Flaccid Length' },
            { value: 'flaccidGirth', text: 'Flaccid Girth' }
        ];
        sortOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            sortSelect.appendChild(optionElement);
        });
        document.querySelector('.container').insertBefore(sortSelect, document.getElementById('databaseTable'));

        // Function to update the table
        function updateTable(sortedData) {
            const tableBody = document.getElementById('databaseTable').getElementsByTagName('tbody')[0];
            tableBody.innerHTML = ''; // Clear existing rows

            let totalErectLength = 0, totalErectGirth = 0, totalFlaccidLength = 0, totalFlaccidGirth = 0;
            let count = 0;

            sortedData.forEach((entry, index) => {
                if (entry.erectLength && entry.erectGirth && entry.flaccidLength && entry.flaccidGirth) {
                    const row = tableBody.insertRow();
                    row.insertCell(0).innerText = index + 1;
                    row.insertCell(1).innerText = entry.visitorId;
                    row.insertCell(2).innerText = entry.unit; // Added unit column
                    row.insertCell(3).innerText = entry.erectLength;
                    row.insertCell(4).innerText = entry.erectGirth;
                    row.insertCell(5).innerText = entry.flaccidLength;
                    row.insertCell(6).innerText = entry.flaccidGirth;

                    totalErectLength += entry.erectLength;
                    totalErectGirth += entry.erectGirth;
                    totalFlaccidLength += entry.flaccidLength;
                    totalFlaccidGirth += entry.flaccidGirth;
                    count++;
                }
            });

            // Update averages
            if (count > 0) {
                document.getElementById('avgErectLength').innerText = (totalErectLength / count).toFixed(2);
                document.getElementById('avgErectGirth').innerText = (totalErectGirth / count).toFixed(2);
                document.getElementById('avgFlaccidLength').innerText = (totalFlaccidLength / count).toFixed(2);
                document.getElementById('avgFlaccidGirth').innerText = (totalFlaccidGirth / count).toFixed(2);
            }
        }

        // Initial table update
        updateTable(data);

        // Sort function
        function sortData(data, sortBy) {
            return [...data].sort((a, b) => {
                if (sortBy === 'id') {
                    return a.visitorId.localeCompare(b.visitorId);
                } else {
                    return b[sortBy] - a[sortBy];
                }
            });
        }

        // Add event listener for sorting
        sortSelect.addEventListener('change', function() {
            const sortedData = sortData(data, this.value);
            updateTable(sortedData);
        });

        console.log('Table updated and sorting functionality added.');
    } catch (error) {
        console.error('Error fetching data:', error);
    }
});
