import { Robot } from './robot.js';
import { WeatherService } from './weather-service.js';

const botConfig = {
    appID: process.env.ROBOT_ID, // 申请机器人时获取到的机器人 BotAppID
    token: process.env.ROBOT_TOKEN, // 申请机器人时获取到的机器人 BotToken
    intents: ['AT_MESSAGES'], // 事件订阅,用于开启可接收的消息类型
    sandbox: false, // 沙箱支持，可选，默认false. v2.7.0+
};

const defaultCity = '深圳';

const weatherService = new WeatherService();
const robot = new Robot(botConfig);
robot.addAtMessagesHandler(message => {
    if (message.content.includes('文字')) { // 被动消息
        robot.sendTextMessage(`你好${message.author.username}，这是一条文字消息`, message.channel_id, message.id);
    } else if (message.content.includes('图片')) {
        const imageUrl = 'https://www.tencent.com/img/index/tencent_logo.png';
        robot.sendImageMessage('这是图片消息', imageUrl, message.channel_id, message.id);
    } else {
        robot.sendEmbdMessage(null, message.channel_id, message.id);
    }
});



