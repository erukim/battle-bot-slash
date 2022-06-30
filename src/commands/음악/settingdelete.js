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
const builders_1 = require("@discordjs/builders");
const config_1 = __importDefault(require("../../../config"));
exports.default = new Command_1.BaseCommand({
    name: 'musicsettingdelete',
    description: '노래 기능 세팅을 해제합니다',
    aliases: ['뮤직설정해제', '노래세팅해제', 'musicsetdel']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let errembed = new Embed_1.default(client, 'error')
        .setColor('#2f3136');
    let sucessembed = new Embed_1.default(client, 'success')
        .setColor('#2f3136');
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
        errembed.setTitle('이런...!');
        errembed.setDescription(`음악 기능을 설정한 기록이 없는거같아요! \n \`${config_1.default.bot.prefix}뮤직세팅\` 을 입력해주세요!`);
        return message.reply({ embeds: [errembed] });
    }
    else {
        yield musicSchema_1.default.deleteOne({ guild_id: message.guild.id });
        sucessembed.setTitle('설정을 성공적으로 해제 했어요!');
        return message.reply({ embeds: [sucessembed] });
    }
}), {
    data: new builders_1.SlashCommandBuilder()
        .setName('뮤직설정해제')
        .setDescription('설정하신 뮤직 기능을 해제합니다!'),
    options: {
        name: '뮤직설정해제',
        isSlash: true
    },
    execute(client, interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply({ ephemeral: true });
            let errembed = new Embed_1.default(client, 'error')
                .setColor('#2f3136');
            let sucessembed = new Embed_1.default(client, 'success')
                .setColor('#2f3136');
            if (!interaction.guild) {
                errembed.setTitle('이 명령어는 서버에서만 사용이 가능해요!');
                return interaction.editReply({ embeds: [errembed] });
            }
            if (!((_a = interaction.guild.members.cache.get(interaction.user.id)) === null || _a === void 0 ? void 0 : _a.permissions.has('MANAGE_CHANNELS'))) {
                errembed.setTitle('이 명령어를 사용할 권한이 없어요');
                return interaction.editReply({ embeds: [errembed] });
            }
            let db = yield musicSchema_1.default.findOne({ guild_id: interaction.guild.id });
            if (!db) {
                errembed.setTitle('이런...!');
                errembed.setDescription(`음악 기능을 설정한 기록이 없는거같아요! \n \`/뮤직세팅\` 을 입력해주세요!`);
                return interaction.editReply({ embeds: [errembed] });
            }
            else {
                yield musicSchema_1.default.deleteOne({ guild_id: interaction.guild.id });
                sucessembed.setTitle('설정을 성공적으로 해제 했어요!');
                return interaction.editReply({ embeds: [sucessembed] });
            }
        });
    }
});
