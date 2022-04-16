"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ButtonInteraction = exports.BaseCommand = exports.MessageCommand = exports.SlashCommand = void 0;
class SlashCommand {
    constructor(data, execute, options) {
        this.data = data;
        this.execute = execute;
        this.options = options;
    }
}
exports.SlashCommand = SlashCommand;
class MessageCommand {
    constructor(data, execute) {
        this.data = data;
        this.execute = execute;
    }
}
exports.MessageCommand = MessageCommand;
class BaseCommand extends MessageCommand {
    constructor(data, execute, slash) {
        super(data, execute);
        this.data = data;
        this.execute = execute;
        this.slash = slash;
    }
}
exports.BaseCommand = BaseCommand;
class ButtonInteraction {
    constructor(data, execute) {
        this.data = data;
        this.execute = execute;
    }
}
exports.ButtonInteraction = ButtonInteraction;
