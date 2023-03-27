<template>
  <Layer>
    <div class="container">
      <div class="screen-record">
        <div class="recode-operate">
          <p class="btn" @click="record">{{ isRecord ? "结束" : "录屏" }}</p>
          <p class="time">{{ transTime(timeStamp) }}</p>
        </div>
        <div class="list-box">
          <div class="video-list" v-for="item in files">
            <span class="name">{{ item }}</span>
            <span class="play" @click="playVideo(item)">播放</span>
            <span class="play" @click="openDir(item)">打开文件目录</span>
          </div>
        </div>
      </div>
      <div class="screen-preview">
        <img :src="previewImg" v-if="videoUrl === ''" />
        <video :src="videoUrl" v-else />
      </div>
    </div>
  </Layer>
</template>

<script>
import Layer from "@/components/Layer.vue";
import { desktopCapturer, ipcRenderer, screen } from "electron"; //桌面窗口捕获视频
import fs from "fs";
import path from "path";
export default {
  name: "Dashboard",
  components: { Layer },
  data() {
    return {
      isRecord: false,
      previewImg: "",
      recordObj: null,
      files: [],
      timer: null,
      timeStamp: 0,
      videoUrl: "",
    };
  },
  mounted() {
    this.getSource().then((source) => {
      this.previewImg = source.thumbnail.toDataURL();
    });
    this.files = this.getFiles();
  },
  methods: {
    // 转换时间
    transTime(time) {
      const h =
        Math.floor(time / 3600) < 10
          ? "0" + Math.floor(time / 3600)
          : Math.floor(time / 3600);
      const m =
        Math.floor((time / 60) % 60) < 10
          ? "0" + Math.floor((time / 60) % 60)
          : Math.floor((time / 60) % 60);
      const s =
        Math.floor(time % 60) < 10
          ? "0" + Math.floor(time % 60)
          : Math.floor(time % 60);
      return `${h}:${m}:${s}`;
    },
    getSource() {
      return new Promise((resolve) => {
        const { size, scaleFactor } = screen.getPrimaryDisplay();
        desktopCapturer.getSources(
          {
            types: ["window", "screen"],
            thumbnailSize: {
              width: size.width * scaleFactor,
              height: size.height * scaleFactor,
            },
          },
          (_, sources) => {
            const source = sources[0];
            resolve(source);
          }
        );
      });
    },
    // 获取录制的视频文件
    getFiles() {
      if (!fs.existsSync("d:/videos")) {
        return [];
      }
      const files = fs.readdirSync("d:/videos").filter((item) => {
        const filePath = path.join("d:/videos", item);
        return fs.statSync(filePath).isFile();
      });
      return files;
    },
    // 创建文件夹
    mkdir(pathUrl) {
      return new Promise((resolve) => {
        if (!fs.existsSync(pathUrl)) {
          const res = fs.mkdirSync(pathUrl, { recursive: true });
          res && resolve(true);
        } else {
          resolve(true);
        }
      });
    },
    // 开始录制
    recordStart(stream) {
      if (!this.timer) {
        this.timeStamp++;
        this.timer = setInterval(() => {
          this.timeStamp++;
        }, 1000);
      }
      this.isRecord = true;
      let blobSlice = [];
      this.recordObj = new MediaRecorder(stream, {
        mimeType: "video/webm",
      });
      this.recordObj.start(1000);
      this.recordObj.ondataavailable = (event) => {
        blobSlice.push(event.data);
      };
      this.recordObj.onstop = () => {
        if (this.timer) {
          clearInterval(this.timer);
          this.timer = null;
          this.timeStamp = 0;
        }
        this.isRecord = false;
        const blob = new Blob(blobSlice, { type: "video/webm" });
        const time = new Date().getTime();
        this.mkdir("d:/videos").then(() => {
          const reader = new FileReader();
          reader.readAsArrayBuffer(blob);
          reader.onload = () => {
            const buffer = Buffer.from(reader.result);
            fs.writeFile(
              path.join("d:/videos", `${time}.mp4`),
              buffer,
              (err, data) => {
                if (err) return;
                console.log("保存成功");
                this.files = this.getFiles();
              }
            );
          };
          reader.onloadend = () => {};
          reader.onerror = (err) => {
            console.log(err);
          };
        });
      };
      this.recordObj.onerror = (err) => {
        console.log(err);
      };
    },
    // 点击录制
    record() {
      if (this.isRecord) {
        this.recordObj && this.recordObj.stop();
        return;
      }
      this.getSource().then(async (source) => {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            mandatory: {
              chromeMediaSource: "desktop",
              chromeMediaSourceId: source.id,
              minWidth: 1280,
              maxWidth: 1280,
              minHeight: 720,
              maxHeight: 720,
            },
          },
        });
        this.recordStart(stream);
      });
    },
    // 播放视频
    playVideo(item) {
      // this.videoUrl = path.join("d:/videos", item);
      // console.log(this.videoUrl);
      alert("暂不支持！！！！！");
    },
    // 打开文件目录
    openDir(item) {
      ipcRenderer.send("open-dir", path.join("d:/videos", item));
    },
  },
};
</script>

<style scoped>
.container {
  height: 100%;
  padding: 10px;
  display: flex;
}
.container .screen-record {
  width: calc(40% - 2px);
  margin-right: 4px;
}
.container .screen-record .recode-operate {
  height: 150px;
  text-align: center;
}
.container .screen-record .recode-operate .btn {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: red;
  text-align: center;
  line-height: 80px;
  margin: 0 auto;
  color: #fff;
}
.container .screen-record .recode-operate .time {
  color: red;
  font-weight: bold;
  line-height: 50px;
}
.container .screen-record .list-box {
  border: 1px solid #000;
  height: calc(100% - 150px);
  padding: 0 10px;
  overflow: auto;
}
.container .screen-record .list-box .video-list {
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: space-around;
  border-bottom: 1px solid #000;
}
.container .screen-record .list-box .video-list:last-child {
  border: 0;
}
.container .screen-record .list-box .video-list .play {
  cursor: pointer;
}
.container .screen-preview {
  width: calc(60% - 2px);
  background-color: #ccc;
}
.container .screen-preview img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
