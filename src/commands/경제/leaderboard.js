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
    description: '자신의 돈을 확인합니다.',
    aliases: ['순위', 'moneylist', 'tnsdnl', '랭킹', '돈순위']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    let embed = new Embed_1.default(client, 'warn').setTitle('처리중..');
    let m = yield message.reply({
        embeds: [embed]
    });
    Money_1.default.find()
        .sort({ money: 1, descending: 1 })
        .limit(30)
        .exec((error, res) => {
        var _a;
        for (let i = 0; i < res.length; i++) {
            let searchuser = client.users.cache.get(res[i].userid);
            const user = searchuser;
            const users = (_a = user === null || user === void 0 ? void 0 : user.username) !== null && _a !== void 0 ? _a : '찾을수가 없어요!';
            embed = new Embed_1.default(client, 'info')
                .setTitle('돈 순위표')
                .addField(`${i + 1}. ${users}`, `${(0, comma_number_1.default)(res[i].money)}원`, true);
        }
        m.edit({
            embeds: [embed]
        });
    });
}));
