function shareResults() {
    // Check if the user has agreed to share measurements
    const shareMeasurements = localStorage.getItem('shareMeasurements');
    if (shareMeasurements !== 'true') {
        alert('Sharing is disabled because you did not agree to share your measurements.');
        return;
    }

    const unit = document.getElementById('unit-selector').value;
    const erectLength = document.getElementById('erect-length').value;
    const flaccidLength = document.getElementById('flaccid-length').value;
    const erectGirth = document.getElementById('erect-girth').value;
    const flaccidGirth = document.getElementById('flaccid-girth').value;
    const visitorId = generateVisitorId(); // Get the visitor ID

    console.log('Generated visitor ID:', visitorId);

    const encodedParams = btoa(`${visitorId}`);
    const shareUrl = `${window.location.origin}/shared-results.html?d=${encodedParams}`;
    
    console.log('Share URL:', shareUrl);

    const modal = createModal('Share Your Results');
    const shareOptions = [
        { name: 'Copy Link', icon: '🔗', action: () => navigator.clipboard.writeText(shareUrl) },
        { name: 'Discord', icon: '🎮', action: () => syncResultsToDiscord() },
        { name: 'Twitter', icon: '🐦', action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=Check%20out%20my%20results%20on%20PlsSize.Me!`) },
        { name: 'Reddit', icon: '🔴', action: () => window.open(`https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=Check%20out%20my%20results%20on%20PlsSize.Me!`) }
    ];

    shareOptions.forEach(option => addShareButton(modal, option));
    addCloseButton(modal);
    document.body.appendChild(modal);
    animateModal(modal);
    console.log('Share modal displayed');
}

function createModal(title) {
    const modal = document.createElement('div');
    Object.assign(modal.style, {
        position: 'fixed', left: '50%', top: '50%', transform: 'translate(-50%, -50%) scale(0.9)',
        backgroundColor: '#fff', padding: '30px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        zIndex: '1000', opacity: '0', transition: 'all 0.3s ease-in-out', minWidth: '300px'
    });
    modal.appendChild(createTitle(title));
    return modal;
}

function createTitle(text) {
    const title = document.createElement('h2');
    Object.assign(title.style, {
        marginBottom: '20px', textAlign: 'center', fontSize: '24px', color: '#333'
    });
    title.textContent = text;
    return title;
}

function addShareButton(modal, option) {
    const button = document.createElement('button');
    Object.assign(button.style, {
        display: 'block', width: '100%', padding: '15px', margin: '10px 0', border: 'none',
        borderRadius: '8px', backgroundColor: '#f0f0f0', cursor: 'pointer',
        transition: 'background-color 0.2s ease', fontSize: '16px', color: '#333'
    });
    button.innerHTML = `${option.icon} ${option.name}`;
    button.onmouseover = () => button.style.backgroundColor = '#e0e0e0';
    button.onmouseout = () => button.style.backgroundColor = '#f0f0f0';
    button.onclick = () => {
        option.action();
        showFlyout(`Shared via ${option.name}!`);
        closeModal(modal);
    };
    modal.appendChild(button);
}

function addCloseButton(modal) {
    const closeButton = document.createElement('button');
    Object.assign(closeButton.style, {
        display: 'block', width: '100%', padding: '15px', marginTop: '20px', border: 'none',
        borderRadius: '8px', backgroundColor: '#333', color: '#fff', cursor: 'pointer',
        transition: 'background-color 0.2s ease', fontSize: '16px'
    });
    closeButton.textContent = 'Close';
    closeButton.onmouseover = () => closeButton.style.backgroundColor = '#555';
    closeButton.onmouseout = () => closeButton.style.backgroundColor = '#333';
    closeButton.onclick = () => closeModal(modal);
    modal.appendChild(closeButton);
}

function animateModal(modal) {
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 50);
}

function closeModal(modal) {
    modal.style.opacity = '0';
    modal.style.transform = 'translate(-50%, -50%) scale(0.9)';
    setTimeout(() => modal.remove(), 300);
}

function showFlyout(message) {
    const flyout = document.createElement('div');
    Object.assign(flyout.style, {
        position: 'fixed', bottom: '-100px', left: '50%', transform: 'translateX(-50%)',
        backgroundColor: '#333', color: '#fff', padding: '15px 25px', borderRadius: '5px',
        zIndex: '1000', transition: 'bottom 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)', fontSize: '16px'
    });
    flyout.textContent = message;
    document.body.appendChild(flyout);

    setTimeout(() => flyout.style.bottom = '20px', 50);
    setTimeout(() => {
        flyout.style.bottom = '-100px';
        setTimeout(() => flyout.remove(), 500);
    }, 2500);
}