"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Embed_1 = __importDefault(require("../utils/Embed"));
const Logger_1 = __importDefault(require("../utils/Logger"));
const Event_1 = require("../structures/Event");
const config_1 = __importDefault(require("../../config"));
const log = new Logger_1.default('GuildCreateEvent');
exports.default = new Event_1.Event('guildCreate', (client, guild) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const owner = yield guild.fetchOwner();
    const embed = new Embed_1.default(client, 'success')
        .setTitle(`${guild.name}서버에 배틀이를 초대해주셔서 감사합니다`)
        .setDescription(`- [웹 대시보드](https://battlebot.kr/) 에서 서버를 관리 하실수 있습니다 \n - 명령어는 \`/도움말\` 을 사용하여 확인 할 수 있습니다 \n\n [봇 서포트 서버](https://discord.gg/WtGq7D7BZm) | [상태](https://battlebot.kr/status) | [문의하기](https://teamarchive.channel.io)`);
    owner.send({ embeds: [embed] });
    const supprotguild = client.guilds.cache.get(config_1.default.guildAddAlert.guildID);
    if (!supprotguild)
        return;
    const supportAlertChannel = supprotguild.channels.cache.get(config_1.default.guildAddAlert.channelID);
    //const test = supprotguild.channels.cache.get('943747484025520198') as TextChannel
    if (!supportAlertChannel)
        return;
    const res = yield ((_a = client.shard) === null || _a === void 0 ? void 0 : _a.fetchClientValues('guilds.cache.size'));
    //return test.send(`서버 : ${guild.name}\n서버 아이디 : ${guild.id}`)
    return supportAlertChannel.send(`새로운 서버에 추가되었습니다. **(현재 서버수 : ${res === null || res === void 0 ? void 0 : res.reduce((acc, guilds) => Number(acc) + Number(guilds), 0)})**`);
}));
