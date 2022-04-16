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
const Event_1 = require("../structures/Event");
const DateFormatting_1 = __importDefault(require("../utils/DateFormatting"));
const LogSettingSchema_1 = __importDefault(require("../schemas/LogSettingSchema"));
const Embed_1 = __importDefault(require("../utils/Embed"));
const discord_js_1 = require("discord.js");
exports.default = new Event_1.Event('messageDeleteBulk', (client, messages) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    (_b = (_a = messages.first()) === null || _a === void 0 ? void 0 : _a.guild) === null || _b === void 0 ? void 0 : _b.id;
    const LoggerSettingDB = yield LogSettingSchema_1.default.findOne({
        guild_id: (_d = (_c = messages.first()) === null || _c === void 0 ? void 0 : _c.guild) === null || _d === void 0 ? void 0 : _d.id
    });
    if (!LoggerSettingDB)
        return;
    if (!LoggerSettingDB.useing.deleteMessage)
        return;
    const logChannel = (_f = (_e = messages
        .first()) === null || _e === void 0 ? void 0 : _e.guild) === null || _f === void 0 ? void 0 : _f.channels.cache.get(LoggerSettingDB.guild_channel_id);
    if (!logChannel)
        return;
    const channel = (_g = messages.first()) === null || _g === void 0 ? void 0 : _g.channel;
    let humanLog = `**삭제된 메시지들 #${channel.name} (${channel.id}) 서버 ${channel.guild.name} (${channel.guild.id})**`;
    for (const message of [...messages.values()].reverse()) {
        humanLog += `\r\n\r\n[${DateFormatting_1.default.date(message.createdAt)}] ${(_j = (_h = message.author) === null || _h === void 0 ? void 0 : _h.tag) !== null && _j !== void 0 ? _j : '찾을 수 없음'} (${message.id})`;
        humanLog += ' : ' + message.content;
    }
    const attachment = new discord_js_1.MessageAttachment(Buffer.from(humanLog, 'utf-8'), 'DeletedMessages.txt');
    const msg = yield logChannel.send({ files: [attachment] });
    const embed = new Embed_1.default(client, 'error').setTitle('메시지 대량 삭제');
    embed.addField('삭제된 메시지', `${messages.size}`);
    embed.addField('삭제된 메시지 확인', `[링크](https://txt.discord.website/?txt=${logChannel.id}/${(_k = msg.attachments.first()) === null || _k === void 0 ? void 0 : _k.id}/DeletedMessages)`);
    return yield logChannel.send({ embeds: [embed] });
}));
