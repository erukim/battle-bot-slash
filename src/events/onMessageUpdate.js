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
exports.default = new Event_1.Event('messageUpdate', (client, oldMessage, newMessage) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!newMessage.guild)
        return;
    if (oldMessage.partial)
        oldMessage = yield oldMessage.fetch();
    if (newMessage.partial)
        newMessage = yield newMessage.fetch();
    if (!oldMessage.content)
        return;
    if (!newMessage.content)
        return;
    const LoggerSettingDB = yield LogSettingSchema_1.default.findOne({
        guild_id: (_a = newMessage.guild) === null || _a === void 0 ? void 0 : _a.id
    });
    if (!LoggerSettingDB)
        return;
    if (!LoggerSettingDB.useing.editMessage)
        return;
    const logChannel = (_b = newMessage.guild) === null || _b === void 0 ? void 0 : _b.channels.cache.get(LoggerSettingDB.guild_channel_id);
    if (!logChannel)
        return;
    let oldContent = new String(oldMessage.content);
    let newContent = new String(newMessage.content);
    if (oldContent !== newContent) {
        if (oldContent.length > 500) {
            const oldContentLength = oldMessage.content.length - 500;
            oldContent = oldContent.slice(0, 500) + `... +${oldContentLength}`;
        }
        if (newContent.length > 500) {
            const newContentLength = newMessage.content.length - 500;
            newContent = newContent.slice(0, 500) + `... +${newContentLength}`;
        }
        const embed = new Embed_1.default(client, 'warn')
            .setTitle('메시지 수정')
            .addField('채널', `<#${newMessage.channel.id}>` + '(`' + newMessage.channel.id + '`)')
            .addField('메시지', `[메시지](${newMessage.url})`)
            .addField('수정전', `${oldContent ? oldContent : '없음'}`)
            .addField('수정후', `${newContent ? newContent : '없음'}`);
        return yield logChannel.send({ embeds: [embed] });
    }
}));
