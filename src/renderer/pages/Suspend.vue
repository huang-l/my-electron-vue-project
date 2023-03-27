<template>
  <div class="suspend-ball" v-mouse-drag="handleDrag">00:00:00</div>
</template>

<script>
//
import { ipcRenderer } from "electron";
export default {
  name: "Suspend",
  methods: {
    handleDrag(pos) {
      ipcRenderer.send("suspend-move", {
        x: pos.x,
        y: pos.y,
      });
    },
  },
};
</script>

<style>
html,
body {
  border-radius: 50%;
  background: transparent !important;
}

.suspend-ball {
  user-select: none;
  height: 100%;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #5bc6ef;
  color: #fff;
}
</style>
