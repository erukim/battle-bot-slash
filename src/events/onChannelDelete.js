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
const LogSettingSchema_1 = __importDefault(require("../schemas/LogSettingSchema"));
const Embed_1 = __importDefault(require("../utils/Embed"));
const Event_1 = require("../structures/Event");
exports.default = new Event_1.Event('channelDelete', (client, channel) => __awaiter(void 0, void 0, void 0, function* () {
    if (channel.type === 'DM')
        return;
    const LoggerSettingDB = yield LogSettingSchema_1.default.findOne({
        guild_id: channel.guild.id
    });
    if (!LoggerSettingDB)
        return;
    if (!LoggerSettingDB.useing.deleteChannel)
        return;
    const logChannel = channel.guild.channels.cache.get(LoggerSettingDB.guild_channel_id);
    if (!logChannel)
        return;
    const fetchedLogs = yield channel.guild.fetchAuditLogs({
        limit: 1,
        type: 'CHANNEL_DELETE'
    });
    const embed = new Embed_1.default(client, 'error').setTitle('채널 삭제').addFields({
        name: '채널',
        value: `#${channel.name}` + '(`' + channel.id + '`)'
    }, {
        name: '카테고리',
        value: channel.parent ? channel.parent.name : '없음'
    });
    if (!fetchedLogs)
        return yield logChannel.send({ embeds: [embed] });
    const deletionLog = fetchedLogs.entries.first();
    const executor = deletionLog.executor;
    const target = deletionLog.target;
    if (target.id === channel.id) {
        embed.addField('삭제유저', `<@${executor.id}>` + '(`' + executor.id + '`)');
        return yield logChannel.send({ embeds: [embed] });
    }
    else {
        return yield logChannel.send({ embeds: [embed] });
    }
}));
