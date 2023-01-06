<script>
import CodeMirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/python/python.js";
import "codemirror/mode/clike/clike.js";
import "codemirror/mode/vhdl/vhdl.js";
import "codemirror/mode/gfm/gfm.js";
import "codemirror/mode/verilog/verilog.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/edit/closebrackets.js";
import "codemirror/addon/edit/matchtags.js";
import "codemirror/addon/edit/closetag.js";
import "codemirror/keymap/sublime";

export var editor = null;

export default {
  props: ["code", "cursor", "language"],

  data() {
    return {
      echo: true,
    };
  },

  mounted() {
    const textarea = document.querySelector("#editor_code");

    editor = CodeMirror.fromTextArea(textarea, {
      mode: this.language,
      lineWrapping: true,
      theme: "dracula",
      tabSize: 2,
      lineNumbers: true,
      indentWithTabs: true,
      matchBrackets: true,
      autoCloseBrackets: true,
      matchTags: true,
      autoCloseTags: true,
      keyMap: "sublime",
    });
    editor.setSize("100%", "100%");

    editor.on("change", () => {
      let cursorPosition = editor.getCursor();
      let new_num_lines = editor.lineCount();
      this.$emit("cursor", cursorPosition);
      if (this.echo) {
        this.$emit(
          "edit",
          editor.getValue(),
          cursorPosition.line,
          new_num_lines
        );
      }
      this.echo = true;
    });
  },

  watch: {
    active() {
      let cursorPosition = editor.getCursor();
      editor.setValue(this.code);
      editor.setCursor(cursorPosition);
    },
    code() {
      this.echo = false;
      let cursorPosition = editor.getCursor();
      let prev_line_count = editor.lineCount();
      var scroll_info = editor.getScrollInfo();
      var top = scroll_info.top;
      var left = scroll_info.left;
      editor.setValue(this.code);
      let new_line_count = editor.lineCount();
      // move cursor down one line, if it was on the last line, before a new line
      // from above was entered
      // waiting to update the cursor until after the code update, in this case,
      // prevents an out of bounds when placing the cursor on the last, new, line
      if (
        new_line_count == prev_line_count + 1 &&
        cursorPosition.line == prev_line_count - 1
      ) {
        cursorPosition.line = cursorPosition.line + 1;
      }
      editor.setCursor(cursorPosition);
      editor.scrollTo(left, top);
    },
  },
};

