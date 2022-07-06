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
    name: 'wallet',
    description: '자신의 돈을 확인합니다.',
    aliases: ['잔액', 'money', 'ehs', 'wlrkq', '지갑', '돈']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    let embed = new Embed_1.default(client, 'warn')
        .setTitle('처리중..')
        .setColor('#2f3136');
    let m = yield message.reply({
        embeds: [embed]
    });
    const user = message.mentions.users.first() || client.users.cache.get(args[0]) || message.author;
    const wjdqh = yield Money_1.default.findOne({ userid: user.id });
    embed = new Embed_1.default(client, 'success').setTitle(`정보 오류`)
        .setDescription(`아쉽지만 ${message.author}님의 정보가 기록되어있지 않아요..ㅠ\n!돈받기 명령어로 정보를 알려주세요!`);
    if (!wjdqh)
        return m.edit({
            embeds: [embed]
        });
    const t = new Date();
    const date = "" + t.getFullYear() + t.getMonth() + t.getDate();
    let i;
    if (wjdqh.date == date)
        i = "돈을 받음";
    else
        i = "돈을 받지않음";
    embed = new Embed_1.default(client, 'success')
        .setTitle(`${user.tag}님의 잔액`)
        .setDescription(`유저님의 잔액은 아래와 같습니다.`)
        .addField("잔액 :", `**${(0, comma_number_1.default)(wjdqh.money)}원**`)
        .setColor('#2f3136');
    m.edit({
        embeds: [embed]
    });
}));
