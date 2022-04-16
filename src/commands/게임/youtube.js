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
const rest_1 = require("@discordjs/rest");
const Command_1 = require("../../structures/Command");
const Embed_1 = __importDefault(require("../../utils/Embed"));
const config_1 = __importDefault(require("../../../config"));
exports.default = new Command_1.BaseCommand({
    name: 'youtube',
    description: '디스코드에서 유튜브를 같이 볼 수 있습니다.',
    aliases: ['유튜브', 'dbxbqm', '유튜브보기', '유튜브보기용', '유튭']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    let embed = new Embed_1.default(client, 'error')
        .setTitle(`유튜브`)
        .setDescription('유튜브 명령어는 (/) 명령어로만 사용이 가능해요');
    return message.reply({ embeds: [embed] });
}), {
    // @ts-ignore
    data: new builders_1.SlashCommandBuilder()
        .setName('유튜브')
        .setDescription('디스코드에서 유튜브를 같이 볼 수 있어요!'),
    options: {
        name: '유튜브',
        isSlash: true
    },
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const embed = new Embed_1.default(client, 'error')
                .setTitle(`유튜브`);
            const embedSuccess = new Embed_1.default(client, 'success')
                .setTitle(`유튜브`);
            const guild = interaction.guild;
            if (!guild) {
                embed.setDescription('이 명령어는 서버에서만 사용이 가능해요!');
                return interaction.reply({ embeds: [embed] });
            }
            const member = guild.members.cache.get(interaction.user.id);
            if (!member) {
                embed.setDescription('서버에서 유저를 찾지 못했어요!');
                return interaction.reply({ embeds: [embed] });
            }
            if (!member.voice || !member.voice.channel) {
                embed.setDescription(`먼저 음성채널에 입장해주세요!`);
                return interaction.reply({ embeds: [embed] });
            }
            if (member.voice.channel.type === "GUILD_STAGE_VOICE") {
                embed.setDescription(`스테이지 채널에서는 이 명령어를 사용할 수 없어요!`);
                return interaction.reply({ embeds: [embed] });
            }
            const rest = new rest_1.REST({ version: "8" }).setToken(config_1.default.bot.token);
            const invite = yield rest.post(`/channels/${member.voice.channelId}/invites`, {
                body: {
                    max_age: 86400,
                    max_uses: 0,
                    target_application_id: '880218394199220334',
                    target_type: 2,
                    temporary: false,
                    validate: null,
                }
            });
            if (!invite) {
                embed.setDescription(`초대코드를 생성하지 못했어요!`);
                return interaction.reply({ embeds: [embed] });
            }
            embedSuccess.setDescription(`성공적으로 유튜브같이 보기가 생성되었어요!\n**초대코드가 활성화 되지 않을 경우 링크를 눌러주세요!**`);
            return interaction.reply({ embeds: [embedSuccess], content: `https://discord.gg/${invite.code}` });
        });
    }
});
