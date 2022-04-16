"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../utils/Logger"));
const BaseManager_1 = __importDefault(require("./BaseManager"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class ButtonManager extends BaseManager_1.default {
    constructor(client) {
        super(client);
        this.logger = new Logger_1.default('ButtonManager');
        this.buttons = client.buttons;
    }
    load(buttonPath = path_1.default.join(__dirname, '../buttons')) {
        this.logger.debug('Loading buttons...');
        const buttonFolder = fs_1.default.readdirSync(buttonPath);
        try {
            buttonFolder.forEach((folder) => {
                if (!fs_1.default.lstatSync(path_1.default.join(buttonPath, folder)).isDirectory())
                    return;
                try {
                    const buttonFiles = fs_1.default.readdirSync(path_1.default.join(buttonPath, folder));
                    buttonFiles.forEach((buttonFile) => {
                        var _a, _b;
                        try {
                            const { default: button
                            // eslint-disable-next-line @typescript-eslint/no-var-requires
                             } = require(`../buttons/${folder}/${buttonFile}`);
                            if ((_a = !button.data.name) !== null && _a !== void 0 ? _a : !button.name)
                                return this.logger.debug(`Button ${buttonFile} has no name. Skipping.`);
                            this.buttons.set((_b = button.data.name) !== null && _b !== void 0 ? _b : button.name, button);
                            this.logger.debug(`Loaded Button ${button.name}`);
                        }
                        catch (error) {
                            this.logger.error(`Error loading button '${buttonFile}'.\n` + error.stack);
                        }
                        finally {
                            this.logger.debug(`Succesfully loaded buttons. count: ${this.buttons.size}`);
                            // eslint-disable-next-line no-unsafe-finally
                            return this.buttons;
                        }
                    });
                }
                catch (error) {
                    this.logger.error(`Error loading button folder '${folder}'.\n` + error.stack);
                }
            });
        }
        catch (error) {
            this.logger.error('Error fetching folder list.\n' + error.stack);
        }
    }
    get(commandName) {
        if (this.client.buttons.has(commandName))
            return this.client.buttons.get(commandName);
    }
    reload(buttonPath = path_1.default.join(__dirname, '../buttons')) {
        this.logger.debug('Reloading buttons...');
        this.buttons.clear();
        try {
            this.load(buttonPath);
        }
        finally {
            this.logger.debug('Succesfully reloaded buttons.');
            // eslint-disable-next-line no-unsafe-finally
            return { message: '[200] Succesfully reloaded commands.' };
        }
    }
}
exports.default = ButtonManager;
