import { createOpenAPI, createWebsocket } from 'qq-guild-bot';

export class Robot {
    client = null;
    ws = null;

    constructor(config) {
        this.client = createOpenAPI(config); // 创建 client
        this.ws = createWebsocket(config); // 创建 websocket 连接
    }

    addAtMessagesHandler(handler) {
        this.ws.on('AT_MESSAGES', (data) => {
            console.log('[AT_MESSAGES] 事件接收 :', data);
            handler(data.msg);
        });
    }

    sendTextMessage(content, channelId, fromMessageId) {
        this.postMessage(channelId, {
            content: content,
            msg_id: fromMessageId,
        });
    }

    sendImageMessage(content, image, channelId, fromMessageId) {
        this.postMessage(channelId, {
            content: content,
            image: image,
            msg_id: fromMessageId,
        });
    }

    sendEmbdMessage(message, channelId, fromMessageId) {
        this.postMessage(channelId, {
            "embed": {
                "title": "标题",
                "prompt": "消息通知",
                "thumbnail": {
                    "url": "xxxxxx"
                },
                "fields": [
                    {
                        "name": "当前等级：黄金"
                    },
                    {
                        "name": "之前等级：白银"
                    },
                    {
                        "name": "😁继续努力"
                    }
                ]
            },
            msg_id: fromMessageId,
        });
    }

    postMessage(channelId, message) {
        this.client.messageApi.postMessage(channelId, message).then((res) => {
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }
}
