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
exports.playerStats = void 0;
const discord_js_1 = require("discord.js");
const archive_pubg_ts_1 = require("archive-pubg-ts");
const config_1 = __importDefault(require("../../config"));
const PubgStatsSchema_1 = __importDefault(require("../schemas/PubgStatsSchema"));
const DateFormatting_1 = require("./DateFormatting");
const Embed_1 = __importDefault(require("./Embed"));
const playerStats = (nickname, mode, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const pubgUser = yield PubgStatsSchema_1.default.findOne({ nickname: nickname });
    const embed = new Embed_1.default(interaction.client, 'success');
    const embedError = new Embed_1.default(interaction.client, 'info');
    if (!pubgUser) {
        const buttons = [
            new discord_js_1.MessageButton()
                .setLabel('스팀')
                .setCustomId('pubg.steam')
                .setStyle('SECONDARY'),
            new discord_js_1.MessageButton()
                .setLabel('카카오')
                .setCustomId('pubg.kakao')
                .setStyle('SECONDARY')
        ];
        embedError.setDescription('처음으로 전적을 검색하는 닉네임 같아요! \n 서버를 선택해 주세요! 다음부터는 선택 없이 검색이 가능해요!');
        yield interaction.editReply({
            embeds: [embedError],
            components: [new discord_js_1.MessageActionRow().addComponents(buttons)]
        });
        const collector = (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.createMessageComponentCollector({
            time: 30 * 1000
        });
        collector === null || collector === void 0 ? void 0 : collector.on('collect', (collector_interaction) => __awaiter(void 0, void 0, void 0, function* () {
            if (collector_interaction.customId === 'pubg.kakao') {
                const pubg = new archive_pubg_ts_1.Client({
                    apiKey: config_1.default.pubgapikey,
                    shard: archive_pubg_ts_1.Shard.KAKAO
                });
                const { data: player } = yield pubg.getPlayer({
                    skipFailed: false,
                    value: nickname
                });
                if (!player || player.length === 0)
                    return collector_interaction.reply('유저 정보를 찾지 못했습니다! \n 대소문자 구별 필수');
                const pubgDB = new PubgStatsSchema_1.default();
                pubgDB.user_id = player[0].id;
                pubgDB.nickname = nickname;
                pubgDB.platform = archive_pubg_ts_1.Shard.KAKAO;
                pubgDB.save((err) => {
                    if (err)
                        return collector_interaction.reply('데이터 저장도중 오류가 발생했습니다!');
                });
                interaction.editReply({ components: [] });
                collector === null || collector === void 0 ? void 0 : collector.stop();
                return collector_interaction.reply(`\`${nickname}\`유저가 \`카카오\` 서버로 설정이 완료되었습니다`);
            }
            else if (collector_interaction.customId === 'pubg.steam') {
                const pubg = new archive_pubg_ts_1.Client({
                    apiKey: config_1.default.pubgapikey,
                    shard: archive_pubg_ts_1.Shard.STEAM
                });
                const { data: player } = yield pubg.getPlayer({
                    skipFailed: false,
                    value: nickname
                });
                if (!player || player.length === 0)
                    return collector_interaction.reply('유저 정보를 찾지 못했습니다! \n 대소문자 구별 필수');
                const pubgDB = new PubgStatsSchema_1.default();
                pubgDB.user_id = player[0].id;
                pubgDB.nickname = nickname;
                pubgDB.platform = archive_pubg_ts_1.Shard.STEAM;
                pubgDB.save((err) => {
                    if (err)
                        return collector_interaction.reply('데이터 저장도중 오류가 발생했습니다!');
                });
                interaction.editReply({ components: [] });
                collector === null || collector === void 0 ? void 0 : collector.stop();
                return collector_interaction.reply(`\`${nickname}\`유저가 \`스팀\` 서버로 설정이 완료되었습니다`);
            }
            else if (collector_interaction.user.id !== interaction.user.id) {
                collector_interaction.reply(`메세지를 작성한 **${interaction.user.username}**만 사용할 수 있습니다.`);
            }
        }));
    }
    else {
        const date = new Date();
        if (Math.round(Number(date) - Number(pubgUser.last_update)) / 1000 / 60 <
            10) {
            if (mode === 'fpprank') {
                if (!pubgUser.stats.rankSquardFpp)
                    return yield updateStats(pubgUser, mode, interaction);
                const squadFppStats = pubgUser.stats.rankSquardFpp;
                if (!squadFppStats) {
                    embed.setDescription(`\`${pubgUser.nickname}\`님의 1인칭 스쿼드 경쟁전 전적을 찾을 수 없습니다`);
                    return interaction.editReply({ embeds: [embed] });
                }
                return interaction.editReply({
                    embeds: [
                        rankStatEmbed(squadFppStats, pubgUser.nickname, '1인칭 경쟁전', pubgUser.last_update)
                    ]
                });
            }
            else if (mode === 'tpprank') {
                if (!pubgUser.stats.rankSquardTpp)
                    return yield updateStats(pubgUser, mode, interaction);
                const squadTppStats = pubgUser.stats.rankSquardTpp;
                if (!squadTppStats) {
                    embed.setDescription(`\`${pubgUser.nickname}\`님의 3인칭 스쿼드 경쟁전 전적을 찾을 수 없습니다`);
                    return interaction.editReply({ embeds: [embed] });
                }
                return interaction.editReply({
                    embeds: [
                        rankStatEmbed(squadTppStats, pubgUser.nickname, '3인칭 경쟁전', pubgUser.last_update)
                    ]
                });
            }
            else if (mode === 'tpp') {
                if (!pubgUser.stats.SquardTpp)
                    return yield updateStats(pubgUser, mode, interaction);
                const squadTppStats = pubgUser.stats.SquardTpp;
                if (!squadTppStats) {
                    embed.setDescription(`\`${pubgUser.nickname}\`님의 3인칭 스쿼드 전적을 찾을 수 없습니다`);
                    return interaction.editReply({ embeds: [embed] });
                }
                return interaction.editReply({
                    embeds: [
                        statEmbed(squadTppStats, pubgUser.nickname, '3인칭 일반전', pubgUser.last_update)
                    ]
                });
            }
            else if (mode == 'fpp') {
                if (!pubgUser.stats.SquardFpp)
                    return yield updateStats(pubgUser, mode, interaction);
                const squadFppStats = pubgUser.stats.SquardFpp;
                if (!squadFppStats) {
                    embed.setDescription(`\`${pubgUser.nickname}\`님의 1인칭 스쿼드 전적을 찾을 수 없습니다`);
                    return interaction.editReply({ embeds: [embed] });
                }
                return interaction.editReply({
                    embeds: [
                        statEmbed(squadFppStats, pubgUser.nickname, '1인칭 일반전', pubgUser.last_update)
                    ]
                });
            }
        }
        else {
            return yield updateStats(pubgUser, mode, interaction);
        }
    }
    function updateStats(pubgUser, mode, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            const embed = new Embed_1.default(interaction.client, 'success');
            if (mode === 'fpprank') {
                const pubg = new archive_pubg_ts_1.Client({
                    apiKey: config_1.default.pubgapikey,
                    shard: pubgUser.platform
                });
                const { data: activeSeason } = yield pubg.getSeason();
                const { data: SeasonsStats, error: error } = yield pubg.getPlayerSeason({
                    player: pubgUser.user_id,
                    season: activeSeason,
                    ranked: true,
                    gamemode: archive_pubg_ts_1.GameModeStatGamemode.SQUAD_FPP
                });
                if (error) {
                    console.log(error);
                }
                const squadFppStats = 
                // @ts-ignore
                SeasonsStats.rankedGameModeStats['squad-fpp'];
                yield PubgStatsSchema_1.default.updateOne({ user_id: pubgUser.user_id }, {
                    $set: {
                        stats: {
                            // @ts-ignore
                            rankSquardTpp: SeasonsStats.rankedGameModeStats.squad,
                            // @ts-ignore
                            rankSquardFpp: SeasonsStats.rankedGameModeStats['squad-fpp']
                        },
                        last_update: new Date()
                    }
                });
                return interaction.editReply({
                    embeds: [
                        rankStatEmbed(squadFppStats, pubgUser.nickname, '1인칭 경쟁전', new Date())
                    ]
                });
            }
            else if (mode === 'tpprank') {
                const pubg = new archive_pubg_ts_1.Client({
                    apiKey: config_1.default.pubgapikey,
                    shard: pubgUser.platform
                });
                const { data: activeSeason } = yield pubg.getSeason();
                const { data: SeasonsStats, error: error } = yield pubg.getPlayerSeason({
                    player: pubgUser.user_id,
                    season: activeSeason,
                    ranked: true,
                    gamemode: archive_pubg_ts_1.GameModeStatGamemode.SQUAD
                });
                if (error) {
                    console.log(error);
                }
                const squadTppStats = 
                // @ts-ignore
                SeasonsStats.rankedGameModeStats.squad;
                yield PubgStatsSchema_1.default.updateOne({ user_id: pubgUser.user_id }, {
                    $set: {
                        stats: {
                            // @ts-ignore
                            rankSquardTpp: SeasonsStats.rankedGameModeStats.squad,
                            // @ts-ignore
                            rankSquardFpp: SeasonsStats.rankedGameModeStats['squad-fpp']
                        },
                        last_update: new Date()
                    }
                });
                if (!squadTppStats) {
                    embed.setDescription(`\`${pubgUser.nickname}\`님의 3인칭 스쿼드 전적을 찾을 수 없습니다`);
                    return interaction.editReply({ embeds: [embed] });
                }
                return interaction.editReply({
                    embeds: [
                        rankStatEmbed(squadTppStats, pubgUser.nickname, '3인칭 경쟁전', new Date())
                    ]
                });
            }
            else if (mode === 'tpp') {
                const pubg = new archive_pubg_ts_1.Client({
                    apiKey: config_1.default.pubgapikey,
                    shard: pubgUser.platform
                });
                const { data: activeSeason } = yield pubg.getSeason();
                const { data: SeasonsStats, error: error } = yield pubg.getPlayerSeason({
                    player: pubgUser.user_id,
                    season: activeSeason,
                    gamemode: archive_pubg_ts_1.GameModeStatGamemode.SQUAD
                });
                if (error) {
                    console.log(error);
                }
                // @ts-ignore
                const squadTppStats = SeasonsStats.gamemodeStats.squad;
                yield PubgStatsSchema_1.default.updateOne({ user_id: pubgUser.user_id }, {
                    $set: {
                        stats: {
                            // @ts-ignore
                            SquardTpp: SeasonsStats.gamemodeStats.squad,
                            // @ts-ignore
                            SquardFpp: SeasonsStats.gamemodeStats['squad-fpp']
                        },
                        last_update: new Date()
                    }
                });
                if (!squadTppStats) {
                    embed.setDescription(`\`${pubgUser.nickname}\`님의 3인칭 스쿼드 전적을 찾을 수 없습니다`);
                    return interaction.editReply({ embeds: [embed] });
                }
                return interaction.editReply({
                    embeds: [
                        statEmbed(squadTppStats, pubgUser.nickname, '3인칭 일반전', new Date())
                    ]
                });
            }
            else if (mode == 'fpp') {
                const pubg = new archive_pubg_ts_1.Client({
                    apiKey: config_1.default.pubgapikey,
                    shard: pubgUser.platform
                });
                const { data: activeSeason } = yield pubg.getSeason();
                const { data: SeasonsStats, error: error } = yield pubg.getPlayerSeason({
                    player: pubgUser.user_id,
                    season: activeSeason,
                    gamemode: archive_pubg_ts_1.GameModeStatGamemode.SQUAD_FPP
                });
                const squadFppStats = 
                // @ts-ignore
                SeasonsStats.gamemodeStats['squad-fpp'];
                yield PubgStatsSchema_1.default.updateOne({ user_id: pubgUser.user_id }, {
                    $set: {
                        stats: {
                            // @ts-ignore
                            SquardTpp: SeasonsStats.gamemodeStats.squad,
                            // @ts-ignore
                            SquardFpp: SeasonsStats.gamemodeStats['squad-fpp']
                        },
                        last_update: new Date()
                    }
                });
                if (!squadFppStats) {
                    embed.setDescription(`\`${pubgUser.nickname}\`님의 1인칭 스쿼드 전적을 찾을 수 없습니다`);
                    return interaction.editReply({ embeds: [embed] });
                }
                return interaction.editReply({
                    embeds: [
                        statEmbed(squadFppStats, pubgUser.nickname, '1인칭 일반전', new Date())
                    ]
                });
            }
        });
    }
});
exports.playerStats = playerStats;
const rankStatEmbed = (stats, nickname, mode, last_update) => {
    const embed = new discord_js_1.MessageEmbed();
    if (!stats) {
        embed
            .setDescription(`\`${nickname}\`님의 ${mode} 스쿼드 전적을 찾을 수 없습니다`)
            .setFooter(`마지막 업데이트: ${(0, DateFormatting_1.Day)(last_update).fromNow(false)}`);
        return embed;
    }
    embed
        .setColor('BLUE')
        .setAuthor(`${nickname}님의 ${mode} 전적`)
        .setTitle(stats.currentTier
        ? `${stats.currentTier.tier} ${stats.currentTier.subTier}`
        : '언랭크')
        .setThumbnail(`https://dak.gg/pubg/images/tiers/s7/rankicon_${stats.currentTier.tier.toLowerCase() + stats.currentTier.subTier}.png`)
        .addField('KDA', stats.kda.toFixed(2), true)
        .addField('승률', (stats.winRatio * 100).toFixed(1) + '%', true)
        .addField('TOP 10', (stats.top10Ratio * 100).toFixed(1) + '%', true)
        .addField('평균 딜량', (stats.damageDealt / stats.roundsPlayed).toFixed(0), true)
        .addField('게임 수', stats.roundsPlayed.toString(), true)
        .addField('평균 등수', stats.avgRank.toFixed(1) + '등', true)
        .setFooter(`마지막 업데이트: ${(0, DateFormatting_1.Day)(last_update).fromNow(false)}`);
    return embed;
};
const statEmbed = (stats, nickname, mode, last_update) => {
    const winGamePercent = (stats.wins / stats.roundsPlayed) * 100;
    const top10GamePercent = (stats.top10s / stats.roundsPlayed) * 100;
    const embed = new discord_js_1.MessageEmbed()
        .setColor('BLUE')
        .setAuthor(`${nickname}님의 ${mode} 전적`)
        .addField('KDA', ((stats.kills + stats.assists) / stats.losses).toFixed(2), true)
        .addField('승률', winGamePercent.toFixed(1) + '%', true)
        .addField('TOP 10', top10GamePercent.toFixed(1) + '%', true)
        .addField('평균 딜량', (stats.damageDealt / stats.roundsPlayed).toFixed(0), true)
        .addField('게임 수', stats.roundsPlayed.toString(), true)
        .addField('최다 킬', stats.roundMostKills + '킬', true)
        .setFooter(`마지막 업데이트: ${(0, DateFormatting_1.Day)(last_update).fromNow(false)}`);
    return embed;
};
