<script>
import { collapsed, toggleSidebar, sidebarWidth } from "./state";
import Whiteboard from "../../views/Whiteboard";
import Codeboard from "../../views/Codeboard";
import Home from "../../views/Home";
import Swal from "sweetalert2";

export default {
  props: {
    selectedece: Boolean,
  },
  components: {
    whiteboard: Whiteboard,
    codeboard: Codeboard,
    video: Home,
  },
  setup() {
    return { collapsed, toggleSidebar, sidebarWidth };
  },
  methods: {
    get_about_window() {
      Swal.fire({
        position: "center",
        color: "white",
        title: "About TutorCollab",
        background: "#292d34",
        text:
          "TutorChat, made by CollabLab, is an all-in-one collaboration and communication solution created for " +
          "Troy Tutors users. It allows users to write code together in real-time, run it, draw on virtual " +
          "whiteboards, hold one-on-one and group video calls, host live lectures and webinars, chat, and screen " +
          "share. Outside of CollabLab, an all-in-one solution for all of these tasks does not exist anywhere else in the world!",
        icon: "info",
        iconColor: "#dc1c13",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc1c13",
      });
    },
    get_bug_window() {
      Swal.fire({
        position: "center",
        color: "white",
        background: "#292d34",
        text: "If you run into any issues or discover any bugs on TutorChat, please report them to bugs@troytutors.com",
        icon: "question",
        iconColor: "#dc1c13",
        confirmButtonText: "OK",
        confirmButtonColor: "#dc1c13",
      });
    },
    no_settings() {
      Swal.fire({
        position: "center",
        color: "white",
        background: "#292d34",
        title: "Settings",
        text: "Coming soon!",
        icon: "warning",
        iconColor: "#dc1c13",
        confirmButtonText: "Cool",
        confirmButtonColor: "#dc1c13",
      });
    },
  },
  data() {
    return {
      component: "video",
      videoColor: true,
      whiteboardColor: false,
      codeboardColor: false,
    };
  },
};
</script>

<template>
  <div>
    <div class="sidebar-top" :style="{ width: sidebarWidth }">
      <button class="button-ends" v-on:click="get_about_window">
        <i class="fa-solid fa-circle-info"></i>
      </button>
      <br />
      <a
        class="button-ends"
        href="https://www.troytutors.com/"
        target="_blank"
        style="color: white; text-decoration: none; text-align: center"
      >
        <i class="fa-solid fa-calendar-days"></i>
      </a>
    </div>
    <div class="sidebar" :style="{ width: sidebarWidth }">
      <div>
        <button
          class="button"
          :class="{ background: videoColor }"
          v-on:click="
            (videoColor = true),
              (whiteboardColor = false),
              (codeboardColor = false),
              (component = 'video')
          "
        >
          <i class="fa-solid fa-video"></i>
        </button>
        <br />
        <button
          class="button"
          :class="{ background: whiteboardColor }"
          v-on:click="
            videoColor = false;
            whiteboardColor = true;
            codeboardColor = false;
            component = 'whiteboard';
            this.$socket.emit('sync_request');
          "
        >
          <i class="fa-solid fa-chalkboard-user"></i>
        </button>
        <br />
        <button
          class="button"
          :class="{ background: codeboardColor }"
          v-on:click="
            videoColor = false;
            whiteboardColor = false;
            codeboardColor = true;
            component = 'codeboard';
            this.$socket.emit('sync_request');
          "
        >
          <i class="fa-solid fa-laptop-code"></i>
        </button>
      </div>
    </div>
    <div class="sidebar-bottom" :style="{ width: sidebarWidth }">
      <a
        class="button-ends"
        href="https://www.troytutors.com/filesharing/227d31c1-701b-44d6-a870-cb40d42b7dc4"
        target="_blank"
        style="color: white; text-decoration: none; text-align: center"
      >
        <i class="fa-solid fa-paperclip"></i>
      </a>
      <br />
      <button class="button-ends" v-on:click="get_bug_window">
        <i class="fa-solid fa-bug"></i>
      </button>
    </div>
    <component class="page" v-bind:is="component"></component>
  </div>
</template>

<style>
:root {
  --sidebar-bg-color: #dc1c13;
  --sidebar-item-hover: #f1959b;
  --sidebar-item-active: #ea4c46;
}
</style>

<style scoped>
h1 {
  text-align: center;
}
.sidebar {
  color: white;
  background-color: var(--sidebar-bg-color);
  float: left;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  bottom: 0;
  padding: 0.5em;
  transition: 0.3s ease;
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.sidebar-bottom {
  color: white;
  float: left;
  position: fixed;
  z-index: 1;
  bottom: 0;
  padding: 0.5em;
  transition: 0.3s ease;
  display: flex;
  flex-direction: column;
}
.sidebar-top {
  color: white;
  float: left;
  position: fixed;
  z-index: 2;
  top: 0;
  padding: 0.5em;
  transition: 0.3s ease;
  display: flex;
  flex-direction: column;
}
.sidebar h1 {
  height: 2.5em;
}
.page {
  margin-left: 50px;
}
.button {
  background-color: var(--sidebar-bg-color);
  border: none;
  border-radius: 5px;
  color: white;
  margin-bottom: 70px;
  padding: 10px 10px;
}
.button-ends {
  background-color: var(--sidebar-bg-color);
  border: none;
  border-radius: 5px;
  color: white;
  padding: 10px 10px;
}
.button:hover {
  background-color: var(--sidebar-item-hover);
}
.button-ends:hover {
  background-color: var(--sidebar-item-hover);
}

.background {
  background-color: var(--sidebar-item-active);
}
</style>
