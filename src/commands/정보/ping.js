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
    name: 'ping',
    description: '핑을 측정합니다.',
    aliases: ['핑', '측정', 'vld']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    let embed = new Embed_1.default(client, 'warn')
        .setTitle('핑 측정중...')
        .setColor('#2f3136');
    let m = yield message.reply({
        embeds: [embed]
    });
    embed = new Embed_1.default(client, 'success')
        .setColor('#2f3136')
        .setTitle('PONG!')
        .addField('메세지 응답속도', `${Number(m.createdAt) - Number(message.createdAt)}ms`, true)
        .addField('API 반응속도', `${client.ws.ping}ms`, true)
        .addField('업타임', `<t:${(Number(client.readyAt) / 1000) | 0}:R>`, true);
    m.edit({
        embeds: [embed]
    });
}), {
    data: new builders_1.SlashCommandBuilder()
        .setName('핑')
        .setDescription('핑을 측정합니다.'),
    options: {
        name: '핑',
        isSlash: true
    },
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let PingEmbed = new Embed_1.default(client, 'success')
                .setColor('#2f3136')
                .setTitle('핑 측정')
                .addField('웹소켓 지연속도', `${client.ws.ping}ms`)
                .addField('업타임', `<t:${(Number(client.readyAt) / 1000) | 0}:R>`);
            interaction.reply({ embeds: [PingEmbed] });
        });
    }
});
