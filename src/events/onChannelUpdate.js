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
exports.default = new Event_1.Event('channelUpdate', (client, newChannel, oldChannel) => __awaiter(void 0, void 0, void 0, function* () {
    if (oldChannel.type === 'DM')
        return;
    if (newChannel.type === 'DM')
        return;
    const LoggerSettingDB = yield LogSettingSchema_1.default.findOne({
        guild_id: newChannel.guild.id
    });
    if (!LoggerSettingDB)
        return;
    if (!LoggerSettingDB.useing.editChannel)
        return;
    const logChannel = newChannel.guild.channels.cache.get(LoggerSettingDB.guild_channel_id);
    if (!logChannel)
        return;
    const fetchedLogs = yield newChannel.guild.fetchAuditLogs({
        limit: 1,
        type: 'CHANNEL_UPDATE'
    });
    let updated = false;
    const embed = new Embed_1.default(client, 'warn').setTitle('채널 수정').addFields({
        name: '채널',
        value: `<#${newChannel.id}>` + '(`' + newChannel.id + '`)'
    });
    if (oldChannel.name != newChannel.name) {
        embed.addField('이름 수정', '`' + oldChannel.name + '`' + ' -> ' + '`' + newChannel.name + '`');
        updated = true;
    }
    if (oldChannel.parent != newChannel.parent) {
        embed.addField('카테고리 변경', '`' +
            (oldChannel.parent ? oldChannel.parent.name : '없음') +
            '`' +
            ' -> ' +
            '`' +
            (newChannel.parent ? newChannel.parent.name : '없음') +
            '`');
        updated = true;
    }
    if (updated) {
        if (!fetchedLogs)
            return yield logChannel.send({ embeds: [embed] });
        const deletionLog = fetchedLogs.entries.first();
        const executor = deletionLog.executor;
        const target = deletionLog.target;
        if (target.id !== newChannel.id)
            return yield logChannel.send({ embeds: [embed] });
        embed.addField('수정유저', `<@${executor.id}>` + '(`' + executor.id + '`)');
        return yield logChannel.send({ embeds: [embed] });
    }
}));
