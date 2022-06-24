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
const ticketSchema_1 = __importDefault(require("../../schemas/ticketSchema"));
const Command_1 = require("../../structures/Command");
const Embed_1 = __importDefault(require("../../utils/Embed"));
const discord_js_1 = require("discord.js");
exports.default = new Command_1.ButtonInteraction({
    name: 'close'
}, (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    yield interaction.deferReply({ ephemeral: true });
    const replyTicket = new Embed_1.default(client, 'info').setDescription(`5초뒤에 티켓이 종료됩니다!,  <@!${interaction.user.id}>`)
        .setColor('#2f3136');
    yield interaction.editReply({ embeds: [replyTicket] });
    const ticketDB = yield ticketSchema_1.default.findOne({
        guildId: (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id,
        channelId: (_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.id,
        status: 'open'
    });
    if (!ticketDB)
        return yield ((_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.send({
            content: '이미 닫힌 티켓이거나 티켓 정보를 찾을 수 없습니다'
        }));
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        var _d, _e, _f, _g, _h;
        yield ticketSchema_1.default.updateOne({
            guildId: (_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.id,
            channelId: (_e = interaction.channel) === null || _e === void 0 ? void 0 : _e.id,
            status: 'open'
        }, { $set: { status: 'close' } });
        const buttonSave = new discord_js_1.MessageButton()
            .setLabel('저장')
            .setStyle('SUCCESS')
            .setEmoji('💾')
            .setCustomId('save');
        const buttonDelete = new discord_js_1.MessageButton()
            .setLabel('삭제')
            .setStyle('DANGER')
            .setEmoji('🗑')
            .setCustomId('delete');
        const componets = new discord_js_1.MessageActionRow()
            .addComponents(buttonSave)
            .addComponents(buttonDelete);
        const replyCloseTicket = new Embed_1.default(client, 'info').setDescription(`티켓이 종료되었습니다!, <@!${interaction.user.id}>`)
            .setColor('#2f3136');
        interaction.channelId;
        const channel = (_f = interaction.guild) === null || _f === void 0 ? void 0 : _f.channels.cache.get((_g = interaction.channel) === null || _g === void 0 ? void 0 : _g.id);
        yield channel.permissionOverwrites.edit(ticketDB.userId, {
            VIEW_CHANNEL: false,
            SEND_MESSAGES: false
        });
        channel.setName(`closed-ticket-${ticketDB.ticketId.slice(0, 5)}`);
        (_h = interaction.channel) === null || _h === void 0 ? void 0 : _h.send({
            embeds: [replyCloseTicket],
            components: [componets]
        });
        return interaction.editReply({
            embeds: [replyCloseTicket],
            components: [componets]
        });
    }), 5000);
}));
