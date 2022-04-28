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
const hcs_js_1 = require("hcs.js");
const hcsSchemas_1 = __importDefault(require("../../schemas/hcsSchemas"));
const builders_1 = require("@discordjs/builders");
const Embed_1 = __importDefault(require("../../utils/Embed"));
const discord_js_1 = require("discord.js");
exports.default = new Command_1.BaseCommand({
    name: 'hcskr',
    description: '자가진단을 실행합니다.',
    aliases: ['자가진단', 'hcskr', 'hcs']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    return message.reply(`해당 명령어는 (/)커멘드로만 사용가능합니다`);
}), {
    // @ts-ignore
    data: new builders_1.SlashCommandBuilder()
        .setName('자가진단')
        .setDescription('자가진단 관련 명령어 입니다')
        .addSubcommand((option) => option.setName('실행').setDescription('자가진단을 실행합니다'))
        .addSubcommand((option) => option
        .setName('설정')
        .setDescription('자가진단을 설정합니다')
        .addStringOption((name) => name
        .setName('이름')
        .setDescription('이름을 적어주세요')
        .setRequired(true))
        .addStringOption((school) => school
        .setName('학교')
        .setDescription('학교이름을 적어주세요')
        .setRequired(true))
        .addStringOption((birthday) => birthday
        .setName('생년월일')
        .setDescription('생년월일 6자리를 입력해주세요')
        .setRequired(true))
        .addStringOption((password) => password
        .setName('비밀번호')
        .setDescription('4자리 비밀번호를 입력해주세요.')
        .setRequired(true))),
    options: {
        name: '자가진단',
        isSlash: true
    },
    execute(client, interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            let subcommand = interaction.options.getSubcommand();
            let successEmbed = new Embed_1.default(client, 'success');
            let errEmbed = new Embed_1.default(client, 'error');
            let infoEmbed = new Embed_1.default(client, 'info');
            if (subcommand === '설정') {
                let name = interaction.options.getString('이름', true);
                let school = interaction.options.getString('학교', true);
                let birthday = interaction.options.getString('생년월일', true);
                let password = interaction.options.getString('비밀번호', true);
                let hcsDb = yield hcsSchemas_1.default.findOne({ user_id: interaction.user.id });
                if (hcsDb) {
                    errEmbed.setDescription('이미 등록된 자가진단 정보가 있습니다.');
                    return interaction.editReply({ embeds: [errEmbed] });
                }
                let schoolResult = yield (0, hcs_js_1.searchSchool)(school);
                if (schoolResult.length === 0) {
                    errEmbed.setDescription('학교정보를 찾지 못했습니다.');
                    return interaction.editReply({ embeds: [errEmbed] });
                }
                let login = yield (0, hcs_js_1.login)(schoolResult[0].endpoint, schoolResult[0].schoolCode, name, birthday.toString(), schoolResult[0].searchKey);
                if (!login.success) {
                    errEmbed.setDescription('이름과 생년월일이 올바르게 작성되었는지 확인해주세요.');
                    return interaction.editReply({ embeds: [errEmbed] });
                }
                if (login.agreementRequired) {
                    yield (0, hcs_js_1.updateAgreement)(schoolResult[0].endpoint, login.token);
                }
                let token = login.token;
                let secondLogin = yield (0, hcs_js_1.secondLogin)(schoolResult[0].endpoint, login.token, password);
                if (!secondLogin.success) {
                    if (secondLogin.remainingMinutes) {
                        errEmbed.setDescription(`비밀번호를 5회 이상 실패하여 ${secondLogin.remainingMinutes}분 후에 재시도가 가능합니다.`);
                        return interaction.editReply({ embeds: [errEmbed] });
                    }
                    errEmbed.setDescription('비밀번호가 올바르지 않습니다. 다시 시도해주세요.');
                    return interaction.editReply({ embeds: [errEmbed] });
                }
                infoEmbed.setAuthor('자가진단 등록');
                infoEmbed.addField('이름', name, true);
                infoEmbed.addField('생년월일', birthday.toString(), true);
                infoEmbed.addField('학교', schoolResult[0].name, true);
                infoEmbed.setDescription('[개인정보처리방침](https://battlebot.kr/help/privacy)에 따라 아래정보로 등록을 진행합니다 \n 동의하실경우 등록이 진행됩니다');
                let buttons = [
                    new discord_js_1.MessageButton()
                        .setCustomId('hcs.ok')
                        .setLabel('동의')
                        .setStyle('SUCCESS'),
                    new discord_js_1.MessageButton()
                        .setCustomId('hcs.none')
                        .setLabel('거부')
                        .setStyle('DANGER')
                ];
                yield interaction.editReply({
                    embeds: [infoEmbed],
                    components: [new discord_js_1.MessageActionRow().addComponents(buttons)]
                });
                const collector = (_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.createMessageComponentCollector({
                    time: 30000
                });
                collector === null || collector === void 0 ? void 0 : collector.on('collect', (collerton) => __awaiter(this, void 0, void 0, function* () {
                    if (collerton.user.id !== interaction.user.id)
                        return;
                    if (collerton.customId === 'hcs.ok') {
                        collector.stop();
                        if (!login.success)
                            return;
                        let hcsdb = new hcsSchemas_1.default();
                        hcsdb.user_id = interaction.user.id;
                        hcsdb.name = name;
                        hcsdb.school = schoolResult[0].name;
                        hcsdb.birthday = birthday;
                        hcsdb.password = password;
                        hcsdb.save((err) => __awaiter(this, void 0, void 0, function* () {
                            if (err) {
                                errEmbed.setDescription('자가진단 정보 저장중 오류가 발생했습니다.');
                                return interaction.editReply({
                                    embeds: [errEmbed],
                                    components: []
                                });
                            }
                        }));
                        successEmbed.setDescription('자가진단 등록이 성공적으로 완료 되었습니다!');
                        yield interaction.editReply({
                            embeds: [successEmbed],
                            components: []
                        });
                    }
                    if (collerton.customId === 'hcs.none') {
                        collector.stop();
                        errEmbed.setDescription('자가진단 등록이 취소되었습니다.');
                        yield interaction.editReply({ embeds: [errEmbed], components: [] });
                    }
                }));
            }
            else if (subcommand === '실행') {
                let hcsdb = yield hcsSchemas_1.default.findOne({ user_id: interaction.user.id });
                if (!hcsdb) {
                    errEmbed.setDescription('등록된 자가진단 정보가 없습니다 \n `/자가진단 설정` 명령어로 **자가진단**을 설정해주세요.');
                    return yield interaction.editReply({ embeds: [errEmbed] });
                }
                else {
                    const school = yield (0, hcs_js_1.searchSchool)(hcsdb.school);
                    const login = yield (0, hcs_js_1.login)(school[0].endpoint, school[0].schoolCode, hcsdb.name, hcsdb.birthday, school[0].searchKey);
                    const secondLogin = yield (0, hcs_js_1.secondLogin)(school[0].endpoint, 
                    // @ts-ignore
                    login.token, hcsdb.password);
                    if (!secondLogin.success) {
                        if (secondLogin.remainingMinutes) {
                            errEmbed.setDescription(`비밀번호를 5회 이상 실패하여 ${secondLogin.remainingMinutes}분 후에 재시도가 가능합니다.`);
                            return interaction.editReply({ embeds: [errEmbed] });
                        }
                        errEmbed.setDescription('비밀번호가 올바르지 않습니다. 관리자에게 문의해주세요.');
                        return interaction.editReply({ embeds: [errEmbed] });
                    }
                    yield (0, hcs_js_1.registerSurvey)(school[0].endpoint, secondLogin.token);
                    successEmbed.setDescription(`\`${hcsdb.name}\`님의 자가진단이 완료되었습니다`);
                    return yield interaction.editReply({ embeds: [successEmbed] });
                }
            }
        });
    }
});
