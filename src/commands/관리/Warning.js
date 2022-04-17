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
const Command_1 = require("../../structures/Command");
const Embed_1 = __importDefault(require("../../utils/Embed"));
const mongoose_1 = __importDefault(require("mongoose"));
const Warning_1 = __importDefault(require("../../schemas/Warning"));
let ObjectId = mongoose_1.default.Types.ObjectId;
// @ts-ignore
String.prototype.toObjectId = function () {
    // @ts-ignore
    return new ObjectId(this.toString());
};
exports.default = new Command_1.BaseCommand({
    name: 'warning',
    description: '유저에게 경고를 추가합니다',
    aliases: ['경고']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    let embed = new Embed_1.default(client, 'error')
        .setTitle(`경고`)
        .setDescription('경고 명령어는 (/) 명령어로만 사용이 가능해요');
    return message.reply({ embeds: [embed] });
}), {
    // @ts-ignore
    data: new builders_1.SlashCommandBuilder()
        .setName('경고')
        .setDescription('경고 관련 명령어 입니다')
        .addSubcommand((option) => option
        .setName('지급')
        .setDescription('경고를 지급합니다')
        .addUserOption((user) => user
        .setName('user')
        .setDescription('유저를 적어주세요')
        .setRequired(true))
        .addStringOption((reason) => reason
        .setName('사유')
        .setDescription('사유를 적어주세요')
        .setRequired(false)))
        .addSubcommand((option) => option
        .setName('차감')
        .setDescription('경고를 차감합니다')
        .addUserOption((user) => user
        .setName('user')
        .setDescription('유저를 적어주세요')
        .setRequired(true))
        .addStringOption((id) => id
        .setName('id')
        .setDescription('차감할 경고의 ID를 적어주세요')
        .setRequired(true)))
        .addSubcommand((option) => option
        .setName('조회')
        .setDescription('경고를 조회합니다')
        .addUserOption((user) => user
        .setName('user')
        .setDescription('유저를 적어주세요')
        .setRequired(true))
        .addNumberOption((number) => number
        .setName('페이지')
        .setDescription('페이지를 적어주세요')
        .setRequired(false))),
    options: {
        name: '경고',
        isSlash: true
    },
    execute(client, interaction) {
        var _a, _b, _c, _d, _e, _f;
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            let member = interaction.member;
            member = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(member.id);
            if (!member.permissions.has('MANAGE_CHANNELS'))
                return interaction.editReply('해당 명령어를 사용할 권한이 없습니다');
            let reason = interaction.options.getString('사유');
            let user = interaction.options.getUser('user');
            if (!reason)
                reason = '없음';
            let subcommand = interaction.options.getSubcommand();
            if (subcommand === '지급') {
                let insertRes = yield Warning_1.default.insertMany({
                    userId: user === null || user === void 0 ? void 0 : user.id,
                    guildId: (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id,
                    reason: reason,
                    managerId: member.id
                });
                let embedAdd = new Embed_1.default(client, 'info')
                    .setTitle('경고')
                    .setDescription('아래와 같이 경고가 추가되었습니다')
                    .setFields({ name: '경고 ID', value: insertRes[0]._id.toString() }, {
                    name: '유저',
                    value: `<@${user === null || user === void 0 ? void 0 : user.id}>` + '(' + '`' + (user === null || user === void 0 ? void 0 : user.id) + '`' + ')',
                    inline: true
                }, { name: '사유', value: reason, inline: true });
                return interaction.editReply({ embeds: [embedAdd] });
            }
            else if (subcommand === '차감') {
                let warningID = interaction.options.getString('id');
                // @ts-ignore
                if (!ObjectId.isValid(warningID))
                    return interaction.editReply('찾을 수 없는 경고 아이디 입니다');
                // @ts-ignore
                let warningIDtoObject = warningID.toObjectId();
                let findWarnDB = yield Warning_1.default.findOne({
                    userId: user === null || user === void 0 ? void 0 : user.id,
                    guildId: (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.id,
                    _id: warningIDtoObject
                });
                if (!findWarnDB)
                    return interaction.editReply('찾을 수 없는 경고 아이디 입니다');
                yield Warning_1.default.deleteOne({
                    userId: user === null || user === void 0 ? void 0 : user.id,
                    guildId: (_d = interaction.guild) === null || _d === void 0 ? void 0 : _d.id,
                    _id: warningIDtoObject
                });
                const embedRemove = new discord_js_1.MessageEmbed()
                    .setColor('#008000')
                    .setTitle('경고')
                    .setDescription('아래와 같이 경고가 삭감되었습니다')
                    .addField('유저', `<@${user === null || user === void 0 ? void 0 : user.id}>` + '(' + '`' + (user === null || user === void 0 ? void 0 : user.id) + '`' + ')', true)
                    .addField('경고 ID', warningID, true);
                return interaction.editReply({ embeds: [embedRemove] });
            }
            else if (subcommand === '조회') {
                let warningID = interaction.options.getNumber('페이지');
                let insertRes = yield Warning_1.default.find({
                    userId: user === null || user === void 0 ? void 0 : user.id,
                    guildId: (_e = interaction.guild) === null || _e === void 0 ? void 0 : _e.id
                })
                    .sort({ published_date: -1 })
                    .limit(5)
                    .skip(warningID ? (warningID - 1) * 5 : 0);
                let insertResLength = yield Warning_1.default.find({
                    userId: user === null || user === void 0 ? void 0 : user.id,
                    guildId: (_f = interaction.guild) === null || _f === void 0 ? void 0 : _f.id
                });
                let warns = new Array();
                if (insertRes.length == 0)
                    return interaction.editReply('해당 유저의 경고 기록이 없습니다');
                insertRes.forEach((reasons) => warns.push({
                    name: 'ID: ' + reasons._id.toString(),
                    value: '사유: ' + reasons.reason
                }));
                const embedList = new discord_js_1.MessageEmbed()
                    .setColor('#ff7f00')
                    .setTitle('경고')
                    .setDescription(`${user === null || user === void 0 ? void 0 : user.username}님의 ${insertResLength.length}개의 경고중 최근 5개의 경고 기록입니다`)
                    .setFooter(`페이지 - ${warningID ? warningID : 1}/${Math.ceil(insertResLength.length / 5)}`)
                    .addFields(warns);
                return interaction.editReply({ embeds: [embedList] });
            }
        });
    }
});
