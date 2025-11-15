document.addEventListener('DOMContentLoaded', function() {
    if (!sessionStorage.getItem('loadingShown')) {
        document.getElementById('loadingOverlay').style.display = 'flex';
        setTimeout(function() {
            document.getElementById('loadingOverlay').style.opacity = '0';
            setTimeout(function() {
                document.getElementById('loadingOverlay').style.display = 'none';
            }, 500);
        }, 1000);
        sessionStorage.setItem('loadingShown', 'true');
    }
});