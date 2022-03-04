#天气机器人开发教程

## 开发前准备

参考 [申请机器人账号流程](https://bot.q.qq.com/wiki/#%E6%8E%A5%E5%85%A5%E6%B5%81%E7%A8%8B)

## 快速开始

- 安装 Node.js

从官网 http://nodejs.cn/ 下载安装 Node.js，建议安装12以上版本。如果你的电脑系统是 macOS，也可以使用 homebrew 安装

```
brew install node
````

查看 node 版本

```
node -v
```

- 安装 Yarn

Yarn 是替代 npm 的包管理工具，本教程使用 Yarn 安装依赖。

```
npm install --global yarn
```

- 创建项目

打开命令行工具，进入需要创建工程的目录，执行以下命令

``` typescript
mkdir weather-robot
cd weather-robot
yarn init -y
```

- 安装依赖

本项目使用了以下依赖包：qq-guild-bot（qq机器人 NodeSDK）、axios（网络请求库）、typescript、ts-node（执行typescript代码）、nodemon（代码改变时自动重启服务）、@types/node（node类型提示）@types/ws（websocket类型提示）

```
yarn add qq-guild-bot axios
yarn add -D typescript ts-node nodemon @types/node
```

- 测试机器人连接

在项目目录下新建文件夹src，在src下新建index.ts，内容如下（APPID和TOKEN要需要替换成自己的机器人，可以在机器人后台管理端查看）

```
import { AvailableIntentsEventsEnum, createOpenAPI, createWebsocket, IMessage } from 'qq-guild-bot';

const botConfig = {
    appID: 'APPID', // 申请机器人时获取到的机器人 BotAppID
    token: 'TOKEN', // 申请机器人时获取到的机器人 BotToken
    intents: [AvailableIntentsEventsEnum.AT_MESSAGES], // 事件订阅,用于开启可接收的消息类型
    sandbox: false, // 沙箱支持，可选，默认false. v2.7.0+
};

// 创建 client
const client = createOpenAPI(botConfig);
// 创建 websocket 连接
const ws = createWebsocket(botConfig);

ws.on(AvailableIntentsEventsEnum.AT_MESSAGES, (data: { msg: IMessage }) => {
    console.log('[AT_MESSAGES] 事件接收 :', data);
    client.messageApi.postMessage(data.msg.channel_id, { content: '你好' }).then((res) => {
        console.log(res.data);
    }).catch((err) => {
        console.log(err);
    });
});
```

修改 package.json，添加 scripts 字段

```
{
  "name": "weather-robot",
  "version": "1.0.0",
  "main": "./src/index.ts",
  "author": "Next",
  "license": "MIT",
  "scripts": {
    "dev": "npx nodemon ./src/index.ts"
  },
  "dependencies": {
    "axios": "^0.26.0",
    "qq-guild-bot": "^2.8.2"
  },
  "devDependencies": {
    "@types/node": "^17.0.21",
    "@types/ws": "^8.5.2",
    "nodemon": "^2.0.15",
    "ts-node": "^10.6.0",
    "typescript": "^4.6.2"
  }
}
```

命令行启动服务

```
yarn dev
```

在频道内@机器人任意内容，收到机器人回复“你好”代表连接成功