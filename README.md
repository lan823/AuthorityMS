# GID


## 特性

-   基于[react](https://github.com/facebook/react)，[ant-design](https://github.com/ant-design/ant-design)，[dva](https://github.com/dvajs/dva)
-   使用[roadhog](https://github.com/sorrycc/roadhog)本地调试和构建

## 更新日志

### 0.0.1

`2017-07-31`

-     master


## 开发构建

文件夹命名说明:

-   components：组件（方法）为单位以文件夹保存，文件夹名组件首字母大写（如`DataTable`），文件夹内主文件与文件夹同名，多文件以`index.js`导出对象（如`./src/components/DataTable`）。
-   routes：页面为单位以文件夹保存，文件夹名首字母小写（特殊除外，如`Home`）。

### 快速开始

进入目录安装依赖:

    npm install

开发：
npm start
打开 http://localhost:8000
开启模拟数据服务
json-server --watch db.json

