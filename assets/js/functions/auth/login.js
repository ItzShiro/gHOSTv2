firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        location.href = '../loggedin'
    }
});

function loginWith(type) {
    if (type == "google") {
        const googleProvider = new firebase.auth.GoogleAuthProvider();

        auth.signInWithPopup(googleProvider)
            .then(() => {
                console.log("")
            })
            .catch(error => {
                console.error(error)
            })
    }
}

function login(email, password) {
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            var user = userCredential.user;

            console.log(`Logged as ${user.displayName}`)
            console.log(user)
        })
        .catch((error) => {
            console.log(error.code)

            var errorDisplay = document.querySelector('.error')
            errorDisplay.style.opacity = "100%"

            switch (error.code) {
                case ("auth/user-not-found"):
                    console.log("Didn't found user with that email")
                    errorDisplay.innerHTML = "Didn't found user with that email";
                    break;
                case ("auth/wrong-password"):
                    console.log("Invalid Password")
                    errorDisplay.innerHTML = "Invalid Password"
                    break;
                case ("auth/invalid-email"):
                    console.log("Niepoprawny Email")
                    errorDisplay.innerHTML = "Invalid Email";
                    break;
            }
        });
}