// Function to print local save info to console
function printLocalSaveInfo() {
    console.log("Local Save Information:");
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        console.log(`${key}: ${value}`);
    }
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', function() {
    printLocalSaveInfo();
});