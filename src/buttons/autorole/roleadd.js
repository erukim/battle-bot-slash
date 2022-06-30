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
const AutoRoleSchema_1 = __importDefault(require("../../schemas/AutoRoleSchema"));
const Command_1 = require("../../structures/Command");
const Embed_1 = __importDefault(require("../../utils/Embed"));
exports.default = new Command_1.ButtonInteraction({
    name: 'autorole.add'
}, (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    yield interaction.deferReply({ ephemeral: true });
    const role_id = interaction.customId.split('_')[1];
    const ErrEmbed = new Embed_1.default(client, 'error');
    const SuccessEmbed = new Embed_1.default(client, 'success')
        .setColor('#2f3136');
    const autoroleDB = yield AutoRoleSchema_1.default.findOne({
        guild_id: (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id,
        message_id: interaction.message.id
    });
    if (!autoroleDB) {
        ErrEmbed.setTitle('이 서버에 자동역할 기능을 설정한 기록이 없어요!');
        return interaction.editReply({ embeds: [ErrEmbed] });
    }
    else {
        const role = (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.roles.cache.get(role_id);
        if (!role) {
            ErrEmbed.setTitle('역할을 찾을 수 없어요!');
            return interaction.editReply({ embeds: [ErrEmbed] });
        }
        const user = (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.members.cache.get(interaction.user.id);
        if (autoroleDB.isKeep) {
            yield (user === null || user === void 0 ? void 0 : user.roles.add(role).then((role) => {
                SuccessEmbed.setTitle(`역할을 성공적으로 지급했어요!`);
                return interaction.editReply({ embeds: [SuccessEmbed] });
            }).catch((e) => {
                if (e.code === 50013) {
                    ErrEmbed.setTitle('이 역할을 지급할 권한이 부족해요');
                    return interaction.editReply({ embeds: [ErrEmbed] });
                }
                else {
                    ErrEmbed.setTitle('역할을 지급에 오류가 발생했어요! ');
                    return interaction.editReply({ embeds: [ErrEmbed] });
                }
            }));
        }
        else {
            const roles = [];
            (_d = interaction.message.components) === null || _d === void 0 ? void 0 : _d.forEach((x) => {
                x.components.forEach((x2) => {
                    const role_id = x2.customId.split('_')[1];
                    roles.push(role_id);
                });
            });
            yield (user === null || user === void 0 ? void 0 : user.roles.remove(roles).then((d) => __awaiter(void 0, void 0, void 0, function* () {
                yield (user === null || user === void 0 ? void 0 : user.roles.add(role).then(() => {
                    SuccessEmbed.setTitle(`${role.name}을 성공적으로 지급했어요!`);
                    return interaction.editReply({ embeds: [SuccessEmbed] });
                }).catch((e) => {
                    if (e.code === 50013) {
                        ErrEmbed.setTitle('이 역할을 지급할 권한이 부족해요');
                        return interaction.editReply({ embeds: [ErrEmbed] });
                    }
                    else {
                        ErrEmbed.setTitle('역할을 지급에 오류가 발생했어요! ');
                        return interaction.editReply({ embeds: [ErrEmbed] });
                    }
                }));
            })).catch((e) => {
                if (e.code === 50013) {
                    ErrEmbed.setTitle('역할들을 삭제할 권한이 부족해요');
                    return interaction.editReply({ embeds: [ErrEmbed] });
                }
                else {
                    ErrEmbed.setTitle('역할을 지급에 오류가 발생했어요! ');
                    return interaction.editReply({ embeds: [ErrEmbed] });
                }
            }));
        }
    }
}));
