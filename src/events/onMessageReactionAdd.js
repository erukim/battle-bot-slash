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
exports.default = new Event_1.Event('messageReactionAdd', (client, messageReaction, user) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { guild } = messageReaction.message;
    if (user.bot)
        return;
    if (!guild)
        return;
    if (messageReaction.partial)
        messageReaction = yield messageReaction.fetch();
    if (messageReaction.message.partial)
        messageReaction.message = yield messageReaction.message.fetch();
    const LoggerSettingDB = yield LogSettingSchema_1.default.findOne({
        guild_id: (_a = messageReaction.message.guild) === null || _a === void 0 ? void 0 : _a.id
    });
    if (!LoggerSettingDB)
        return;
    if (!LoggerSettingDB.useing.reactMessage)
        return;
    const logChannel = (_b = messageReaction.message.guild) === null || _b === void 0 ? void 0 : _b.channels.cache.get(LoggerSettingDB.guild_channel_id);
    if (!logChannel)
        return;
    const embed = new Embed_1.default(client, 'success')
        .setTitle('반응 추가')
        .addField('채널', `<#${messageReaction.message.channel.id}>` +
        '(`' +
        messageReaction.message.channel.id +
        '`)')
        .addField('메시지', `[메시지](${messageReaction.message.url})`)
        .addField('유저', `<@${user.id}>` + '(`' + user.id + '`)')
        .addField('반응 이모지', messageReaction.emoji.toString());
    return yield logChannel.send({ embeds: [embed] });
}));
