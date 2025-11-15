document.addEventListener('DOMContentLoaded', function() {
    const userInfoDiv = document.getElementById('user-info');
    const dataUploadInfoDiv = document.getElementById('data-upload-info');
    const visitorId = localStorage.getItem('visitorId');
    const unit = localStorage.getItem('penisCalcUnit');
    const erectLength = localStorage.getItem('penisCalcErectLength');
    const flaccidLength = localStorage.getItem('penisCalcFlaccidLength');
    const erectGirth = localStorage.getItem('penisCalcErectGirth');
    const flaccidGirth = localStorage.getItem('penisCalcFlaccidGirth');
    const country = localStorage.getItem('userCountry');
    const shareMeasurements = localStorage.getItem('shareMeasurements');

    let userInfoHTML = `<p><strong>User ID:</strong> ${visitorId}</p>`;
    userInfoHTML += `<p><strong>Unit:</strong> ${unit}</p>`;
    userInfoHTML += `<p><strong>Erect Length:</strong> ${erectLength} ${unit}</p>`;
    userInfoHTML += `<p><strong>Flaccid Length:</strong> ${flaccidLength} ${unit}</p>`;
    userInfoHTML += `<p><strong>Erect Girth:</strong> ${erectGirth} ${unit}</p>`;
    userInfoHTML += `<p><strong>Flaccid Girth:</strong> ${flaccidGirth} ${unit}</p>`;
    userInfoHTML += `<p><strong>Country:</strong> ${country}</p>`;
    userInfoHTML += `<p><strong>Share Measurements:</strong> ${shareMeasurements === 'true' ? 'Yes' : 'No'}</p>`;

    userInfoDiv.innerHTML = userInfoHTML;

    let dataUploadInfoHTML = `<h2>Data Upload Information</h2>`;
    if (shareMeasurements === 'true') {
        dataUploadInfoHTML += `<p>Your measurements are being uploaded to our database for research and analysis purposes.</p>`;
        dataUploadInfoHTML += `<ul>`;
        dataUploadInfoHTML += `<li>Unit: ${unit}</li>`;
        dataUploadInfoHTML += `<li>Erect Length: ${erectLength} ${unit}</li>`;
        dataUploadInfoHTML += `<li>Flaccid Length: ${flaccidLength} ${unit}</li>`;
        dataUploadInfoHTML += `<li>Erect Girth: ${erectGirth} ${unit}</li>`;
        dataUploadInfoHTML += `<li>Flaccid Girth: ${flaccidGirth} ${unit}</li>`;
        dataUploadInfoHTML += `<li>Country: ${country}</li>`;
        dataUploadInfoHTML += `</ul>`;

        console.log('Data being uploaded to the database:');
        console.log(`Unit: ${unit}`);
        console.log(`Erect Length: ${erectLength} ${unit}`);
        console.log(`Flaccid Length: ${flaccidLength} ${unit}`);
        console.log(`Erect Girth: ${erectGirth} ${unit}`);
        console.log(`Flaccid Girth: ${flaccidGirth} ${unit}`);
        console.log(`Country: ${country}`);
    } else {
        dataUploadInfoHTML += `<p>Your measurements are not being uploaded to our database. Only your visitor ID and timestamp are stored locally.</p>`;
        console.log('Measurements are not being uploaded to the database. Only visitor ID and timestamp are stored locally.');
    }

    dataUploadInfoDiv.innerHTML = dataUploadInfoHTML;
});