<script>
import VueWhiteboard from "../components/vue-whiteboard";
import tinycolor from "tinycolor2";
export default {
  name: "Whiteboard",
  components: {
    VueWhiteboard,
  },
  data: () => ({
    isConnected: false,
    socketMessage: "",
    color: "#f01414",
    size: "10",
    backgroundColor: "#000000",
    textColor: "white",
    colorHover: "#f01414",
  }),
  sockets: {
    connect() {
      this.isConnected = true;
    },
    disconnect() {
      this.isConnected = false;
    },
    whiteboard_dragstart_relay() {
      var wb = this.$refs.whiteboard;
      wb.simulate_start();
    },
    whiteboard_drag_relay(event) {
      var wb = this.$refs.whiteboard;
      wb.simulate_drag(event);
    },
    whiteboard_dragend_relay(event) {
      var wb = this.$refs.whiteboard;
      wb.simulate_end(event);
    },
    whiteboard_undo_relay() {
      var wb = this.$refs.whiteboard;
      wb.simulate_undo();
    },
    whiteboard_redo_relay() {
      var wb = this.$refs.whiteboard;
      wb.simulate_redo();
    },
    whiteboard_clear_relay() {
      var wb = this.$refs.whiteboard;
      wb.simulate_clear();
    },
    update_color_relay(c) {
      this.set_color(c);
    },
    update_size_relay(s) {
      this.size = s;
    },
    sync_up(data) {
      var wb = this.$refs.whiteboard;
      var state = data[2];
      if (state !== null) {
        var colors = state.colors;
        var sizes = state.sizes;
        for (var i = 0; i < state.strokes.length; i++) {
          wb.load_stroke(state.strokes[i], colors[i], sizes[i]);
        }
      }
      var c = data[3];
      if (c !== null) {
        this.set_color(c);
      }
      var s = data[4];
      if (s !== null) {
        this.size = s;
      }
    },
  },
  mounted() {
    const cursor = document.querySelector(".cursor");
    document.addEventListener("mousemove", (e) => {
      cursor.setAttribute(
        "style",
        "top: " +
          (e.clientY - Math.floor(this.size / 2)) +
          "px; left: " +
          (e.clientX - Math.floor(this.size / 2)) +
          "px;" +
          "width: " +
          this.size +
          "px;" +
          "height: " +
          this.size +
          "px;"
      );
    });
    document.addEventListener("mouseleave", (e) => {
      cursor.setAttribute(
        "style",
        "top: " +
          (e.clientY - Math.floor(this.size / 2)) +
          "px; left: " +
          (e.clientX - Math.floor(this.size / 2)) +
          "px;" +
          "width: " +
          "0 px;" +
          "height: " +
          "0 px;"
      );
    });
  },
  methods: {
    whiteboard_dragstart() {
      this.$socket.emit("whiteboard_dragstart");
    },
    whiteboard_drag(event) {
      this.$socket.emit("whiteboard_drag", event);
    },
    whiteboard_dragend(event) {
      const state = this.$refs.whiteboard.get_state();
      this.$socket.emit("whiteboard_dragend", event, state);
    },
    whiteboard_undo(event) {
      const state = this.$refs.whiteboard.get_state();
      this.$socket.emit("whiteboard_undo", event, state);
    },
    whiteboard_redo(event) {
      const state = this.$refs.whiteboard.get_state();
      this.$socket.emit("whiteboard_redo", event, state);
    },
    whiteboard_clear(event) {
      const state = this.$refs.whiteboard.get_state();
      this.$socket.emit("whiteboard_clear", event, state);
    },
    update_color(c) {
      this.set_color(c);
      this.$socket.emit("update_color", c);
    },
    update_size(s) {
      this.$socket.emit("update_size", s);
    },
    set_color(c) {
      this.color = c;
      this.colorHover = this.color;
      var color1 = tinycolor(c);
      if (color1.isLight()) {
        this.textColor = "black";
      }
      if (color1.isDark()) {
        this.textColor = "white";
      }
      if (color1.getBrightness() < 25) {
        this.colorHover = "#404040";
      }
    },
  },
};
</script>

