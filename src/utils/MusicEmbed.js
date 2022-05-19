"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("../../config"));
class Embed extends discord_js_1.MessageEmbed {
    constructor(client, track) {
        var _a, _b, _c;
        if (!client.isReady())
            return;
        const EmbedJSON = {
            color: '#2f3136',
            timestamp: new Date(),
            footer: {
                text: client.user.username,
                icon_url: (_a = client.user.avatarURL()) !== null && _a !== void 0 ? _a : undefined
            }
        };
        if (!track) {
            EmbedJSON.author = {
                name: '재생 중인 노래',
                iconURL: 'https://cdn.discordapp.com/emojis/667750713698549781.gif?v=1'
            };
            EmbedJSON.title = '❌ 노래가 재생 중이지 않아요!\n 해당 채널에 노래 제목을 입력해주세요!';
            EmbedJSON.description = `[대시보드](${(_b = config_1.default.web) === null || _b === void 0 ? void 0 : _b.baseurl}) | [서포트 서버](https://discord.gg/WtGq7D7BZm) | [상태](https://battlebot.kr/status)`;
            EmbedJSON.image = {
                url: 'https://cdn.discordapp.com/attachments/901745892418256910/941301364095586354/46144c4d9e1cf2e6.png'
            };
        }
        else {
            EmbedJSON.author = {
                name: '재생 중인 노래',
                iconURL: 'https://cdn.discordapp.com/emojis/667750713698549781.gif?v=1',
                url: track.url
            };
            EmbedJSON.description = `[대시보드](${(_c = config_1.default.web) === null || _c === void 0 ? void 0 : _c.baseurl}) | [서포트 서버](https://discord.gg/WtGq7D7BZm) | [상태](https://battlebot.kr/status)`;
            EmbedJSON.title = `${track.title} - ${track.author} (${track.duration})`;
            EmbedJSON.image = {
                url: 'https://cdn.discordapp.com/attachments/901745892418256910/941301364095586354/46144c4d9e1cf2e6.png'
            };
            EmbedJSON.thumbnail = {
                url: track.thumbnail
                    ? track.thumbnail
                    : 'https://cdn.discordapp.com/attachments/901745892418256910/941249525069262888/image0_1.png'
            };
        }
        super(EmbedJSON);
    }
}
exports.default = Embed;
