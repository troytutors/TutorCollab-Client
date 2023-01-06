<template>
  <main class="wrapper">
    <div class="home" v-if="status === 'home'">
      <div class="text" id="myDIV">
        <h2>Join a Call</h2>
        <div class="start-call-container">
          <!--<button @click="createAndJoinRoom" :disabled="runningLocally">
            Create room and start
          </button>
          <p v-if="roomError" class="error">Room could not be created</p> -->
          <form @submit="submitJoinRoom">
            <label for="room">Daily Room URL</label>
            <input
              id="room"
              type="text"
              placeholder="Enter room URL..."
              v-model="roomUrl"
              pattern="^(https:\/\/)?[\w.-]+(\.(daily\.(co)))+[\/\/]+[\w.-]+$"
              @input="validateInput"
            />
            <input type="submit" value="Join room" :disabled="!validRoomURL" />
          </form>
          <!-- Daily room URL is entered here -->
        </div>
      </div>
    </div>

    <div class="call-container" :class="{ hidden: status === 'home' }">
      <!-- The Daily Prebuilt iframe is embedded in the div below using the ref -->
      <div id="call" ref="callRef"></div>
      <div id="share-status-text" class="screenshare-status">
        <h2></h2>
      </div>
    </div>
  </main>
</template>

<script>
import DailyIframe from "@daily-co/daily-js";
import api from "../api.js";

const IFRAME_OPTIONS = {
  height: "Calc(100vh - 8px)",
  width: "100%",
  aspectRatio: 16 / 9,
};

export default {
  name: "Video",
  data() {
    return {
      roomUrl: "",
      status: "home",
      callFrame: null,
      validRoomURL: false,
      roomError: false,
    };
  },
  sockets: {
    connect() {
      this.$socket.emit("room_request", this.$route.path.slice(1));
    },
  },
  mounted() {
    if (this.$route.path != "/") {
      this.joinRoom("https://tutorcollab.daily.co" + this.$route.path);
    }
  },
  computed: {
    runningLocally() {
      return window?.location?.origin.includes("localhost");
    },
  },
  methods: {
    createAndJoinRoom() {
      api
        .createRoom()
        .then((room) => {
          this.roomUrl = room.url;
          this.joinRoom(room.url);
        })
        .catch((e) => {
          console.log(e);
          this.roomError = true;
        });
    },
    // Daily callframe created and joined below
    joinRoom(url) {
      //hides div when entering a call
      var element = document.getElementById("myDIV");
      element.classList.toggle("mystyle");
      if (this.callFrame) {
        this.callFrame.destroy();
      }
      // Daily event callbacks
      const logEvent = (ev) => console.log(ev);
      const goToLobby = () => (this.status = "lobby");
      const goToCall = () => (this.status = "call");
      const leaveCall = () => {
        if (this.callFrame) {
          var element = document.getElementById("myDIV");
          element.classList.toggle("mystyle");
          this.status = "home";
          this.callFrame.destroy();
        }
      };
      // const safeScreenShareWatcher = (e) => {
      //   // if (this.callFrame) {
      //   //   //console.log(callFrame.showLocalVideo());
      //   //   //this.callFrame.setShowLocalVideo(false);
      //   //   if (this.sharing != e.participant.screen) {
      //   //     this.sharing = e.participant.screen;
      //   //     //console.log("q")
      //   //     //console.log(e)
      //   //     //console.log(e.participant)
      //   //     //console.log(e.participant.screen_info)
      //   //     //console.log(e.participant.cam_info)
      //   //     // var video_tab = document.getElementsByClassName(e.participant.session_id) + "-screen";
      //   //     var video_tab = document.getElementById("call");
      //   //     var status_text = document.getElementById("share-status-text");
      //   //     // console.log(video_tab)
      //   //     //console.log(video_tab.firstElementChild.style)
      //   //     console.log("t")
      //   //     console.log(status_text)
      //   //     if (video_tab.style.display === "none") {
      //   //       video_tab.style.display = "block";
      //   //       status_text.style.display = "none";
      //   //     } else {
      //   //       video_tab.style.display = "none";
      //   //       status_text.style.display = "block";
      //   //     }
      //   //   }
      //   // }
      // };
      // DailyIframe container element
      const callWrapper = this.$refs.callRef;
      // Create Daily call
      const callFrame = DailyIframe.createFrame(callWrapper, {
        iframeStyle: IFRAME_OPTIONS,
        showLeaveButton: true,
        theme: {
          colors: {
            // You can vizualize any changes on Figma at
            // https://www.figma.com/proto/D4V6bMJzrcF0CajydZfq8P/Daily-Prebuilt-Dark-Theme?node-id=303%3A1449
            accent: "#E83551",
            accentText: "#121A24",
            background: "#121A24",
            backgroundAccent: "#121A24",
            baseText: "#FFFFFF",
            border: "#2B3F56",
            mainAreaBg: "#121A24",
            mainAreaBgAccent: "#2B3F56",
            mainAreaText: "#FFFFFF",
            supportiveText: "#C8D1DC",
          },
        },
      });
      this.callFrame = callFrame;
      //this.sharing = false;
      // Add event listeners and join call
      callFrame
        .on("loaded", logEvent)
        .on("started-camera", logEvent)
        .on("camera-error", logEvent)
        .on("joining-meeting", goToLobby)
        .on("joined-meeting", goToCall)
        .on("left-meeting", leaveCall);
      //.on("participant-updated", safeScreenShareWatcher);
      callFrame.join({ url, showFullscreenButton: true });
    },
    submitJoinRoom(e) {
      e.preventDefault();
      this.joinRoom(this.roomUrl);
    },
    validateInput(e) {
      this.validRoomURL = !!this.roomUrl && e.target.checkValidity();
    },
  },
};
</script>
<style>
:root {
  --white: #ffffff;
  --grey: #c8d1dc;
  --dark-grey: #6b7785;
  --dark-blue: #1f2d3d;
  --dark-blue-border: #2b3f56;
  --teal: #1bebb9;
  --red-dark: #bb0c0c;
  --font-family: GraphikRegular, "Helvetica Neue", Sans-Serif;
}
</style>
<style scoped>
body {
  margin: 0;
}
.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.wrapper {
  position: absolute;
  background-color: #121a24;
  width: Calc(100% - 55px);
  height: 100vh;
  display: flex;
  align-items: center;
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  z-index: -1;
  margin: 0px;
  top: 0;
}

