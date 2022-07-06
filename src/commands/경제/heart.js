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
const discord_js_1 = __importDefault(require("discord.js"));
const Money_1 = __importDefault(require("../../schemas/Money"));
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../../config"));
const DateFormatting_1 = __importDefault(require("../../utils/DateFormatting"));
const HeartCheck_1 = __importDefault(require("../../schemas/HeartCheck"));
exports.default = new Command_1.BaseCommand({
    name: '하트인증',
    description: '한디리, 아카이브 하트를 인증합니다',
    aliases: ['하트인증', 'ㅎㅌㅇㅈ', 'heart']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    let embed = new Embed_1.default(client, 'warn')
        .setTitle('하트인증')
        .setDescription('하트인증 진행할 플랫폼을 선택해주세요!')
        .setColor('#2f3136');
    const money = yield Money_1.default.findOne({ userid: message.author.id });
    if (!money) {
        embed.setTitle(`❌ 에러 발생`);
        embed.setDescription(message.author +
            '님의 정보가 확인되지 않습니다.\n먼저 `!돈받기`를 입력해 정보를 알려주세요!');
        return message.reply({ embeds: [embed] });
    }
    let m = yield message.reply({
        embeds: [embed],
        components: [
            new discord_js_1.default.MessageActionRow()
                .addComponents(new discord_js_1.default.MessageButton()
                .setLabel(`한디리 인증`)
                .setStyle('PRIMARY')
                .setCustomId('heart.koreanlist'))
                .addComponents(new discord_js_1.default.MessageButton()
                .setLabel(`아카이브 인증`)
                .setStyle('PRIMARY')
                .setCustomId('heart.archive'))
        ]
    });
    const collector = m.createMessageComponentCollector({ time: 10000 });
    collector.on('collect', (i) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        if (i.user.id != message.author.id)
            return;
        if (i.customId == 'heart.koreanlist') {
            axios_1.default
                .get(`https://koreanbots.dev/api/v2/bots/${(_a = client.user) === null || _a === void 0 ? void 0 : _a.id}/vote?userID=${message.author.id}`, {
                headers: {
                    Authorization: config_1.default.updateServer.koreanbots,
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => __awaiter(void 0, void 0, void 0, function* () {
                var _c;
                if (!res.data.data.voted) {
                    embed = new Embed_1.default(client, 'warn')
                        .setTitle('한국 디스코드 리스트 봇 하트인증')
                        .setDescription(`한국 디스코드 리스트에 있는 배틀이 봇의 하트가 아직 눌려있지 않았어요!`)
                        .setTimestamp()
                        .setColor('#2f3136');
                    let link = new discord_js_1.default.MessageActionRow().addComponents(new discord_js_1.default.MessageButton()
                        .setURL(`https://koreanbots.dev/bots/${(_c = client.user) === null || _c === void 0 ? void 0 : _c.id}/vote`)
                        .setLabel(`하트 누르기`)
                        .setStyle('LINK'));
                    i.reply({
                        embeds: [embed],
                        components: [link]
                    });
                    return m.edit({ components: [] });
                }
                else {
                    const heartData = yield HeartCheck_1.default.findOne({
                        userid: message.author.id,
                        platform: 'koreanlist'
                    });
                    if (!heartData) {
                        yield Money_1.default.updateOne({ userid: message.author.id }, { $inc: { money: 50000 } });
                        yield HeartCheck_1.default.create({
                            userid: message.author.id,
                            platform: 'koreanlist'
                        });
                        embed = new Embed_1.default(client, 'success')
                            .setTitle('⭕ 하트 인증 성공')
                            .setDescription(`${message.author.username}님의 한국 디스코드 리스트에 있는 배틀이 봇의 하트인증이 완료되었습니다.`)
                            .setTimestamp()
                            .setColor('#2f3136');
                        i.reply({
                            embeds: [embed]
                        });
                        return m.edit({ components: [] });
                    }
                    else {
                        embed = new Embed_1.default(client, 'success')
                            .setTitle('❌ 하트 인증 실패')
                            .setDescription(`${DateFormatting_1.default._format(res.data.data.lastVote + 12 * 60 * 60 * 1000, 'R')} 뒤에 다시 인증해주세요!`)
                            .setTimestamp()
                            .setColor('#2f3136');
                        i.reply({
                            embeds: [embed]
                        });
                        return m.edit({ components: [] });
                    }
                }
            }))
                .catch((e) => {
                embed = new Embed_1.default(client, 'error')
                    .setTitle('❌ 에러 발생')
                    .setDescription(`하트 인증중 오류가 발생했어요! ${e.message}`)
                    .setFooter(`${message.author.tag}`)
                    .setTimestamp()
                    .setColor('#2f3136');
                i.reply({
                    embeds: [embed]
                });
                return m.edit({ components: [] });
            });
        }
        else if (i.customId == 'heart.archive') {
            axios_1.default
                .get(`https://api.archiver.me/bots/${(_b = client.user) === null || _b === void 0 ? void 0 : _b.id}/like/${message.author.id}`, {
                headers: {
                    Authorization: 'Bearer ' + config_1.default.updateServer.archive,
                    'Content-Type': 'application/json'
                }
            })
                .then((res) => __awaiter(void 0, void 0, void 0, function* () {
                var _d;
                if (!res.data.data.like) {
                    embed = new Embed_1.default(client, 'warn')
                        .setTitle('아카이브 봇 하트인증')
                        .setDescription(`아카이브에 있는 배틀이 봇의 하트가 아직 눌려있지 않았어요!`)
                        .setTimestamp()
                        .setColor('#2f3136');
                    let link = new discord_js_1.default.MessageActionRow().addComponents(new discord_js_1.default.MessageButton()
                        .setURL(`https://archiver.me/bots/${(_d = client.user) === null || _d === void 0 ? void 0 : _d.id}/like`)
                        .setLabel(`하트 누르기`)
                        .setStyle('LINK'));
                    i.reply({
                        embeds: [embed],
                        components: [link]
                    });
                    return m.edit({ components: [] });
                }
                else {
                    const heartData = yield HeartCheck_1.default.findOne({
                        userid: message.author.id,
                        platform: 'archive'
                    });
                    if (!heartData) {
                        yield Money_1.default.updateOne({ userid: message.author.id }, { $inc: { money: 50000 } });
                        yield HeartCheck_1.default.create({
                            userid: message.author.id,
                            platform: 'archive'
                        });
                        embed = new Embed_1.default(client, 'success')
                            .setTitle('⭕ 하트 인증 성공')
                            .setDescription(`${message.author.username}님의 아카이브에 있는 배틀이 봇의 하트인증이 완료되었습니다.`)
                            .setTimestamp()
                            .setColor('#2f3136');
                        i.reply({
                            embeds: [embed]
                        });
                        return m.edit({ components: [] });
                    }
                    else {
                        embed = new Embed_1.default(client, 'success')
                            .setTitle('❌ 하트 인증 실패')
                            .setDescription(`${DateFormatting_1.default._format(res.data.data.lastLike + 24 * 60 * 60 * 1000, 'R')} 뒤에 다시 인증해주세요!`)
                            .setTimestamp()
                            .setColor('#2f3136');
                        i.reply({
                            embeds: [embed]
                        });
                        return m.edit({ components: [] });
                    }
                }
            }))
                .catch((e) => {
                embed = new Embed_1.default(client, 'error')
                    .setTitle('❌ 에러 발생')
                    .setDescription(`하트 인증중 오류가 발생했어요! ${e.message}`)
                    .setFooter(`${message.author.tag}`)
                    .setTimestamp()
                    .setColor('#2f3136');
                i.reply({
                    embeds: [embed]
                });
                return m.edit({ components: [] });
            });
        }
    }));
    collector.on('end', (collected) => {
        if (collected.size == 1)
            return;
        m.edit({
            embeds: [embed],
            components: [
                new discord_js_1.default.MessageActionRow()
                    .addComponents(new discord_js_1.default.MessageButton()
                    .setLabel(`한디리 인증`)
                    .setStyle('PRIMARY')
                    .setCustomId('heart.koreanlist')
                    .setDisabled(true))
                    .addComponents(new discord_js_1.default.MessageButton()
                    .setLabel(`아카이브 인증`)
                    .setStyle('PRIMARY')
                    .setCustomId('heart.archive')
                    .setDisabled(true))
            ]
        });
    });
}));
