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
const builders_1 = require("@discordjs/builders");
const Command_1 = require("../../structures/Command");
const Embed_1 = __importDefault(require("../../utils/Embed"));
exports.default = new Command_1.ButtonInteraction({
    name: 'music.stop'
}, (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    yield interaction.deferReply({ ephemeral: true });
    const errembed = new Embed_1.default(client, 'error')
        .setColor('#2f3136');
    if (!interaction.guild) {
        errembed.setTitle('❌ 이 버튼은 서버에서만 사용이 가능해요!');
        return interaction.editReply({ embeds: [errembed] });
    }
    const user = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(interaction.user.id);
    const channel = user === null || user === void 0 ? void 0 : user.voice.channel;
    if (!channel) {
        errembed.setTitle('❌ 음성 채널에 먼저 입장해주세요!');
        return interaction.editReply({ embeds: [errembed] });
    }
    const guildQueue = client.player.getQueue(interaction.guild.id);
    if (!guildQueue) {
        errembed.setTitle('❌ 노래가 재생 중이지 않아요!');
        return interaction.editReply({ embeds: [errembed] });
    }
    if (guildQueue) {
        if (channel.id !== ((_b = interaction.guild.me) === null || _b === void 0 ? void 0 : _b.voice.channelId)) {
            errembed.setTitle('❌ 이미 다른 음성 채널에서 재생 중입니다!');
            return interaction.editReply({ embeds: [errembed] });
        }
    }
    const sucessembed = new Embed_1.default(client, 'info')
        .setColor('#2f3136');
    guildQueue.stop();
    sucessembed.setDescription(`**${(0, builders_1.userMention)(interaction.user.id)}님의 요청으로 노래 재생을 정지했어요!**`);
    return interaction.editReply({ embeds: [sucessembed] });
}));
