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
const premiumSchemas_1 = __importDefault(require("../../schemas/premiumSchemas"));
const Logger_1 = __importDefault(require("../../utils/Logger"));
const logger = new Logger_1.default('premium');
exports.default = new Command_1.MessageCommand({
    name: 'addpremium',
    description: '서버에 프리미엄을 추가합니다',
    aliases: ['프리미엄추가']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // @ts-ignore
    if (!client.dokdo.owners.includes(message.author.id))
        return message.reply(`해당 명령어는 ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username}의 주인이 사용할 수 있는 명령어입니다.`);
    let LoadingEmbed = new Embed_1.default(client, 'warn')
        .setTitle('잠시만 기다려주십시요')
        .setDescription('해당 서버의 정보를 찾는 중이에요...');
    let msg = yield message.reply({ embeds: [LoadingEmbed] });
    let guild = client.guilds.cache.get(args[0]);
    let ErrorEmbed = new Embed_1.default(client, 'error')
        .setTitle('오류!')
        .setDescription('해당 서버는 봇이 입장되어 있지 않습니다');
    if (!guild)
        return yield msg.edit({ embeds: [ErrorEmbed] });
    let premiumDB = yield premiumSchemas_1.default.findOne({ guild_id: guild.id });
    let date = new Date(args[1]);
    if (!premiumDB) {
        let premium = new premiumSchemas_1.default();
        premium.guild_id = guild.id;
        premium.nextpay_date = date;
        premium.save((err) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                let ErrorEmbed = new Embed_1.default(client, 'error')
                    .setTitle('오류!')
                    .setDescription('데이터 저장중 오류가 발생했습니다');
                return yield msg.edit({ embeds: [ErrorEmbed] });
            }
        }));
        let successEmbed = new Embed_1.default(client, 'success')
            .setTitle('프리미엄')
            .setDescription(`관리자 ${message.author.username}에 의하여 ${guild.name}서버의 프리미엄 만료일이 ${date.getFullYear() +
            '년 ' +
            (date.getMonth() + 1) +
            '월 ' +
            date.getDate() +
            '일'} 로 설정되었습니다`);
        try {
            let owner = client.users.cache.get(guild.ownerId);
            yield owner.send({ embeds: [successEmbed] });
        }
        catch (e) {
            logger.error(e);
        }
        logger.info(`관리자 ${message.author.username}에 의하여 ${guild.name}서버의 프리미엄 만료일이 ${date.getFullYear() +
            '년 ' +
            (date.getMonth() + 1) +
            '월 ' +
            date.getDate() +
            '일'} 로 설정되었습니다`);
        return yield msg.edit({ embeds: [successEmbed] });
    }
    else {
        yield premiumSchemas_1.default.updateOne({ guild_id: guild.id }, { $set: { nextpay_date: date } });
        let successEmbed = new Embed_1.default(client, 'success')
            .setTitle('프리미엄')
            .setDescription(`관리자 ${message.author.username}에 의하여 ${guild.name}서버의 프리미엄 만료일이 ${date.getFullYear() +
            '년 ' +
            (date.getMonth() + 1) +
            '월 ' +
            date.getDate() +
            '일'} 로 설정되었습니다`);
        try {
            let owner = client.users.cache.get(guild.ownerId);
            yield owner.send({ embeds: [successEmbed] });
        }
        catch (e) {
            // @ts-ignore
            logger.error(e);
        }
        logger.info(`관리자 ${message.author.username}에 의하여 ${guild.name}서버의 프리미엄 만료일이 ${date.getFullYear() +
            '년 ' +
            (date.getMonth() + 1) +
            '월 ' +
            date.getDate() +
            '일'} 로 설정되었습니다`);
        return yield msg.edit({ embeds: [successEmbed] });
    }
}));
