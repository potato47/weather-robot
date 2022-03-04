import { createOpenAPI, createWebsocket, IMessage, IOpenAPI, MessageToCreate } from 'qq-guild-bot';

export class Robot {
    client: IOpenAPI;
    ws: any;

    constructor(config: any) {
        this.client = createOpenAPI(config); // 创建 client
        this.ws = createWebsocket(config); // 创建 websocket 连接
    }

    addAtMessagesHandler(handler: (message: IMessage) => void) {
        this.ws.on('AT_MESSAGES', (data: any) => {
            console.log('[AT_MESSAGES] 事件接收 :', data);
            handler(data.msg);
        });
    }

    sendTextMessage(content: string, channelId: string, fromMessageId: string) {
        this.postMessage(channelId, {
            content: content,
            msg_id: fromMessageId,
        });
    }

    sendImageMessage(content: string, image: string, channelId: string, fromMessageId: string) {
        this.postMessage(channelId, {
            content: content,
            image: image,
            msg_id: fromMessageId,
        });
    }

    sendEmbdMessage(message: string, channelId: string, fromMessageId: string) {
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

    postMessage(channelId: string, message: MessageToCreate) {
        this.client.messageApi.postMessage(channelId, message).then((res) => {
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }
}
