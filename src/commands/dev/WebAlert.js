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
const discord_modals_1 = require("discord-modals");
const builders_1 = require("@discordjs/builders");
const WebAlertSender_1 = __importDefault(require("../../utils/WebAlertSender"));
exports.default = new Command_1.BaseCommand({
    name: 'webalert',
    description: '웹 알림을 보냅니다',
    aliases: ['웹알림', '알림추가']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // @ts-ignore
    if (!client.dokdo.owners.includes(message.author.id))
        return message.reply(`해당 명령어는 ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username}의 주인이 사용할 수 있는 명령어입니다.`);
}), {
    data: new builders_1.SlashCommandBuilder()
        .setName('웹알림')
        .setDescription('웹에 알림을 보냅니다'),
    options: {
        name: '웹알림',
        isSlash: true
    },
    execute(client, interaction) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            if (!client.dokdo.owners.includes(interaction.user.id))
                return interaction.reply(`해당 명령어는 ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username}의 주인이 사용할 수 있는 명령어입니다.`);
            const modal = new discord_modals_1.Modal()
                .setCustomId('modal.webalert')
                .setTitle('배틀이 웹 알림')
                .addComponents(new discord_modals_1.TextInputComponent()
                .setCustomId('modal.webalert.title')
                .setLabel('제목')
                .setStyle('SHORT')
                .setMinLength(1)
                .setMaxLength(10)
                .setPlaceholder('알림의 제목을 입력해주세요.')
                .setRequired(true), new discord_modals_1.TextInputComponent()
                .setCustomId('modal.webalert.description')
                .setLabel('설명')
                .setStyle('LONG')
                .setPlaceholder('알림의 설명을 입력해주세요.')
                .setRequired(true), new discord_modals_1.TextInputComponent()
                .setCustomId('modal.webalert.linktitle')
                .setLabel('링크 제목')
                .setStyle('SHORT')
                .setMinLength(1)
                .setMaxLength(10)
                .setPlaceholder('알림의 링크 제목을 입력해주세요.')
                .setRequired(false), new discord_modals_1.TextInputComponent()
                .setCustomId('modal.webalert.link')
                .setLabel('링크')
                .setStyle('SHORT')
                .setPlaceholder('알림에 링크를 넣을경우 필수로 입력해주세요.')
                .setRequired(false), new discord_modals_1.TextInputComponent()
                .setCustomId('modal.webalert.user')
                .setLabel('유저')
                .setStyle('SHORT')
                .setPlaceholder('알림을 보낼 유저 아이디를 입력해주세요. (빈곳으로 둘 경우 모든 유저에게 발송됩니다)')
                .setRequired(false));
            (0, discord_modals_1.showModal)(modal, { client: client, interaction: interaction });
            client.on('modalSubmit', (modal) => __awaiter(this, void 0, void 0, function* () {
                if (modal.customId === "modal.webalert") {
                    const webalertTitle = modal.getTextInputValue('modal.webalert.title');
                    const webalertDescription = modal.getTextInputValue('modal.webalert.description');
                    const webalertLinktitle = modal.getTextInputValue('modal.webalert.linktitle');
                    const webalertLink = modal.getTextInputValue('modal.webalert.link');
                    const webalertUser = modal.getTextInputValue('modal.webalert.user');
                    yield modal.deferReply({ ephemeral: true });
                    if (webalertLinktitle && !webalertLink) {
                        return modal.followUp({ content: '링크를 넣을경우 링크 제목과 링크 향목을 필수로 입력해야합니다', ephemeral: true });
                    }
                    if (!webalertLinktitle && webalertLink) {
                        return modal.followUp({ content: '링크를 넣을경우 링크 제목과 링크 향목을 필수로 입력해야합니다', ephemeral: true });
                    }
                    yield (0, WebAlertSender_1.default)(webalertTitle, webalertDescription, { url: webalertLink, value: webalertLinktitle }, webalertUser)
                        .then(() => {
                        return modal.followUp({ content: '성공적으로 알림을 추가했습니다', ephemeral: true });
                    })
                        .catch((e) => {
                        return modal.followUp({ content: e.message, ephemeral: true });
                    });
                }
            }));
        });
    }
});
