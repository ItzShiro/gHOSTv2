function closeError() {
    if (window.location.href.split("?")[1] == undefined == true) return;
    document.querySelector('.noIdError').style.display = "none"
    getProfileData()
}

var uidFromLink = window.location.href.split("?")[1].split("=")[1]

function getProfileData() {
    firebase.database().ref("users/" + uidFromLink).once('value', (snap) => {
        console.log(snap.val())
    })
}