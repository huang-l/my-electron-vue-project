// 启动页配置主进程
import { BrowserWindow } from "electron";
const events = require("events");

const winConfig = {
  show: false, // 初始化不显示窗口
  frame: false, // 窗口不显示边框
  focusable: true, // 窗口聚焦
  resizable: false, // 窗口不可手动调整大小
  webPreferences: {
    nodeIntegration: true, // 让渲染进程中可以写nodejs 需要将隔离去除才生效
    contextIsolation: false, // 去除上下文隔离 即取消主进程和渲染进程之间的隔离
  },
};

export default class Launch extends events {
  constructor(confInfo, url) {
    super();
    this.conf = Object.assign({}, winConfig, confInfo);
    this.winInstance = new BrowserWindow(this.conf);
    this.winInstance.loadURL(`${url}#/lauch`);
    this.init();
  }
  init() {
    this.winInstance.on("ready-to-show", () => {
      this.winInstance.show();
    });
    this.winInstance.on("show", () => {
      this.emit("show");
    });
  }
  close() {
    if (this.winInstance && this.winInstance.isVisible) {
      this.winInstance.close();
      this.winInstance = null;
    }
  }
}
