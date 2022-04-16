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
Object.defineProperty(exports, "__esModule", { value: true });
exports.buttonList = void 0;
const discord_js_1 = require("discord.js");
const musicbuttonrow = (interaction, embed) => __awaiter(void 0, void 0, void 0, function* () {
    const row = new discord_js_1.MessageActionRow().addComponents(buttonList);
    interaction.editReply({ embeds: [embed], components: [row], content: ' ' });
});
const buttonList = [
    new discord_js_1.MessageButton()
        .setCustomId('music.back')
        .setStyle('SECONDARY')
        .setEmoji('⬅️'),
    new discord_js_1.MessageButton()
        .setCustomId('music.repeat')
        .setStyle('SECONDARY')
        .setEmoji('🔁'),
    new discord_js_1.MessageButton()
        .setCustomId('music.shuffle')
        .setStyle('SECONDARY')
        .setEmoji('🔀'),
    new discord_js_1.MessageButton()
        .setCustomId('music.pause')
        .setStyle('SECONDARY')
        .setEmoji('⏯️'),
    new discord_js_1.MessageButton()
        .setCustomId('music.next')
        .setStyle('SECONDARY')
        .setEmoji('➡️')
];
exports.buttonList = buttonList;
exports.default = musicbuttonrow;
