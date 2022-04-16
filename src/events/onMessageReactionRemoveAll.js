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
exports.default = new Event_1.Event('messageReactionRemoveAll', (client, message) => __awaiter(void 0, void 0, void 0, function* () {
    const { guild } = message;
    if (!guild)
        return;
    if (message.partial)
        yield message.fetch();
    const LoggerSettingDB = yield LogSettingSchema_1.default.findOne({ guild_id: guild.id });
    if (!LoggerSettingDB)
        return;
    if (!LoggerSettingDB.useing.reactMessage)
        return;
    const logChannel = guild.channels.cache.get(LoggerSettingDB.guild_channel_id);
    if (!logChannel)
        return;
    const embed = new Embed_1.default(client, 'error')
        .setTitle('모든 반응 삭제')
        .addField('채널', `<#${message.channel.id}>` + '(`' + message.channel.id + '`)')
        .addField('메시지', `[메시지](${message.url})`);
    return yield logChannel.send({ embeds: [embed] });
}));
