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
const Event_1 = require("../structures/Event");
const CommandManager_1 = __importDefault(require("../managers/CommandManager"));
const ErrorManager_1 = __importDefault(require("../managers/ErrorManager"));
const discord_js_1 = require("discord.js");
const autoModSchema_1 = __importDefault(require("../schemas/autoModSchema"));
const musicSchema_1 = __importDefault(require("../schemas/musicSchema"));
const Embed_1 = __importDefault(require("../utils/Embed"));
const levelSchema_1 = __importDefault(require("../schemas/levelSchema"));
const levelSettingSchema_1 = __importDefault(require("../schemas/levelSettingSchema"));
const checkPremium_1 = require("../utils/checkPremium");
const LevelCooldown = new Map();
exports.default = new Event_1.Event('messageCreate', (client, message) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const commandManager = new CommandManager_1.default(client);
    const errorManager = new ErrorManager_1.default(client);
    if (message.author.bot)
        return;
    if (message.channel.type === 'DM')
        return;
    profanityFilter(client, message);
    MusicPlayer(client, message);
    LevelSystem(client, message);
    if (!message.content.startsWith(client.config.bot.prefix))
        return;
    const args = message.content
        .slice(client.config.bot.prefix.length)
        .trim()
        .split(/ +/g);
    const commandName = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    const command = commandManager.get(commandName);
    yield client.dokdo.run(message);
    try {
        yield (command === null || command === void 0 ? void 0 : command.execute(client, message, args));
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.code) === discord_js_1.Constants.APIErrors.MISSING_PERMISSIONS) {
            return message.reply('해당 명령어를 실행하기 위한 권한이 부족합니다!');
        }
        errorManager.report(error, { executer: message, isSend: true });
    }
}));
const profanityFilter = (client, message) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c;
    if (!message.content)
        return;
    const automodDB = yield autoModSchema_1.default.findOne({ guild_id: (_b = message.guild) === null || _b === void 0 ? void 0 : _b.id });
    if (!automodDB)
        return;
    if (!automodDB.useing.useCurse)
        return;
    if (!automodDB.useing.useCurseType)
        return;
    if ((_c = automodDB.useing.useCurseIgnoreChannel) === null || _c === void 0 ? void 0 : _c.includes(message.channel.id))
        return;
    let regex = false;
    if (/(쌍)(년|놈)/.test(message.content))
        regex = true;
    if (!regex &&
        /((씨|쓰|ㅅ|ㅆ|si)([0-9]+|\W+)(블|벌|발|빨|뻘|ㅂ|ㅃ|bal))/.test(message.content))
        regex = true;
    if (!regex &&
        /((시발)(?!역)|((시|씨|쓰|ㅅ|ㅆ)([0-9]+|\W+|)(블|벌|발|빨|뻘|ㅂ|ㅃ))(!시발))/.test(message.content))
        regex = true;
    if (!regex &&
        /((병|빙|븅|등|ㅂ)([0-9]+|\W+|)(신|싄|ㅅ)|ㅄ)/.test(message.content))
        regex = true;
    if (!regex &&
        /((너|느(그|)|니)([0-9]+|\W+|)(금|애미|엄마|금마|검마))/.test(message.content))
        regex = true;
    if (!regex && /(개|게)(같|갓|새|세|쉐)/.test(message.content))
        regex = true;
    if (!regex && /(꼬|꽂|고)(추|츄)/.test(message.content))
        regex = true;
    if (!regex && /(니|너)(어|엄|엠|애|m|M)/.test(message.content))
        regex = true;
    if (!regex && /(노)(애|앰)/.test(message.content))
        regex = true;
    if (!regex && /((뭔|)개(소리|솔))/.test(message.content))
        regex = true;
    if (!regex && /(ㅅㅂ|ㅄ|ㄷㅊ)/.test(message.content))
        regex = true;
    if (!regex && /(놈|년|새끼)/.test(message.content))
        regex = true;
    if (regex) {
        findCurse(automodDB, message);
    }
    else {
        return;
    }
});
const findCurse = (automodDB, message) => __awaiter(void 0, void 0, void 0, function* () {
    var _d, _e;
    if (automodDB.useing.useCurseType === 'delete') {
        yield message.reply('욕설 사용으로 자동 삭제됩니다').then((m) => {
            setTimeout(() => {
                m.delete();
            }, 5000);
        });
        return yield message.delete();
    }
    else if (automodDB.useing.useCurseType === 'delete_kick') {
        yield message.reply('욕설 사용으로 자동 삭제 후 추방됩니다').then((m) => {
            setTimeout(() => {
                m.delete();
            }, 5000);
        });
        yield message.delete();
        try {
            return (_d = message.member) === null || _d === void 0 ? void 0 : _d.kick();
        }
        catch (e) {
            return;
        }
    }
    else if (automodDB.useing.useCurseType === 'delete_ban') {
        yield message.reply('욕설 사용으로 자동 삭제 후 차단됩니다').then((m) => {
            setTimeout(() => {
                m.delete();
            }, 5000);
        });
        yield message.delete();
        try {
            return (_e = message.member) === null || _e === void 0 ? void 0 : _e.ban({ reason: '[배틀이] 욕설 사용 자동차단' });
        }
        catch (e) {
            return;
        }
    }
    else {
        return;
    }
});
const MusicPlayer = (client, message) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    if (!message.guild)
        return;
    if (!message.content)
        return;
    const musicDB = yield musicSchema_1.default.findOne({
        channel_id: message.channel.id,
        guild_id: message.guild.id
    });
    if (!musicDB)
        return;
    const prefix = [client.config.bot.prefix, '!', '.', '$', '%', '&', '='];
    for (const i in prefix) {
        if (message.content.startsWith(prefix[i]))
            return message.delete();
    }
    yield message.delete();
    const errembed = new Embed_1.default(client, 'error');
    const sucessembed = new Embed_1.default(client, 'success');
    const user = (_f = message.guild) === null || _f === void 0 ? void 0 : _f.members.cache.get(message.author.id);
    const channel = user === null || user === void 0 ? void 0 : user.voice.channel;
    if (!channel) {
        errembed.setTitle('❌ 음성 채널에 먼저 입장해주세요!');
        return message.channel.send({ embeds: [errembed] }).then((m) => {
            setTimeout(() => {
                m.delete();
            }, 15000);
        });
    }
    const guildQueue = client.player.getQueue(message.guild.id);
    if (guildQueue) {
        if (channel.id !== ((_g = message.guild.me) === null || _g === void 0 ? void 0 : _g.voice.channelId)) {
            errembed.setTitle('❌ 이미 다른 음성 채널에서 재생 중입니다!');
            return message.channel.send({ embeds: [errembed] }).then((m) => {
                setTimeout(() => {
                    m.delete();
                }, 15000);
            });
        }
    }
    const song = (yield client.player.search(message.content, {
        requestedBy: message.author
    }));
    if (!song || !song.tracks.length) {
        errembed.setTitle(`❌ ${message.content}를 찾지 못했어요!`);
        return message.channel.send({ embeds: [errembed] }).then((m) => {
            setTimeout(() => {
                m.delete();
            }, 15000);
        });
    }
    let queue;
    if (guildQueue) {
        queue = guildQueue;
        queue.metadata = message;
    }
    else {
        queue = yield client.player.createQueue(message.guild, {
            metadata: message
        });
    }
    try {
        if (!queue.connection)
            yield queue.connect(channel);
    }
    catch (e) {
        client.player.deleteQueue(message.guild.id);
        errembed.setTitle(`❌ 음성 채널에 입장할 수 없어요 ${e}`);
        return message.channel.send({ embeds: [errembed] }).then((m) => {
            setTimeout(() => {
                m.delete();
            }, 15000);
        });
    }
    if (song.playlist) {
        const songs = [];
        song.playlist.tracks.forEach((music) => {
            songs.push(music.title);
        });
        sucessembed.setAuthor('재생목록에 아래 노래들을 추가했어요!', undefined, song.playlist.url);
        sucessembed.setDescription(songs.join(', '));
        sucessembed.setThumbnail(song.playlist.thumbnail);
        queue.addTracks(song.tracks);
        if (!queue.playing)
            yield queue.play();
        return message.channel.send({ embeds: [sucessembed] }).then((m) => {
            setTimeout(() => {
                m.delete();
            }, 15000);
        });
    }
    else {
        queue.addTrack(song.tracks[0]);
        sucessembed.setAuthor(`재생목록에 노래를 추가했어요!`, undefined, song.tracks[0].url);
        sucessembed.setDescription(`[${song.tracks[0].title}](${song.tracks[0].url}) ${song.tracks[0].duration} - ${song.tracks[0].requestedBy}`);
        sucessembed.setThumbnail(song.tracks[0].thumbnail);
        if (!queue.playing)
            yield queue.play();
        return message.channel.send({ embeds: [sucessembed] }).then((m) => {
            setTimeout(() => {
                m.delete();
            }, 15000);
        });
    }
});
const LevelSystem = (client, message) => __awaiter(void 0, void 0, void 0, function* () {
    if (!message.guild)
        return;
    if ([client.config.bot.prefix, '!', '.', '$', '%', '&', '=', ';;'].find((x) => message.content.toLowerCase().startsWith(x)))
        return;
    const levelSetting = yield levelSettingSchema_1.default.findOne({
        guild_id: message.guild.id
    });
    if (!levelSetting)
        return;
    if (!levelSetting.useage)
        return;
    if (!LevelCooldown.has(`${message.guild.id}_${message.author.id}`))
        LevelCooldown.set(`${message.guild.id}_${message.author.id}`, Date.now());
    const cooldown = LevelCooldown.get(`${message.guild.id}_${message.author.id}`);
    if (cooldown && Date.now() - cooldown > 1000) {
        const isPremium = yield (0, checkPremium_1.checkUserPremium)(client, message.author);
        LevelCooldown.set(`${message.guild.id}_${message.author.id}`, Date.now());
        const levelData = yield levelSchema_1.default.findOne({
            guild_id: message.guild.id,
            user_id: message.author.id
        });
        const level = levelData ? levelData.level : 1;
        const nextLevelXP = (!level ? 1 : level + 1) * 13;
        const xpPerLevel = '1'.toString().includes('-') ? '1'.split('-') : '1';
        const min = parseInt(xpPerLevel[0]);
        const max = parseInt(xpPerLevel[1]);
        let xpToAdd = Array.isArray(xpPerLevel)
            ? min + Math.floor((max - min) * Math.random())
            : xpPerLevel;
        if (isPremium)
            xpToAdd = Number(xpToAdd) * 1.3;
        if (!levelData || (levelData && levelData.currentXP < nextLevelXP))
            return yield levelSchema_1.default.findOneAndUpdate({ guild_id: message.guild.id, user_id: message.author.id }, { $inc: { totalXP: xpToAdd, currentXP: xpToAdd } }, { upsert: true });
        const newData = yield levelSchema_1.default.findOneAndUpdate({ guild_id: message.guild.id, user_id: message.author.id }, { $inc: { level: 1 }, $set: { currentXP: 0 } }, { upsert: true, new: true });
        /*const levelEmbed = new Embed(client, 'info')
        levelEmbed.setTitle(`${message.author.username}님의 레벨이 올랐어요!`)
        levelEmbed.setDescription(
          `레벨이 \`LV.${level ? level : 0} -> LV.${newData.level}\`로 올랐어요!`
        )*/
        return message.reply('${message.author.username}님의 레벨이 `LV.${level ? level : 0} -> LV.${newData.level}`로 올랐어요!');
    }
});
