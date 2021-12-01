//Its just a file to make a chat/posts display

firebase.database().ref("posts").on("child_added", function(snapshot) {

    var user = firebase.auth().currentUser
    var html = "";

    if (snapshot.val().senderUid == user.uid) {
        html = `<div  id="${snapshot.key}" class="post">
        <div class="thumbnail">
            <div class="avatar">
                <img src="../assets/img/defaultAvatar.png" alt="profilePic">
            </div>
            <div class="text">
                <span class="nickname">${snapshot.val().sender} <span>You</span></span>
                <span class="timestamp">${snapshot.val().timestamp}</span>
            </div>
            <div class="dropdown">
                <div onclick="deleteMessage('${snapshot.key}')" class="content">
                    <div class="delete">
                        <i class="far fa-trash-alt"></i>
                        <span>Delete</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="border"></div>
        <div class="content">
          <span class="text">${snapshot.val().message }</span>
          <img src="${snapshot.val().postImageUrl}">
          <div class="border"></div>
        </div>
    </div>`
    } else {
        html = `<div data-id="${snapshot.key}" class="post">
        <div class="thumbnail">
          <div class="avatar">
            <img src="${snapshot.val().senderProfile}" alt="profilePic">
          </div>
          <div class="text">
            <span class="nickname">${snapshot.val().sender}</span>
            <span class="timestamp">${snapshot.val().timestamp}</span>
          </div>
        </div>
        <div class="border"></div>
        <div class="content">
          <span class="text">${snapshot.val().message }</span>
          <img src="${snapshot.val().postImageUrl}">
          <div class="border"></div>
        </div>
        </div>`
    }

    document.querySelector('.posts .content').insertAdjacentHTML('afterbegin', html);

})

function deleteMessage(self) {
    firebase.database().ref("posts").child(self).remove();
}
firebase.database().ref("posts").on("child_removed", function(snapshot) {
    document.getElementById(snapshot.key).remove();
});
Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}