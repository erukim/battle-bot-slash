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
const LogSettingSchema_1 = __importDefault(require("../schemas/LogSettingSchema"));
const Embed_1 = __importDefault(require("../utils/Embed"));
exports.default = new Event_1.Event('voiceStateUpdate', (client, oldState, newState) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    if (!newState.guild)
        return;
    const LoggerSettingDB = yield LogSettingSchema_1.default.findOne({
        guild_id: newState.guild.id
    });
    if (!LoggerSettingDB)
        return;
    const logChannel = newState.guild.channels.cache.get(LoggerSettingDB.guild_channel_id);
    if (!logChannel)
        return;
    const embed = new Embed_1.default(client, 'warn').addField('유저', `<@${(_a = newState.member) === null || _a === void 0 ? void 0 : _a.id}>` + '(`' + ((_b = newState.member) === null || _b === void 0 ? void 0 : _b.id) + '`)', true);
    let updated = false;
    if (!newState.channel) {
        if (!LoggerSettingDB.useing.leaveVoiceChannel)
            return;
        embed.setTitle('음성채널 퇴장');
        embed.addField('채널', ((_c = oldState.channel) === null || _c === void 0 ? void 0 : _c.id)
            ? `<#${oldState.channel.id}>` + '(`' + oldState.channel.id + '`)'
            : '없음', true);
        embed.setColor('RED');
        updated = true;
    }
    if (!oldState.channel) {
        if (!LoggerSettingDB.useing.joinVoiceChannel)
            return;
        embed.setTitle('음성채널 입장');
        embed.addField('채널', ((_d = newState.channel) === null || _d === void 0 ? void 0 : _d.id)
            ? `<#${newState.channel.id}>` + '(`' + newState.channel.id + '`)'
            : '없음', true);
        embed.setColor('GREEN');
        updated = true;
    }
    if (updated)
        return yield logChannel.send({ embeds: [embed] });
}));
