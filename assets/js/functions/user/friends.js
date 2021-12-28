var friends = {
    add: function(uid) {

        firebase.database().ref(`users/${firebase.auth().currentUser.uid}/friends/${uid}`).once('value', (snap) => {
            if (snap.val() == null) {
                firebase.database().ref(`users/${firebase.auth().currentUser.uid}/friends/${uid}`).set({ status: false, uid: uid })
                firebase.database().ref(`users/${uid}/friends/${firebase.auth().currentUser.uid}`).set({ status: "invite", uid: firebase.auth().currentUser.uid })
            }
        })

    },
    accept: function(uid) {
        firebase.database().ref(`users/${firebase.auth().currentUser.uid}/friends/${uid}`).once('value', (snap) => {
            if (snap.val().status == "invite") {
                firebase.database().ref(`users/${firebase.auth().currentUser.uid}/friends/${uid}`).set({ status: true, uid: uid })
                firebase.database().ref(`users/${uid}/friends/${firebase.auth().currentUser.uid}`).set({ status: true, uid: firebase.auth().currentUser.uid })
            }
        })
    },
    delete: function(uid) {
        firebase.database().ref(`users/${firebase.auth().currentUser.uid}/friends/${uid}`).once('value', (snap) => {
            if (snap.val() !== null) {
                firebase.database().ref(`users/${firebase.auth().currentUser.uid}/friends/${uid}`).set(null)
                firebase.database().ref(`users/${uid}/friends/${firebase.auth().currentUser.uid}`).set(null)
            }
        })
    },
    list: function() {
        firebase.database().ref(`users/${firebase.auth().currentUser.uid}/friends`).on('value', (snap) => {
            console.log(snap)
        })
    },
    display: function() {
        firebase.database().ref(`users/${firebase.auth().currentUser.uid}/friends`).on('child_added', (snap) => {
            firebase.database().ref(`users/${snap.val().uid}/data`).once('value', (snapshot) => {
                console.log(snap.val())
                console.log(snapshot.val())
                if (snap.val() !== null) {
                    switch (snap.val().status) {
                        case true:
                            console.log("Active Friend")
                            break;
                        case false:
                            var html = `
                            <div id="${snap.val().uid}" class="invite">
                                <div onclick="User.openProfile('${snap.val().uid}')"  class="avatar40">
                                    <img src="${snapshot.val().profilePicture}" alt="">
                                </div>
                                <div class="nickname">
                                    ${snapshot.val().displayName}
                                </div>
                                <button onclick="friends.delete('${snap.val().uid}')" class="cancel">Cancel</button>
                            </div>`
                            document.querySelector('.friends .pending').innerHTML += html;
                            break;
                        case "invite":
                            var html = `
                            <div id="${snap.val().uid}" class="invite">
                                <div onclick="User.openProfile('${snap.val().uid}')" class="avatar40">
                                    <img src="${snapshot.val().profilePicture}" alt="">
                                </div>
                                <div class="nickname">
                                ${snapshot.val().displayName}
                                </div>
                                <button onclick="friends.accept('${snap.val().uid}')" class="accept">Accept</button>
                                <button onclick="friends.delete('${snap.val().uid}')" class="cancel">Ignore</button>
                            </div>`

                            document.querySelector('.friends .invites').innerHTML += html;
                            break;
                    }

                }
            })
        })
    }
}