const { shallowRef } = require("vue")

<script>
import { reactive } from "vue";
import Editor from "../components/editor";
import { editor } from "../components/editor";
import { code_greeting } from "../components/editor";

const state = reactive({
  language: "python",
  cursor: { ch: 0, line: 0 },
  code: "",
});

export default {
  name: "Codeboard",
  components: {
    Editor,
  },
  data: () => ({
    isConnected: false,
    myStyle: {
      backgroundColor: "#0d1117",
    },
  }),
  sockets: {
    connect() {
      this.isConnected = true;
    },
    disconnect() {
      this.isConnected = false;
    },
    codeboard_relay(data) {
      let new_line = data[1];
      let new_num_lines = data[2];
      let curr_cursor = editor.getCursor();
      let curr_num_lines = editor.lineCount();
      state.code = data[0];
      this.update_curr_cursor_line(
        new_line,
        new_num_lines,
        curr_cursor,
        curr_num_lines
      );
    },
    language_relay(lang) {
      state.language = lang;
      editor.setOption("mode", state.language);
    },
    sync_up(data) {
      if (data[0] !== null) {
        if (data[0].length > 0) {
          state.code = data[0];
        } else {
          state.code = code_greeting;
        }
      } else {
        state.code = code_greeting;
      }
      editor.setValue(state.code);
      if (data[1] !== null) {
        state.language = data[1];
        editor.setOption("mode", state.language);
      }
    },
  },
  methods: {
    edit(code_value, new_line, new_num_lines) {
      this.$socket.emit(
        "codeboard_update",
        code_value,
        new_line,
        new_num_lines
      );
    },
    update_language(lang) {
      editor.setOption("mode", lang);
      this.$socket.emit("update_language", lang);
    },
    setCursor(payload) {
      state.cursor = { ...payload };
    },
    update_curr_cursor_line(
      new_line,
      new_num_lines,
      curr_cursor,
      curr_num_lines
    ) {
      // if new line was created above current cursor, move cursor down one line
      // avoid logic (until code update) if on last line
      if (
        new_num_lines > curr_num_lines &&
        new_line <= curr_cursor.line &&
        curr_cursor.line != curr_num_lines - 1
      ) {
        curr_cursor.line = curr_cursor.line + 1;
        state.cursor = curr_cursor;
      }
      // if new line was deleted above current cursor, move cursor up one line
      if (new_num_lines < curr_num_lines && new_line <= curr_cursor.line) {
        curr_cursor.line = Math.max(curr_cursor.line - 1, 0);
        state.cursor = curr_cursor;
      }
    },
  },
  setup() {
    return {
      state,
      log: console.log,
    };
  },
};
</script>

<template>
  <div :style="myStyle">
    <div>
      <select
        v-model="state.language"
        class="btn-secondary"
        value="Python"
        @change="update_language(state.language)"
      >
        <option value="python">Python</option>
        <option value="text/x-c++src">C++</option>
        <option value="text/x-csrc">C</option>
        <option value="text/x-java">Java</option>
        <option value="text/javascript">JavaScript</option>
        <option value="text/x-markdown">Markdown</option>
        <option value="text/x-vhdl">VHDL</option>
        <option value="text/x-verilog">Verilog</option>
        <option value="text/x-systemverilog">SystemVerilog</option>
      </select>
    </div>
    <div>
      <Editor
        :style="{ height: 'calc(100vh - 40px)' }"
        :code="state.code"
        :language="state.language"
        @edit="edit"
        @cursor="setCursor"
      />
    </div>
  </div>
</template>

<style scoped>
.btn-secondary {
  transform: translate(5px, 0) !important;
  width: 140px;
  height: 40px;
  border: none;
  text-align: center;
  background-color: #292d34;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100' fill='white'><polygon points='0,0 100,0 50,50'/></svg>")
    no-repeat;
  background-size: 12px;
  background-position: calc(100% - 10px) center;
  background-repeat: no-repeat;
  border: 1px solid white;
  border-radius: 4px;
}
.btn-secondary:hover {
  background-color: #292d34;
  border: 1px solid white;
  border-radius: 4px;
}
.btn-secondary:focus {
  background-color: #292d34;
  border: 1px solid white;
  border-radius: 4px;
  box-shadow: none;
  outline: none;
}

p {
  margin-bottom: 0px;
}
</style>
