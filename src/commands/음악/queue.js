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
const discord_js_1 = require("discord.js");
const button_pagination_1 = __importDefault(require("../../utils/button-pagination"));
exports.default = new Command_1.BaseCommand({
    name: 'queue',
    description: '노래의 재생목록을 확인합니다',
    aliases: ['재생목록', 'musicqueue', '큐']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    let errembed = new Embed_1.default(client, 'error');
    let sucessembed = new Embed_1.default(client, 'success')
        .setColor('#2f3136');
    if (!message.guild) {
        errembed.setTitle('❌ 이 명령어는 서버에서만 사용이 가능해요!');
        return message.reply({ embeds: [errembed] });
    }
    const queue = client.player.getQueue(message.guild.id);
    if (!queue || !queue.playing) {
        errembed.setTitle('❌ 노래가 재생 중이지 않아요!');
        return message.reply({ embeds: [errembed] });
    }
    let queues = new Array();
    let more = 0;
    queue.tracks.forEach((track, index) => {
        if (index < 50) {
            queues.push(`${index + 1}. ${track.title} - ${track.author} - ${track.duration} ${(0, builders_1.userMention)(track.requestedBy.id)}`);
        }
        else {
            more++;
        }
    });
    if (more > 1) {
        queues.push(`+ ${more}곡`);
    }
    sucessembed.setTitle('재생목록');
    sucessembed.setDescription(queues.join("\n"));
    return message.reply({ embeds: [sucessembed] });
}), {
    data: new builders_1.SlashCommandBuilder()
        .setName('재생목록')
        .setDescription('노래의 재생목록을 확인합니다'),
    options: {
        name: '재생목록',
        isSlash: true
    },
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            let errembed = new Embed_1.default(client, 'error');
            if (!interaction.guild) {
                errembed.setTitle('❌ 이 명령어는 서버에서만 사용이 가능해요!');
                return interaction.editReply({ embeds: [errembed] });
            }
            const queue = client.player.getQueue(interaction.guild.id);
            if (!queue || !queue.playing) {
                errembed.setTitle('❌ 노래가 재생 중이지 않아요!');
                return interaction.editReply({ embeds: [errembed] });
            }
            const buttons = [
                new discord_js_1.MessageButton()
                    .setCustomId('previousbtn')
                    .setLabel('이전')
                    .setStyle('SECONDARY'),
                new discord_js_1.MessageButton()
                    .setCustomId('nextbtn')
                    .setLabel('다음')
                    .setStyle('SUCCESS')
            ];
            const pages = [];
            let page = 1;
            let emptypage;
            do {
                const pageStart = 10 * (page - 1);
                const pageEnd = pageStart + 10;
                const tracks = queue.tracks.slice(pageStart, pageEnd).map((m, i) => {
                    return `**${i + pageStart + 1}**. [${m.title}](${m.url}) ${m.duration} - ${m.requestedBy}`;
                });
                if (tracks.length) {
                    const embed = new Embed_1.default(client, 'success');
                    embed.setDescription(`\n${tracks.join('\n')}${queue.tracks.length > pageEnd
                        ? `\n... + ${queue.tracks.length - pageEnd}`
                        : ''}`);
                    embed.setAuthor(`재생 중인 노래 🎵 ${queue.current.title} - ${queue.current.author}`, undefined, `${queue.current.url}`);
                    pages.push(embed);
                    page++;
                }
                else {
                    emptypage = 1;
                    if (page === 1) {
                        const embed = new Embed_1.default(client, 'success');
                        embed.setDescription(`더 이상 재생목록에 노래가 없습니다`);
                        embed.setAuthor(`재생 중인 노래 🎵 ${queue.current.title} - ${queue.current.author}`, undefined, `${queue.current.url}`);
                        return interaction.editReply({ embeds: [embed] });
                    }
                    if (page === 2) {
                        return interaction.editReply({ embeds: [pages[0]] });
                    }
                }
            } while (!emptypage);
            return (0, button_pagination_1.default)(interaction, pages, buttons, 30000);
        });
    }
});
