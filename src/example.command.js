"use strict";
// @ts-nocheck
/* eslint-disable no-unused-vars */
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
// Slash command and Message Command
const builders_1 = require("@discordjs/builders");
const Command_1 = require("./structures/Command");
exports.default = new Command_1.BaseCommand({
    name: '',
    description: '',
    aliases: [],
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
}), {
    data: new builders_1.SlashCommandBuilder()
        .setName('')
        .setDescription(''),
    options: {
        isSlash: true,
    },
    execute(client, interaction) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
});
// Message command
const Command_2 = require("./structures/Command");
exports.default = new Command_2.MessageCommand({
    name: '',
    description: '',
    aliases: [],
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
}));
// Slash command
const Command_3 = require("./structures/Command");
exports.default = new Command_3.SlashCommand(new builders_1.SlashCommandBuilder()
    .setName('')
    .setDescription(''), (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
}), {
    isSlash: true,
});
