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
    name: 'emoji',
    description: '이모지를 확대합니다',
    aliases: ['이모지', 'dlahwl', 'emoji']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    let errEmbed = new Embed_1.default(client, 'error');
    let successEmbed = new Embed_1.default(client, 'success')
        .setColor('#2f3136');
    if (!message.guild) {
        errEmbed.setDescription('이 명령어는 서버에서만 사용 가능합니다');
        return message.reply({ embeds: [errEmbed] });
    }
    if (!/(<a?)?:\w+:(\d{18}>)?/g.test(args[0])) {
        errEmbed.setDescription('이모지만 입력해주세요');
        return message.reply({ embeds: [errEmbed] });
    }
    let emoji = client.emojis.cache.get(args[0].split(':')[2].replace(/[^0-9]/g, ''));
    if (!emoji) {
        errEmbed.setDescription('찾을 수 없는 이모지입니다!');
        return message.reply({ embeds: [errEmbed] });
    }
    successEmbed
        .setTitle("이모지")
        .setImage(emoji.url);
    return message.reply({ embeds: [successEmbed] });
}), {
    data: new builders_1.SlashCommandBuilder()
        .setName('이모지')
        .addStringOption(option => option
        .setName("이모지")
        .setDescription("확인할 이모지를 입력해주세요")
        .setRequired(true))
        .setDescription('이모지의 정보를 불러옵니다'),
    options: {
        name: '이모지',
        isSlash: true
    },
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            let errEmbed = new Embed_1.default(client, 'error');
            let successEmbed = new Embed_1.default(client, 'success')
                .setColor('#2f3136');
            let stringemoji = interaction.options.getString('이모지', true);
            if (!interaction.guild) {
                errEmbed.setDescription('이 명령어는 서버에서만 사용 가능합니다');
                return interaction.editReply({ embeds: [errEmbed] });
            }
            if (!/(<a?)?:\w+:(\d{18}>)?/g.test(stringemoji)) {
                errEmbed.setDescription('이모지만 입력해주세요');
                return interaction.editReply({ embeds: [errEmbed] });
            }
            let emoji = client.emojis.cache.get(stringemoji.split(':')[2].replace(/[^0-9]/g, ''));
            if (!emoji) {
                errEmbed.setDescription('찾을 수 없는 이모지입니다!');
                return interaction.editReply({ embeds: [errEmbed] });
            }
            successEmbed
                .setTitle("이모지")
                .setImage(emoji.url);
            return interaction.editReply({ embeds: [successEmbed] });
        });
    }
});
