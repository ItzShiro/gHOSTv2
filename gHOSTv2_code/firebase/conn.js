var firebaseConfig = {
    //Your Firebase Config if you want to make your version of gHOSTv2
};
function init(){
    if(firebaseConfig == null) return init()
    firebase.initializeApp(firebaseConfig);
}
const auth = firebase.auth();
