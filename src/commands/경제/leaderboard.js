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
    name: 'leaderboard',
    description: '자신의 돈을 확인합니다. (서버, 전체)',
    aliases: ['순위', 'moneylist', 'tnsdnl', '랭킹', '돈순위']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const type = args[0];
    const data = yield Money_1.default.find()
        .sort({ money: -1, descending: -1 })
        .limit(10);
    console.log(data);
    const embed = new Embed_1.default(client, 'info').setColor('#2f3136');
    for (let i = 0; i < data.length; i++) {
        if (type === '전체') {
            embed.setTitle('돈 순위표');
            let searchuser = client.users.cache.get(data[i].userid);
            if (!searchuser)
                return;
            embed.addField(`${i + 1}. ${searchuser.username}`, `${(0, comma_number_1.default)(data[i].money)}원`);
            embed.setColor('#2f3136');
        }
        else if (type === '서버') {
            embed.setTitle('서버 돈 순위표');
            let searchuser = (_a = message.guild) === null || _a === void 0 ? void 0 : _a.members.cache.get(data[i].userid);
            if (!searchuser)
                return;
            embed.addField(`${i + 1}. ${(_b = searchuser.nickname) !== null && _b !== void 0 ? _b : searchuser.user.username}`, `${(0, comma_number_1.default)(data[i].money)}원`);
            embed.setColor('#2f3136');
        }
        else {
            embed.setTitle('돈 순위표');
            let searchuser = client.users.cache.get(data[i].userid);
            if (!searchuser)
                return;
            embed.addField(`${i + 1}. ${searchuser.username}`, `${(0, comma_number_1.default)(data[i].money)}원`);
            embed.setColor('#2f3136');
        }
    }
    message.reply({
        embeds: [embed]
    });
}));
