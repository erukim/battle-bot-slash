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
const Embed_1 = __importDefault(require("../../utils/Embed"));
const builders_1 = require("@discordjs/builders");
const levelSchema_1 = __importDefault(require("../../schemas/levelSchema"));
const config_1 = __importDefault(require("../../../config"));
const checkPremium_1 = require("../../utils/checkPremium");
exports.default = new Command_1.BaseCommand({
    name: 'level',
    description: '유저의 레벨 정보를 확인합니다.',
    aliases: ['레벨', 'fpqpf']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    return message.reply('\`/레벨\` 명령어를 이용해주세요');
}), {
    data: new builders_1.SlashCommandBuilder()
        .setName('레벨')
        .addUserOption(option => option
        .setName("유저")
        .setDescription("확인할 유저를 입력해주세요")
        .setRequired(false))
        .setDescription('유저의 레벨 정보를 확인합니다.'),
    options: {
        name: '레벨',
        isSlash: true
    },
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply();
            let errEmbed = new Embed_1.default(client, 'error');
            let successEmbed = new Embed_1.default(client, 'success');
            let user = interaction.options.getUser('유저', false);
            const isPremium = yield (0, checkPremium_1.checkUserPremium)(client, interaction.user);
            if (!interaction.guild) {
                errEmbed.setDescription('이 명령어는 서버에서만 사용 가능합니다');
                return interaction.editReply({ embeds: [errEmbed] });
            }
            if (!user) {
                const levelDB = yield levelSchema_1.default.findOne({ guild_id: interaction.guild.id, user_id: interaction.user.id });
                if (!levelDB) {
                    successEmbed.setTitle(`${interaction.user.username}님의 레벨 정보`);
                    successEmbed.setDescription(`현재 \`LV.0\`입니다. 다음 레벨까지 \`0XP / 15XP\` 남았습니다.\n
          ${isPremium ? "**배틀이 프리미엄으로 30% 경험치 부스터가 적용되었어요**" : `**[여기](${config_1.default.web.baseurl}/premium)에서 프리미엄을 사용하시면 레벨 30% 부스터를 사용할 수 있어요!**`}`);
                    return interaction.editReply({ embeds: [successEmbed] });
                }
                else {
                    successEmbed.setTitle(`${interaction.user.username}님의 레벨 정보`);
                    successEmbed.setDescription(`현재 \`LV.${levelDB.level ? levelDB.level : 0}\`입니다. 다음 레벨까지 \`${levelDB.currentXP.toFixed(1)}XP / ${(!levelDB.level ? 1 : levelDB.level + 1) * 13}XP\` 남았습니다.\n
          ${isPremium ? "**배틀이 프리미엄으로 30% 경험치 부스터가 적용되었어요**" : `**[여기](${config_1.default.web.baseurl}/premium)에서 프리미엄을 사용하시면 레벨 30% 부스터를 사용할 수 있어요!**`}`);
                    return interaction.editReply({ embeds: [successEmbed] });
                }
            }
            else {
                const levelDB = yield levelSchema_1.default.findOne({ guild_id: interaction.guild.id, user_id: user.id });
                if (!levelDB) {
                    successEmbed.setTitle(`${user.username}님의 레벨 정보`);
                    successEmbed.setDescription(`현재 \`LV.0\`입니다. 다음 레벨까지 \`0XP / 15XP\` 남았습니다.`);
                    return interaction.editReply({ embeds: [successEmbed] });
                }
                else {
                    successEmbed.setTitle(`${user.username}님의 레벨 정보`);
                    successEmbed.setDescription(`현재 \`LV.${levelDB.level ? levelDB.level : 0}\`입니다. 다음 레벨까지 \`${levelDB.currentXP.toFixed(1)}XP / ${(!levelDB.level ? 1 : levelDB.level + 1) * 13}XP\` 남았습니다.`);
                    return interaction.editReply({ embeds: [successEmbed] });
                }
            }
        });
    }
});
