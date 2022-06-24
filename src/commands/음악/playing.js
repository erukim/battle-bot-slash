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
const musicbutton_1 = __importDefault(require("../../utils/musicbutton"));
exports.default = new Command_1.BaseCommand({
    name: 'playing',
    description: '현재 재생중인 노래를 확인합니다',
    aliases: ['현재재생중', 'musicnow']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    let errembed = new Embed_1.default(client, 'error')
        .setTitle('어라...');
    let sucessembed = new Embed_1.default(client, 'success');
    if (!message.guild) {
        errembed.setDescription('이 명령어는 서버에서만 사용이 가능해요!');
        return message.reply({ embeds: [errembed] });
    }
    const queue = client.player.getQueue(message.guild.id);
    if (!queue || !queue.playing) {
        errembed.setDescription('노래가 재생 중이지 않아요!');
        return message.reply({ embeds: [errembed] });
    }
    sucessembed.setAuthor('재생 중인 노래', 'https://cdn.discordapp.com/emojis/667750713698549781.gif?v=1', queue.nowPlaying().url);
    sucessembed.setDescription(`[**${queue.nowPlaying().title} - ${queue.nowPlaying().author}**](${queue.nowPlaying().url}) ${queue.nowPlaying().duration} - ${queue.nowPlaying().requestedBy}`);
    sucessembed.setThumbnail(queue.nowPlaying().thumbnail);
    return message.reply({ embeds: [sucessembed] });
}), {
    data: new builders_1.SlashCommandBuilder()
        .setName('현재재생중')
        .setDescription('현재 재생중인 노래를 확인합니다'),
    options: {
        name: '현재재생중',
        isSlash: true
    },
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            let errembed = new Embed_1.default(client, 'error');
            let sucessembed = new Embed_1.default(client, 'success');
            if (!interaction.guild) {
                errembed.setTitle('❌ 이 명령어는 서버에서만 사용이 가능해요!');
                return interaction.editReply({ embeds: [errembed] });
            }
            const queue = client.player.getQueue(interaction.guild.id);
            if (!queue || !queue.playing) {
                errembed.setTitle('❌ 노래가 재생 중이지 않아요!');
                return interaction.editReply({ embeds: [errembed] });
            }
            sucessembed.setAuthor('재생 중인 노래', 'https://cdn.discordapp.com/emojis/667750713698549781.gif?v=1', queue.nowPlaying().url);
            sucessembed.setDescription(`[**${queue.nowPlaying().title} - ${queue.nowPlaying().author}**](${queue.nowPlaying().url}) ${queue.nowPlaying().duration} - ${queue.nowPlaying().requestedBy}`);
            sucessembed.setThumbnail(queue.nowPlaying().thumbnail);
            return (0, musicbutton_1.default)(interaction, sucessembed);
        });
    }
});
