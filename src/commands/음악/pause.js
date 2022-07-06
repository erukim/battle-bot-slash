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
const Command_1 = require("../../structures/Command");
const Embed_1 = __importDefault(require("../../utils/Embed"));
const builders_1 = require("@discordjs/builders");
exports.default = new Command_1.BaseCommand({
    name: 'pause',
    description: '노래를 일시정지합니다',
    aliases: ['일시정지', 'musicpause']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let errembed = new Embed_1.default(client, 'error')
        .setTitle(`❌ 에러 발생`)
        .setColor('#2f3136');
    let sucessembed = new Embed_1.default(client, 'success')
        .setColor('#2f3136');
    if (!message.guild) {
        errembed.setDescription('이 명령어는 서버에서만 사용이 가능해요!');
        return message.reply({ embeds: [errembed] });
    }
    const user = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(message.author.id);
    const queue = client.player.getQueue(message.guild.id);
    if (!queue || !queue.playing) {
        errembed.setDescription('노래가 재생 중이지 않아요!');
        return message.reply({ embeds: [errembed] });
    }
    const memberChannel = user === null || user === void 0 ? void 0 : user.voice.channelId;
    if (!memberChannel) {
        errembed.setDescription('먼저 음성 채널에 입장해 주세요');
        return message.reply({ embeds: [errembed] });
    }
    if (((_b = message.guild.me) === null || _b === void 0 ? void 0 : _b.voice.channelId) !== memberChannel) {
        errembed.setDescription('다른 채널에서 노래가 재생 중이에요');
        return message.reply({ embeds: [errembed] });
    }
    if (queue.connection.paused) {
        queue.setPaused(false);
        sucessembed.setDescription('일시정지를 해제했어요!');
        return message.reply({ embeds: [sucessembed] });
    }
    else {
        queue.setPaused(true);
        sucessembed.setDescription('노래를 일시정지 했어요!');
        return message.reply({ embeds: [sucessembed] });
    }
}), {
    data: new builders_1.SlashCommandBuilder()
        .setName('일시정지')
        .setDescription('노래를 일시정지합니다'),
    options: {
        name: '일시정지',
        isSlash: true
    },
    execute(client, interaction) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply({ ephemeral: true });
            let errembed = new Embed_1.default(client, 'error')
                .setTitle(`❌ 에러 발생`)
                .setColor('#2f3136');
            let sucessembed = new Embed_1.default(client, 'success')
                .setColor('#2f3136');
            if (!interaction.guild) {
                errembed.setDescription('이 명령어는 서버에서만 사용이 가능해요!');
                return interaction.editReply({ embeds: [errembed] });
            }
            const user = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(interaction.user.id);
            const queue = client.player.getQueue(interaction.guild.id);
            if (!queue || !queue.playing) {
                errembed.setDescription('노래가 재생 중이지 않아요!');
                return interaction.editReply({ embeds: [errembed] });
            }
            const memberChannel = user === null || user === void 0 ? void 0 : user.voice.channelId;
            if (!memberChannel) {
                errembed.setDescription('먼저 음성 채널에 입장해 주세요');
                return interaction.editReply({ embeds: [errembed] });
            }
            if (((_b = interaction.guild.me) === null || _b === void 0 ? void 0 : _b.voice.channelId) !== memberChannel) {
                errembed.setDescription('다른 채널에서 노래가 재생 중이에요');
                return interaction.editReply({ embeds: [errembed] });
            }
            if (queue.connection.paused) {
                queue.setPaused(false);
                sucessembed.setDescription('일시정지를 해제했어요!');
                return interaction.editReply({ embeds: [sucessembed] });
            }
            else {
                queue.setPaused(true);
                sucessembed.setDescription('노래를 일시정지 했어요!');
                return interaction.editReply({ embeds: [sucessembed] });
            }
        });
    }
});
