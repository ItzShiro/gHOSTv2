var dataElement = document.querySelectorAll(".beta_data")

dataElement.forEach((e) => {
    var data = JSON.parse(`{${e.innerText.split("}}")[0].replace("{{", "")}}`)
    data.uid = data.uid.trim()
    console.log("users/" + data.uid + "/data")
    switch (data.data) {
        case "avatar":
            firebase.database().ref("users/" + data.uid + "/data").once('value', (snap) => {
                e.innerHTML = `
                <div class="avatar avatar${data.avatar_data}">
                    <img src="${snap.val().profilePicture}" class="avatarPicture" alt="profilePic">
                </div>
                `
            })
            break;

        case "nickname":
            firebase.database().ref("users/" + data.uid + "/data").once('value', (snap) => {
                e.innerHTML = snap.val().displayName
            })
            break;
        case "uid":
            e.innerHTML = data.uid
            break;
    }
})