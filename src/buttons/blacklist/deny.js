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
const blacklistSchemas_1 = __importDefault(require("../../schemas/blacklistSchemas"));
const Command_1 = require("../../structures/Command");
const Embed_1 = __importDefault(require("../../utils/Embed"));
exports.default = new Command_1.ButtonInteraction({
    name: 'blacklist.deny'
}, (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield interaction.deferReply({ ephemeral: true });
    // @ts-ignore
    if (!client.dokdo.owners.includes(interaction.user.id))
        return interaction.editReply(`해당 명령어는 ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username}의 주인이 사용할 수 있는 명령어입니다.`);
    const blacklist = yield blacklistSchemas_1.default.findOne({
        message: interaction.message.id,
        status: 'pending'
    });
    if (!blacklist)
        return interaction.editReply({
            embeds: [
                new Embed_1.default(client, 'warn').setDescription('이미 처리가 완료된 블랙리스트입니다')
                    .setColor('#2f3136')
            ]
        });
    yield blacklistSchemas_1.default.updateOne({ message: interaction.message.id }, { $set: { status: 'deny' } });
    return interaction.editReply({
        embeds: [
            new Embed_1.default(client, 'success').setDescription('성공적으로 거절이 완료되었습니다')
                .setColor('#2f3136')
        ]
    });
}));