export const code_greeting = `'''
Welcome to the CollabLab Codeboard!

Here are some coding shortcuts, if you need them:

On PC:
  "Shift-Tab": "indentLess",
  "Shift-Ctrl-K": "deleteLine",
  "Alt-Q": "wrapLines",
  "Ctrl-T": "transposeChars",
  "Alt-Left": "goSubwordLeft",
  "Alt-Right": "goSubwordRight",
  "Ctrl-Up": "scrollLineUp",
  "Ctrl-Down": "scrollLineDown",
  "Ctrl-L": "selectLine",
  "Shift-Ctrl-L": "splitSelectionByLine",
  "Esc": "singleSelectionTop",
  "Ctrl-Enter": "insertLineAfter",
  "Shift-Ctrl-Enter": "insertLineBefore",
  "Ctrl-D": "selectNextOccurrence",
  "Shift-Ctrl-Space": "selectScope",
  "Shift-Ctrl-M": "selectBetweenBrackets",
  "Ctrl-M": "goToBracket",
  "Shift-Ctrl-Up": "swapLineUp",
  "Shift-Ctrl-Down": "swapLineDown",
  "Ctrl-/": "toggleCommentIndented",
  "Ctrl-J": "joinLines",
  "Shift-Ctrl-D": "duplicateLine",
  "F9": "sortLines",
  "Shift-F9": "reverseSortLines",
  "Ctrl-F9": "sortLinesInsensitive",
  "Shift-Ctrl-F9": "reverseSortLinesInsensitive",
  "F2": "nextBookmark",
  "Shift-F2": "prevBookmark",
  "Ctrl-F2": "toggleBookmark",
  "Shift-Ctrl-F2": "clearBookmarks",
  "Alt-F2": "selectBookmarks",
  "Backspace": "smartBackspace",
  "Ctrl-K Ctrl-D": "skipAndSelectNextOccurrence",
  "Ctrl-K Ctrl-K": "delLineRight",
  "Ctrl-K Ctrl-U": "upcaseAtCursor",
  "Ctrl-K Ctrl-L": "downcaseAtCursor",
  "Ctrl-K Ctrl-Space": "setSublimeMark",
  "Ctrl-K Ctrl-A": "selectToSublimeMark",
  "Ctrl-K Ctrl-W": "deleteToSublimeMark",
  "Ctrl-K Ctrl-X": "swapWithSublimeMark",
  "Ctrl-K Ctrl-Y": "sublimeYank",
  "Ctrl-K Ctrl-C": "showInCenter",
  "Ctrl-K Ctrl-G": "clearBookmarks",
  "Ctrl-K Ctrl-Backspace": "delLineLeft",
  "Ctrl-K Ctrl-1": "foldAll",
  "Ctrl-K Ctrl-0": "unfoldAll",
  "Ctrl-K Ctrl-J": "unfoldAll",
  "Ctrl-Alt-Up": "addCursorToPrevLine",
  "Ctrl-Alt-Down": "addCursorToNextLine",
  "Ctrl-F3": "findUnder",
  "Shift-Ctrl-F3": "findUnderPrevious",
  "Alt-F3": "findAllUnder",
  "Shift-Ctrl-[": "fold",
  "Shift-Ctrl-]": "unfold",
  "Ctrl-I": "findIncremental",
  "Shift-Ctrl-I": "findIncrementalReverse",
  "Ctrl-H": "replace",
  "F3": "findNext",
  "Shift-F3": "findPrev",
  "fallthrough": "pcDefault"

On Mac:
  "Cmd-Left": "goLineStartSmart",
  "Shift-Tab": "indentLess",
  "Shift-Ctrl-K": "deleteLine",
  "Alt-Q": "wrapLines",
  "Ctrl-Left": "goSubwordLeft",
  "Ctrl-Right": "goSubwordRight",
  "Ctrl-Alt-Up": "scrollLineUp",
  "Ctrl-Alt-Down": "scrollLineDown",
  "Cmd-L": "selectLine",
  "Shift-Cmd-L": "splitSelectionByLine",
  "Esc": "singleSelectionTop",
  "Cmd-Enter": "insertLineAfter",
  "Shift-Cmd-Enter": "insertLineBefore",
  "Cmd-D": "selectNextOccurrence",
  "Shift-Cmd-Space": "selectScope",
  "Shift-Cmd-M": "selectBetweenBrackets",
  "Cmd-M": "goToBracket",
  "Cmd-Ctrl-Up": "swapLineUp",
  "Cmd-Ctrl-Down": "swapLineDown",
  "Cmd-/": "toggleCommentIndented",
  "Cmd-J": "joinLines",
  "Shift-Cmd-D": "duplicateLine",
  "F5": "sortLines",
  "Shift-F5": "reverseSortLines",
  "Cmd-F5": "sortLinesInsensitive",
  "Shift-Cmd-F5": "reverseSortLinesInsensitive",
  "F2": "nextBookmark",
  "Shift-F2": "prevBookmark",
  "Cmd-F2": "toggleBookmark",
  "Shift-Cmd-F2": "clearBookmarks",
  "Alt-F2": "selectBookmarks",
  "Backspace": "smartBackspace",
  "Cmd-K Cmd-D": "skipAndSelectNextOccurrence",
  "Cmd-K Cmd-K": "delLineRight",
  "Cmd-K Cmd-U": "upcaseAtCursor",
  "Cmd-K Cmd-L": "downcaseAtCursor",
  "Cmd-K Cmd-Space": "setSublimeMark",
  "Cmd-K Cmd-A": "selectToSublimeMark",
  "Cmd-K Cmd-W": "deleteToSublimeMark",
  "Cmd-K Cmd-X": "swapWithSublimeMark",
  "Cmd-K Cmd-Y": "sublimeYank",
  "Cmd-K Cmd-C": "showInCenter",
  "Cmd-K Cmd-G": "clearBookmarks",
  "Cmd-K Cmd-Backspace": "delLineLeft",
  "Cmd-K Cmd-1": "foldAll",
  "Cmd-K Cmd-0": "unfoldAll",
  "Cmd-K Cmd-J": "unfoldAll",
  "Ctrl-Shift-Up": "addCursorToPrevLine",
  "Ctrl-Shift-Down": "addCursorToNextLine",
  "Cmd-F3": "findUnder",
  "Shift-Cmd-F3": "findUnderPrevious",
  "Alt-F3": "findAllUnder",
  "Shift-Cmd-[": "fold",
  "Shift-Cmd-]": "unfold",
  "Cmd-I": "findIncremental",
  "Shift-Cmd-I": "findIncrementalReverse",
  "Cmd-H": "replace",
  "F3": "findNext",
  "Shift-F3": "findPrev",
  "fallthrough": "macDefault"

We hope you enjoy using the codeboard! If you have any feature requests, contact
support@troytutors.com
'''
`;
</script>

<template>
  <section id="editor">
    <textarea id="editor_code"></textarea>
  </section>
</template>
