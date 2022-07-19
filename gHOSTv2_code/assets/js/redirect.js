function getLink() {
    var link = window.location.href
    console.log(link.split("?"))
    document.querySelector(".link").innerHTML = link.split("?")[1]
    document.querySelector('.yesBTN').setAttribute('onclick', `location.href = "${link.split("?")[1]}"`);
    document.querySelector('.noBTN').setAttribute('onclick', `location.href = "https://ghostv2.netlify.app/${link.split("?")[2]}"`);
}