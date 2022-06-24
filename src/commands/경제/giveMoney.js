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
    name: 'givemoney',
    description: '자신의 돈을 확인합니다.',
    aliases: ['돈받기', 'moneyget', 'ehswnj', '돈줘']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    let embed = new Embed_1.default(client, 'warn').setTitle('처리중..')
        .setColor('#2f3136');
    let m = yield message.reply({
        embeds: [embed]
    });
    const t = new Date();
    const date = "" + t.getFullYear() + t.getMonth() + t.getDate();
    const ehqkrduqn = yield Money_1.default.findOne({
        userid: message.author.id
    });
    if (!ehqkrduqn) {
        let newData = new Money_1.default({
            money: parseInt('5000'),
            userid: message.author.id,
            date: date
        });
        newData.save();
        embed = new Embed_1.default(client, 'success').setTitle('환영합니다!')
            .setDescription(`처음이시군요! 5000원을 입금해드리겠습니다!`)
            .setColor('#2f3136');
        m.edit({
            embeds: [embed]
        });
    }
    else {
        embed = new Embed_1.default(client, 'info')
            .setDescription(`이미 오늘 돈을 받으셨어요 ㅠㅠ\n다음에 다시 와주세요!`)
            .setColor('#2f3136');
        if (ehqkrduqn.date == date)
            return m.edit({
                embeds: [embed]
            });
        const money = parseInt(String(ehqkrduqn.money));
        yield Money_1.default.findOneAndUpdate({ userid: message.author.id }, {
            money: money + 5000,
            userid: message.author.id,
            date: date
        });
        const f = money + 5000;
        embed = new Embed_1.default(client, 'success').setTitle('입금이 완료되었습니다!')
            .setDescription(`처음이시군요! 5000원을 입금해드리겠습니다!`)
            .addField(`돈이 입금되었습니다!`, `현재 잔액 : ${(0, comma_number_1.default)(f)}`)
            .setColor('#2f3136');
        m.edit({
            embeds: [embed]
        });
    }
}));
