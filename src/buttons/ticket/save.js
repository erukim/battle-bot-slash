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
const config_1 = __importDefault(require("../../../config"));
const discord_js_1 = require("discord.js");
const ticketSchema_1 = __importDefault(require("../../schemas/ticketSchema"));
const Command_1 = require("../../structures/Command");
const Embed_1 = __importDefault(require("../../utils/Embed"));
exports.default = new Command_1.ButtonInteraction({
    name: 'save'
}, (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    yield interaction.deferReply({ ephemeral: true });
    const ticket = yield ticketSchema_1.default.findOne({
        guildId: (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id,
        channelId: (_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.id
    });
    const ErrorEmbed = new Embed_1.default(client, 'error').setTitle('찾을 수 없는 티켓 정보입니다');
    if (!ticket)
        yield interaction.editReply({ embeds: [ErrorEmbed] });
    let messages = new discord_js_1.Collection();
    let channelMessages = yield ((_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.messages.fetch({
        limit: 100
    }));
    const LoadingEmbed = new Embed_1.default(client, 'info').setTitle('채팅 기록을 불러오는 중입니다')
        .setColor('#2f3136');
    const NoMessageEmbed = new Embed_1.default(client, 'error').setTitle('채팅 기록을 불러오지 못했습니다');
    if (!channelMessages)
        return interaction.editReply({ embeds: [NoMessageEmbed] });
    messages = messages.concat(channelMessages);
    yield interaction.editReply({ embeds: [LoadingEmbed] });
    while ((channelMessages === null || channelMessages === void 0 ? void 0 : channelMessages.size) === 100) {
        channelMessages = yield ((_d = interaction.channel) === null || _d === void 0 ? void 0 : _d.messages.fetch({
            limit: 100
        }));
        if (channelMessages)
            messages = messages.concat(channelMessages);
    }
    let MessageDB = [];
    messages.forEach((msg) => __awaiter(void 0, void 0, void 0, function* () {
        MessageDB.push({
            author: msg.author,
            created: msg.createdAt,
            messages: msg.content,
            embed: msg.embeds[0]
        });
    }));
    MessageDB = MessageDB.reverse();
    const SaveingEmbed = new Embed_1.default(client, 'info').setTitle('채팅 기록을 저장하는 중입니다')
        .setColor('#2f3136');
    yield interaction.editReply({ embeds: [SaveingEmbed] });
    yield ticketSchema_1.default.updateOne({ guildId: (_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.id, channelId: (_f = interaction.channel) === null || _f === void 0 ? void 0 : _f.id }, { $set: { messages: MessageDB } });
    const successembed = new Embed_1.default(client, 'success')
        .setTitle('티켓이 저장되었습니다')
        .setDescription(`[여기](${(_g = config_1.default.web) === null || _g === void 0 ? void 0 : _g.baseurl}/guilds/${(_h = interaction.guild) === null || _h === void 0 ? void 0 : _h.id}/ticket/${ticket.ticketId})에서 확인할 수 있습니다`)
        .setColor('#2f3136');
    yield interaction.editReply({ embeds: [successembed] });
}));
