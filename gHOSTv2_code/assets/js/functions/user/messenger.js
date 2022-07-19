var message = {
    send: function(toUid, messageText) {
        const idPair = [firebase.auth().currentUser.uid, toUid].sort().slice(",")
        firebase.database().ref(`dms/${idPair[0]}/${idPair[1]}`)
            .push({
                by: firebase.auth().currentUser.uid,
                content: messageText
            }).then(() => {
                firebase.database().ref(`users/${firebase.auth().currentUser.uid}/friends/${toUid}/lastMessage`).set(messageText)
                firebase.database().ref(`users/${toUid}/friends/${firebase.auth().currentUser.uid}/lastMessage`).set(messageText)
            })
    },
    listener: null,
    clearChat: function(uid) {
        const idPair = [firebase.auth().currentUser.uid, uid].sort().slice(",")
        firebase.database().ref(`dms/${idPair[0]}/${idPair[1]}/`).set("Erased")
    },
    openMessages: function(uid) {
        const idPair = [firebase.auth().currentUser.uid, uid].sort().slice(",")
        webData.messenger.userOpen = uid

        firebase.database().ref(`users/${firebase.auth().currentUser.uid}/data/messenger_lastUser`)



        if (webData.messenger.userOpen !== uid) {
            window.location.reload(true);
        }

        firebase.database().ref(`users/${uid}/data/`).once('value', (snap) => {

            function checkStatus() {
                if (snap.val().status == null || snap.val().status == undefined) return "No Status";
                return snap.val().status
            }

            var content = `
                <div class="avatar50">
                    <img src="${snap.val().profilePicture}" alt="ProfilePic">
                </div>
                <div class="text">
                    <div class="nickname">${snap.val().displayName}</div>
                    <div class="status">${checkStatus()}</div>
                </div>
            `
            document.querySelector('.bodyContent .content .topBar').innerHTML = content

            document.querySelector('.bodyContent .content').classList.add('active')
            document.querySelector('.bodyContent .content .messages').innerHTML = ""
        })

        this.listener = firebase.database().ref(`dms/${idPair[0]}/${idPair[1]}/`).on('child_added', (snap) => {
            if (webData.messenger.userOpen !== uid || webData.messenger.userOpen == null) return;

            function checkMessageContent() {
                emojiIndex.forEach((e) => {
                    message = snap.val().content
                    console.log(e.name)
                    var text = "JD :)"
                    text.replace(e.name, e.emoji)
                    console.log(text)
                })

                var message;
                return message
            }
            //console.log(snap.val().content)
            firebase.database().ref(`users/${uid}/data`).on('value', (snapshott) => {
                firebase.database().ref(`users/${firebase.auth().currentUser.uid}/data`).on('value', (snapshot) => {
                    if (document.querySelector("." + snap.key)) return;
                    if (snap.val().by == firebase.auth().currentUser.uid) {

                        document.querySelector('.bodyContent .content .messages').innerHTML += `
                        <div class="${snap.key} messageContainer byMe">
                            <div class="message ">
                                <div class="text">${checkMessageContent()}</div>
                            </div>
                        </div>`

                        var element = document.querySelector('.bodyContent .messages');
                        element.scrollTop = element.scrollHeight - element.clientHeight;
                    } else if (snap.val().by !== firebase.auth().currentUser.uid) {

                        document.querySelector('.bodyContent .content .messages').innerHTML += `
                        <div class="${snap.key} messageContainer">
                            <div class="message ">
                                <div class="avatar40">
                                    <img src="${snapshott.val().profilePicture}" alt="">
                                </div>
                                <div class="text">${checkMessageContent()}</div>
                            </div>
                        </div>`

                        var element = document.querySelector('.bodyContent .messages');
                        element.scrollTop = element.scrollHeight - element.clientHeight;
                    }

                })
            })
        })

    }
}
firebase.auth().onAuthStateChanged((user) => {
    if (!user) return;
    firebase.database().ref(`users/${firebase.auth().currentUser.uid}/data/messenger_lastUser`).once('value', (snap) => {
        if (snap.val() == undefined || snap.val() == null) return;
        message.openMessages(snap.val())
    })
    firebase.database().ref(`users/${firebase.auth().currentUser.uid}/friends`).on('child_added', (snap) => {
        if (snap.val().status !== true) return;
        firebase.database().ref(`users/${snap.val().uid}/`).once('value', snapshot => {

            function checkLastMessage() {
                if (snap.val().lastMessage == null || snap.val().lastMessage == undefined) return "No Messages";
                return snap.val().lastMessage
            }
            var content = `
            <div class="item" onclick="message.openMessages('${snap.val().uid}')">
                <div onclick="User.openProfile('${snap.val().uid}')" class="avatar50">
                    <img src="${snapshot.val().data.profilePicture}" alt="Avatar">
                </div>
                <div class="info">
                    <div class="nickname">
                        ${snapshot.val().data.displayName}
                    </div>
                    <div class="lastMessage">
                        ${checkLastMessage()}
                    </div>
                </div>
                <div class="line"></div>
            </div>
            `

            var newDiv = document.createElement('div');
            newDiv.innerHTML = content

            document.querySelector('.bodyContent .friends').appendChild(newDiv)

        })

    })
})
document.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
        if ($(document.querySelector('input[type="text"].private_textInput')).is(':focus')) {
            if (document.querySelector('input[type="text"].private_textInput').value == "" || document.querySelector('input[type="text"].private_textInput').value == " ") return;
            message.send(webData.messenger.userOpen, document.querySelector('input[type="text"].private_textInput').value)
            document.querySelector('input[type="text"].private_textInput').value = ""
        }
    }
});