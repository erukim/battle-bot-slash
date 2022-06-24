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
const ticketSettingSchema_1 = __importDefault(require("../../schemas/ticketSettingSchema"));
const Command_1 = require("../../structures/Command");
const randomstring_1 = __importDefault(require("randomstring"));
const Embed_1 = __importDefault(require("../../utils/Embed"));
const discord_js_1 = require("discord.js");
exports.default = new Command_1.ButtonInteraction({
    name: 'create'
}, (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    yield interaction.deferReply({ ephemeral: true });
    const ticketSetting = yield ticketSettingSchema_1.default.findOne({
        guildId: (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id
    });
    const guildtickets = yield ticketSchema_1.default.find({ guildId: (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id });
    if (!ticketSetting) {
        return interaction.editReply('이 서버는 티켓 생성 기능을 사용 중이지 않습니다');
    }
    else {
        const ticketId = randomstring_1.default.generate({ length: 25 });
        const count = guildtickets.length + 1;
        const categori = (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.channels.cache.get(ticketSetting.categories);
        yield ((_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.channels.create(`ticket-${count}-${interaction.user.discriminator}`, {
            type: 'GUILD_TEXT',
            permissionOverwrites: [
                {
                    id: (_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.roles.everyone,
                    deny: ['VIEW_CHANNEL']
                },
                {
                    id: interaction.user.id,
                    allow: [
                        'VIEW_CHANNEL',
                        'READ_MESSAGE_HISTORY',
                        'ATTACH_FILES',
                        'SEND_MESSAGES'
                    ]
                }
            ],
            parent: categori ? categori.id : undefined,
            topic: `<@!${interaction.user.id}> 님의 티켓`
        }).then((channel) => {
            var _a;
            const ticket = new ticketSchema_1.default();
            ticket.status = 'open';
            ticket.guildId = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id;
            ticket.userId = interaction.user.id;
            ticket.ticketId = ticketId;
            ticket.channelId = channel.id;
            ticket.save((err) => {
                if (err)
                    return interaction.editReply('티켓을 생성하는 도중 오류가 발생했어요');
            });
            const embed = new Embed_1.default(client, 'success')
                .setTitle('티켓')
                .setDescription(`<@${interaction.user.id}> 님의 티켓 \n 티켓 종료를 원하시면 🔒 닫기 버튼을 눌러주세요`);
            const buttonSave = new discord_js_1.MessageButton()
                .setLabel('저장')
                .setStyle('SUCCESS')
                .setEmoji('💾')
                .setCustomId('save');
            const buttonDelete = new discord_js_1.MessageButton()
                .setLabel('삭제')
                .setStyle('DANGER')
                .setEmoji('❌')
                .setCustomId('delete');
            const buttonClose = new discord_js_1.MessageButton()
                .setLabel('닫기')
                .setStyle('PRIMARY')
                .setEmoji('🔒')
                .setCustomId('close');
            const componets = new discord_js_1.MessageActionRow()
                .addComponents(buttonSave)
                .addComponents(buttonClose)
                .addComponents(buttonDelete);
            channel.send({
                content: `<@${interaction.user.id}>`,
                embeds: [embed],
                components: [componets]
            });
            interaction.editReply(`티켓이 생성되었습니다 <#${channel.id}>`);
        }));
    }
}));
