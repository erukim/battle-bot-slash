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
const button_pagination_1 = __importDefault(require("../../utils/button-pagination"));
const discord_js_1 = require("discord.js");
const convert_1 = require("../../utils/convert");
exports.default = new Command_1.BaseCommand({
    name: 'play',
    description: '노래를 재생합니다',
    aliases: ['재생', 'musicplay', 'wotod', 'p']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let errembed = new Embed_1.default(client, 'error');
    let sucessembed = new Embed_1.default(client, 'success');
    if (!message.guild) {
        errembed.setTitle('❌ 이 명령어는 서버에서만 사용이 가능해요!');
        return message.reply({ embeds: [errembed] });
    }
    if (!args[0]) {
        errembed.setTitle('❌ 노래 제목을 적어주세요');
        return message.reply({ embeds: [errembed] });
    }
    let song = args.slice(1).join(" ");
    if (args.length === 1)
        song = args[0];
    const user = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(message.author.id);
    const channel = user === null || user === void 0 ? void 0 : user.voice.channel;
    if (!channel) {
        errembed.setTitle('❌ 음성 채널에 먼저 입장해주세요!');
        return message.reply({ embeds: [errembed] });
    }
    const guildQueue = client.player.getQueue(message.guild.id);
    if (guildQueue) {
        if (channel.id !== ((_b = message.guild.me) === null || _b === void 0 ? void 0 : _b.voice.channelId)) {
            errembed.setTitle('❌ 이미 다른 음성 채널에서 재생 중입니다!');
            return message.reply({ embeds: [errembed] });
        }
    }
    else {
        if (!channel.viewable) {
            errembed.setTitle('\`채널보기\` 권한이 필요해요!');
            return message.reply({ embeds: [errembed] });
        }
        if (!channel.joinable) {
            errembed.setTitle('\`채널입장\` 권한이 필요해요!');
            return message.reply({ embeds: [errembed] });
        }
        if (channel.full) {
            errembed.setTitle('채널이 가득 차 입장할 수 없어요!');
            return message.reply({ embeds: [errembed] });
        }
    }
    let result = yield client.player.search(song, { requestedBy: message.author }).catch((e) => { });
    if (!result || !result.tracks.length) {
        errembed.setTitle(`❌ ${song}를 찾지 못했어요!`);
        return message.reply({ embeds: [errembed] });
    }
    let queue;
    if (guildQueue) {
        queue = guildQueue;
        queue.metadata = message;
    }
    else {
        queue = yield client.player.createQueue(message.guild, {
            metadata: message
        });
    }
    try {
        if (!queue.connection)
            yield queue.connect(channel);
    }
    catch (e) {
        client.player.deleteQueue(message.guild.id);
        errembed.setTitle(`❌ 음성 채널에 입장할 수 없어요 ${e}`);
        return message.reply({ embeds: [errembed] });
    }
    if (result.playlist) {
        let songs = [];
        result.playlist.tracks.forEach((music) => {
            songs.push(music.title);
        });
        sucessembed.setAuthor('재생목록에 아래 노래들을 추가했어요!', undefined, result.playlist.url);
        sucessembed.setDescription(songs.join(', '));
        sucessembed.setThumbnail(result.playlist.thumbnail);
        queue.addTracks(result.tracks);
        if (!queue.playing)
            yield queue.play();
        return message.reply({ embeds: [sucessembed] });
    }
    else {
        let row = new discord_js_1.MessageActionRow();
        let select = new discord_js_1.MessageSelectMenu()
            .setCustomId('music.select')
            .setPlaceholder('재생할 노래를 선택해주세요!');
        let trackslist = 15;
        if (result.tracks.length < 15)
            trackslist = result.tracks.length;
        for (let i = 0; i < trackslist; i++) {
            select.addOptions([
                {
                    label: `${result.tracks[i].title}`,
                    description: `${result.tracks[i].author} - ${result.tracks[i].duration}`,
                    value: `${i}`,
                    emoji: (0, convert_1.getNumberEmogi)(i + 1)
                }
            ]);
        }
        row.addComponents(select);
        let msg = yield message.reply({ content: `<:playing:941212508784586772> **${(0, builders_1.userMention)(message.author.id)} 노래를 선택해주세요!**`, components: [row] });
        const collector = msg.createMessageComponentCollector({ time: 60000 });
        collector === null || collector === void 0 ? void 0 : collector.on('collect', (i) => __awaiter(void 0, void 0, void 0, function* () {
            if (i.user.id === message.author.id) {
                if (i.customId === "music.select") {
                    // @ts-ignore
                    let index = Number(i.values[0]);
                    queue.addTrack(result.tracks[index]);
                    sucessembed.setAuthor(`재생목록에 노래를 추가했어요!`, undefined, result.tracks[index].url);
                    sucessembed.setDescription(`[${result.tracks[index].title}](${result.tracks[index].url}) ${result.tracks[index].duration} - ${result.tracks[index].requestedBy}`);
                    sucessembed.setThumbnail(result.tracks[index].thumbnail);
                    msg.edit({ content: " ", embeds: [sucessembed], components: [] });
                    if (!queue.playing)
                        return yield queue.play();
                }
            }
        }));
    }
}), {
    data: new builders_1.SlashCommandBuilder()
        .setName('재생')
        .addStringOption(option => option
        .setName("song")
        .setDescription("재생할 노래 재목 또는 링크를 적어주세요")
        .setRequired(true))
        .setDescription('노래를 재생합니다'),
    options: {
        name: '재생',
        isSlash: true
    },
    execute(client, interaction) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            let errembed = new Embed_1.default(client, 'error');
            let sucessembed = new Embed_1.default(client, 'success');
            if (!interaction.guild) {
                errembed.setTitle('❌ 이 명령어는 서버에서만 사용이 가능해요!');
                return interaction.editReply({ embeds: [errembed] });
            }
            const song = interaction.options.getString("song", true);
            const user = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(interaction.user.id);
            const channel = user === null || user === void 0 ? void 0 : user.voice.channel;
            if (!channel) {
                errembed.setTitle('❌ 음성 채널에 먼저 입장해주세요!');
                return interaction.editReply({ embeds: [errembed] });
            }
            const guildQueue = client.player.getQueue(interaction.guild.id);
            if (guildQueue) {
                if (channel.id !== ((_b = interaction.guild.me) === null || _b === void 0 ? void 0 : _b.voice.channelId)) {
                    errembed.setTitle('❌ 이미 다른 음성 채널에서 재생 중입니다!');
                    return interaction.editReply({ embeds: [errembed] });
                }
            }
            else {
                if (!channel.viewable) {
                    errembed.setTitle('\`채널보기\` 권한이 필요해요!');
                    return interaction.editReply({ embeds: [errembed] });
                }
                if (!channel.joinable) {
                    errembed.setTitle('\`채널입장\` 권한이 필요해요!');
                    return interaction.editReply({ embeds: [errembed] });
                }
                if (channel.full) {
                    errembed.setTitle('채널이 가득 차 입장할 수 없어요!');
                    return interaction.editReply({ embeds: [errembed] });
                }
            }
            let result = yield client.player.search(song, { requestedBy: interaction.user }).catch((e) => { });
            if (!result || !result.tracks.length) {
                errembed.setTitle(`❌ ${song}을 찾지 못했어요!`);
                return interaction.editReply({ embeds: [errembed] });
            }
            let queue;
            if (guildQueue) {
                queue = guildQueue;
                queue.metadata = interaction;
            }
            else {
                queue = yield client.player.createQueue(interaction.guild, {
                    metadata: interaction
                });
            }
            try {
                if (!queue.connection)
                    yield queue.connect(channel);
            }
            catch (e) {
                client.player.deleteQueue(interaction.guild.id);
                errembed.setTitle(`❌ 음성 채널에 입장할 수 없어요 ${e}`);
                return interaction.editReply({ embeds: [errembed] });
            }
            if (result.playlist) {
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
                    const tracks = result.playlist.tracks.slice(pageStart, pageEnd).map((m, i) => {
                        return `**${i + pageStart + 1}**. [${m.title}](${m.url}) ${m.duration} - ${m.requestedBy}`;
                    });
                    if (tracks.length) {
                        const embed = new Embed_1.default(client, 'success');
                        embed.setDescription(`\n${tracks.join('\n')}${result.playlist.tracks.length > pageEnd
                            ? `\n... + ${result.playlist.tracks.length - pageEnd}`
                            : ''}`);
                        embed.setThumbnail(result.playlist.thumbnail);
                        embed.setAuthor(`재생목록에 아래 노래들을 추가했어요!`, undefined, `${result.playlist.url}`);
                        pages.push(embed);
                        page++;
                    }
                    else {
                        emptypage = 1;
                        if (page === 1) {
                            const embed = new Embed_1.default(client, 'success');
                            embed.setDescription(`더 이상 재생목록에 노래가 없습니다`);
                            embed.setThumbnail(result.playlist.thumbnail);
                            embed.setAuthor(`재생목록에 아래 노래들을 추가했어요!`, undefined, `${result.playlist.url}`);
                            return interaction.editReply({ embeds: [embed] });
                        }
                        if (page === 2) {
                            return interaction.editReply({ embeds: [pages[0]] });
                        }
                    }
                } while (!emptypage);
                queue.addTracks(result.tracks);
                (0, button_pagination_1.default)(interaction, pages, buttons, 30000);
                if (!queue.playing)
                    return yield queue.play();
            }
            else {
                let row = new discord_js_1.MessageActionRow();
                let select = new discord_js_1.MessageSelectMenu()
                    .setCustomId('music.select')
                    .setPlaceholder('재생할 노래를 선택해주세요!');
                let trackslist = 15;
                if (result.tracks.length < 15)
                    trackslist = result.tracks.length;
                for (let i = 0; i < trackslist; i++) {
                    select.addOptions([
                        {
                            label: `${result.tracks[i].title}`,
                            description: `${result.tracks[i].author} - ${result.tracks[i].duration}`,
                            value: `${i}`,
                            emoji: (0, convert_1.getNumberEmogi)(i + 1)
                        }
                    ]);
                }
                row.addComponents(select);
                interaction.editReply({ content: `<:playing:941212508784586772> **${(0, builders_1.userMention)(interaction.user.id)} 노래를 선택해주세요!**`, components: [row] });
                const collector = (_c = interaction.channel) === null || _c === void 0 ? void 0 : _c.createMessageComponentCollector({ time: 60000 });
                collector === null || collector === void 0 ? void 0 : collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                    if (i.user.id === interaction.user.id) {
                        if (i.customId === "music.select") {
                            // @ts-ignore
                            let index = Number(i.values[0]);
                            queue.addTrack(result.tracks[index]);
                            sucessembed.setAuthor(`재생목록에 노래를 추가했어요!`, undefined, result.tracks[index].url);
                            sucessembed.setDescription(`[${result.tracks[index].title}](${result.tracks[index].url}) ${result.tracks[index].duration} - ${result.tracks[index].requestedBy}`);
                            sucessembed.setThumbnail(result.tracks[index].thumbnail);
                            interaction.editReply({ content: " ", embeds: [sucessembed], components: [] });
                            if (!queue.playing)
                                return yield queue.play();
                        }
                    }
                }));
            }
        });
    }
});
