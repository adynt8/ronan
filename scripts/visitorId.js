function generateVisitorId() {
    if (!localStorage.getItem('visitorId')) {
        const id = 'v' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('visitorId', id);
    }
    return localStorage.getItem('visitorId');
}