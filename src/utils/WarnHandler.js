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
exports.userWarnAdd = void 0;
const LogSettingSchema_1 = __importDefault(require("../schemas/LogSettingSchema"));
const Warning_1 = __importDefault(require("../schemas/Warning"));
const Embed_1 = __importDefault(require("./Embed"));
const userWarnAdd = (client, userId, guildId, reason, managerId, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const insertRes = yield Warning_1.default.insertMany({
        userId: userId,
        guildId: guildId,
        reason: reason,
        managerId: managerId
    });
    const embedAdd = new Embed_1.default(client, 'error')
        .setTitle('경고 추가')
        .setDescription('아래와 같이 경고가 추가되었습니다')
        .setFields({ name: '경고 ID', value: insertRes[0]._id.toString() }, {
        name: '유저',
        value: `<@${userId}>` + '(' + '`' + userId + '`' + ')',
        inline: true
    }, { name: '사유', value: reason, inline: true });
    if (interaction) {
        interaction.editReply({ embeds: [embedAdd] });
    }
    const logSetting = yield LogSettingSchema_1.default.findOne({ guild_id: guildId });
    const guildLogChannel = (_a = client.guilds.cache
        .get(guildId)) === null || _a === void 0 ? void 0 : _a.channels.cache.get(logSetting === null || logSetting === void 0 ? void 0 : logSetting.guild_channel_id);
    if (!guildLogChannel)
        return;
    guildLogChannel.send({ embeds: [embedAdd] });
    try {
        const guildRoles = (_b = client.guilds.cache.get(guildId)) === null || _b === void 0 ? void 0 : _b.roles.cache;
        const member = (_c = client.guilds.cache.get(guildId)) === null || _c === void 0 ? void 0 : _c.members.cache.get(userId);
        if (!member)
            return;
        const warns = yield Warning_1.default.find({ userId: userId, guildId: guildId });
        let role_id = undefined;
        let remove_role_id = undefined;
        guildRoles === null || guildRoles === void 0 ? void 0 : guildRoles.each((role) => {
            if (role.name == `경고 ${warns.length}회`)
                return (role_id = role.id);
            if (warns.length == 1)
                return;
            if (role.name == `경고 ${warns.length - 1}회`)
                return (remove_role_id = role.id);
        });
        if (remove_role_id)
            member.roles.remove(remove_role_id);
        if (role_id)
            member.roles.add(role_id);
    }
    catch (e) {
        console.log(e);
    }
});
exports.userWarnAdd = userWarnAdd;
