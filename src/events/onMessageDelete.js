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
const config_1 = __importDefault(require("../../config"));
const LogSettingSchema_1 = __importDefault(require("../schemas/LogSettingSchema"));
const Embed_1 = __importDefault(require("../utils/Embed"));
exports.default = new Event_1.Event('messageDelete', (client, message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    if (!message)
        return;
    if (!message.content)
        return;
    if (message.content.startsWith(config_1.default.bot.prefix))
        return;
    if (((_a = message.author) === null || _a === void 0 ? void 0 : _a.id) == ((_b = client.user) === null || _b === void 0 ? void 0 : _b.id))
        return;
    if (!message.guild)
        return;
    if (!message.content && message.attachments.size == 0 && message.embeds[0])
        return;
    const LoggerSettingDB = yield LogSettingSchema_1.default.findOne({
        guild_id: message.guild.id
    });
    if (!LoggerSettingDB)
        return;
    if (!LoggerSettingDB.useing.deleteMessage)
        return;
    const logChannel = message.guild.channels.cache.get(LoggerSettingDB.guild_channel_id);
    if (!logChannel)
        return;
    if (message.partial)
        message = yield message.fetch();
    if (!message.author)
        return;
    if (message.content.length > 1024) {
        message.content = message.content.slice(0, 700) + '...';
    }
    const embed = new Embed_1.default(client, 'error').setTitle('메시지 삭제');
    embed.addField('채널', `<#${message.channel.id}>` + '(`' + message.channel.id + '`)');
    embed.addField('작성자', `<@${message.author.id}>` + '(`' + message.author.id + '`)');
    if (message.content.length > 0)
        embed.addField('내용', `${message.content}`);
    if (message.attachments.size > 0) {
        embed.addField('파일', message.attachments.map((file) => `[링크](${file.url})`).join('\n'));
    }
    const fetchedLogs = yield ((_c = message.guild) === null || _c === void 0 ? void 0 : _c.fetchAuditLogs({
        limit: 1,
        type: 'MESSAGE_DELETE'
    }));
    if (!fetchedLogs)
        return yield logChannel.send({ embeds: [embed] });
    const deletionLog = fetchedLogs.entries.first();
    if (!deletionLog)
        return yield logChannel.send({ embeds: [embed] });
    const target = deletionLog.target;
    const executor = deletionLog.executor;
    const extra = deletionLog.extra;
    if (!deletionLog)
        return yield logChannel.send({ embeds: [embed] });
    if (extra.channel.id === message.channel.id &&
        target.id === message.author.id &&
        deletionLog.createdTimestamp > Date.now() - 60 * 1000) {
        embed.addField('삭제유저', `<@${executor.id}>` + '(`' + executor.id + '`)');
        return yield logChannel.send({ embeds: [embed] });
    }
    return yield logChannel.send({ embeds: [embed] });
}));
