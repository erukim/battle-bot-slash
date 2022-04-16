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
exports.default = new Event_1.Event('inviteCreate', (client, invite) => __awaiter(void 0, void 0, void 0, function* () {
    const guild = invite.guild;
    const inviter = invite.inviter;
    const LoggerSettingDB = yield LogSettingSchema_1.default.findOne({ guild_id: guild.id });
    if (!LoggerSettingDB)
        return;
    if (!LoggerSettingDB.useing.inviteGuild)
        return;
    const logChannel = guild.channels.cache.get(LoggerSettingDB.guild_channel_id);
    if (!logChannel)
        return;
    const embed = new Embed_1.default(client, 'success')
        .setTitle('초대코드')
        .setDescription([
        `초대코드 생성 ${invite.channel ? `채널: ${invite.channel}` : ''}`,
        `코드: \`${invite.code}\``,
        `사용가능 횟수: \`${invite.maxUses === 0 ? '무제한' : invite.maxUses}\``,
        `사용 가능일: ${invite.maxAge != 0 ? invite.maxAge : '무제한'}`,
        `생성유저: <@${inviter.id}>(\`${inviter.id}\`)`
    ].join('\n'));
    return yield logChannel.send({ embeds: [embed] });
}));
