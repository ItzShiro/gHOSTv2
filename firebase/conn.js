const firebaseConfig = {
    apiKey: "AIzaSyCgaLxAMcbXgXqIPHTzFH5vt9SQyPJhAdo",
    authDomain: "ghost-chat-v2.firebaseapp.com",
    projectId: "ghost-chat-v2",
    storageBucket: "ghost-chat-v2.appspot.com",
    messagingSenderId: "430406752276",
    appId: "1:430406752276:web:3fafb6706b0149f54e2f01"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();