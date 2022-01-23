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
var pPicture

var ghost = {
    initialized: false,
    logged: false,
    initialize: function() {
        if (ghost.initialized == true) return;
        var firebase_appScript = document.createElement('script');
        var firebase_authScript = document.createElement('script');
        var firebase_dbScript = document.createElement('script');

        firebase_appScript.type = 'text/javascript'
        firebase_appScript.classList = "firebase_app"
        firebase_authScript.type = 'text/javascript'
        firebase_dbScript.type = 'text/javascript'

        firebase_appScript.src = "https://www.gstatic.com/firebasejs/8.0.0/firebase-app.js"
        firebase_authScript.src = "https://www.gstatic.com/firebasejs/8.0.0/firebase-auth.js"
        firebase_dbScript.src = "https://www.gstatic.com/firebasejs/8.0.0/firebase-database.js"

        document.head.appendChild(firebase_appScript)
        document.head.appendChild(firebase_authScript)
        document.head.appendChild(firebase_dbScript)

        if (document.head.contains(document.querySelector('.firebase_app'))) {
            window.setTimeout(() => {
                const firebaseConfig = {
                    apiKey: "AIzaSyCgaLxAMcbXgXqIPHTzFH5vt9SQyPJhAdo",
                    authDomain: "ghost-chat-v2.firebaseapp.com",
                    projectId: "ghost-chat-v2",
                    storageBucket: "ghost-chat-v2.appspot.com",
                    messagingSenderId: "430406752276",
                    appId: "1:430406752276:web:3fafb6706b0149f54e2f01"
                };
                window.setInterval(() => {
                    if (ghost.initialized == true) return;
                    if (firebase !== undefined || firebase !== null || firebase) {

                        firebase.initializeApp(firebaseConfig);
                        firebase.auth().onAuthStateChanged((e) => {
                            if (!e) return;
                            if (firebase.auth().currentUser.photoURL !== null) {
                                pPicture = firebase.auth().currentUser.photoURL
                            } else {
                                pPicture = 'https://firebasestorage.googleapis.com/v0/b/ghost-chat-v2.appspot.com/o/default%2FdefaultPPic.png?alt=media&token=fa2aea88-e0ad-44a4-9920-0e1ac35909ce'
                            }

                            firebase.database().ref("posts/").on('child_added', (snap) => {
                                ghost.post.posts.push(snap.val())
                            })
                            firebase.database().ref("messages/").on('child_added', (snap) => {
                                ghost.group.messages.push(snap.val())
                            })
                        })
                        console.clear()
                        ghost.initialized = true
                    }
                }, 100)
            }, 100)
        }
    },
    login: function(email, password) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                var user = userCredential.user;
                console.log(user)
            })
    },
    group: {
        messages: new Array(),
        send: function(message) {
            if (message == "" || message == " ") {
                return "";
            } else {
                var gendersArray = new Array("#lgbt", "#lgbtq", "#lgbtqa", "#lgbtqai", "#lgbtqaip", "#lgbtqaip+", "#lgbtqai+", "#lgbtqa+", "#lgbtq+", "#lgbt+", "#dream", "#dreamsexual", "#dreamsmp", "#kpop", "#dsmp", "#k-pop", "#bts", "#map", "#blm", "#zoo", "#iphone", "#ithings", "#imac", "#iloveapple", "#osx", "ipad", "#ipod", "#apple", "#gay", "#lesbian", "#trans", "#genderqueer", "#bi", "#pansexual", "#queer", "#genderfluid", "#homosexual", "#bisexual", "#omni", "#transsexual", "#omnisexual", "#asexual", "#intersexual", "#topsexual", "#demisexual", "#demi", "#tiktok", "#tt", "#meta", "#metaverse", "#nft", "#crypto", "#blockchain", "#killallmen", "#onlyfans")
                if (gendersArray.includes(message)) {
                    return User.logout()
                } else {
                    firebase.database().ref("messages").push().set({
                        "sender": firebase.auth().currentUser.displayName,
                        "senderProfile": pPicture,
                        "senderUid": firebase.auth().currentUser.uid,
                        "timestamp": displayTime(),
                        "message": message
                    });
                }
            }
        }
    },
    post: {
        posts: new Array(),
        send: function(postMessage) {
            firebase.database().ref("posts").push().set({
                "sender": firebase.auth().currentUser.displayName,
                "senderProfile": pPicture,
                "senderUid": firebase.auth().currentUser.uid,
                "timestamp": displayTime(),
                "message": postMessage,
                "postImageUrl": ""
            });

        }
    }
}