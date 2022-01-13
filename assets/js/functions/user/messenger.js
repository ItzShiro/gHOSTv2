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
    openMessages: function(uid) {
        const idPair = [firebase.auth().currentUser.uid, uid].sort().slice(",")
        webData.messenger.userOpen = uid

        firebase.database().ref(`users/${uid}/data/`).once('value', (snap) => {
            console.log(`Loaded Messages with "${snap.val().displayName}" And started to listen for new messages by this user`)


            var content = `
                <div class="avatar50">
                    <img src="${snap.val().profilePicture}" alt="ProfilePic">
                </div>
                <div class="text">
                    <div class="nickname">${snap.val().displayName}</div>
                    <div class="status">${snap.val().status}</div>
                </div>
            `
            document.querySelector('.bodyContent .content .topBar').innerHTML = content

            document.querySelector('.bodyContent .content').classList.add('active')
            document.querySelector('.bodyContent .content .messages').innerHTML = ""
        })

        this.listener = firebase.database().ref(`dms/${idPair[0]}/${idPair[1]}/`).on('child_added', (snap) => {
            if (webData.messenger.userOpen !== uid || webData.messenger.userOpen == null) return;
            //console.log(snap.val().content)
            firebase.database().ref(`users/${uid}/data`).on('value', (snapshott) => {
                firebase.database().ref(`users/${firebase.auth().currentUser.uid}/data`).on('value', (snapshot) => {
                    if (snap.val().by == firebase.auth().currentUser.uid) {
                        return document.querySelector('.bodyContent .content .messages').innerHTML += `
                        <div class="messageContainer byMe">
                            <div class="message ">
                                <div class="text">${snap.val().content}</div>
                                <div class="avatar40">
                                    <img src="${snapshot.val().profilePicture}" alt="">
                                </div>
                            </div>
                        </div>`
                    } else if (snap.val().by !== firebase.auth().currentUser.uid) {
                        return document.querySelector('.bodyContent .content .messages').innerHTML += `
                        <div class="messageContainer">
                            <div class="message ">
                                <div class="avatar40">
                                    <img src="${snapshott.val().profilePicture}" alt="">
                                </div>
                                <div class="text">${snap.val().content}</div>
                            </div>
                        </div>`
                    }
                })
            })
        })

    }
}
firebase.auth().onAuthStateChanged((user) => {
    if (!user) return;
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