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
            Content.notification("Succsess", "Your password has been changed, Reloading in 5 seconds")
            window.setTimeout(() => {
                window.location.reload(true);
            }, 5000)
        }).catch((error) => {
            console.log(error.code)

            if (error.code == "auth/weak-password") {
                Content.notification("Error", "An Error occured while changing Password: Your Password is too weak")
            } else {
                Content.notification("Error", "An Error occured while changing Password, Relogin and try again")
            }

        });
    },
    changeAvatar: function() {
        popupBody.classList.remove('active')
        let fileUpload = document.querySelector('input[type="file"]#profile_pic')

        firebase.storage().ref('users/' + firebase.auth().currentUser.uid + '/profile.jpg').put(fileUpload.files[0]).then(() => {
            console.log("Successfully Uploaded");
            firebase.storage().ref('users/' + firebase.auth().currentUser.uid + '/profile.jpg').getDownloadURL().then(url => {
                firebase.auth().currentUser.updateProfile({
                    photoURL: url
                }).then(() => {
                    console.log(`Changed Profile Picture`)
                    Content.notification("Succsess", "Your Avatar has been changed, Reloading in 5seconds")
                    window.setTimeout(() => {
                        window.location.reload(true);
                    }, 5000)
                }).catch((error) => {
                    console.log("An Error occured while changing avatar")
                    Content.notification("Error", "An Error occured while changing Avatar")
                    console.log(error)
                });
            })
        }).catch(error => {
            console.log(error.code)
        })


    },
    addPost: function() {


        function makeid(length) {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() *
                    charactersLength));
            }
            return photoId = result;
        }

        makeid(20)

        var photoId

        let fileUpload = document.querySelector('input[type="file"]#post_pic')
        var postImageLink = null

        if (fileUpload.files[0] !== null) {
            if (document.querySelector('input[type="file"]#post_pic').value.split(/(\\|\/)/g).pop() !== '') {}
            firebase.storage().ref('posts/' + photoId + ".jpg").put(fileUpload.files[0]).then(() => {
                console.log("Successfully Uploaded");
                firebase.storage().ref('posts/' + photoId + ".jpg").getDownloadURL().then(url => {
                    return postImageLink = url
                })
            }).catch(error => {
                console.log(error.code)
            }).then(() => {
                if (document.querySelector('input[type="text"].postInput').value.length == 0 && postImageLink == null) {
                    Content.notification("Error", "Please add something to your post first")
                } else {

                    console.log()

                    Content.notification("Success", "Added your post")
                    window.setTimeout(() => {
                        firebase.database().ref("posts").push().set({
                            "sender": firebase.auth().currentUser.displayName,
                            "senderProfile": pPicture,
                            "senderUid": firebase.auth().currentUser.uid,
                            "timestamp": displayTime(),
                            "message": document.querySelector('input[type="text"].postInput').value,
                            "postImageUrl": validateImage()
                        });

                        document.querySelector('input[type="text"].postInput').value = ""
                        document.querySelector('input[type="file"]#post_pic').value = ""
                        document.querySelector('.fileNamedisplay').innerHTML = "No File Selected"

                        postImageLink = ""
                    }, 500)
                }
            })
        }



        function validateImage() {
            if (document.querySelector('input[type="file"]#post_pic').value.split(/(\\|\/)/g).pop() == '') {
                return "";
            } else {
                if (postImageLink == null) {
                    return "";
                } else {
                    return postImageLink
                }
            }
        }
    },

    group: {
        sendMessage: function() {
            if (document.querySelector('input[type="text"].group_messageInput').value == "" || document.querySelector('input[type="text"].group_messageInput').value == " ") {
                return "";
            } else {
                firebase.database().ref("messages").push().set({
                    "sender": firebase.auth().currentUser.displayName,
                    "senderProfile": pPicture,
                    "senderUid": firebase.auth().currentUser.uid,
                    "timestamp": displayTime(),
                    "message": document.querySelector('input[type="text"].group_messageInput').value
                });
                document.querySelector('input[type="text"].group_messageInput').value = ""
            }
        },
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
            case ("avatar"):

                popupContent.innerHTML = `
                    <div class="content">
                        <span>Change Avatar</span>
                        <input type="file" id="profile_pic" name="profile_pic"
          accept=".jpg, .jpeg, .png"></input>
                        <button onclick="User.changeAvatar()">Change</button>
                    </div>`;
                break;

        }
    }
}

var pPicture


function displayTime() {
    var str = "";

    const d = new Date();
    var hours = d.getHours()
    var minutes = d.getMinutes()
    if (minutes < 10) {
        minutes = "0" + minutes
    }
    str = `${d.getDate()}.${d.getMonth() + 1}.${d.getFullYear()} - ` + hours + ":" + minutes;
    return str;
}

var addPostPhoto = function() {
    document.querySelector('input[type="file"]#post_pic').click()
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
    },
    sounds: function(sound) {
        switch (sound) {
            case "notification":
                var audio = new Audio('../assets/sounds/notification.mp3')
                audio.play()
        }
    },

    groupChatOpen: true,
}

firebase.auth().onAuthStateChanged((user) => {
    if (!user) {
        location.href = "../auth";
    } else {

        if (firebase.auth().currentUser.photoURL !== null) {
            pPicture = firebase.auth().currentUser.photoURL
        } else {
            pPicture = '../assets/img/defaultAvatar.png'
        }

        document.querySelectorAll('.displayName').forEach((e) => {
            if (user.displayName === null) {
                return;
            } else {
                e.innerHTML = user.displayName
            }
        })
        document.querySelectorAll('.avatarPicture').forEach((e) => {
            if (user.photoURL === null) {
                return;
            } else {
                e.style.background = "#fff"
                e.src = user.photoURL
            }
        })
        user.providerData.forEach(function(e) {
            var provider = `${e.providerId}`
            if (provider !== "password") {
                document.querySelector('.dropdown .content .settings .elements').innerHTML = `
                <div class="elements">
                    <span>
                        <i class="far fa-user-circle"></i>
                        <a onclick="User.openPopup('password')" href="#">Password</a>
                    </span>
                </div>`;
            }
        });
        window.setTimeout(() => {
            document.querySelector('.loader').style.opacity = "0"
            document.querySelector('.loader').style.pointerEvents = "none"

            Content.groupChatOpen = false
        }, 1000)
    }
});

function groupChat() {
    if (Content.groupChatOpen == true) {
        Content.groupChatOpen = false
    } else {
        Content.groupChatOpen = true
    }
}


document.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        if ($(document.querySelector('input[type="text"].group_messageInput')).is(':focus')) {
            User.group.sendMessage()
        }
    }
});

window.setInterval(() => {
    if (Content.groupChatOpen == true) {
        document.querySelector('.groupChat').classList.add('active')
    } else {
        document.querySelector('.groupChat').classList.remove('active')
    }
}, 31.25)