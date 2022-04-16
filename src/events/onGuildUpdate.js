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
exports.default = new Event_1.Event('guildUpdate', (client, oldGuild, newGuild) => __awaiter(void 0, void 0, void 0, function* () {
    const LoggerSettingDB = yield LogSettingSchema_1.default.findOne({ guild_id: newGuild.id });
    if (!LoggerSettingDB)
        return;
    if (!LoggerSettingDB.useing.serverSetting)
        return;
    const logChannel = newGuild.channels.cache.get(LoggerSettingDB.guild_channel_id);
    if (!logChannel)
        return;
    let update = false;
    const embed = new Embed_1.default(client, 'warn').setTitle('서버 수정');
    if (oldGuild.name != newGuild.name) {
        embed.addField('이름 수정', '`' + oldGuild.name + '`' + ' -> ' + '`' + newGuild.name + '`');
        update = true;
    }
    if (oldGuild.premiumTier !== newGuild.premiumTier) {
        embed.addField(`부스트 ${oldGuild.premiumTier < newGuild.premiumTier ? '추가됨' : '차감됨'}`, '`' +
            oldGuild.premiumTier +
            '`' +
            ' -> ' +
            '`' +
            newGuild.premiumTier +
            '`');
        update = true;
    }
    if (!oldGuild.banner && newGuild.banner) {
        embed.addField('배너 수정', '`' + oldGuild.banner + '`' + ' -> ' + '`' + newGuild.banner + '`');
        update = true;
    }
    if (!oldGuild.afkChannel && newGuild.afkChannel) {
        embed.addField('잠수 채널 수정', (oldGuild.afkChannelId
            ? `<#${oldGuild.afkChannelId}>` + '(`' + oldGuild.afkChannelId + '`)'
            : '`없음`') +
            ' -> ' +
            (newGuild.afkChannelId
                ? `<#${newGuild.afkChannelId}>` + '(`' + newGuild.afkChannelId + '`)'
                : '`없음`'));
        update = true;
    }
    if (!oldGuild.vanityURLCode && newGuild.vanityURLCode) {
        embed.addField('초대 링크 수정', (oldGuild.vanityURLCode ? oldGuild.vanityURLCode : '`없음`') +
            ' -> ' +
            (newGuild.vanityURLCode ? newGuild.vanityURLCode : '`없음`'));
        update = true;
    }
    if (oldGuild.afkTimeout !== newGuild.afkTimeout) {
        embed.addField('잠수 시간 수정', '`' +
            oldGuild.afkTimeout / 60 +
            '분' +
            '`' +
            ' -> ' +
            '`' +
            newGuild.afkTimeout / 60 +
            '분' +
            '`');
        update = true;
    }
    if (oldGuild.ownerId !== newGuild.ownerId) {
        embed.addField('서버 주인 변경', `<@${oldGuild.ownerId}>` +
            '(`' +
            oldGuild.ownerId +
            '`)' +
            ' -> ' +
            `<@${newGuild.ownerId}>` +
            '(`' +
            newGuild.ownerId +
            '`)');
        update = true;
    }
    if (oldGuild.systemChannelId !== newGuild.systemChannelId) {
        embed.addField('시스템 채널 변경', `<#${oldGuild.systemChannelId}>` +
            '(`' +
            oldGuild.systemChannelId +
            '`)' +
            ' -> ' +
            `<#${newGuild.systemChannelId}>` +
            '(`' +
            newGuild.systemChannelId +
            '`)');
        update = true;
    }
    if (update)
        return yield logChannel.send({ embeds: [embed] });
}));
