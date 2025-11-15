document.addEventListener('DOMContentLoaded', async () => {
    const { createClient } = window.supabase; // Ensure supabase is accessed from the window object
    const supabaseUrl = 'https://lcayhsjrmjkwxekutiih.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYXloc2pybWprd3hla3V0aWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUzMjQzNjMsImV4cCI6MjA0MDkwMDM2M30.HO8ykfrFvwxjhFt5XuDJ1aMvbbIRpnvYO4n18NqXqLc';
    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { data, error } = await supabase
            .from('visitor_data') // Use the same table name as in processData.js
            .select('*')
            .order('timestamp', { ascending: false });

        if (error) {
            console.error('Error fetching data:', error);
            return;
        }

        console.log('Fetched data:', data); // Log the fetched data to verify its structure

        const tableBody = document.getElementById('db-entries');
        if (data.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="9" class="py-2 text-center">No data available</td></tr>'; // Updated colspan to 9
        } else {
            data.forEach(entry => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="py-2">${new Date(entry.timestamp).toLocaleString()}</td>
                    <td class="py-2">${entry.visitorId}</td>
                    <td class="py-2">${entry.unit}</td> <!-- Added unit column -->
                    <td class="py-2">${entry.erectLength}</td>
                    <td class="py-2">${entry.erectGirth}</td>
                    <td class="py-2">${entry.flaccidLength}</td>
                    <td class="py-2">${entry.flaccidGirth}</td>
                    <td class="py-2">${entry.visitCount}</td>
                    <td class="py-2">${entry.note}</td>
                `;
                tableBody.appendChild(row);
            });
        }

        const visitsPerDay = {};

        // Assuming 'data' is the array of entries fetched from the database
        data.forEach(entry => {
            const date = new Date(entry.timestamp).toISOString().split('T')[0]; // Get the date in YYYY-MM-DD format
            visitsPerDay[date] = (visitsPerDay[date] || 0) + 1; // Increment visit count for the date
        });

        // Populate the daily visits table
        const dailyVisitEntries = document.getElementById('daily-visit-entries');
        for (const [date, count] of Object.entries(visitsPerDay)) {
            const row = `<tr><td class="py-2">${date}</td><td class="py-2">${count}</td></tr>`;
            dailyVisitEntries.innerHTML += row;
        }
    } catch (err) {
        console.error('Unexpected error:', err);
    }
});