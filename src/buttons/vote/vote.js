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
const discord_js_1 = require("discord.js");
const VoteSchema_1 = __importDefault(require("../../schemas/VoteSchema"));
const Command_1 = require("../../structures/Command");
const Embed_1 = __importDefault(require("../../utils/Embed"));
const VoteCooldown = new Map();
exports.default = new Command_1.ButtonInteraction({
    name: 'vote.select'
}, (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const ErrEmbed = new Embed_1.default(client, 'error')
        .setColor('#2f3136');
    if (!interaction.guild) {
        ErrEmbed.setTitle('서버에서만 투표할 수 있어요!');
        return interaction.editReply({ embeds: [ErrEmbed] });
    }
    yield interaction.deferReply({ ephemeral: true });
    const vote_id = interaction.customId.split('_')[1];
    const SuccessEmbed = new Embed_1.default(client, 'success')
        .setColor('#2f3136');
    const VoteDB = yield VoteSchema_1.default.findOne({
        guild_id: (_a = interaction.guild) === null || _a === void 0 ? void 0 : _a.id,
        message_id: interaction.message.id
    });
    if (!VoteDB) {
        ErrEmbed.setTitle('찾을 수 없는 투표이거나 이미 종료된 투표에요!');
        return interaction.editReply({ embeds: [ErrEmbed] });
    }
    else {
        if (VoteDB.status === 'close') {
            ErrEmbed.setTitle('이미 종료된 투표에요!');
            return interaction.editReply({ embeds: [ErrEmbed] });
        }
        if (!VoteCooldown.has(`vote_${interaction.guild.id}_${interaction.user.id}_${interaction.message.id}`))
            VoteCooldown.set(`vote_${interaction.guild.id}_${interaction.user.id}_${interaction.message.id}`, Date.now() - 6000);
        const cooldown = VoteCooldown.get(`vote_${interaction.guild.id}_${interaction.user.id}_${interaction.message.id}`);
        if (cooldown && Date.now() - cooldown > 5000) {
            const channel = interaction.channel;
            let message = channel.messages.cache.get(VoteDB.message_id);
            if (!message)
                message = yield channel.messages.fetch(VoteDB.message_id);
            if (!message)
                return;
            const isVoted = VoteDB.vote_items.find((item) => item.voted.includes(interaction.user.id));
            if (isVoted) {
                yield VoteSchema_1.default.updateOne({
                    guild_id: (_b = interaction.guild) === null || _b === void 0 ? void 0 : _b.id,
                    message_id: interaction.message.id,
                    'vote_items.item_id': isVoted.item_id
                }, {
                    $inc: { 'vote_items.$.vote': -1 },
                    $pull: { 'vote_items.$.voted': interaction.user.id }
                });
            }
            yield VoteSchema_1.default.updateOne({
                guild_id: (_c = interaction.guild) === null || _c === void 0 ? void 0 : _c.id,
                message_id: interaction.message.id,
                'vote_items.item_id': vote_id
            }, {
                $inc: { 'vote_items.$.vote': 1 },
                $push: { 'vote_items.$.voted': interaction.user.id }
            });
            const newVoteItem = yield VoteSchema_1.default.findOne({
                guild_id: interaction.guild.id,
                message_id: interaction.message.id
            });
            if (!newVoteItem) {
                ErrEmbed.setTitle('투표 업데이트중 오류가 발생했어요!');
                return interaction.editReply({ embeds: [ErrEmbed] });
            }
            VoteCooldown.set(`vote_${interaction.guild.id}_${interaction.user.id}_${interaction.message.id}`, Date.now());
            const voteEmbed = VoteEmbed(newVoteItem.vote_items, interaction.message.embeds[0].description);
            SuccessEmbed.setTitle('성공적으로 투표에 참가했어요!');
            SuccessEmbed.setColor('#2f3136');
            interaction.editReply({ embeds: [SuccessEmbed] });
            return message.edit({ embeds: [voteEmbed] });
        }
        else {
            ErrEmbed.setTitle('너무 빠른속도로 투표에 참가중이에요... 잠시후에 다시 시도해주세요!');
            return interaction.editReply({ embeds: [ErrEmbed] });
        }
    }
}));
const VoteEmbed = (items, title) => {
    const embed = new discord_js_1.MessageEmbed().setColor('#2f3136');
    embed.setTitle('🗳 투표');
    embed.setDescription(title);
    items.forEach((item, index) => {
        embed.addField(`${item.item_name}`, `\`${item.vote}\`표`, true);
    });
    return embed;
};