.text {
  margin-right: 50px;
}
.home {
  flex: 1;
}
.error {
  color: var(--red-dark);
}
.call-container {
  display: flex;
  margin: auto;
  flex: 1;
  flex-wrap: wrap;
  z-index: 5;
}
.screenshare-status {
  display: none;
  margin: auto;
  color: white;
  flex: 1;
  text-align: center;
  flex-wrap: wrap;
  z-index: 4;
}
.call-container.hidden {
  flex: 0;
}
#call {
  flex: 1;
}
.start-call-container {
  display: flex;
  flex-direction: column;
  max-width: 200px;
  margin: auto;
}
.start-call-container .subtext {
  margin: 8px 0 0;
}
.start-call-container input {
  margin-top: 8px;
  height: 32px;
  border-radius: 8px;
  border: 1px solid var(--grey);
  padding: 0 16px;
}
.start-call-container button {
  color: var(--dark-blue);
  background: var(--teal);
  border: 1px solid transparent;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 16px;
}
.start-call-container input[type="submit"] {
  color: var(--dark-blue);
  background: var(--teal);
  border: 1px solid transparent;
  padding: 6px 16px 8px;
  border-radius: 8px;
  font-size: 12px;
  line-height: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 16px;
}
button:disabled,
.start-call-container input[type="submit"]:disabled {
  cursor: not-allowed;
  background: var(--white);
  border: 1px solid var(--grey);
}
label {
  opacity: 0;
  font-size: 1px;
}
.collapse-icon {
  position: absolute;
  bottom: 0;
  color: black;
  transition: 0.2s linear;
}
.collapse-icon2 {
  position: absolute;
  bottom: 0;
  color: black;
  transition: 0.2s linear;
  width: 100%;
}
.rotate-180 {
  transform: rotate(180deg);
  transition: 0.2s linear;
}
.mystyle {
  display: none;
}
.collapsed {
  width: 100%;
}
h2 {
  color: white;
}
h3 {
  color: white;
}
</style>
