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
const discord_player_1 = require("discord-player");
const dokdo_1 = __importDefault(require("dokdo"));
const Logger_1 = __importDefault(require("../utils/Logger"));
const discord_modals_1 = __importDefault(require("discord-modals"));
const config_1 = __importDefault(require("../../config"));
const CommandManager_1 = __importDefault(require("../managers/CommandManager"));
const EventManager_1 = __importDefault(require("../managers/EventManager"));
const ErrorManager_1 = __importDefault(require("../managers/ErrorManager"));
const DatabaseManager_1 = __importDefault(require("../managers/DatabaseManager"));
const dotenv_1 = require("dotenv");
const ButtonManager_1 = __importDefault(require("../managers/ButtonManager"));
const logger = new Logger_1.default('bot');
class BotClient extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this.config = config_1.default;
        this.commands = new discord_js_1.Collection();
        this.buttons = new discord_js_1.Collection();
        this.categorys = new discord_js_1.Collection();
        this.events = new discord_js_1.Collection();
        this.musicEvents = new discord_js_1.Collection();
        this.errors = new discord_js_1.Collection();
        this.player = new discord_player_1.Player(this);
        this.dokdo = new dokdo_1.default(this, {
            prefix: this.config.bot.prefix,
            owners: config_1.default.bot.owners,
            noPerm: (message) => message.reply('당신은 Dokdo 를 이용할수 없습니다.')
        });
        this.schemas = new discord_js_1.Collection();
        this.command = new CommandManager_1.default(this);
        this.button = new ButtonManager_1.default(this);
        this.event = new EventManager_1.default(this);
        this.error = new ErrorManager_1.default(this);
        this.database = new DatabaseManager_1.default(this);
        (0, dotenv_1.config)();
        logger.info('Loading config data...');
        this.VERSION = config_1.default.BUILD_VERSION;
        this.BUILD_NUMBER = config_1.default.BUILD_NUMBER;
    }
    start(token = config_1.default.bot.token) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.info('Logging in bot...');
            yield this.login(token);
            (0, discord_modals_1.default)(this);
        });
    }
    setStatus(status = 'online', name = '점검중...') {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (status.includes('dev')) {
                logger.warn('Changed status to Developent mode');
                (_a = this.user) === null || _a === void 0 ? void 0 : _a.setPresence({
                    activities: [
                        { name: `${this.config.bot.prefix}help | ${this.VERSION} : ${name}` }
                    ],
                    status: 'dnd'
                });
            }
            else if (status.includes('online')) {
                logger.info('Changed status to Online mode');
                (_b = this.user) === null || _b === void 0 ? void 0 : _b.setPresence({
                    activities: [
                        { name: `${this.config.bot.prefix}help | ${this.VERSION}` }
                    ],
                    status: 'online'
                });
            }
        });
    }
}
exports.default = BotClient;
