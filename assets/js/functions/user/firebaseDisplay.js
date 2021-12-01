//Its just a file to make a chat/posts display

firebase.database().ref("posts").on("child_added", function(snapshot) {

    var user = firebase.auth().currentUser
    var html = "";

    if (snapshot.val().senderUid == user.uid) {
        html = `<div id="${snapshot.key}" class="post">
        <div class="thumbnail">
          <div class="avatar">
            <img src="${snapshot.val().senderProfile}" alt="profilePic">
          </div>
          <div class="text">
            <span class="nickname">${snapshot.val().sender} <span>You</span></span>
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
    } else {
        html = `<div  id="${snapshot.key}" class="post">
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