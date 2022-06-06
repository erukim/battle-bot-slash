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
const comma_number_1 = __importDefault(require("comma-number"));
const Money_1 = __importDefault(require("../../schemas/Money"));
exports.default = new Command_1.BaseCommand({
    name: 'gamble',
    description: '자신의 돈을 확인합니다.',
    aliases: ['도박', 'ehqkr']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    let embed = new Embed_1.default(client, 'warn').setTitle('처리중..');
    let m = yield message.reply({
        embeds: [embed]
    });
    const ehqkrduqn = yield Money_1.default.findOne({
        userid: message.author.id
    });
    embed = new Embed_1.default(client, 'error').setDescription(message.author + '님의 정보가 확인되지 않습니다.\n먼저 \`!돈받기\`를 입력해 정보를 알려주세요!')
        .setTimestamp();
    if (!ehqkrduqn)
        return m.edit({
            embeds: [embed]
        });
    embed = new Embed_1.default(client, 'error').setDescription('저랑 얼마를 가지고 놀거에요? 알려주세요!')
        .setTimestamp();
    if (!args[0])
        return m.edit({
            embeds: [embed]
        });
    embed = new Embed_1.default(client, 'error').setDescription('금액정보가 올바르지 않아요!\n특수문자가 들어가있다면 제거해주세요!(-)')
        .setTimestamp();
    if (args.join(" ").includes("-"))
        return m.edit({
            embeds: [embed]
        });
    const money = parseInt(args[0]);
    embed = new Embed_1.default(client, 'error').setDescription('도박할수 있는 최소 금액은 500원부터 시작합니다!')
        .setTimestamp();
    if (money < 500)
        return m.edit({
            embeds: [embed]
        });
    embed = new Embed_1.default(client, 'error').setDescription('보유하고 있는 돈보다 많은 금액은 보낼수가 없어요.')
        .setTimestamp();
    if (money > ehqkrduqn.money)
        return m.edit({
            embeds: [embed]
        });
    const random = Math.floor(Math.random() * 101);
    if (random < 50) {
        embed = new Embed_1.default(client, 'success').setTitle(`아쉽네요..`)
            .setDescription(`저한테 패배 하셨군요... 이 돈은 그럼 제가 쓸어담아보겠습니다!`)
            .addField("잔액 :", `**${(0, comma_number_1.default)(money)}원**`)
            .setColor('#2f3136');
        m.edit({
            embeds: [embed]
        });
        yield Money_1.default.findOneAndUpdate({ userid: message.author.id }, {
            money: ehqkrduqn.money - money,
            userid: message.author.id,
            date: ehqkrduqn.date
        });
    }
    else {
        embed = new Embed_1.default(client, 'success').setTitle(`승리!`)
            .setDescription(`도박에서 저를 이기셨군요!`)
            .addField("잔액 :", `**${(0, comma_number_1.default)(money)}원**`)
            .setColor('#2f3136');
        m.edit({
            embeds: [embed]
        });
        yield Money_1.default.findOneAndUpdate({ userid: message.author.id }, {
            money: ehqkrduqn.money + money,
            userid: message.author.id,
            date: ehqkrduqn.date
        });
    }
}));
