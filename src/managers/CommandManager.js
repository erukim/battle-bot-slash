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
const Logger_1 = __importDefault(require("../utils/Logger"));
const BaseManager_1 = __importDefault(require("./BaseManager"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("../../config"));
class CommandManager extends BaseManager_1.default {
    constructor(client) {
        super(client);
        this.logger = new Logger_1.default('CommandManager');
        this.commands = client.commands;
        this.categorys = client.categorys;
    }
    load(commandPath = path_1.default.join(__dirname, '../commands')) {
        this.logger.debug('Loading commands...');
        const commandFolder = fs_1.default.readdirSync(commandPath);
        try {
            commandFolder.forEach((folder) => {
                if (!fs_1.default.lstatSync(path_1.default.join(commandPath, folder)).isDirectory())
                    return;
                this.categorys.set(folder, []);
                try {
                    const commandFiles = fs_1.default.readdirSync(path_1.default.join(commandPath, folder));
                    commandFiles.forEach((commandFile) => {
                        var _a, _b, _c, _d, _e, _f;
                        try {
                            /*if (!commandFile.endsWith('.ts') || !commandFile.endsWith('.js'))
                              return this.logger.warn(
                                `Not a TypeScript file ${commandFile}. Skipping.`
                              )*/
                            const { default: command
                            // eslint-disable-next-line @typescript-eslint/no-var-requires
                             } = require(`../commands/${folder}/${commandFile}`);
                            if ((_a = !command.data.name) !== null && _a !== void 0 ? _a : !command.name)
                                return this.logger.debug(`Command ${commandFile} has no name. Skipping.`);
                            (_b = this.categorys.get(folder)) === null || _b === void 0 ? void 0 : _b.push({
                                name: (_c = command.data.aliases[0]) !== null && _c !== void 0 ? _c : command.aliases[0],
                                description: (_d = command.data.description) !== null && _d !== void 0 ? _d : command.description,
                                isSlash: (command === null || command === void 0 ? void 0 : command.slash)
                                    ? true
                                    : ((_e = command === null || command === void 0 ? void 0 : command.options) === null || _e === void 0 ? void 0 : _e.isSlash)
                                        ? true
                                        : false
                            });
                            this.commands.set((_f = command.data.name) !== null && _f !== void 0 ? _f : command.name, command);
                            this.logger.debug(`Loaded command ${command.name}`);
                        }
                        catch (error) {
                            this.logger.error(`Error loading command '${commandFile}'.\n` + error.stack);
                        }
                        finally {
                            this.logger.debug(`Succesfully loaded commands. count: ${this.commands.size}`);
                            // eslint-disable-next-line no-unsafe-finally
                            return this.commands;
                        }
                    });
                }
                catch (error) {
                    this.logger.error(`Error loading command folder '${folder}'.\n` + error.stack);
                }
            });
        }
        catch (error) {
            this.logger.error('Error fetching folder list.\n' + error.stack);
        }
    }
    get(commandName) {
        let command;
        if (this.client.commands.has(commandName))
            return (command = this.client.commands.get(commandName));
        this.client.commands.forEach((cmd) => {
            if (this.isSlash(cmd) && cmd.data.name === commandName)
                return (command = cmd);
            // @ts-ignore
            if (cmd.data.aliases.includes(commandName))
                return (command = cmd);
        });
        return command;
    }
    reload(commandPath = path_1.default.join(__dirname, '../commands')) {
        this.logger.debug('Reloading commands...');
        this.commands.clear();
        try {
            this.load(commandPath);
        }
        finally {
            this.logger.debug('Succesfully reloaded commands.');
            // eslint-disable-next-line no-unsafe-finally
            return { message: '[200] Succesfully reloaded commands.' };
        }
    }
    isSlash(command) {
        var _a;
        //return command?.options.slash ?? false
        return (command === null || command === void 0 ? void 0 : command.slash)
            ? true
            : ((_a = command === null || command === void 0 ? void 0 : command.options) === null || _a === void 0 ? void 0 : _a.isSlash)
                ? true
                : false;
    }
    slashCommandSetup(guildID) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.scope = 'CommandManager: SlashSetup';
            const slashCommands = [];
            this.client.commands.forEach((command) => {
                var _a;
                if (this.isSlash(command)) {
                    slashCommands.push(command.slash ? (_a = command.slash) === null || _a === void 0 ? void 0 : _a.data.toJSON() : command.data.toJSON());
                }
            });
            if (!guildID) {
                this.logger.warn('guildID not gived switching global command...');
                this.logger.debug(`Trying ${this.client.guilds.cache.size} guild(s)`);
                for (const command of slashCommands) {
                    const commands = yield ((_a = this.client.application) === null || _a === void 0 ? void 0 : _a.commands.fetch());
                    const cmd = commands === null || commands === void 0 ? void 0 : commands.find((cmd) => cmd.name === command.name);
                    if (!cmd) {
                        yield ((_b = this.client.application) === null || _b === void 0 ? void 0 : _b.commands.create(command).then((guilds) => this.logger.info(`Succesfully created command ${command.name} at guild`)));
                    }
                }
            }
            else {
                this.logger.info(`Slash Command requesting ${guildID}`);
                const guild = this.client.guilds.cache.get(guildID);
                for (const command of slashCommands) {
                    const commands = yield (guild === null || guild === void 0 ? void 0 : guild.commands.fetch());
                    const cmd = commands === null || commands === void 0 ? void 0 : commands.find((cmd) => cmd.name === command.name);
                    if (!cmd) {
                        yield (guild === null || guild === void 0 ? void 0 : guild.commands.create(command).then((guild) => this.logger.info(`Succesfully created command ${command.name} at ${guild.name} guild`)));
                    }
                }
                return slashCommands;
            }
        });
    }
    slashGlobalCommandSetup() {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.scope = 'CommandManager: SlashGlobalSetup';
            const slashCommands = [];
            this.client.commands.forEach((command) => {
                var _a;
                if (this.isSlash(command)) {
                    slashCommands.push(command.slash ? (_a = command.slash) === null || _a === void 0 ? void 0 : _a.data.toJSON() : command.data.toJSON());
                }
            });
            this.logger.debug(`Trying ${this.client.guilds.cache.size} guild(s)`);
            for (const command of slashCommands) {
                const commands = yield ((_a = this.client.application) === null || _a === void 0 ? void 0 : _a.commands.fetch());
                const cmd = commands === null || commands === void 0 ? void 0 : commands.find((cmd) => cmd.name === command.name);
                const category = this.categorys.get('dev');
                if (category === null || category === void 0 ? void 0 : category.find((c) => c.name === command.name)) {
                    const supportGuild = this.client.guilds.cache.get(config_1.default.devGuild.guildID);
                    yield (supportGuild === null || supportGuild === void 0 ? void 0 : supportGuild.commands.create(command).then(() => {
                        this.logger.info(`Succesfully created Developer command ${command.name} at ${supportGuild.name} guild`);
                    }).catch((e) => {
                        console.log(e);
                        this.logger.error(`Error created Developer command ${command.name} at ${supportGuild.name} guild`);
                    }));
                    return;
                }
                if (!cmd) {
                    yield ((_b = this.client.application) === null || _b === void 0 ? void 0 : _b.commands.create(command).then((guilds) => this.logger.info(`Succesfully created command ${command.name} at ${guilds} guild`)));
                }
            }
        });
    }
}
exports.default = CommandManager;
