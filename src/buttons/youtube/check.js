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
const config_1 = __importDefault(require("../../../config"));
const userSchema_1 = __importDefault(require("../../schemas/userSchema"));
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = require("discord.js");
exports.default = new Command_1.ButtonInteraction({
    name: 'youtube.check'
}, (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield interaction.deferReply({ ephemeral: true });
    if (!interaction.channel)
        return;
    const lodingEmbed = new Embed_1.default(client, 'info')
        .setColor('#2f3136');
    const errorEmbed = new Embed_1.default(client, 'error')
        .setColor('#2f3136');
    const successEmbed = new Embed_1.default(client, 'success')
        .setColor('#2f3136');
    lodingEmbed.setDescription('**유튜브에서 정보를 찾아보는 중이에요!**');
    yield interaction.editReply({ embeds: [lodingEmbed] });
    const userdb = yield userSchema_1.default.findOne({ id: interaction.user.id });
    if (!userdb || !userdb.google_accessToken) {
        errorEmbed.setDescription(`**[여기](${(_a = config_1.default.web) === null || _a === void 0 ? void 0 : _a.baseurl}/api/auth/google)에서 로그인후 다시 진행해주세요!**`);
        return yield interaction.editReply({ embeds: [errorEmbed] });
    }
    else {
        const chnnel_id = 'UCE9Wv-adygeb6PYcqLeRqbA';
        axios_1.default
            .get(`https://www.googleapis.com/youtube/v3/subscriptions?part=snippet&mine=true&forChannelId=${chnnel_id}`, {
            headers: {
                authorization: 'Bearer ' + userdb.google_accessToken
            }
        })
            .then((data) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            const youtubeData = data.data;
            if (youtubeData.pageInfo.totalResults === 0) {
                const button1 = new discord_js_1.MessageButton()
                    .setCustomId('youtube.subscription')
                    .setLabel('네')
                    .setStyle('PRIMARY');
                const button2 = new discord_js_1.MessageButton()
                    .setCustomId('youtube.nosubscription')
                    .setLabel('아니요')
                    .setStyle('DANGER');
                const row = new discord_js_1.MessageActionRow().addComponents([button1, button2]);
                errorEmbed.setDescription(`**구독이 되어있지 않은 거 같아요!** \n 직접 구독해 드릴까요?`);
                yield interaction.editReply({
                    embeds: [errorEmbed],
                    components: [row]
                });
                const collector = (_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.createMessageComponentCollector({
                    time: 10000
                });
                collector === null || collector === void 0 ? void 0 : collector.on('collect', (i) => __awaiter(void 0, void 0, void 0, function* () {
                    if (i.user.id !== interaction.user.id)
                        return;
                    if (i.customId === 'youtube.subscription') {
                        yield axios_1.default
                            .post(`https://www.googleapis.com/youtube/v3/subscriptions?part=snippet`, {
                            snippet: {
                                resourceId: {
                                    channelId: chnnel_id
                                }
                            }
                        }, {
                            headers: {
                                Authorization: 'Bearer ' + (userdb === null || userdb === void 0 ? void 0 : userdb.google_accessToken),
                                redirect: 'follow'
                            }
                        })
                            .then((data) => __awaiter(void 0, void 0, void 0, function* () {
                            successEmbed.setTitle('**성공적으로 구독되었어요!**');
                            return interaction.editReply({
                                embeds: [successEmbed],
                                components: []
                            });
                        }))
                            .catch((err) => {
                            successEmbed.setTitle('**구독하기 중 오류가 발생했어요! 다시 시도해 주세요!**');
                            return interaction.editReply({
                                embeds: [successEmbed],
                                components: []
                            });
                        });
                    }
                    else if (i.customId === 'youtube.nosubscription') {
                        errorEmbed.setDescription(`**구독하기가 취소되었습니다!**`);
                        interaction.editReply({ embeds: [errorEmbed], components: [] });
                    }
                    else {
                        return;
                    }
                }));
                collector === null || collector === void 0 ? void 0 : collector.on('end', (collected) => {
                    if (collected.size == 1)
                        return;
                    interaction.editReply({
                        embeds: [errorEmbed],
                        components: [
                            new discord_js_1.MessageActionRow().addComponents(new discord_js_1.MessageButton()
                                .setCustomId('accept')
                                .setLabel('시간 초과. 다시 시도해주세요...')
                                .setStyle('SECONDARY')
                                .setEmoji('⛔')
                                .setDisabled(true))
                        ]
                    });
                });
            }
            else {
                successEmbed.setTitle('**구독 인증이 완료되었어요!**');
                return interaction.editReply({
                    embeds: [successEmbed],
                    components: []
                });
            }
        }))
            .catch((e) => {
            var _a, _b;
            if (((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 401) {
                errorEmbed.setDescription(`**유튜브 인증이 만료된 거 같아요! \n [여기](${(_b = config_1.default.web) === null || _b === void 0 ? void 0 : _b.baseurl}/api/auth/google)에서 로그인후 다시 진행해주세요!**`);
                return interaction.editReply({ embeds: [errorEmbed] });
            }
        });
    }
}));
