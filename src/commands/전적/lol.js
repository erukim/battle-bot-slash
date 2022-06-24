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
const builders_1 = require("@discordjs/builders");
const Embed_1 = __importDefault(require("../../utils/Embed"));
const discord_js_1 = require("discord.js");
const cheerio_1 = __importDefault(require("cheerio"));
const request_promise_1 = __importDefault(require("request-promise"));
exports.default = new Command_1.BaseCommand({
    name: '롤전적',
    description: '리그오브레전드 전적을 확인합니다.',
    aliases: ['롤전적', 'lolstat']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    return message.reply(`해당 명령어는 (/)커멘드로만 사용가능합니다`);
}), {
    data: new builders_1.SlashCommandBuilder()
        .setName('롤전적')
        .addStringOption((user) => user
        .setName('user')
        .setDescription('리그오브레전드 닉네임을 적어주세요')
        .setRequired(true))
        .setDescription('유저의 리그오브레전드 전적을 확인합니다'),
    options: {
        name: '롤전적',
        isSlash: true
    },
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            yield interaction.editReply({
                embeds: [
                    new Embed_1.default(client, 'info').setDescription('전적을 불러오는 중..')
                        .setColor('#2f3136')
                ]
            });
            let nickname = interaction.options.getString('user', true);
            let stats = yield getStat(nickname);
            if (typeof stats === "string") {
                return interaction.editReply({ embeds: [], content: stats });
            }
            return interaction.editReply({
                embeds: [stats],
            });
        });
    }
});
function getStat(args) {
    return __awaiter(this, void 0, void 0, function* () {
        let url = 'https://www.op.gg/summoner/userName=' + encodeURIComponent(args);
        let options = {
            url: url,
            method: 'GET',
            headers: {
                'Accept-Language': 'ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0) Gecko/20100101 Firefox/72.0'
            }
        };
        let html;
        try {
            html = yield (0, request_promise_1.default)(options); // html 받아옴
        }
        catch (e) {
            console.log("error");
            return "error";
        }
        var $ = cheerio_1.default.load(html);
        // @ts-ignore
        let data = JSON.parse($(`#__NEXT_DATA__`).contents()[0].data).props.pageProps.data;
        // @ts-ignore
        let lastMatch = JSON.parse($(`#__NEXT_DATA__`).contents()[0].data).props.pageProps.games.data;
        let champions = data.championsById;
        let matchinfo = [];
        lastMatch.forEach((match) => {
            let championRes = champions[match.myData.champion_id];
            if (match.myData.stats.result === "LOSE") {
                matchinfo.push(`- 패배 / ${match.queue_info.queue_translate} / <KDA ${match.myData.stats.kill}/${match.myData.stats.death}/${match.myData.stats.assist}> ${match.myData.position ? "/ " + match.myData.position : ''}`);
            }
            else {
                matchinfo.push(`+ 승리 / ${match.queue_info.queue_translate} / ${championRes.name} / <KDA ${match.myData.stats.kill}/${match.myData.stats.death}/${match.myData.stats.assist}> ${match.myData.position ? "/ " + match.myData.position : ''}`);
            }
        });
        let embed = new discord_js_1.MessageEmbed()
            .setTitle(`\`${args}\`의 프로필`)
            .setColor('#2f3136');
        let leagueStatus = data.league_stats[0];
        if (leagueStatus.tier_info.tier)
            embed.setDescription(`${leagueStatus.queue_info.queue_translate} - ${leagueStatus.tier_info.tier} ${leagueStatus.tier_info.division} (${leagueStatus.tier_info.lp}LP) \n ${leagueStatus.win}승 / ${leagueStatus.lose}패 / ${(leagueStatus.win / (leagueStatus.win + leagueStatus.lose) * 100).toFixed(2)}%`);
        else
            embed.setDescription(`**언랭크**`);
        return embed
            .addField('최근 10판 전적', `
    \`\`\`diff
${matchinfo.slice(undefined, 10).join('\n')} 
\`\`\``)
            .setThumbnail(leagueStatus.tier_info.tier_image_url);
    });
}
