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
const anyid_1 = require("anyid");
const config_1 = __importDefault(require("../../../config"));
const NFTUserVerifySchema_1 = __importDefault(require("../../schemas/NFTUserVerifySchema"));
exports.default = new Command_1.ButtonInteraction({
    name: 'nft.verify'
}, (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    yield interaction.deferReply({ ephemeral: true });
    const token = (0, anyid_1.anyid)()
        .encode('Aa0')
        .bits(48 * 8)
        .random()
        .id();
    const verify = new NFTUserVerifySchema_1.default();
    verify.guild_id = (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id;
    verify.user_id = interaction.user.id;
    verify.process = 'pending';
    verify.token = token;
    verify.save((err) => {
        if (err)
            return interaction.editReply('정보 생성중 오류가 발생했습니다');
    });
    const captchaVerify = new Embed_1.default(client, 'success')
        .setTitle('NFT 인증')
        .setDescription(`[여기](${(_b = config_1.default.web) === null || _b === void 0 ? void 0 : _b.baseurl}/walletverify?token=${token})로 접속하여 인증을 진행해주세요`);
    return yield interaction.editReply({ embeds: [captchaVerify] });
}));
