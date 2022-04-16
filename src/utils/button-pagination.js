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
const discord_js_1 = require("discord.js");
const paginationEmbed = (interaction, pages, buttonList, timeout = 120000) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!pages)
        throw new Error('Pages are not given.');
    if (!buttonList)
        throw new Error('Buttons are not given.');
    if (buttonList[0].style === 'LINK' || buttonList[1].style === 'LINK')
        throw new Error('링크 버튼은 사용이 불가능합니다');
    if (buttonList.length !== 2)
        throw new Error('2개의 버튼이 필요합니다');
    let page = 0;
    const row = new discord_js_1.MessageActionRow().addComponents(buttonList);
    const curPage = yield interaction.editReply({
        embeds: [pages[page].setFooter(`페이지 ${page + 1} / ${pages.length}`)],
        components: [row]
    });
    const filter = (i) => i.customId === buttonList[0].customId ||
        i.customId === buttonList[1].customId;
    const collector = yield ((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.createMessageComponentCollector({
        filter,
        time: timeout
    }));
    collector === null || collector === void 0 ? void 0 : collector.on('collect', (i) => __awaiter(void 0, void 0, void 0, function* () {
        switch (i.customId) {
            case buttonList[0].customId:
                page = page > 0 ? --page : pages.length - 1;
                break;
            case buttonList[1].customId:
                page = page + 1 < pages.length ? ++page : 0;
                break;
            default:
                break;
        }
        yield i.deferUpdate();
        yield i.editReply({
            embeds: [pages[page].setFooter(`페이지 ${page + 1} / ${pages.length}`)],
            components: [row]
        });
        collector.resetTimer();
    }));
    collector === null || collector === void 0 ? void 0 : collector.on('end', (_, reason) => {
        if (reason !== 'messageDelete') {
            const disabledRow = new discord_js_1.MessageActionRow().addComponents(buttonList[0].setDisabled(true), buttonList[1].setDisabled(true));
            interaction.editReply({
                embeds: [pages[page].setFooter(`페이지 ${page + 1} / ${pages.length}`)],
                components: [disabledRow]
            });
        }
    });
    return curPage;
});
exports.default = paginationEmbed;
