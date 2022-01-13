//Its just a file to make a chat/posts display
firebase.database().ref("posts").on("child_added", function(snapshot) {

    if (webData.site !== "index") return;

    var user = firebase.auth().currentUser
    var html = "";

    var postImage = function() {
        if (snapshot.val().postImageUrl == undefined) {
            return;
        } else {
            return `<img onclick="location.href='${snapshot.val().postImageUrl}'" src="${snapshot.val().postImageUrl}">`
        }
    }

    if (snapshot.val().senderUid == user.uid) {

        html = `<section  id="${snapshot.key}" class="post">
        <div class="thumbnail">
            <div onclick="User.openProfile('${snapshot.val().senderUid}')" class="avatar">
                <img src="${snapshot.val().senderProfile}" alt="profilePic">
            </div>
            <div class="text">
                <span class="nickname">${snapshot.val().sender} <span>You</span></span>
                <span class="timestamp">${snapshot.val().timestamp}</span>
            </div>
            <div class="dropdown">
                <div onclick="deleteMessage('posts','${snapshot.key}')" class="content">
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
          ${postImage()}
          <div class="border"></div>
        </div>
    </section>`
    } else {
        html = `<section id="${snapshot.key}" class="post">
        <div class="thumbnail">
          <div onclick="User.openProfile('${snapshot.val().senderUid}')" class="avatar">
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
          ${postImage()}
          <div class="border"></div>
        </div>
        </section>`
    }

    document.querySelector('.bodyContent>.posts>.content').insertAdjacentHTML('afterbegin', html);

})


firebase.database().ref("messages").on("child_added", function(snapshot) {

    var user = firebase.auth().currentUser
    var html = "";
    var classes = "";

    if (snapshot.val().message.startsWith("#")) {
        classes = "hashtag"
    }
    if (snapshot.val().senderUid == user.uid) {
        html = `
        <div id="${snapshot.key}" class="messageContainer byMe">
                    <div class="message byMe">
                        <div class="thumbnail">
                            <div class="messageInfo">
                                ${snapshot.val().sender}
                                <span>${snapshot.val().timestamp}</span>
                            </div>
                            <div onclick="User.openProfile('${snapshot.val().senderUid}')" class="avatar avatar40">
                                <img src="${snapshot.val().senderProfile}" alt="">
                            </div>
                        </div>
                        <div class="messageContent ${classes}">
                        ${snapshot.val().message}
                        </div>
                    </div>
                </div>`
    } else {
        html = `
        <div id="${snapshot.key}" class="messageContainer">
                    <div class="message">
                        <div class="thumbnail">
                        <div onclick="User.openProfile('${snapshot.val().senderUid}')" class="avatar avatar40">
                                <img src="${snapshot.val().senderProfile}" alt="">
                            </div>
                            <div class="messageInfo">
                                ${snapshot.val().sender}
                                <span>${snapshot.val().timestamp}</span>
                            </div>
                        </div>
                        <div class="messageContent ${classes}">
                        ${snapshot.val().message}
                        </div>
                    </div>
                </div>`
        if (Content.groupChatOpen == false) {
            Content.notification(snapshot.val().sender, snapshot.val().message)
                //Content.sounds("notification")
        }
    }

    document.querySelector('.groupChat .content .text').innerHTML += html;
    document.querySelector('.groupChat .content .text').scrollTop = document.querySelector('.groupChat .content .text').scrollHeight;

})

function deleteMessage(type, self) {
    firebase.database().ref(type).child(self).remove();
    firebase.database().ref("users/" + firebase.auth().currentUser.uid + "/posts/").child(self).remove();
}

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
firebase.database().ref("posts").on("child_removed", function(snapshot) {
    document.getElementById(snapshot.key).remove();
});

firebase.database().ref("messages").on("child_removed", function(snapshot) {
    document.getElementById(snapshot.key).remove();
});