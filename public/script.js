const socket = io("/");
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

var peer = new Peer(undefined, {
  path: "/peerjs",
  host: "/",
  port: 3030,
});

let myVideStream;

navigator.mediaDevices
  .getUserMedia({
    video: true,
    audio: true,
  })
  .then((stream) => {
    myVideStream = stream;
    addVideoStream(myVideo, stream);

    peer.on("call", (call) => {
      call.answer(stream);
      console.log("peer call answered");
      const video = document.createElement("video");
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
      });
    });

    socket.on("user-connected", (userId) => {
      console.log("user connected emit heard");
      connectToNewUser(userId, stream);
    });
    // let text = $("input");
    // // console.log(text);

    // $("html").keydown((e) => {
    //   if (e.which == 13 && text.val().length !== 0) {
    //     console.log(text.val());
    //     socket.emit("message", text.val());
    //     text.val("");
    //   }
    // });

    // socket.on("createmessage", (message) => {
    //   // console.log("Message received from server", message);
    //   const ul = document.getElementById("abcd");
    //   // console.log("value of ul is ", ul);
    //   const li = document.createElement("Li");
    //   li.innerHTML = `<b>user</b><br/>${message}`;
    //   li.className = "message";
    //   // console.log("value of li is ", li);
    //   ul.append(li);
    //   scrollToBottom();
    // });
  });

peer.on("open", (id) => {
  console.log("peer connection openend");
  socket.emit("join-room", ROOM_ID, id);
});

const connectToNewUser = (userId, stream) => {
  console.log("new user connected");
  const call = peer.call(userId, stream);
  console.log("call using peerjs");
  const video = document.createElement("video");
  console.log("creating video element");
  call.on("stream", (userVideoStream) => {
    console.log("adding user's stream");
    addVideoStream(video, userVideoStream);
  });
};

const addVideoStream = (video, stream) => {
  console.log("inside add video stream");
  video.srcObject = stream;
  video.addEventListener("loadedmetadata", () => {
    video.play();
  });
  videoGrid.append(video);
};

const scrollToBottom = () => {
  let d = $(".main__chat__window");
  d.scrollTop(d.prop("scrollHeight"));
};
