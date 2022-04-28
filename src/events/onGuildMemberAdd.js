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
const autoModSchema_1 = __importDefault(require("../schemas/autoModSchema"));
const blacklistSchemas_1 = __importDefault(require("../schemas/blacklistSchemas"));
const LogSettingSchema_1 = __importDefault(require("../schemas/LogSettingSchema"));
const WelcomeSettingSchema_1 = __importDefault(require("../schemas/WelcomeSettingSchema"));
const Embed_1 = __importDefault(require("../utils/Embed"));
const Event_1 = require("../structures/Event");
const Logger_1 = __importDefault(require("../utils/Logger"));
const checkPremium_1 = __importDefault(require("../utils/checkPremium"));
const guildLastJoin = new Map();
const guildLastJoinUser = new Map();
const log = new Logger_1.default('GuildMemberAddEvent');
exports.default = new Event_1.Event('guildMemberAdd', (client, member) => __awaiter(void 0, void 0, void 0, function* () {
    WelecomEvent(client, member);
    WelecomLogEvent(client, member);
    AutoModEvent(client, member);
    AutoModCreateAtEvent(client, member);
    AutoModAutoRoleEvent(client, member);
    AutoModTokenUserEvent(client, member);
}));
const WelecomEvent = (client, member) => __awaiter(void 0, void 0, void 0, function* () {
    const WelcomeSettingDB = yield WelcomeSettingSchema_1.default.findOne({
        guild_id: member.guild.id
    });
    if (!WelcomeSettingDB)
        return;
    if (!WelcomeSettingDB.welcome_message ||
        WelcomeSettingDB.welcome_message == '')
        return;
    const WelcomeChannel = member.guild.channels.cache.get(WelcomeSettingDB.channel_id);
    if (!WelcomeChannel)
        return;
    const embed = new Embed_1.default(client, 'success');
    embed.setAuthor(member.user.username, member.user.displayAvatarURL());
    embed.setDescription(new String(WelcomeSettingDB.welcome_message)
        .replaceAll('${username}', member.user.username)
        .replaceAll('${discriminator}', member.user.discriminator)
        .replaceAll('${servername}', member.guild.name)
        .replaceAll('${memberCount}', member.guild.memberCount.toString())
        .replaceAll('${줄바꿈}', '\n'));
    return yield WelcomeChannel.send({ embeds: [embed] });
});
const WelecomLogEvent = (client, member) => __awaiter(void 0, void 0, void 0, function* () {
    const LoggerSettingDB = yield LogSettingSchema_1.default.findOne({
        guild_id: member.guild.id
    });
    if (!LoggerSettingDB)
        return;
    if (!LoggerSettingDB.useing.memberJoin)
        return;
    const logChannel = member.guild.channels.cache.get(LoggerSettingDB.guild_channel_id);
    if (!logChannel)
        return;
    const embed = new Embed_1.default(client, 'success')
        .setTitle('멤버 추가')
        .setAuthor(member.user.username, member.user.displayAvatarURL())
        .addFields({
        name: '유저',
        value: `<@${member.user.id}>` + '(`' + member.user.id + '`)'
    });
    return yield logChannel.send({ embeds: [embed] });
});
const AutoModEvent = (client, member) => __awaiter(void 0, void 0, void 0, function* () {
    const automodDB = yield autoModSchema_1.default.findOne({ guild_id: member.guild.id });
    if (!automodDB)
        return;
    if (automodDB.useing.useBlackList) {
        const banlist = yield blacklistSchemas_1.default.find({ status: 'blocked' });
        const isUser = banlist.some((user) => user.user_id === member.id);
        if (isUser) {
            const user = yield blacklistSchemas_1.default.findOne({ user_id: member.id });
            return yield member.ban({ reason: `[배틀이 자동차단] ${user.reason}` });
        }
        else {
            return;
        }
    }
    else {
        return;
    }
});
const AutoModCreateAtEvent = (client, member) => __awaiter(void 0, void 0, void 0, function* () {
    const automodDB = yield autoModSchema_1.default.findOne({ guild_id: member.guild.id });
    const isPremium = yield (0, checkPremium_1.default)(client, member.guild);
    if (!automodDB)
        return;
    if (!automodDB.useing.useCreateAt || automodDB.useing.useCreateAt === 0)
        return;
    if (!isPremium) {
        const LoggerSettingDB = yield LogSettingSchema_1.default.findOne({
            guild_id: member.guild.id
        });
        if (!LoggerSettingDB)
            return;
        const logChannel = member.guild.channels.cache.get(LoggerSettingDB.guild_channel_id);
        if (!logChannel)
            return;
        return logChannel.send('프리미엄 기한 만료로 유저 생성일 제한 기능이 비활성화되었습니다');
    }
    const now = new Date();
    const elapsedDate = Math.round((Number(now) - Number(member.user.createdAt)) / 1000 / 60 / 60 / 24);
    if (elapsedDate < automodDB.useing.useCreateAt) {
        try {
            const embed = new Embed_1.default(client, 'error')
                .setTitle('배틀이 자동 시스템')
                .setDescription(`해당 서버는 계정 생성후 ${automodDB.useing.useCreateAt}일이 지나야 입장이 가능합니다`);
            yield member.send({ embeds: [embed] });
        }
        catch (e) {
            log.error(e);
        }
        return member.kick();
    }
    else {
        return;
    }
});
const AutoModAutoRoleEvent = (client, member) => __awaiter(void 0, void 0, void 0, function* () {
    const automodDB = yield autoModSchema_1.default.findOne({ guild_id: member.guild.id });
    if (!automodDB)
        return;
    if (!automodDB.useing.useAutoRole)
        return;
    const role = member.guild.roles.cache.get(automodDB.useing.autoRoleId);
    if (!role)
        return;
    try {
        return member.roles.add(role);
    }
    catch (e) {
        return;
    }
});
const AutoModTokenUserEvent = (client, member) => __awaiter(void 0, void 0, void 0, function* () {
    if (member.guild.id !== '786153760824492062')
        return;
    const guildLastJoinData = guildLastJoin.get(member.guild.id);
    const guildLastJoinUserData = guildLastJoinUser.get(member.guild.id);
    if (!guildLastJoinData || !guildLastJoinUserData) {
        guildLastJoin.set(member.guild.id, new Date());
        guildLastJoinUser.set(member.guild.id, member.id);
    }
    else {
        if (new Date().getTime() - guildLastJoinData.getTime() < 1000 &&
            !member.avatar) {
            const guildLastJoinUserData = guildLastJoinUser.get(member.guild.id);
            if (member.id === guildLastJoinUserData)
                return;
            const guildLastJoinUserDataMember = client.users.cache.get(guildLastJoinUserData);
            if (!guildLastJoinUserDataMember)
                return;
            if (member.user.createdAt.getMonth() ===
                guildLastJoinUserDataMember.createdAt.getMonth() &&
                member.user.createdAt.getDate() ===
                    guildLastJoinUserDataMember.createdAt.getDate()) {
                const embed = new Embed_1.default(client, 'error')
                    .setTitle('배틀이 자동 시스템')
                    .setDescription(`토큰 유저 의심 계정으로 추방되었습니다.\n**오류라고 생각될 경우 [여기](https://discord.gg/WtGq7D7BZm)로 문의해 주세요**`);
                try {
                    yield member.send({ embeds: [embed] });
                    yield member.kick();
                }
                catch (e) {
                    log.error(e);
                }
            }
        }
    }
});
