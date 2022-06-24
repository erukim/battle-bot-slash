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
const discord_js_1 = __importDefault(require("discord.js"));
const CommandManager_1 = __importDefault(require("../../managers/CommandManager"));
const Embed_1 = __importDefault(require("../../utils/Embed"));
const ErrorManager_1 = __importDefault(require("../../managers/ErrorManager"));
const Command_1 = require("../../structures/Command");
exports.default = new Command_1.BaseCommand({
    name: 'slashSetup',
    aliases: ['slash', 'setup', 'tpxld', '세팅'],
    description: 'Slash Command를 세팅합니다'
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    let commandManager = new CommandManager_1.default(client);
    let errorManager = new ErrorManager_1.default(client);
    let row = new discord_js_1.default.MessageActionRow().addComponents(new discord_js_1.default.MessageButton()
        .setCustomId('accept')
        .setLabel('동의합니다.')
        .setStyle('SUCCESS')
        .setEmoji('✅'));
    let embed = new Embed_1.default(client, 'warn')
        .setTitle('잠시만요!')
        .setDescription(`Slash Command를 사용하려면 봇 초대할 떄 \`applications.commands\` 스코프를 사용하지 않았을 경우 해당기능을 이용할 수 없습니다. 만약 \`applications.commands\` 스코프를 안 할 경우 [여기를](https://discord.com/api/oauth2/authorize?client_id=${(_a = client.user) === null || _a === void 0 ? void 0 : _a.id}&scope=applications.commands) 클릭하여 허용해 주시기 바랍니다.`);
    let m = yield message.channel.send({ embeds: [embed], components: [row] });
    const collector = m.createMessageComponentCollector({ time: 5000 });
    collector.on('collect', (i) => __awaiter(void 0, void 0, void 0, function* () {
        var _b;
        if (i.user.id === message.author.id) {
            let loading = new Embed_1.default(client, 'info')
                .setDescription('Slash Command 로딩중...')
                .setAuthor('잠시만 기다려주십시요...', 'https://cdn.discordapp.com/emojis/667750713698549781.gif?v=1');
            yield i.update({ embeds: [loading], components: [] });
            commandManager
                .slashCommandSetup((_b = message.guild) === null || _b === void 0 ? void 0 : _b.id)
                .then((data) => {
                m.delete();
                message.channel.send({
                    embeds: [
                        new Embed_1.default(client, 'success')
                            .setTitle('로딩완료!')
                            .setDescription(`${data === null || data === void 0 ? void 0 : data.length}개의 (/) 명령어를 생성했어요!`)
                    ]
                });
            })
                .catch((error) => {
                m.delete();
                if (error.code === discord_js_1.default.Constants.APIErrors.MISSING_ACCESS) {
                    message.channel.send({
                        embeds: [
                            new Embed_1.default(client, 'error')
                                .setTitle('Error!')
                                .setDescription('제 봇 권한이 부족합니다...\n> 필요한 권한\n`applications.commands`스코프')
                        ]
                    });
                }
                else {
                    errorManager.report(error, { executer: message, isSend: true });
                }
            });
        }
        else {
            i.reply({
                content: `명령어 요청한 **${message.author.username}**만 사용할수 있어요.`,
                ephemeral: true
            });
        }
    }));
    collector.on('end', (collected) => {
        if (collected.size == 1)
            return;
        m.edit({
            embeds: [embed],
            components: [
                new discord_js_1.default.MessageActionRow().addComponents(new discord_js_1.default.MessageButton()
                    .setCustomId('accept')
                    .setLabel('시간 초과. 다시 시도해주세요...')
                    .setStyle('SECONDARY')
                    .setEmoji('⛔')
                    .setDisabled(true))
            ]
        });
    });
}));
