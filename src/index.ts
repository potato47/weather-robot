import { AvailableIntentsEventsEnum } from 'qq-guild-bot';
import { Robot } from './robot';
import { WeatherService } from './weather-service';
import * as cron from 'node-cron';

const botConfig = {
    appID: process.env.ROBOT_ID as string, // 申请机器人时获取到的机器人 BotAppID
    token: process.env.ROBOT_TOKEN as string, // 申请机器人时获取到的机器人 BotToken
    intents: [AvailableIntentsEventsEnum.AT_MESSAGES, AvailableIntentsEventsEnum.DIRECT_MESSAGE], // 事件订阅,用于开启可接收的消息类型
    sandbox: false, // 沙箱支持，可选，默认false. v2.7.0+
};

const defaultCity = '深圳';
let subWeatherChannelID: string;

const weatherService = new WeatherService();
const robot = new Robot(botConfig);
robot.setAtMessagesHandler(message => {
    const content = message.content;
    if (content.includes('订阅天气')) { // 订阅天气
        subWeatherChannelID = message.channel_id;
        robot.postMessage(message.channel_id, {
            content: '订阅成功',
            msg_id: message.id,
        });
        return;
    }
    if (content.includes('/深圳天气')) { // 文本+图片消息
        robot.postMessage(message.channel_id, {
            content: '深圳：晴',
            image: '',
        });
        return;
    }
    if (content.includes('/上海天气')) { // embed 消息
        const replyMessage = Robot.createEmbedMessage('上海', '', ['有雨', '有风', '有雪']);
        robot.postMessage(message.channel_id, {
            embed: replyMessage
        });
        return;
    }
    if (content.includes('/北京天气')) { // ark 消息
        const replyMessage = Robot.createArk24Message('北京天气', '大雨转小雨转中雨', '天气机器人');
        robot.postMessage(message.channel_id, {
            ark: replyMessage
        });
        return;
    }
    if (content.includes('/私信天气')) { // 私信消息
        robot.getDirectMessageGuildID(message.guild_id, message.author.id).then(guildID => {
            robot.postDirectMessage(guildID, {
                content: '这是一条私信消息',
            });
        });
        return;
    }
});

// 每天早上8点给订阅的频道发送天气预报
cron.schedule('0 0 8 * * *', () => {
    if (subWeatherChannelID) {
        robot.postDirectMessage(subWeatherChannelID, { content: '深圳天气晴' });
    }
});
