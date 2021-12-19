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
    changeStatus: function(status) {
        this.closePopup()
        if (status.length !== 0) {
            if (status.length <= 36) {
                firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/data/status").set(status).then(() => {
                    Content.notification("Success", "Your Status has been changed.")
                })
            } else {
                Content.notification("Error", "Your Status cannot be longer than 36 letters")
            }
        } else {
            Content.notification("Error", "Your Status cannot be empty")
        }
    },
    deleteStatus: function() {
        firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/data/status").set("<c>No status</c>").then(() => {
            Content.notification("Success", "Your Status has been deleted.")
        })
    },
    changeBg: function() {
        popupBody.classList.remove('active')
        let fileUpload = document.querySelector('input[type="file"]#profile_pic')

        firebase.storage().ref('users/' + firebase.auth().currentUser.uid + '/background.jpg').put(fileUpload.files[0]).then(() => {
            console.log("Successfully Uploaded");
            firebase.storage().ref('users/' + firebase.auth().currentUser.uid + '/background.jpg').getDownloadURL().then(url => {
                firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/data/backgroundPicture").set(url)
                    .then(() => {
                        console.log(`Changed Profile Background`)
                        Content.notification("Succsess", "Your Background has been changed")

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
    changePalette: function() {
        firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/appearance/lightTheme").set(!Content.lightTheme)

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
                var gendersArray = new Array("#gay", "#lesbian", "#trans", "#genderqueer", "#bi", "#pansexual", "#queer", "#genderfluid", "#homosexual", "#bisexual", "#omni", "#transsexual", "#omnisexual", "#asexual", "#intersexual", "#topsexual", "#demisexual", "#demi")
                if (gendersArray.includes(document.querySelector('input[type="text"].group_messageInput').value)) {
                    return User.logout()
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
            }
        },
    },
    closePopup: function() {
        popupBody.classList.remove('active')

    },
    closeProfile: function() {
        var contentBody = document.querySelector('.bodyContent')
        var profileBody = document.querySelector('body>.profile')
        profileBody.classList.remove('active')
        contentBody.style.overflowY = "scroll"
    },
    openProfile: function(uid) {
        var contentBody = document.querySelector('.bodyContent')
        var profileBody = document.querySelector('body>.profile')
        var profileContent = document.querySelector('body>.profile .content')

        profileBody.classList.add('active')
        contentBody.style.overflowY = "hidden"
        firebase.database().ref(`users/${uid}/data`).on('value', (snap) => {
            var data = snap.val()
            firebase.database().ref('posts/').on('value', (snap) => {

                var posts = snap.val()

                function checkStatus() {
                    if (data.status !== undefined) {
                        return data.status
                    } else {
                        return "No Status"
                    }
                }

                function checkBgPic() {
                    if (data.backgroundPicture !== undefined) {
                        return data.backgroundPicture
                    } else {
                        return "https://firebasestorage.googleapis.com/v0/b/ghost-chat-v2.appspot.com/o/default%2FdefaultPBg.jpg?alt=media&token=effd2247-db3d-45fc-8a7b-9c55164a6f44";
                    }
                }

                var html = `
                <div class="close" onclick="User.closeProfile()">
                        <i class="fa fa-times-circle" aria-hidden="true"></i>
                    </div>
                <div class="top">
                    <div class="background">
                        <img src="${checkBgPic()}" alt="">
                    </div>
                    <div class="user">
                        <div class="avatar avatar120">
                            <img src="${data.profilePicture}" class="avatarPicture" alt="profilePic" />
                        </div>
                        <div class="text">
                            <span class="displayName">${data.displayName}</span>
                            <span class="status">${checkStatus()}</span>
                        </div>
                    </div>
    
                </div>
                <div class="posts">
                </div>
                
                `

                profileContent.innerHTML = html

                function badgesDisplay() {
                    firebase.database().ref(`users/${uid}/badges`).on('value', (snap) => {
                        if (snap.val() !== null) {
                            if (snap.val().team == true) {
                                document.querySelector(".user>.text>.displayName").innerHTML += `<img class="badge" src="../assets/img/badges/gHostTeam.png">`
                            }
                            if (snap.val().betaTester == true) {
                                document.querySelector(".user>.text>.displayName").innerHTML += `<img class="badge" src="../assets/img/badges/betaBadge.png">`
                            }
                        }
                    })
                }
                badgesDisplay()

                function postDisplay() {
                    if (posts !== undefined) {
                        Object.values(posts).forEach((e) => {
                            //message: ""
                            //postImageUrl: ""
                            //sender: ""
                            //senderProfile: ""
                            //senderUid: ""
                            //timestamp: ""


                            var postHtml = `
                            <div id="${e.snapKey}" class="post">
                            <div class="thumbnail">
                                <div class="avatar">
                                    <img src="${e.senderProfile}" alt="profilePic">
                                </div>
                                <div class="text">
                                    <span class="nickname">${e.sender}</span>
                                    <span class="timestamp">${e.timestamp}</span>
                                </div>
                            </div>
                            <div class="border"></div>
                            <div class="content">
                              <span class="text">${e.message}</span>
                              <img src="${e.postImageUrl}">
                              <div class="border"></div>
                            </div>
                            </div>
    
                            `
                            var profilePosts = document.querySelector('body>.profile>.content>.posts')
                            if (e.senderUid == uid) {
                                return profilePosts.insertAdjacentHTML('afterbegin', postHtml);
                            } else {
                                return;
                            }
                        })
                    } else if (posts == undefined) {
                        var profilePosts = document.querySelector('body>.profile>.content>.posts')
                        return profilePosts.innerHTML = "<span class='tints'>There is nothing more to show</span>"
                    }
                }
                postDisplay()

            });
        })


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
            case ("status"):
                popupContent.innerHTML = `
                        <div class="content">
                            <span>Change Status</span>
                            <input type="text">
                            <button onclick="User.changeStatus(document.querySelector('.changePopup .content input').value)">Change</button>
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
            case ("background"):

                popupContent.innerHTML = `
                        <div class="content">
                            <span>Change Background</span>
                            <input type="file" id="profile_pic" name="profile_pic"
              accept=".jpg, .jpeg, .png"></input>
                            <button onclick="User.changeBg()">Change</button>
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
    lightTheme: null,
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
        firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/badges/betaTester").set(true)
        firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/").on('value', (snap) => {
            var appearance = snap.val().appearance

            if (appearance == undefined) {
                firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/appearance/lightTheme").set(false)
            }
        })

        firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/appearance/lightTheme").on('value', (snap) => {
            console.log(snap.val())
            if (snap.val() == true) {
                Content.lightTheme = true
                document.querySelector('.palette').innerHTML = `
                
                :root {
                    --color1: #c0c2ce;
                    --color2: #d2d4dc;
                    --color3: #e5e6eb;
                    --color4: #f8f8fa;
                    --color5: tomato;
                    --bar_boxShadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.3);
                    --fog: rgba(0, 0, 0, 0.6);
                    --light-dark: white;
                    --loader-icons: white;
                    --icons: #1e1d1e;
                    --text: #000;   
                }
                
                `
            } else {
                Content.lightTheme = false
                document.querySelector('.palette').innerHTML = ``
            }
        })




        var bgPicture;
        firebase.database().ref('users/' + firebase.auth().currentUser.uid + "/data").on('value', (snap) => {
            bgPicture = snap.val().backgroundPicture
        });
        var defaultBackground = "https://firebasestorage.googleapis.com/v0/b/ghost-chat-v2.appspot.com/o/default%2FdefaultPBg.jpg?alt=media&token=effd2247-db3d-45fc-8a7b-9c55164a6f44"

        function defaultBG() {
            if (bgPicture == defaultBackground) {
                return defaultBackground;
            } else if (bgPicture == null) {
                return defaultBackground;
            } else if (bgPicture == undefined) {
                return defaultBackground;
            } else {
                return bgPicture
            }
        }

        var uid = firebase.auth().currentUser.uid

        firebase.database().ref("users/" + uid + "/data/displayName").set(firebase.auth().currentUser.displayName);
        firebase.database().ref("users/" + uid + "/data/email").set(firebase.auth().currentUser.email);
        firebase.database().ref("users/" + uid + "/data/uid").set(firebase.auth().currentUser.uid);
        firebase.database().ref("users/" + uid + "/data/profilePicture").set(firebase.auth().currentUser.photoURL);

        if (firebase.auth().currentUser.photoURL !== null) {
            pPicture = firebase.auth().currentUser.photoURL
        } else {
            pPicture = 'https://firebasestorage.googleapis.com/v0/b/ghost-chat-v2.appspot.com/o/default%2FdefaultPPic.png?alt=media&token=fa2aea88-e0ad-44a4-9920-0e1ac35909ce'
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