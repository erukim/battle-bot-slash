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
const premiumSchemas_1 = __importDefault(require("../../schemas/premiumSchemas"));
const config_1 = __importDefault(require("../../../config"));
exports.default = new Command_1.BaseCommand({
    name: 'premium',
    description: '서버의 프리미엄 만료일을 보여줍니다',
    aliases: ['프리미엄', 'vmflaldja']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let embed = new Embed_1.default(client, 'success')
        .setColor('#2f3136')
        .setTitle(`${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username} 프리미엄`);
    if (!message.guild) {
        embed.setDescription(`프리미엄 확인 기능은 DM 채널에서는 사용이 불가능합니다`);
        return message.reply({ embeds: [embed] });
    }
    let premium = yield premiumSchemas_1.default.findOne({ guild_id: message.guild.id });
    if (!premium) {
        embed.setDescription(`이 서버는 프리미엄을 사용한 기록이 없습니다 [여기](${(_b = config_1.default.web) === null || _b === void 0 ? void 0 : _b.baseurl}/premium) 에서 프리미엄을 구매해주세요`);
        return message.reply({ embeds: [embed] });
    }
    else {
        let nextpay_date = new Date(premium.nextpay_date);
        let now = new Date();
        if (now > nextpay_date) {
            embed.setDescription(`이 서버는 프리미엄이 ${nextpay_date.getFullYear() + '년 ' + (nextpay_date.getMonth() + 1) + '월 ' + nextpay_date.getDate() + '일'}에 만료 되었습니다 [여기](${(_c = config_1.default.web) === null || _c === void 0 ? void 0 : _c.baseurl}/premium) 에서 프리미엄을 구매해주세요`);
            return message.reply({ embeds: [embed] });
        }
        else {
            embed.setDescription(`이 서버의 프리미엄 만료일은 ${nextpay_date.getFullYear() + '년 ' + (nextpay_date.getMonth() + 1) + '월 ' + nextpay_date.getDate() + '일'} 입니다`);
            return message.reply({ embeds: [embed] });
        }
    }
}), {
    data: new builders_1.SlashCommandBuilder()
        .setName('프리미엄')
        .setDescription('서버의 프리미엄 정보를 확인합니다'),
    options: {
        name: '프리미엄',
        isSlash: true
    },
    execute(client, interaction) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            yield interaction.deferReply({ ephemeral: true });
            let embed = new Embed_1.default(client, 'success')
                .setColor('#2f3136')
                .setTitle(`${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username} 프리미엄`);
            if (!interaction.guild) {
                embed.setDescription(`프리미엄 확인 기능은 DM 채널에서는 사용이 불가능합니다`);
                return interaction.editReply({ embeds: [embed] });
            }
            let premium = yield premiumSchemas_1.default.findOne({ guild_id: interaction.guild.id });
            if (!premium) {
                embed.setDescription(`이 서버는 프리미엄을 사용한 기록이 없습니다 [여기](${(_b = config_1.default.web) === null || _b === void 0 ? void 0 : _b.baseurl}/premium) 에서 프리미엄을 구매해주세요`);
                return interaction.editReply({ embeds: [embed] });
            }
            else {
                let nextpay_date = new Date(premium.nextpay_date);
                let now = new Date();
                if (now > nextpay_date) {
                    embed.setDescription(`이 서버는 프리미엄이 ${nextpay_date.getFullYear() + '년 ' + (nextpay_date.getMonth() + 1) + '월 ' + nextpay_date.getDate() + '일'}에 만료 되었습니다 [여기](${(_c = config_1.default.web) === null || _c === void 0 ? void 0 : _c.baseurl}/premium) 에서 프리미엄을 구매해주세요`);
                    return interaction.editReply({ embeds: [embed] });
                }
                else {
                    embed.setDescription(`이 서버의 프리미엄 만료일은 ${nextpay_date.getFullYear() + '년 ' + (nextpay_date.getMonth() + 1) + '월 ' + nextpay_date.getDate() + '일'} 입니다`);
                    return interaction.editReply({ embeds: [embed] });
                }
            }
        });
    }
});
