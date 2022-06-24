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
    name: 'sendMoney',
    description: '자신의 돈을 확인합니다.',
    aliases: ['송금', 'moneysay', 'thdrma']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    let embed = new Embed_1.default(client, 'warn').setTitle('처리중..');
    let m = yield message.reply({
        embeds: [embed]
    });
    const user = message.mentions.users.first();
    embed = new Embed_1.default(client, 'error').setDescription(`송금할 대상을 선택해주세요!`);
    if (!user)
        return m.edit({
            embeds: [embed]
        });
    const sk = yield Money_1.default.findOne({ userid: message.author.id });
    const tkdeoqkd = yield Money_1.default.findOne({ userid: user.id });
    embed = new Embed_1.default(client, 'error')
        .setDescription(message.author +
        '님의 정보가 확인되지 않습니다.\n먼저 `!돈받기`를 입력해 정보를 알려주세요!')
        .setTimestamp();
    if (!sk)
        return m.edit({
            embeds: [embed]
        });
    embed = new Embed_1.default(client, 'error')
        .setDescription('상대방의 정보가 확인되지 않았어요ㅠㅠ\n상대방에게 먼저 `!돈받기`를 입력해 정보를 알려달라고 해주세요!')
        .setTimestamp();
    if (!tkdeoqkd)
        return m.edit({
            embeds: [embed]
        });
    const betting = parseInt(args[1]);
    embed = new Embed_1.default(client, 'error')
        .setDescription('사용법 : !송금 @멘션 (금액)')
        .setTimestamp();
    if (!betting)
        return m.edit({
            embeds: [embed]
        });
    embed = new Embed_1.default(client, 'error')
        .setDescription('금액정보가 올바르지 않아요!\n특수문자가 들어가있다면 제거해주세요!(-)')
        .setTimestamp();
    if (message.content.includes('-'))
        return m.edit({
            embeds: [embed]
        });
    embed = new Embed_1.default(client, 'error')
        .setDescription('송금할수 있는 최소 금액은 1000원부터 시작합니다!')
        .setTimestamp();
    if (betting < 1000)
        return m.edit({
            embeds: [embed]
        });
    const money = parseInt(String(sk.money));
    const money2 = parseInt(String(tkdeoqkd.money));
    embed = new Embed_1.default(client, 'error')
        .setDescription('보유하고 있는 돈보다 많은 금액은 보낼수가 없어요.')
        .setTimestamp();
    if (money < betting)
        return m.edit({
            embeds: [embed]
        });
    embed = new Embed_1.default(client, 'error')
        .setDescription('잠시만요 지금 누구한테 보내려는거죠?')
        .setTimestamp();
    if (message.author.id == user.id)
        return m.edit({
            embeds: [embed]
        });
    yield Money_1.default.findOneAndUpdate({ userid: message.author.id }, {
        money: money - betting,
        userid: message.author.id,
        date: sk.date
    });
    yield Money_1.default.findOneAndUpdate({ userid: user.id }, {
        money: money2 + betting,
        userid: user.id,
        date: tkdeoqkd.date
    });
    embed = new Embed_1.default(client, 'info')
        .setTitle('돈을 보냈어요!')
        .addField(`송금인 잔액`, `${(0, comma_number_1.default)(money - betting)}원`, true)
        .addField(`받는사람 잔액`, ` ${money2 + betting}원`, true)
        .setTimestamp()
        .setColor('#2f3136');
    m.edit({
        embeds: [embed]
    });
}));
