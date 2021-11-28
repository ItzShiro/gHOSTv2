window.setInterval(() => {
    if (navigator.onLine) {
        alert('online');
    } else {
        alert('offline');
    }
}, 1000)