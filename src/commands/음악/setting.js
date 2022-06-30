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
const musicSchema_1 = __importDefault(require("../../schemas/musicSchema"));
const Embed_1 = __importDefault(require("../../utils/Embed"));
const MusicEmbed_1 = __importDefault(require("../../utils/MusicEmbed"));
const discord_js_1 = require("discord.js");
const builders_1 = require("@discordjs/builders");
const musicbutton_1 = require("../../utils/musicbutton");
const config_1 = __importDefault(require("../../../config"));
exports.default = new Command_1.BaseCommand({
    name: 'musicsetting',
    description: '노래 기능을 세팅합니다',
    aliases: ['뮤직세팅', '노래세팅', 'musicset', '음악세팅']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let errembed = new Embed_1.default(client, 'error')
        .setColor('#2f3136');
    let musicEmbed = new MusicEmbed_1.default(client);
    if (!message.guild) {
        errembed.setTitle('이 명령어는 서버에서만 사용이 가능해요!');
        return message.reply({ embeds: [errembed] });
    }
    if (!((_a = message.member) === null || _a === void 0 ? void 0 : _a.permissions.has("MANAGE_CHANNELS"))) {
        errembed.setTitle('이 명령어를 사용할 권한이 없어요');
        return message.reply({ embeds: [errembed] });
    }
    let db = yield musicSchema_1.default.findOne({ guild_id: message.guild.id });
    if (!db) {
        let musicChannel = yield message.guild.channels.create('battle-bot-music', { type: "GUILD_TEXT" });
        const row = new discord_js_1.MessageActionRow()
            .addComponents(musicbutton_1.buttonList);
        let msg = yield musicChannel.send({ embeds: [musicEmbed], components: [row] });
        let musicdb = new musicSchema_1.default();
        musicdb.guild_id = message.guild.id;
        musicdb.channel_id = musicChannel.id;
        musicdb.message_id = msg.id;
        musicdb.save((err) => {
            if (err) {
                errembed.setTitle('뮤직기능 설정중 오류가 발생했어요!');
                return message.reply({ embeds: [errembed] });
            }
        });
        return message.reply(`${(0, builders_1.channelMention)(musicChannel.id)} 노래기능 설정이 완료되었어요!`);
    }
    else {
        errembed.setTitle('이런...!');
        errembed.setDescription(`이미 ${(0, builders_1.channelMention)(db.channel_id)}로 음악기능이 설정되있는거 같아요! \n 채널을 삭제하셨거나 다시 설정을 원하시면 \`${config_1.default.bot.prefix}뮤직설정헤제\` 입력 후 다시 시도해주세요!`);
        return message.reply({ embeds: [errembed] });
    }
}), {
    data: new builders_1.SlashCommandBuilder()
        .setName('뮤직세팅')
        .setDescription('뮤직 기능을 설정합니다!'),
    options: {
        name: '뮤직세팅',
        isSlash: true
    },
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply({ ephemeral: true });
            let errembed = new Embed_1.default(client, 'error')
                .setColor('#2f3136');
            let musicEmbed = new MusicEmbed_1.default(client);
            if (!interaction.guild) {
                errembed.setTitle('이 명령어는 서버에서만 사용이 가능해요!');
                return interaction.editReply({ embeds: [errembed] });
            }
            let member = interaction.guild.members.cache.get(interaction.user.id);
            if (!member)
                member = (yield interaction.guild.members.fetch(interaction.user.id));
            if (!member.permissions.has("MANAGE_CHANNELS")) {
                errembed.setTitle('이 명령어를 사용할 권한이 없어요');
                return interaction.editReply({ embeds: [errembed] });
            }
            let db = yield musicSchema_1.default.findOne({ guild_id: interaction.guild.id });
            if (!db) {
                let musicChannel = yield interaction.guild.channels.create('battle-bot-music', { type: "GUILD_TEXT" });
                const row = new discord_js_1.MessageActionRow()
                    .addComponents(musicbutton_1.buttonList);
                let msg = yield musicChannel.send({ embeds: [musicEmbed], components: [row] });
                let musicdb = new musicSchema_1.default();
                musicdb.guild_id = interaction.guild.id;
                musicdb.channel_id = musicChannel.id;
                musicdb.message_id = msg.id;
                musicdb.save((err) => {
                    if (err) {
                        errembed.setTitle('뮤직기능 설정중 오류가 발생했어요!');
                        return interaction.editReply({ embeds: [errembed] });
                    }
                });
                return interaction.editReply(`${(0, builders_1.channelMention)(musicChannel.id)} 노래기능 설정이 완료되었어요!`);
            }
            else {
                errembed.setTitle('이런...!');
                errembed.setDescription(`이미 ${(0, builders_1.channelMention)(db.channel_id)}로 음악기능이 설정되있는거 같아요! \n 채널을 삭제하셨거나 다시 설정을 원하시면 \`${config_1.default.bot.prefix}뮤직설정헤제\` 입력 후 다시 시도해주세요!`);
                return interaction.editReply({ embeds: [errembed] });
            }
        });
    }
});
