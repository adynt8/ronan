// Initialize the Supabase client
const supabaseUrl = 'https://lcayhsjrmjkwxekutiih.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjYXloc2pybWprd3hla3V0aWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUzMjQzNjMsImV4cCI6MjA0MDkwMDM2M30.HO8ykfrFvwxjhFt5XuDJ1aMvbbIRpnvYO4n18NqXqLc'
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)

// Make processData a global function
window.processData = async function(data) {
    console.log('Processing data:', data);
    try {
        // Check if an entry with the same visitorId already exists
        const { data: existingEntry, error: fetchError } = await supabaseClient
            .from('visitor_data')
            .select()
            .eq('visitorId', data.visitorId)
            .single()

        if (fetchError && fetchError.code !== 'PGRST116') {
            console.error('Error fetching existing entry:', fetchError)
            return
        }

        let visitCount = 1;
        let result;

        if (existingEntry) {
            // Increment visit count
            visitCount = (existingEntry.visitCount || 0) + 1;
            
            // Update the existing entry
            result = await supabaseClient
                .from('visitor_data')
                .update({...data, visitCount: visitCount})
                .eq('visitorId', data.visitorId)
            console.log('Updating existing entry:', result)
        } else {
            // Add new data if no existing entry found
            result = await supabaseClient
                .from('visitor_data')
                .insert([{...data, visitCount: visitCount}])
            console.log('Adding new entry:', result)
        }

        if (result.error) {
            console.error('Error processing data:', result.error)
            return
        }

        console.log('Data successfully processed:', result.data)
    } catch (error) {
        console.error('Error processing data:', error)
    }
}

console.log('processData function initialized');