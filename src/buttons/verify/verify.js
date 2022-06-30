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
const verifySetting_1 = __importDefault(require("../../schemas/verifySetting"));
const Command_1 = require("../../structures/Command");
const createCapcha_1 = __importDefault(require("../../utils/createCapcha"));
const Embed_1 = __importDefault(require("../../utils/Embed"));
const anyid_1 = require("anyid");
const verify_1 = __importDefault(require("../../schemas/verify"));
const config_1 = __importDefault(require("../../../config"));
const convert_1 = require("../../utils/convert");
const MailSender_1 = __importDefault(require("../../utils/MailSender"));
const checkPremium_1 = __importDefault(require("../../utils/checkPremium"));
const userSchema_1 = __importDefault(require("../../schemas/userSchema"));
exports.default = new Command_1.ButtonInteraction({
    name: 'verify'
}, (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    yield interaction.deferReply({ ephemeral: true });
    const VerifySettingDB = yield verifySetting_1.default.findOne({
        guild_id: (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id
    });
    if (!VerifySettingDB)
        return interaction.editReply('찾을 수 없는 서버 정보입니다');
    if (VerifySettingDB.type === 'default') {
        const captcha = (0, createCapcha_1.default)();
        const captchaEmbed = new Embed_1.default(client, 'info')
            .setTitle('인증')
            .setDescription('아래코드를 입력해주세요 제한시간: 30초')
            .setImage('attachment://captcha.png')
            .setColor('#2f3136');
        yield interaction.editReply({
            embeds: [captchaEmbed],
            files: [{ name: 'captcha.png', attachment: captcha.buffer }]
        });
        const filter = (m) => {
            return m.author.id == interaction.user.id;
        };
        yield ((_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.awaitMessages({
            filter: filter,
            max: 1,
            time: 30000,
            errors: ['time']
        }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
            var _k;
            yield ((_k = res.first()) === null || _k === void 0 ? void 0 : _k.delete());
            const answer = String(res.first());
            if (answer === captcha.text) {
                const captchaSuccess = new Embed_1.default(client, 'success')
                    .setTitle('인증')
                    .setDescription('인증을 성공했습니다')
                    .setColor('#2f3136');
                const member = interaction.member;
                try {
                    yield member.roles.remove(VerifySettingDB.del_role_id);
                }
                catch (e) {
                    console.log(e);
                }
                try {
                    yield member.roles.add(VerifySettingDB === null || VerifySettingDB === void 0 ? void 0 : VerifySettingDB.role_id);
                }
                catch (e) {
                    const captchaError = new Embed_1.default(client, 'error')
                        .setTitle('인증')
                        .setDescription('인증완료 역할 지급중 오류가 발생했습니다')
                        .setColor('#2f3136');
                    if (e)
                        return interaction.editReply({ embeds: [captchaError] });
                }
                return interaction.editReply({ embeds: [captchaSuccess] });
            }
            else {
                const captchaDeny = new Embed_1.default(client, 'error')
                    .setTitle('인증')
                    .setDescription('인증을 실패했습니다 다시 시도해주세요')
                    .setColor('#2f3136');
                return interaction.editReply({ embeds: [captchaDeny] });
            }
        })).catch(() => {
            const captchaTimeout = new Embed_1.default(client, 'error')
                .setTitle('인증')
                .setDescription('인증시간이 초과되었습니다 다시 시도해주세요')
                .setColor('#2f3136');
            return interaction.editReply({ embeds: [captchaTimeout] });
        }));
    }
    else if (VerifySettingDB.type === 'captcha') {
        const token = (0, anyid_1.anyid)()
            .encode('Aa0')
            .bits(48 * 8)
            .random()
            .id();
        const verify = new verify_1.default();
        verify.guild_id = (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.id;
        verify.user_id = interaction.user.id;
        verify.status = 'pending';
        verify.token = token;
        verify.save((err) => {
            if (err)
                return interaction.editReply('정보 생성중 오류가 발생했습니다');
        });
        const captchaVerify = new Embed_1.default(client, 'success')
            .setTitle('인증')
            .setDescription(`[여기](${(_d = config_1.default.web) === null || _d === void 0 ? void 0 : _d.baseurl}/verify?token=${token})로 접속하여 인증을 진행해주세요`)
            .setColor('#2f3136');
        const captchaGuildEmbed = new Embed_1.default(client, 'info')
            .setColor('#2f3136');
        captchaGuildEmbed.setThumbnail((0, convert_1.guildProfileLink)(interaction.guild));
        captchaGuildEmbed.setTitle(`${(_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.name} 서버 인증`);
        captchaGuildEmbed.setDescription(`${(_f = interaction.guild) === null || _f === void 0 ? void 0 : _f.name}서버에서 ${interaction.user.username}님에게 인증을 요청합니다`);
        captchaGuildEmbed.setURL(`${(_g = config_1.default.web) === null || _g === void 0 ? void 0 : _g.baseurl}/verify?token=${token}`);
        try {
            yield interaction.user.send({ embeds: [captchaVerify] });
            yield interaction.user.send({ embeds: [captchaGuildEmbed] });
        }
        catch (e) {
            if (e)
                return interaction.editReply('서버 멤버가 보내는 다이렉트 메시지 허용하기가 꺼저있는지 확인해주세요');
        }
        return interaction.editReply('DM으로 인증정보를 보내드렸습니다 DM을 확인해주세요');
    }
    else if (VerifySettingDB.type === 'email') {
        const isPremium = yield (0, checkPremium_1.default)(client, interaction.guild);
        if (!isPremium) {
            return interaction.editReply('프리미엄 기한 만료로 이메일 인증 기능이 비활성화되었습니다');
        }
        const code = Math.random().toString(36).substr(2, 7);
        const captchaEmail = new Embed_1.default(client, 'success')
            .setTitle('인증')
            .setDescription('인증을 진행하실 이메일 주소를 30초 내로 입력해주세요!')
            .setColor('#2f3136');
        yield interaction.editReply({ embeds: [captchaEmail] });
        const filter = (m) => {
            return m.author.id == interaction.user.id;
        };
        yield ((_h = interaction.channel) === null || _h === void 0 ? void 0 : _h.awaitMessages({
            filter: filter,
            max: 1,
            time: 30000,
            errors: ['time']
        }).then((res) => __awaiter(void 0, void 0, void 0, function* () {
            var _l, _m, _o;
            const regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
            yield ((_l = res.first()) === null || _l === void 0 ? void 0 : _l.delete());
            const answer = String(res.first());
            if (answer.match(regExp) != null) {
                MailSender_1.default.sendGmail({
                    serverName: (_m = interaction.guild) === null || _m === void 0 ? void 0 : _m.name,
                    code: code,
                    email: answer
                });
                const captchaEmailSended = new Embed_1.default(client, 'success')
                    .setTitle('인증')
                    .setDescription('이메일로 인증번호가 발송되었습니다! 2분 내로 인증번호를 입력해주세요')
                    .setColor('#2f3136');
                yield interaction.editReply({ embeds: [captchaEmailSended] });
                yield ((_o = interaction.channel) === null || _o === void 0 ? void 0 : _o.awaitMessages({
                    filter: filter,
                    max: 1,
                    time: 120000,
                    errors: ['time']
                }).then((res2) => __awaiter(void 0, void 0, void 0, function* () {
                    var _p;
                    yield ((_p = res2.first()) === null || _p === void 0 ? void 0 : _p.delete());
                    const answer2 = String(res2.first());
                    if (answer2 === code) {
                        const captchaSuccess = new Embed_1.default(client, 'success')
                            .setTitle('인증')
                            .setDescription('인증을 성공했습니다')
                            .setColor('#2f3136');
                        const member = interaction.member;
                        try {
                            yield member.roles.remove(VerifySettingDB.del_role_id);
                        }
                        catch (e) {
                            console.log(e);
                        }
                        try {
                            yield member.roles.add(VerifySettingDB === null || VerifySettingDB === void 0 ? void 0 : VerifySettingDB.role_id);
                        }
                        catch (e) {
                            const captchaError = new Embed_1.default(client, 'error')
                                .setTitle('인증')
                                .setDescription('인증완료 역할 지급중 오류가 발생했습니다')
                                .setColor('#2f3136');
                            if (e)
                                return interaction.editReply({ embeds: [captchaError] });
                        }
                        return interaction.editReply({ embeds: [captchaSuccess] });
                    }
                    else {
                        const captchaDeny = new Embed_1.default(client, 'error')
                            .setTitle('인증')
                            .setDescription('인증을 실패했습니다 다시 시도해주세요')
                            .setColor('#2f3136');
                        return interaction.editReply({ embeds: [captchaDeny] });
                    }
                })).catch(() => {
                    const captchaTimeout = new Embed_1.default(client, 'error')
                        .setTitle('인증')
                        .setDescription('인증시간이 초과되었습니다 다시 시도해주세요')
                        .setColor('#2f3136');
                    return interaction.editReply({ embeds: [captchaTimeout] });
                }));
            }
            else {
                const captchaTimeout = new Embed_1.default(client, 'error')
                    .setTitle('인증')
                    .setDescription('올바른 이메일 형식이 아닙니다 다시 시도해주세요')
                    .setColor('#2f3136');
                return interaction.editReply({ embeds: [captchaTimeout] });
            }
        })).catch(() => {
            const captchaTimeout = new Embed_1.default(client, 'error')
                .setTitle('인증')
                .setDescription('메일 입력시간이 초과되었습니다 다시 시도해주세요')
                .setColor('#2f3136');
            return interaction.editReply({ embeds: [captchaTimeout] });
        }));
    }
    else if (VerifySettingDB.type === 'kakao') {
        const isPremium = yield (0, checkPremium_1.default)(client, interaction.guild);
        if (!isPremium) {
            return interaction.editReply('프리미엄 기한 만료로 카카오 인증 기능이 비활성화되었습니다');
        }
        const UserDB = yield userSchema_1.default.findOne({ id: interaction.user.id });
        if (!UserDB || !UserDB.kakao_name) {
            const Verify = new Embed_1.default(client, 'warn')
                .setTitle('인증')
                .setDescription(`인증을 진행하기 위해 [여기](${(_j = config_1.default.web) === null || _j === void 0 ? void 0 : _j.baseurl}/me)에서 카카오 아이디 연동을 진행해 주세요 \n 연동 후 다시 인증 버튼을 눌러주세요`)
                .setColor('#2f3136');
            return interaction.editReply({ embeds: [Verify] });
        }
        const member = interaction.member;
        try {
            yield member.roles.remove(VerifySettingDB.del_role_id);
        }
        catch (e) {
            console.log(e);
        }
        try {
            yield member.roles.add(VerifySettingDB === null || VerifySettingDB === void 0 ? void 0 : VerifySettingDB.role_id);
        }
        catch (e) {
            const captchaError = new Embed_1.default(client, 'error')
                .setTitle('인증')
                .setDescription('인증완료 역할 지급중 오류가 발생했습니다')
                .setColor('#2f3136');
            if (e)
                return interaction.editReply({ embeds: [captchaError] });
        }
        const VerifySuccess = new Embed_1.default(client, 'success')
            .setTitle('인증')
            .setDescription(`${UserDB.kakao_name}(\`${UserDB.kakao_email}\`) 정보로 인증이 완료되었습니다`)
            .setColor('#2f3136');
        return interaction.editReply({ embeds: [VerifySuccess] });
    }
}));