<style scoped lang="scss">
html,
body,
#app {
  margin: 0;
  height: 100%;
}

.whiteboard {
  border: 1px solid v-bind(backgroundColor);
  color: red;
  padding: 5px;
  width: 100%;
  height: 500vh;
  cursor: none;
  //cursor: url("../cursor.svg") 5 5, crosshair;
}

.cursor {
  width: 10px;
  height: 10px;
  background-color: v-bind(colorHover);
  border-radius: 50%;
  position: fixed;
  pointer-events: none;
}

.draw-button {
  position: relative;
  color: white;
  margin-top: -60px;
  height: 20%;
  width: 7%;
  border: 1px solid white;
}

.draw-button:hover {
  background-color: v-bind(colorHover);
  color: v-bind(textColor);
  border: 1px solid white;
}

.color-picker-container {
  position: relative;
  color: white;
  margin-top: -60px;
  height: 38px;
  width: 7%;
  padding: 0px;
  border-radius: 4px;
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='white'><polygon points='0,0 100,0 50,50'/></svg>")
    no-repeat;
  background-size: 12px;
  background-position: calc(100% - 10px) center;
  background-repeat: no-repeat;
}

select:focus {
  box-shadow: none;
  outline: none;
}

.size-picker-container {
  position: relative;
  color: white;
  margin-top: -60px;
  height: 38px;
  width: 7%;
  border: 1px solid white;
  border-radius: 4px;
}

.size-picker-container:hover {
  background-color: v-bind(colorHover);
  color: v-bind(textColor);
  border: 1px solid white;
}
.size-picker-container:focus {
  background-color: v-bind(colorHover);
  color: v-bind(textColor);
  border: 1px solid white;
}

input {
  -webkit-appearance: none;
  border: 1px solid white;
  height: 38px;
  width: 100%;
  background: none;
  padding: 0px;
  border-radius: 4px;
}

input::-webkit-color-swatch {
  border: none;
  border-radius: 3px;
}
input::-webkit-color-swatch-wrapper {
  border: none;
  border-radius: 3px;
}
input::-moz-color-swatch {
  border: none;
  border-radius: 3px;
}
input::-moz-color-swatch-wrapper {
  border: none;
  border-radius: 3px;
}

.container {
  max-width: 95%;
  position: fixed;
  margin-left: 35px;
  bottom: 0px;
}
</style>
<template>
  <div>
    <vue-whiteboard
      class="whiteboard"
      :color="color"
      :size="size"
      @dragstart="whiteboard_dragstart()"
      @drag="whiteboard_drag($event)"
      @dragend="whiteboard_dragend($event)"
      @undo="whiteboard_undo($event)"
      @redo="whiteboard_redo($event)"
      @clear="whiteboard_clear($event)"
      ref="whiteboard"
    />
    <div class="container">
      <div class="row">
        <select
          v-model="size"
          class="col-1 dropdown-toggle size-picker-container"
          value="10"
          @change="update_size(size)"
        >
          <option value="1">1</option>
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </select>

        <div
          class="btn btn-outline-primary col-1 draw-button"
          @click="$refs.whiteboard.clear"
        >
          clear
        </div>
        <div
          class="btn btn-outline-primary col-1 draw-button"
          @click="$refs.whiteboard.undo"
        >
          undo
        </div>
        <div
          class="btn btn-outline-primary col-1 draw-button"
          @click="$refs.whiteboard.redo"
        >
          redo
        </div>
        <div
          class="btn btn-outline-primary col-1 draw-button"
          @click="
            color = backgroundColor;
            update_color(color);
          "
        >
          erase
        </div>
        <div class="col-1 color-picker-container">
          <input type="color" v-model="color" @input="update_color(color)" />
        </div>
      </div>
    </div>
    <div class="cursor"></div>
  </div>
</template>
