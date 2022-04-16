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
exports.default = new Event_1.Event('guildMemberUpdate', (client, oldMember, newMember) => __awaiter(void 0, void 0, void 0, function* () {
    const LoggerSettingDB = yield LogSettingSchema_1.default.findOne({
        guild_id: newMember.guild.id
    });
    if (!LoggerSettingDB)
        return;
    if (!LoggerSettingDB.useing.memberUpdate)
        return;
    const logChannel = newMember.guild.channels.cache.get(LoggerSettingDB.guild_channel_id);
    if (!logChannel)
        return;
    let update = false;
    const embed = new Embed_1.default(client, 'warn')
        .setTitle('멤버 수정')
        .addField('유저', `<@${newMember.user.id}>` + '(`' + newMember.user.id + '`)');
    if (oldMember.nickname !== newMember.nickname) {
        const fetchedLogs = yield newMember.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_UPDATE'
        });
        const deletionLog = fetchedLogs.entries.first();
        if (deletionLog) {
            const executor = deletionLog.executor;
            const target = deletionLog.target;
            if (target.id === newMember.id && executor.id !== newMember.id)
                embed.addField('수정유저', `<@${executor.id}>` + '(`' + executor.id + '`)');
        }
        embed.addField('닉네임 수정', '`' +
            (oldMember.nickname ? oldMember.nickname : oldMember.user.username) +
            '`' +
            ' ->' +
            '`' +
            (newMember.nickname ? newMember.nickname : newMember.user.username) +
            '`');
        update = true;
    }
    if (!oldMember.premiumSince && newMember.premiumSince) {
        embed.addField('서버 부스트', `<@${newMember.user.id}>` +
            '(`' +
            newMember.user.id +
            '`)' +
            ' 님이 서버를 부스트 했습니다');
        update = true;
    }
    if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
        const fetchedLogs = yield newMember.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_ROLE_UPDATE'
        });
        const deletionLog = fetchedLogs.entries.first();
        if (deletionLog) {
            const executor = deletionLog.executor;
            const target = deletionLog.target;
            if (target.id === newMember.id)
                embed.addField('수정유저', `<@${executor.id}>` + '(`' + executor.id + '`)');
        }
        if (oldMember.roles.cache.size > newMember.roles.cache.size) {
            oldMember.roles.cache.forEach((role) => {
                if (!newMember.roles.cache.has(role.id)) {
                    embed.addField('역할 삭제', `<@&${role.id}>` + '(`' + role.id + '`)');
                    update = true;
                }
            });
        }
        else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
            newMember.roles.cache.forEach((role) => {
                if (!oldMember.roles.cache.has(role.id)) {
                    embed.addField('역할 추가', `<@&${role.id}>` + '(`' + role.id + '`)');
                    update = true;
                }
            });
        }
    }
    if (update)
        return yield logChannel.send({ embeds: [embed] });
}));
