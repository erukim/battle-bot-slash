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
const config_1 = __importDefault(require("../../../config"));
const Command_1 = require("../../structures/Command");
const Embed_1 = __importDefault(require("../../utils/Embed"));
const discord_js_1 = require("discord.js");
exports.default = new Command_1.BaseCommand({
    name: 'help',
    description: '봇의 도움말을 보여줍니다',
    aliases: ['도움말', 'ehdna', 'ehdnaakf', '도움']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let buttton = new discord_js_1.MessageButton()
        .setLabel('하트 누르기')
        .setURL('https://koreanbots.dev/bots/928523914890608671/vote')
        .setStyle('LINK');
    let row = new discord_js_1.MessageActionRow().addComponents(buttton);
    let embed = new Embed_1.default(client, 'success')
        .setTitle(`${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username} 도움말`)
        .setColor('#2f3136');
    if (!args[0]) {
        client.categorys.forEach((category, command) => {
            if (command === 'dev')
                return;
            embed.setDescription(`아래에 있는 명령어들을 이용해 도움말을 보실 수 있습니다.`);
            embed.addField(`\`${config_1.default.bot.prefix}도움말 ${command}\``, `> ${command}관련 명령어들을 보내드려요!`, true);
        });
        return message.reply({ embeds: [embed], components: [row] });
    }
    else {
        let commands = client.categorys.get(args[0]);
        if (args[0] === 'dev') {
            // @ts-ignore
            if (!client.dokdo.owners.includes(message.author.id)) {
                embed
                    .setTitle(`❌ 에러 발생`)
                    .setDescription(`존재하지 않는 카테고리입니다.`)
                    .setType('error');
                return message.reply({ embeds: [embed], components: [row] });
            }
        }
        if (!commands) {
            embed
                .setTitle(`❌ 에러 발생`)
                .setDescription(`존재하지 않는 카테고리입니다.`)
                .setType('error');
            return message.reply({ embeds: [embed], components: [row] });
        }
        embed.setDescription(`${args[0]} 관련 도움말 입니다!`);
        commands.forEach((command) => {
            embed.addField(`\`${config_1.default.bot.prefix}${command.name}\``, `> ${command.description}`, true);
        });
        return message.reply({ embeds: [embed], components: [row] });
    }
}), {
    data: new builders_1.SlashCommandBuilder()
        .setName('도움말')
        .addStringOption((option) => option
        .setName('category')
        .setDescription('카테고리를 적어주세요')
        .setRequired(false))
        .setDescription('봇의 도움말을 보여줍니다'),
    options: {
        name: '도움말',
        isSlash: true
    },
    execute(client, interaction) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let buttton = new discord_js_1.MessageButton()
                .setLabel('하트 누르기')
                .setURL('https://koreanbots.dev/bots/928523914890608671/vote')
                .setStyle('LINK');
            let row = new discord_js_1.MessageActionRow().addComponents(buttton);
            let embed = new Embed_1.default(client, 'success')
                .setColor('#2f3136')
                .setTitle(`${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username} 도움말`);
            if (!interaction.options.getString('category')) {
                client.categorys.forEach((category, command) => {
                    if (command === 'dev')
                        return;
                    embed.setDescription(`아래에 있는 명령어들을 이용해 도움말을 보세요!`);
                    embed.addField(`\`/도움말 ${command}\``, `> ${command}관련 명령어들을 보내드려요!`, true);
                });
                return interaction.reply({ embeds: [embed], components: [row] });
            }
            else {
                let category = (_b = interaction.options.getString('category')) === null || _b === void 0 ? void 0 : _b.toLowerCase();
                if (category === 'dev') {
                    // @ts-ignore
                    if (!client.dokdo.owners.includes(message.author.id)) {
                        embed
                            .setTitle(`❌ 에러 발생`)
                            .setDescription(`존재하지 않는 카테고리입니다.`)
                            .setType('error');
                        return interaction.reply({ embeds: [embed], components: [row] });
                    }
                }
                let commands = client.categorys.get(category);
                if (!commands) {
                    embed
                        .setTitle(`❌ 에러 발생`)
                        .setDescription(`존재하지 않는 카테고리입니다.`)
                        .setType('error');
                    return interaction.reply({ embeds: [embed], components: [row] });
                }
                embed.setDescription(`${category} 관련 도움말 입니다!`);
                let isSlash = commands === null || commands === void 0 ? void 0 : commands.filter((x) => x.isSlash);
                if ((isSlash === null || isSlash === void 0 ? void 0 : isSlash.length) === 0) {
                    embed.setTitle(`❌ 에러 발생`);
                    embed.setDescription(`${category} 카테고리에는 사용 가능한 (/) 명령어가 없어요`);
                }
                else {
                    commands.forEach((command) => {
                        if (!command.isSlash)
                            return;
                        embed.addField(`\`/${command.name}\``, `> ${command.description}`);
                    });
                }
                return interaction.reply({ embeds: [embed], components: [row] });
            }
        });
    }
});
