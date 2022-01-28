window.setInterval(() => {
    if (!navigator.onLine) {
        //alert('online');
        document.querySelector('.offline').classList.add("active")
    } else {
        //alert('offline');
        document.querySelector('.offline').classList.remove("active")
    }
}, 1000)