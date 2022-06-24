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
const discord_js_1 = require("discord.js");
const config_1 = __importDefault(require("../../../config"));
const package_json_1 = require("../../../package.json");
const Command_1 = require("../../structures/Command");
const DateFormatting_1 = __importDefault(require("../../utils/DateFormatting"));
const Embed_1 = __importDefault(require("../../utils/Embed"));
const memory = () => {
    const memory = process.memoryUsage().rss;
    return (memory / 1024 / 1024).toFixed(2) + "MB";
};
exports.default = new Command_1.BaseCommand({
    name: 'info',
    description: '봇의 정보를 보여줍니다',
    aliases: ['정보', 'info', 'wjdqh']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    let embed = new Embed_1.default(client, 'default')
        .setTitle(`${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username} 정보`)
        .setColor('#2f3136');
    let shardEmbed;
    shardEmbed = `**서버의 Shard ID#${(_b = message.guild) === null || _b === void 0 ? void 0 : _b.shard.id} ${client.ws.ping}ms**\n`;
    embed.setDescription(shardEmbed);
    embed.addField('서버 수', `${client.guilds.cache.size}서버`, true);
    embed.addField('유저 수', `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}명`, true);
    embed.addField('업타임', `${DateFormatting_1.default.relative(new Date(Date.now() - process.uptime() * 1000))}`, true);
    embed.addField('시스템정보', `\`\`\`diff\n- Discord.js: ${discord_js_1.version} \n- Node.js: ${process.version}\n- OS: ${process.platform} - Memory: ${memory()} \`\`\``);
    embed.addField('유용한 링크', `[서포트 서버](https://discord.gg/WtGq7D7BZm) | [웹 대시보드](${config_1.default.web.baseurl}) | [깃허브](${package_json_1.repository}) | [개인정보처리방침](${config_1.default.web.baseurl}/help/privacy) | [상태](${config_1.default.web.baseurl}/status)`);
    return message.reply({ embeds: [embed] });
}), {
    data: new builders_1.SlashCommandBuilder()
        .setName('정보')
        .setDescription('봇의 정보를 보여줍니다'),
    options: {
        name: '정보',
        isSlash: true
    },
    execute(client, interaction) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            let embed = new Embed_1.default(client, 'default')
                .setTitle(`${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username} 정보`)
                .setColor('#2f3136');
            let shardEmbed;
            shardEmbed = `**서버의 Shard ID#${(_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.shard.id} ${client.ws.ping}ms**\n`;
            embed.setDescription(shardEmbed);
            embed.addField('서버 수', `${client.guilds.cache.size}서버`, true);
            embed.addField('유저 수', `${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0)}명`, true);
            embed.addField('업타임', `${DateFormatting_1.default.relative(new Date(Date.now() - process.uptime() * 1000))}`, true);
            embed.addField('시스템정보', `\`\`\`diff\n- Discord.js: ${discord_js_1.version} \n- Node.js: ${process.version}\n- OS: ${process.platform} - Memory: ${memory()} \`\`\``);
            embed.addField('유용한 링크', `[서포트 서버](https://discord.gg/WtGq7D7BZm) | [웹 대시보드](${config_1.default.web.baseurl}) | [깃허브](${package_json_1.repository}) | [개인정보처리방침](${config_1.default.web.baseurl}/help/privacy) | [상태](${config_1.default.web.baseurl}/status)`);
            return interaction.reply({ embeds: [embed] });
        });
    }
});
