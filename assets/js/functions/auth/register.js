firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        location.href = '../loggedin'
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
                    });
                firebase.auth().currentUser.updateProfile({
                    displayName: username
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