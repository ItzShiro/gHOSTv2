firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/data").set({
            "displayName": firebase.auth().currentUser.displayName,
            "email": firebase.auth().currentUser.email,
            "uid": firebase.auth().currentUser.uid,
            "profilePicture": firebase.auth().currentUser.photoURL,
            "backgroundPicture": null
        });
        window.setTimeout(() => {
            location.href = '../loggedin'
        }, 2000)
    }
});

function register(email, password, username) {
    if (username == "") {
        var errorDisplay = document.querySelector('.error')
        errorDisplay.style.opacity = "100%"
        errorDisplay.innerHTML = "Invalid Username"
    } else {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                firebase.auth().currentUser.sendEmailVerification()
                    .then(() => {
                        console.log("Verification Email Sent")
                    }).catch((error) => {
                        console.error(error)
                    });
                firebase.auth().currentUser.updateProfile({
                    displayName: username,
                    photoUrl: "https://firebasestorage.googleapis.com/v0/b/ghost-chat-v2.appspot.com/o/default%2FdefaultPPic.png?alt=media&token=fa2aea88-e0ad-44a4-9920-0e1ac35909ce"
                }).then(() => {
                    console.log(`Changed displayName to: ${username}`)
                }).catch((error) => {
                    console.log("An Error occured while changing displayName")
                    console.log(error)
                });



                var user = userCredential.user;
                // ...
            })
            .catch((error) => {
                console.log(error.code)

                var errorDisplay = document.querySelector('.error')
                errorDisplay.style.opacity = "100%"

                switch (error.code) {
                    case ("auth/invalid-email"):
                        console.log("Niepoprawny Email")
                        errorDisplay.innerHTML = "Invalid Email";
                        break;
                    case ("auth/weak-password"):
                        console.log("Zbyt słabe hasło")
                        errorDisplay.innerHTML = "Too Weak Password"
                        break;
                    case ("auth/email-already-in-use"):
                        console.log("Email is already in use")
                        errorDisplay.innerHTML = "Email is already in use"
                }
            });
    }
}