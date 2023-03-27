// 大屏页配置主进程
import { app, BrowserWindow, ipcMain, shell } from "electron";
const events = require("events");

const winConfig = {
  title: "录屏客户端",
  show: false, // 初始化不显示窗口
  frame: false, // 窗口不显示边框
  focusable: true, // 窗口聚焦
  resizable: false, // 窗口不可手动调整大小
  webPreferences: {
    nodeIntegration: true, // 让渲染进程中可以写nodejs 需要将隔离去除才生效
    contextIsolation: false, // 去除上下文隔离 即取消主进程和渲染进程之间的隔离
  },
};

export default class Dashboard extends events {
  constructor(confInfo, url) {
    super();
    this.conf = Object.assign({}, winConfig, confInfo);
    this.winInstance = new BrowserWindow(this.conf);
    this.winInstance.loadURL(`${url}#/dashboard`);
    this.init();
  }
  init() {
    this.winInstance.on("ready-to-show", () => {
      this.winInstance.show();
    });
    this.winInstance.on("show", () => {
      this.emit("show");
    });
    this.listenIpc();
  }
  listenIpc() {
    // 移动窗口
    ipcMain.on("dashboard-move", (_, pos) => {
      this.winInstance && this.winInstance.setPosition(pos.x, pos.y);
    });
    // 最小化窗口
    ipcMain.on("dashboard-minimize", () => {
      this.winInstance.minimize();
    });
    // 最大化窗口
    ipcMain.on("dashboard-maximize", () => {
      this.winInstance.maximize();
    });
    // 最大化还原
    ipcMain.on("dashboard-unmaximize", () => {
      this.winInstance.unmaximize();
    });
    // 关闭窗口
    ipcMain.on("dashboard-close", () => {
      app.quit();
    });
    // 打开文件目录
    ipcMain.on("open-dir", (_, path) => {
      shell.showItemInFolder(path);
    });
  }
  close() {
    if (this.winInstance && this.winInstance.isVisible) {
      this.winInstance.close();
      this.winInstance = null;
    }
  }
}
