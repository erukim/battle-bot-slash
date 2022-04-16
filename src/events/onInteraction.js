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
const ButtonManager_1 = __importDefault(require("../managers/ButtonManager"));
const CommandManager_1 = __importDefault(require("../managers/CommandManager"));
const ErrorManager_1 = __importDefault(require("../managers/ErrorManager"));
const Event_1 = require("../structures/Event");
exports.default = new Event_1.Event('interactionCreate', (client, interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const commandManager = new CommandManager_1.default(client);
    const errorManager = new ErrorManager_1.default(client);
    const buttonManager = new ButtonManager_1.default(client);
    if (interaction.isButton()) {
        if (interaction.user.bot)
            return;
        if (((_a = interaction.channel) === null || _a === void 0 ? void 0 : _a.type) === 'DM')
            return interaction.reply('DM으로는 버튼 사용이 불가능해요');
        let button = buttonManager.get(interaction.customId);
        if (interaction.customId.startsWith('role_')) {
            button = buttonManager.get('autorole.add');
        }
        if (interaction.customId.startsWith('vote_')) {
            button = buttonManager.get('vote.select');
        }
        if (!button)
            return;
        try {
            yield (button === null || button === void 0 ? void 0 : button.execute(client, interaction));
        }
        catch (error) {
            errorManager.report(error, { executer: undefined, isSend: false });
        }
    }
    if (interaction.isCommand()) {
        if (interaction.user.bot)
            return;
        if (((_b = interaction.channel) === null || _b === void 0 ? void 0 : _b.type) === 'DM')
            return interaction.reply('DM으로는 명령어 사용이 불가능해요');
        const command = commandManager.get(interaction.commandName);
        try {
            if (commandManager.isSlash(command)) {
                command.slash
                    ? yield command.slash.execute(client, interaction)
                    : yield command.execute(client, interaction);
            }
            //await interaction.deferReply().catch(() => { })
        }
        catch (error) {
            errorManager.report(error, { executer: interaction, isSend: true });
        }
    }
}));
