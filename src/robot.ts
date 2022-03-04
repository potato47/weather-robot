import { createOpenAPI, createWebsocket, IMessage, IOpenAPI, MessageToCreate, AvailableIntentsEventsEnum, GetWsParam, Embed, DirectMessageToCreate } from 'qq-guild-bot';
import { EventEmitter } from 'ws';

export class Robot {

    client: IOpenAPI;
    ws: EventEmitter;

    static createEmbedMessage(title: string, thumbnail: string, items: string[]) {
        const message: Embed = { title, thumbnail: { url: thumbnail }, fields: [] };
        items.forEach(item => {
            message.fields!.push({ name: item });
        });
        return message;
    }

    static createArk24Message(title: string, subtitle: string, desc: string, img?: string) {
        const message = {
            template_id: 24, kv: [
                { key: "#TITLE#", value: title },
                { key: "#SUBTITLE#", value: subtitle },
                { key: "#METADESC#", value: desc },
                { key: "#IMGC#", value: img },
            ]
        };
        return message as any;
    }

    constructor(config: GetWsParam) {
        this.client = createOpenAPI(config); // 创建 client
        this.ws = createWebsocket(config); // 创建 websocket 连接
        this.client
    }

    setAtMessagesHandler(handler: (message: IMessage) => void) {
        this.ws.on(AvailableIntentsEventsEnum.AT_MESSAGES, (data: any) => {
            console.log('[AT_MESSAGES] 事件接收 :', data);
            handler(data.msg);
        });
    }

    setDirectMessagesHandler(handler: (message: IMessage) => void) {
        this.ws.on(AvailableIntentsEventsEnum.DIRECT_MESSAGE, (data: any) => {
            console.log('[DIRECT_MESSAGE] 事件接收 :', data);
            this.postDirectMessage(data.msg.guild_id, {
                content: '777',
                msg_id: data.msg.id,
            });
            handler(data.msg);
        });
    }

    postMessage(channelID: string, message: MessageToCreate) {
        this.client.messageApi.postMessage(channelID, message).then((res) => {
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }

    postDirectMessage(guildID: string, message: MessageToCreate) {
        this.client.directMessageApi.postDirectMessage(guildID, message).then((res) => {
            console.log(res.data);
        }).catch((err) => {
            console.log(err);
        });
    }

    async getDirectMessageGuildID(sourceGuildID: string, authorID: string) {
        const result = await this.client.directMessageApi.createDirectMessage({ source_guild_id: sourceGuildID, recipient_id: authorID });
        return result.data.guild_id;
    }

}
