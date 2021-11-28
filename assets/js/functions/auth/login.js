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
            switch (error.code) {
                case "":
                    break;
            }
        });
}