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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicTrackEvent = void 0;
const MusicEmbed_1 = __importDefault(require("../utils/MusicEmbed"));
const musicSchema_1 = __importDefault(require("../schemas/musicSchema"));
const statusSchema_1 = __importDefault(require("../schemas/statusSchema"));
const Event_1 = require("../structures/Event");
const Embed_1 = __importDefault(require("../utils/Embed"));
const Logger_1 = __importDefault(require("../utils/Logger"));
const premiumSchemas_1 = __importDefault(require("../schemas/premiumSchemas"));
const node_schedule_1 = __importDefault(require("node-schedule"));
const DateFormatting_1 = __importDefault(require("../utils/DateFormatting"));
const autoModSchema_1 = __importDefault(require("../schemas/autoModSchema"));
const NFTUserWalletSchema_1 = __importDefault(require("../schemas/NFTUserWalletSchema"));
const NFTGuildVerifySchema_1 = __importDefault(require("../schemas/NFTGuildVerifySchema"));
const axios_1 = __importDefault(require("axios"));
const config_1 = __importDefault(require("../../config"));
const CommandManager_1 = __importDefault(require("../managers/CommandManager"));
const premiumUserSchemas_1 = __importDefault(require("../schemas/premiumUserSchemas"));
const logger = new Logger_1.default('bot');
exports.default = new Event_1.Event('ready', (client) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        StatusUpdate(client);
    }), 60 * 1000 * 5);
    setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
        ServerCountUpdate(client);
    }), 60 * 1000 * 10);
    client.player.on('trackStart', (queue, track) => __awaiter(void 0, void 0, void 0, function* () {
        const musicDB = (yield musicSchema_1.default.findOne({
            guild_id: queue.guild.id
        }));
        MusicAlert(client, track, queue, musicDB);
        MusicTrackEvent(client, queue, musicDB);
        //MusicTrackStartEvent(client, queue, musicDB)
    }));
    client.player.on('queueEnd', (queue) => __awaiter(void 0, void 0, void 0, function* () {
        const musicDB = (yield musicSchema_1.default.findOne({
            guild_id: queue.guild.id
        }));
        MusicQueueEnd(client, queue, musicDB);
    }));
    client.player.on('connectionError', (queue, error) => __awaiter(void 0, void 0, void 0, function* () {
        const musicDB = (yield musicSchema_1.default.findOne({
            guild_id: queue.guild.id
        }));
        MusicQueueEnd(client, queue, musicDB);
    }));
    client.player.on('error', (queue, error) => __awaiter(void 0, void 0, void 0, function* () {
        if (error.name === 'DestroyedQueue') {
            const musicDB = (yield musicSchema_1.default.findOne({
                guild_id: queue.guild.id
            }));
            MusicQueueEnd(client, queue, musicDB);
        }
        else {
            console.log(error);
        }
    }));
    client.player.on('botDisconnect', (queue) => __awaiter(void 0, void 0, void 0, function* () {
        const musicDB = (yield musicSchema_1.default.findOne({
            guild_id: queue.guild.id
        }));
        queue.destroy();
        MusicQueueEnd(client, queue, musicDB);
    }));
    client.player.on('trackAdd', (queue, track) => __awaiter(void 0, void 0, void 0, function* () {
        const musicDB = (yield musicSchema_1.default.findOne({
            guild_id: queue.guild.id
        }));
        MusicTrackEvent(client, queue, musicDB);
    }));
    client.player.on('tracksAdd', (queue, track) => __awaiter(void 0, void 0, void 0, function* () {
        const musicDB = (yield musicSchema_1.default.findOne({
            guild_id: queue.guild.id
        }));
        MusicTrackEvent(client, queue, musicDB);
    }));
    node_schedule_1.default.scheduleJob('0 0 0 * * *', () => {
        PremiumAlert(client);
        automodResetChannel(client);
        nftChecker(client);
        PremiumPersonAlert(client);
    });
    const commandManager = new CommandManager_1.default(client);
    yield commandManager.slashGlobalCommandSetup();
    logger.info(`Logged ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username}`);
}), { once: true });
function MusicTrackEvent(client, queue, musicDB) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        if (!musicDB)
            return;
        const channel = queue.guild.channels.cache.get(musicDB.channel_id);
        if (!channel)
            return;
        let message = channel.messages.cache.get(musicDB.message_id);
        if (!message)
            message = yield channel.messages.fetch(musicDB.message_id);
        if (!message)
            return;
        const pageStart = 0;
        const pageEnd = pageStart + 5;
        const tracks = queue.tracks.slice(pageStart, pageEnd).map((m, i) => {
            return `**${i + pageStart + 1}**. [${m.title}](${m.url}) ${m.duration} - ${m.requestedBy}`;
        });
        const embed = new MusicEmbed_1.default(client, queue.nowPlaying());
        if (tracks.length === 0) {
            embed.setDescription(`
      [대시보드](${(_a = config_1.default.web) === null || _a === void 0 ? void 0 : _a.baseurl}) | [서포트 서버](https://discord.gg/WtGq7D7BZm)
      \n**플레이리스트**\n❌ 더 이상 재생목록에 노래가 없습니다`);
        }
        else {
            embed.setDescription(`
      [대시보드](${(_b = config_1.default.web) === null || _b === void 0 ? void 0 : _b.baseurl}) | [서포트 서버](https://discord.gg/WtGq7D7BZm)
      \n**플레이리스트**\n${tracks.join('\n')}${queue.tracks.length > pageEnd
                ? `\n... + ${queue.tracks.length - pageEnd}`
                : ''}`);
        }
        return message.edit({ embeds: [embed] });
    });
}
exports.MusicTrackEvent = MusicTrackEvent;
function MusicQueueEnd(client, queue, musicDB) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!musicDB)
            return;
        const channel = queue.guild.channels.cache.get(musicDB.channel_id);
        if (!channel)
            return;
        let message = channel.messages.cache.get(musicDB.message_id);
        if (!message)
            message = yield channel.messages.fetch(musicDB.message_id);
        if (!message)
            return;
        const embed = new MusicEmbed_1.default(client);
        return message.edit({ embeds: [embed] });
    });
}
function MusicAlert(client, track, queue, musicDB) {
    return __awaiter(this, void 0, void 0, function* () {
        //@ts-ignore
        const channel = queue.metadata.channel;
        if (!musicDB || channel.id !== musicDB.channel_id) {
            const embed = new Embed_1.default(client, 'info');
            embed.setAuthor('재생 중인 노래', 'https://cdn.discordapp.com/emojis/667750713698549781.gif?v=1', track.url);
            embed.setDescription(`[**${track.title} - ${track.author}**](${track.url}) ${track.duration} - ${track.requestedBy}`);
            embed.setThumbnail(track.thumbnail);
            return channel.send({ embeds: [embed] }).catch((e) => {
                if (e)
                    console.log(e);
            });
        }
    });
}
function StatusUpdate(client) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const totalShard = (_a = client.shard) === null || _a === void 0 ? void 0 : _a.count;
        const shardInfo = yield ShardInfo(client);
        const status = new statusSchema_1.default();
        status.build_number = client.BUILD_NUMBER;
        (status.commands = client.commands.size), (status.totalShard = totalShard);
        status.shard = shardInfo;
        status.save((err) => {
            if (err)
                logger.error(`봇 상태 업데이트 오류: ${err}`);
        });
        logger.info('봇 상태 업데이트');
    });
}
function PremiumAlert(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const PremiumDB = yield premiumSchemas_1.default.find({});
        PremiumDB.forEach((guild) => {
            var _a;
            const premiumguild = client.guilds.cache.get(guild.guild_id);
            if (!premiumguild)
                return;
            const user = client.users.cache.get(premiumguild.ownerId);
            if (!user)
                return;
            const embed = new Embed_1.default(client, 'info');
            embed.setTitle(`${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username} 프리미엄`);
            const now = new Date();
            const lastDate = Math.round((Number(guild.nextpay_date) - Number(now)) / 1000 / 60 / 60 / 24);
            if (lastDate === 7) {
                embed.setDescription(`${premiumguild.name} 서버의 프리미엄 만료일이 7일 (${DateFormatting_1.default._format(guild.nextpay_date)}) 남았습니다`);
                return user.send({ embeds: [embed] });
            }
            if (lastDate === 1) {
                embed.setDescription(`${premiumguild.name} 서버의 프리미엄 만료일이 1일 (${DateFormatting_1.default._format(guild.nextpay_date)}) 남았습니다`);
                return user.send({ embeds: [embed] });
            }
            if (lastDate === 0) {
                embed.setDescription(`${premiumguild.name} 서버의 프리미엄이 만료되었습니다`);
                return user.send({ embeds: [embed] });
            }
        });
    });
}
function PremiumPersonAlert(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const PremiumDB = yield premiumUserSchemas_1.default.find({});
        PremiumDB.forEach((user) => {
            var _a;
            const users = client.users.cache.get(user.user_id);
            if (!users)
                return;
            const embed = new Embed_1.default(client, 'info');
            embed.setTitle(`${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username} 프리미엄`);
            const now = new Date();
            const lastDate = Math.round((Number(user.nextpay_date) - Number(now)) / 1000 / 60 / 60 / 24);
            try {
                if (lastDate === 7) {
                    embed.setDescription(`${users.username}님의 프리미엄 만료일이 7일 (${DateFormatting_1.default._format(user.nextpay_date)}) 남았습니다`);
                    return users.send({ embeds: [embed] });
                }
                if (lastDate === 1) {
                    embed.setDescription(`${users.username} 서버의 프리미엄 만료일이 1일 (${DateFormatting_1.default._format(user.nextpay_date)}) 남았습니다`);
                    return users.send({ embeds: [embed] });
                }
                if (lastDate === 0) {
                    embed.setDescription(`${users.username} 서버의 프리미엄이 만료되었습니다`);
                    return users.send({ embeds: [embed] });
                }
            }
            catch (e) {
                logger.error(e);
            }
        });
    });
}
function ShardInfo(client) {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function* () {
        const shardInfo = [];
        const totalShard = (_a = client.shard) === null || _a === void 0 ? void 0 : _a.count;
        const wsping = (yield ((_b = client.shard) === null || _b === void 0 ? void 0 : _b.fetchClientValues('ws.ping')));
        const guilds = (yield ((_c = client.shard) === null || _c === void 0 ? void 0 : _c.fetchClientValues('guilds.cache.size')));
        const users = (yield ((_d = client.shard) === null || _d === void 0 ? void 0 : _d.fetchClientValues('users.cache.size')));
        const channels = (yield ((_e = client.shard) === null || _e === void 0 ? void 0 : _e.fetchClientValues('channels.cache.size')));
        const uptime = (yield ((_f = client.shard) === null || _f === void 0 ? void 0 : _f.fetchClientValues('uptime')));
        for (let i = 0; i < totalShard; i++) {
            shardInfo.push({
                shardNumber: i,
                shardPing: wsping[i],
                shardGuild: guilds[i],
                shardMember: users[i],
                shardChannels: channels[i],
                shardUptime: uptime[i]
            });
        }
        return shardInfo;
    });
}
function automodResetChannel(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const automod = yield autoModSchema_1.default.find();
        automod.forEach(({ useing, guild_id }) => __awaiter(this, void 0, void 0, function* () {
            var e_1, _a;
            if (!useing.useResetChannel)
                return;
            if (!useing.useResetChannels || useing.useResetChannels.length === 0)
                return;
            const guild = client.guilds.cache.get(guild_id);
            if (!guild)
                return;
            const newChannels = [];
            try {
                for (var _b = __asyncValues(useing.useResetChannels), _c; _c = yield _b.next(), !_c.done;) {
                    const resetchannel = _c.value;
                    const channel = guild === null || guild === void 0 ? void 0 : guild.channels.cache.get(resetchannel);
                    if (!channel)
                        return;
                    const newchannel = yield (guild === null || guild === void 0 ? void 0 : guild.channels.create(channel.name, {
                        type: 'GUILD_TEXT',
                        parent: channel.parent ? channel.parent.id : undefined,
                        permissionOverwrites: channel.permissionOverwrites.cache,
                        position: channel.position
                    }));
                    if (!newchannel)
                        return;
                    yield newchannel.send({
                        embeds: [
                            new Embed_1.default(client, 'info')
                                .setTitle('채널 초기화')
                                .setDescription('채널 초기화가 완료되었습니다.')
                        ]
                    });
                    yield channel.delete();
                    newChannels.push(newchannel.id);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return yield autoModSchema_1.default.updateOne({ guild_id: guild_id }, { $set: { 'useing.useResetChannels': newChannels } });
        }));
    });
}
function nftChecker(client) {
    return __awaiter(this, void 0, void 0, function* () {
        const wallet_list = yield NFTUserWalletSchema_1.default.find();
        const guild_list = yield NFTGuildVerifySchema_1.default.find();
        wallet_list.forEach((user_wallet) => __awaiter(this, void 0, void 0, function* () {
            yield axios_1.default
                .get(`https://th-api.klaytnapi.com/v2/account/${user_wallet.wallet_address}/token?kind=nft`, {
                headers: {
                    Authorization: 'Basic ' + config_1.default.klaytnapikey,
                    'X-Chain-ID': '8217'
                }
            })
                .then((data) => {
                guild_list.forEach((guild_data) => __awaiter(this, void 0, void 0, function* () {
                    const result = data.data.items.filter((x) => x.contractAddress === guild_data.wallet);
                    if (result.length === 0) {
                        const guild = client.guilds.cache.get(guild_data.guild_id);
                        if (!guild)
                            return;
                        const member = guild.members.cache.get(user_wallet.user_id);
                        if (!member)
                            return;
                        try {
                            yield member.roles.remove(guild_data.role_id);
                        }
                        catch (e) {
                            return;
                        }
                    }
                    else {
                        return;
                    }
                }));
            })
                .catch((e) => {
                return;
            });
        }));
    });
}
function ServerCountUpdate(client) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield ((_a = client.shard) === null || _a === void 0 ? void 0 : _a.fetchClientValues('guilds.cache.size'));
        axios_1.default
            .post(`https://api.archiver.me/bots/${(_b = client.user) === null || _b === void 0 ? void 0 : _b.id}/server`, {
            servers: res === null || res === void 0 ? void 0 : res.reduce((acc, guilds) => Number(acc) + Number(guilds), 0)
        }, {
            headers: { Authorization: 'Bearer ' + config_1.default.updateServer.archive }
        })
            .then((data) => {
            logger.info('아카이브: 서버 수 업데이트 완료');
        })
            .catch((e) => {
            var _a;
            logger.error(`아카이브: 서버 수 업데이트 오류: ${(_a = e.response) === null || _a === void 0 ? void 0 : _a.data.message}`);
        });
        axios_1.default
            .post(`https://koreanbots.dev/api/v2/bots/${(_c = client.user) === null || _c === void 0 ? void 0 : _c.id}/stats`, {
            servers: res === null || res === void 0 ? void 0 : res.reduce((acc, guilds) => Number(acc) + Number(guilds), 0),
            shards: (_d = client.shard) === null || _d === void 0 ? void 0 : _d.count
        }, {
            headers: { Authorization: config_1.default.updateServer.koreanbots }
        })
            .then((data) => {
            logger.info('한디리: 서버 수 업데이트 완료');
        })
            .catch((e) => {
            var _a;
            logger.error(`한디리: 서버 수 업데이트 오류: ${(_a = e.response) === null || _a === void 0 ? void 0 : _a.data.message}`);
        });
    });
}
