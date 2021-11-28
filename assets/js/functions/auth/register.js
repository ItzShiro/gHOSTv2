firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        location.href = '../loggedin'
    }
});
s

function register(email, password, username) {
    firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
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
            var errorCode = error.code;
            console.log(error.code)
        });
}