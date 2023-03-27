// 启动页配置主进程
import { BrowserWindow, ipcMain } from "electron";
const events = require("events");

const winConfig = {
  frame: false, // 窗口不显示边框
  focusable: false, // 窗口聚焦
  resizable: false, // 窗口不可手动调整大小
  transparent: true, // 窗口透明
  alwaysOnTop: true, // 在顶部
  webPreferences: {
    nodeIntegration: true, // 让渲染进程中可以写nodejs 需要将隔离去除才生效
    contextIsolation: false, // 去除上下文隔离 即取消主进程和渲染进程之间的隔离
    devTools: false, //关闭调试工具
  },
};

export default class Suspend extends events {
  constructor(confInfo, url) {
    super();
    this.conf = Object.assign({}, winConfig, confInfo);
    this.winInstance = new BrowserWindow(this.conf);
    this.winInstance.loadURL(`${url}#/suspend`);
    this.listenIpc();
  }
  listenIpc() {
    // 移动窗口
    ipcMain.on("suspend-move", (_, pos) => {
      this.winInstance && this.winInstance.setPosition(pos.x, pos.y);
    });
  }
}
