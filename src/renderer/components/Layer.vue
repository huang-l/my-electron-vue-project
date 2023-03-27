<template>
  <div class="layer-wrapper">
    <div class="drag-header" v-mouse-drag="handleDrag">
      <div class="header-logo">
        <a-icon type="video-camera" />
        <span class="title">录屏客户端</span>
      </div>
      <div class="header-operate">
        <a-icon type="line" @click="operate('minimize')" />
        <a-icon :type="isMax ? 'switcher' : 'border'" @click="changeState" />
        <a-icon type="close" @click="operate('close')" />
      </div>
    </div>
    <div class="layer-container">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
export default {
  name: "Layer",
  data() {
    return {
      isMax: false,
    };
  },
  methods: {
    handleDrag(pos) {
      ipcRenderer.send("dashboard-move", {
        x: pos.x,
        y: pos.y,
      });
    },
    operate(way) {
      ipcRenderer.send(`dashboard-${way}`);
    },
    changeState() {
      this.operate(this.isMax ? "unmaximize" : "maximize");
      this.isMax = !this.isMax;
    },
  },
};
</script>

<style scoped>
.layer-wrapper {
  height: 100%;
}
.layer-wrapper .drag-header {
  height: 50px;
  padding: 0 10px;
  background-color: #000;
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.layer-wrapper .drag-header .header-logo {
  width: 100px;
  line-height: 50px;
}
.layer-wrapper .drag-header .header-logo .title {
  margin-left: 5px;
}
.layer-wrapper .drag-header .header-operate {
  width: 100px;
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.layer-wrapper .layer-container {
  height: calc(100% - 50px);
}
</style>
