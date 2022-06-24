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
const userSchema_1 = __importDefault(require("../../schemas/userSchema"));
const Embed_1 = __importDefault(require("../../utils/Embed"));
const builders_1 = require("@discordjs/builders");
const DateFormatting_1 = __importDefault(require("../../utils/DateFormatting"));
exports.default = new Command_1.BaseCommand({
    name: 'profile',
    description: '유저의 정보를 확인합니다.',
    aliases: ['프로필', 'vmfhvlf', 'vmfhvlf']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!message.guild) {
        let embed = new Embed_1.default(client, 'error');
        embed.setTitle('이런...');
        embed.setDescription('이 명령어는 서버에서만 사용 가능합니다');
        return message.reply({ embeds: [embed] });
    }
    if (!args[0])
        args[0] = message.author.id;
    let user = message.guild.members.cache.get(args[0]);
    if (message.mentions.users.first())
        user = message.guild.members.cache.get((_a = message.mentions.users.first()) === null || _a === void 0 ? void 0 : _a.id);
    if (!user) {
        let embed = new Embed_1.default(client, 'error');
        embed.setTitle('이런...');
        embed.setDescription('찾을 수 없는 유저입니다');
        return message.reply({ embeds: [embed] });
    }
    let userdb = yield userSchema_1.default.findOne({ id: user.id });
    let embed = new Embed_1.default(client, 'success')
        .setTitle(`${user.user.username}님의 정보`)
        .setThumbnail(user.displayAvatarURL())
        .addField(`유저`, (0, builders_1.userMention)(user.id), true)
        .addField(`아이디`, `\`${user.id}\``, true)
        .addField(`상태`, (user.presence ? (user.presence.activities.length === 0 ? "없음" : user.presence.activities.join(", ")) : "오프라인"), true)
        .addField(`서버 가입일`, DateFormatting_1.default._format(user.joinedAt, ''), true)
        .addField(`계정 생성일`, DateFormatting_1.default._format(user.user.createdAt, ''), true)
        .addField(`${(_b = client.user) === null || _b === void 0 ? void 0 : _b.username} 웹 가입일`, (userdb ? DateFormatting_1.default._format(userdb.published_date, '') : "미가입"))
        .setColor('#2f3136');
    return message.reply({ embeds: [embed] });
}), {
    data: new builders_1.SlashCommandBuilder()
        .setName('프로필')
        .addUserOption(option => option
        .setName("user")
        .setDescription("프로필을 확인할 유저를 선택합니다")
        .setRequired(true))
        .setDescription('유저의 프로필을 확인합니다'),
    options: {
        name: '프로필',
        isSlash: true
    },
    execute(client, interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            if (!interaction.guild) {
                let embed = new Embed_1.default(client, 'error');
                embed.setTitle('이런...');
                embed.setDescription('이 명령어는 서버에서만 사용 가능합니다');
                return interaction.reply({ embeds: [embed] });
            }
            let seluser = interaction.options.getUser('user');
            let user = interaction.guild.members.cache.get(seluser === null || seluser === void 0 ? void 0 : seluser.id);
            if (!user) {
                let embed = new Embed_1.default(client, 'error');
                embed.setTitle('이런...');
                embed.setDescription('찾을 수 없는 유저입니다');
                return interaction.reply({ embeds: [embed] });
            }
            let userdb = yield userSchema_1.default.findOne({ id: user.id });
            let embed = new Embed_1.default(client, 'success')
                .setTitle(`${user.user.username}님의 정보`)
                .setThumbnail(user.displayAvatarURL())
                .addField(`유저`, (0, builders_1.userMention)(user.id), true)
                .addField(`아이디`, `\`${user.id}\``, true)
                .addField(`상태`, (user.presence ? (user.presence.activities.length === 0 ? "없음" : user.presence.activities.join(", ")) : "오프라인"), true)
                .addField(`서버 가입일`, DateFormatting_1.default._format(user.joinedAt, ''), true)
                .addField(`계정 생성일`, DateFormatting_1.default._format(user.user.createdAt, ''), true)
                .addField(`${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username} 웹 가입일`, (userdb ? DateFormatting_1.default._format(userdb.published_date, '') : "미가입"))
                .setColor('#2f3136');
            return interaction.reply({ embeds: [embed] });
        });
    }
});
