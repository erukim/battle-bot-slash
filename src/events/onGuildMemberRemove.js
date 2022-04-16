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
const WelcomeSettingSchema_1 = __importDefault(require("../schemas/WelcomeSettingSchema"));
const Embed_1 = __importDefault(require("../utils/Embed"));
const Event_1 = require("../structures/Event");
exports.default = new Event_1.Event('guildMemberRemove', (client, member) => __awaiter(void 0, void 0, void 0, function* () {
    GreetingEvent(client, member);
    LoggerEvent(client, member);
}));
const GreetingEvent = (client, member) => __awaiter(void 0, void 0, void 0, function* () {
    const WelcomeSettingDB = yield WelcomeSettingSchema_1.default.findOne({
        guild_id: member.guild.id
    });
    if (!WelcomeSettingDB)
        return;
    if (!WelcomeSettingDB.outting_message ||
        WelcomeSettingDB.outting_message == '')
        return;
    const WelcomeChannel = member.guild.channels.cache.get(WelcomeSettingDB.channel_id);
    if (!WelcomeChannel)
        return;
    const embed = new Embed_1.default(client, 'warn');
    embed.setAuthor(member.user.username, member.user.displayAvatarURL());
    embed.setDescription(new String(WelcomeSettingDB.outting_message)
        .replaceAll('${username}', member.user.username)
        .replaceAll('${discriminator}', member.user.discriminator)
        .replaceAll('${servername}', member.guild.name)
        .replaceAll('${memberCount}', member.guild.memberCount.toString().replaceAll('${줄바꿈}', '\n')));
    return yield WelcomeChannel.send({ embeds: [embed] });
});
const LoggerEvent = (client, member) => __awaiter(void 0, void 0, void 0, function* () {
    const LoggerSettingDB = yield LogSettingSchema_1.default.findOne({
        guild_id: member.guild.id
    });
    if (!LoggerSettingDB)
        return;
    if (!LoggerSettingDB.useing.memberLeft)
        return;
    const logChannel = member.guild.channels.cache.get(LoggerSettingDB.guild_channel_id);
    if (!logChannel)
        return;
    const embed = new Embed_1.default(client, 'error')
        .setTitle('멤버 퇴장')
        .setAuthor(member.user.username, member.user.displayAvatarURL())
        .addFields({
        name: '유저',
        value: `<@${member.user.id}>` + '(`' + member.user.id + '`)'
    });
    return yield logChannel.send({ embeds: [embed] });
});
