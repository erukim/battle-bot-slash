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
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../../structures/Command");
const pubg_1 = require("../../utils/pubg");
const builders_1 = require("@discordjs/builders");
exports.default = new Command_1.BaseCommand({
    name: '배그전적',
    description: '배틀그라운드 전적을 확인합니다.',
    aliases: ['전적배그', 'pubgstat']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    return message.reply(`해당 명령어는 (/)커멘드로만 사용가능합니다`);
}), {
    // @ts-ignore
    data: new builders_1.SlashCommandBuilder()
        .setName('배그전적')
        .setDescription('유저의 배틀그라운드 전적을 확인합니다')
        .addStringOption((user) => user
        .setName('user')
        .setDescription('배틀그라운드 닉네임을 적어주세요')
        .setRequired(true))
        .addStringOption((mode) => mode
        .setName('mode')
        .setDescription('검색할 모드를 선택해주세요')
        .setRequired(true)
        .addChoice('3인칭', 'tpp')
        .addChoice('1인칭', 'fpp')
        .addChoice('3인칭 (경쟁)', 'tpprank')
        .addChoice('1인칭 (경쟁)', 'fpprank')),
    options: {
        name: '배그전적',
        isSlash: true
    },
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            let nickname = interaction.options.getString('user', true);
            let mode = interaction.options.getString('mode', true);
            return yield (0, pubg_1.playerStats)(nickname, mode, interaction);
        });
    }
});
