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
const discord_js_1 = require("discord.js");
const Command_1 = require("../../structures/Command");
const Embed_1 = __importDefault(require("../../utils/Embed"));
const axios_1 = __importDefault(require("axios"));
const convert_1 = require("../../utils/convert");
const config_1 = __importDefault(require("../../../config"));
const builders_1 = require("@discordjs/builders");
exports.default = new Command_1.BaseCommand({
    name: 'schoolmeal',
    description: '학교의 급식정보를 보여줍니다',
    aliases: ['급식', 'rmqtlr']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    if (!args[0]) {
        let embed = new Embed_1.default(client, 'error')
            .setTitle(`이런...`)
            .setDescription(`학교 이름을 적어주세요 \n\n \`${config_1.default.bot.prefix}급식 <학교명>\``);
        return message.reply({ embeds: [embed] });
    }
    else {
        let embed = new Embed_1.default(client, 'info')
            .setTitle(`급식`)
            .setDescription(`학교 급식을 찾는중이에요...`);
        let msg = yield message.reply({ embeds: [embed] });
        yield axios_1.default.get(`https://asia-northeast3-smeals-school.cloudfunctions.net/meals/schools?name=${encodeURI(args[0])}`)
            .then((d) => __awaiter(void 0, void 0, void 0, function* () {
            let data = d.data;
            let embed = new Embed_1.default(client, 'info')
                .setTitle(`급식`)
                .setDescription(`학교를 찾았어요 학교를 선택해 주세요!`);
            let row = new discord_js_1.MessageActionRow();
            let select = new discord_js_1.MessageSelectMenu()
                .setCustomId('school.meal')
                .setPlaceholder('학교를 선택해주세요!');
            let schoolsTime = 25;
            if (data.schools.length < 25)
                schoolsTime = data.schools.length;
            for (let i = 0; i < schoolsTime; i++) {
                select.addOptions([
                    {
                        label: data.schools[i].name,
                        description: data.schools[i].where,
                        value: `${data.schools[i].code}|${data.schools[i].scCode}|${data.schools[i].name}`
                    }
                ]);
            }
            row.addComponents(select);
            yield msg.edit({ embeds: [embed], components: [row] });
            const collector = msg.createMessageComponentCollector({ time: 60000 });
            collector.on('collect', (i) => __awaiter(void 0, void 0, void 0, function* () {
                if (i.user.id === message.author.id) {
                    if (i.customId === "school.meal") {
                        let date = (0, convert_1.getDate)();
                        // @ts-ignore
                        let value = i.values[0].split("|");
                        axios_1.default.get(`https://asia-northeast3-smeals-school.cloudfunctions.net/meals/meals?code=${value[0]}&scCode=${value[1]}&date=${date.datestring}`)
                            .then((data) => __awaiter(void 0, void 0, void 0, function* () {
                            let meal = data.data;
                            let mealembed = new Embed_1.default(client, 'success')
                                .setTitle(`${value[2]} 급식`)
                                .setDescription(`${meal.meals[0].meal.join('\n')} \n\n ${meal.meals[0].calories}`);
                            yield i.reply({ embeds: [mealembed] });
                        })).catch((e) => __awaiter(void 0, void 0, void 0, function* () {
                            var _a;
                            if (((_a = e.response) === null || _a === void 0 ? void 0 : _a.status) === 404) {
                                let mealembed = new Embed_1.default(client, 'warn')
                                    .setTitle(`${value[2]} 급식`)
                                    .setDescription(`어라... ${value[2]}의 급식을 찾을 수 없어요...`);
                                yield i.reply({ embeds: [mealembed], components: [] });
                            }
                        }));
                    }
                }
                else {
                    i.reply(`명령어를 요청한 **${message.author.username}**만 사용할수 있어요.`);
                }
            }));
        })).catch((e) => __awaiter(void 0, void 0, void 0, function* () {
            var _b;
            if (((_b = e.response) === null || _b === void 0 ? void 0 : _b.status) === 404) {
                let mealembed = new Embed_1.default(client, 'warn')
                    .setTitle(`${args[0]} 급식`)
                    .setDescription(`어라... ${args[0]}을 찾을 수 없어요...`);
                yield msg.edit({ embeds: [mealembed], components: [] });
            }
        }));
    }
}), {
    data: new builders_1.SlashCommandBuilder()
        .setName('급식')
        .addStringOption((option) => option
        .setName('school')
        .setDescription('학교이름을 적어주세요')
        .setRequired(true))
        .setDescription('학교의 급식정보를 보여줍니다'),
    options: {
        name: '급식',
        isSlash: true
    },
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            let school = interaction.options.getString('school');
            if (!school) {
                let embed = new Embed_1.default(client, 'error')
                    .setTitle(`이런...`)
                    .setDescription(`학교 이름을 적어주세요 \n\n \`${config_1.default.bot.prefix}급식 <학교명>\``);
                return interaction.reply({ embeds: [embed] });
            }
            else {
                let embed = new Embed_1.default(client, 'info')
                    .setTitle(`급식`)
                    .setDescription(`학교 학교를 찾는중이에요...`);
                let msg = yield interaction.reply({ embeds: [embed] });
                yield axios_1.default.get(`https://asia-northeast3-smeals-school.cloudfunctions.net/meals/schools?name=${encodeURI(school)}`)
                    .then((d) => __awaiter(this, void 0, void 0, function* () {
                    var _a;
                    let data = d.data;
                    let embed = new Embed_1.default(client, 'info')
                        .setTitle(`급식`)
                        .setDescription(`학교 학교 찾았어요 학교를 선택해 주세요!`);
                    let row = new discord_js_1.MessageActionRow();
                    let select = new discord_js_1.MessageSelectMenu()
                        .setCustomId('school.meal')
                        .setPlaceholder('학교를 선택해주세요!');
                    let schoolsTime = 25;
                    if (data.schools.length < 25)
                        schoolsTime = data.schools.length;
                    for (let i = 0; i < schoolsTime; i++) {
                        select.addOptions([
                            {
                                label: data.schools[i].name,
                                description: data.schools[i].where,
                                value: `${data.schools[i].code}|${data.schools[i].scCode}|${data.schools[i].name}`
                            }
                        ]);
                    }
                    row.addComponents(select);
                    yield interaction.editReply({ embeds: [embed], components: [row] });
                    const collector = (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.createMessageComponentCollector({ time: 60000 });
                    collector === null || collector === void 0 ? void 0 : collector.on('collect', (i) => __awaiter(this, void 0, void 0, function* () {
                        if (i.user.id === interaction.user.id) {
                            if (i.customId === "school.meal") {
                                let date = (0, convert_1.getDate)();
                                // @ts-ignore
                                let value = i.values[0].split("|");
                                axios_1.default.get(`https://asia-northeast3-smeals-school.cloudfunctions.net/meals/meals?code=${value[0]}&scCode=${value[1]}&date=${date.datestring}`)
                                    .then((data) => __awaiter(this, void 0, void 0, function* () {
                                    let meal = data.data;
                                    let mealembed = new Embed_1.default(client, 'success')
                                        .setTitle(`${value[2]} 급식`)
                                        .setDescription(`${meal.meals[0].meal.join('\n')} \n\n ${meal.meals[0].calories}`);
                                    yield i.reply({ embeds: [mealembed] });
                                })).catch((e) => __awaiter(this, void 0, void 0, function* () {
                                    var _b;
                                    if (((_b = e.response) === null || _b === void 0 ? void 0 : _b.status) === 404) {
                                        let mealembed = new Embed_1.default(client, 'warn')
                                            .setTitle(`${value[2]} 급식`)
                                            .setDescription(`어라... ${value[2]}의 급식을 찾을 수 없어요...`);
                                        yield i.reply({ embeds: [mealembed], components: [] });
                                    }
                                }));
                            }
                        }
                        else {
                            i.editReply(`명령어를 요청한 **${interaction.user.username}**만 사용할수 있어요.`);
                        }
                    }));
                })).catch((e) => __awaiter(this, void 0, void 0, function* () {
                    var _c;
                    if (((_c = e.response) === null || _c === void 0 ? void 0 : _c.status) === 404) {
                        let mealembed = new Embed_1.default(client, 'warn')
                            .setTitle(`${school} 급식`)
                            .setDescription(`어라... ${school}을 찾을 수 없어요...`);
                        return yield interaction.editReply({ embeds: [mealembed], components: [] });
                    }
                }));
            }
        });
    }
});
