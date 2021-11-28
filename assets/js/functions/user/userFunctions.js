var popupBody = document.querySelector('.changePopup')

var User = {
    logout: function() {
        firebase.auth().signOut()
    },
    changeDName: function(newName) {
        popupBody.classList.remove('active')
        firebase.auth().currentUser.updateProfile({
            displayName: newName
        }).then(() => {
            console.log(`Changed displayName to: ${newName}`)
            Content.notification("Succsess", "Your Username has been changed to " + newName + ", Reloading in 5seconds")
        }).catch((error) => {
            console.log("An Error occured while changing displayName")
            Content.notification("Error", "An Error occured while changing Nickname")
            console.log(error)
        });
        window.setTimeout(() => {
            window.location.reload(true);
        }, 5000)
    },
    changePassword: function(newPassword) {
        popupBody.classList.remove('active')
        const user = firebase.auth().currentUser;

        user.updatePassword(newPassword).then(() => {
            console.log("Password Changed")
            Content.notification("Succsess", "Your password has been changed")
        }).catch((error) => {
            console.log(error.code)
            Content.notification("Error", "An Error occured while changing Password")
        });
        window.setTimeout(() => {
            window.location.reload(true);
        }, 5000)
    },
    closePopup: function() {
        popupBody.classList.remove('active')
    },
    openPopup: function(thingToChange) {
        var popupBody = document.querySelector('.changePopup')
        var popupContent = document.querySelector('.changePopup .content')

        popupBody.classList.add('active')

        switch (thingToChange) {
            case ("password"):
                popupContent.innerHTML = `
                <div class="content">
                    <span>Change Password</span>
                    <input type="text">
                    <button onclick="User.changePassword(document.querySelector('.changePopup .content input').value)">Change</button>
                </div>`;
                break;
            case ("dname"):
                popupContent.innerHTML = `
                    <div class="content">
                        <span>Change Username</span>
                        <input type="text">
                        <button onclick="User.changeDName(document.querySelector('.changePopup .content input').value)">Change</button>
                    </div>`;
                break;
        }
    }
}
var Content = {
    dropdownToggle: function() {
        document.querySelector('.dropdownOpen').classList.toggle('active')
        document.querySelector('.dropdown .content').classList.toggle('active')
    },
    highlightSettings: function() {
        document.querySelector('.dropdownOpen').classList.add('active')
        document.querySelector('.dropdown .content').classList.add('active')
        document.querySelector('.dropdown .content .settings').style.background = "rgba(255, 255, 0, 0.2)"
        window.setTimeout(() => {
            document.querySelector('.dropdown .content .settings').style.background = "transparent"
        }, 1000)
        return this;
    },
    notification: function(thumbnail, content) {
        var content = `
      <div class="notification">
        <div class="thumbnail">${thumbnail}</div>
        <div class="content">${content}</div>
      </div>
      `;
        var div = document.createElement("div");
        div.innerHTML = content;
        document.querySelector(".notifications").appendChild(div);
        window.setTimeout(() => {
            div.classList.add('hide')
            window.setTimeout(() => {
                document.querySelector(".notifications").removeChild(div);
            }, 200);
        }, 2000);
    }
}