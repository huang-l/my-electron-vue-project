# electron-vue 项目实战

> https://simulatedgreg.gitbooks.io/electron-vue/content/cn/getting_started.html

## 项目初始化

1. npm install -g vue-cli
2. vue init simulatedgreg/electron-vue my-electron-vue-project 或 (1) vue init my-electron-vue-project (2) npm i electron -D (3) vue add electron-builder
3. cd my-electron-vue-project
4. yarn # 或者 npm install
5. yarn run dev # 或者 npm run dev
6. 若出现错误 `Object.fromEntries is not a function` 安装 polyfill-object.fromentries `npm i polyfill-object.fromentries` 并在.electron-vue>dev-client 中引入 `import 'polyfill-object.fromentries';`
7. 若出现错误 `GET http://localhost:9080/__webpack_hmr 404 (Not Found)` 在.electron-vue>dev-runner 中注释 hot:true 将 app.use(hotMiddleware)注释打开

## 项目打包

1. npm run build
2. 若出现错误 `Identifier ‘tasks’ has already been declared` 在.electron-vue>build 中将 tasks 改成 task1
3. 若出现错误 `Multispinner is not defined` 安装 multispinner 模块 `npm i  multispinner` 并在.electron-vue>build 中引入`const Multispinner = require('multispinner')`
4. 若出现下载包问题 多执行几次`npm run build`
