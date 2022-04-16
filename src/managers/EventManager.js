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
const fs_1 = require("fs");
const path_1 = require("path");
const Event_1 = require("../structures/Event");
const Logger_1 = __importDefault(require("../utils/Logger"));
const BaseManager_1 = __importDefault(require("./BaseManager"));
/**
 * @extends {BaseManager}
 */
class EventManager extends BaseManager_1.default {
    constructor(client) {
        super(client);
        this.logger = new Logger_1.default('EventManager');
        this.events = client.events;
    }
    load(eventPath = (0, path_1.join)(__dirname, '../events')) {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug('Loading events...');
            const eventFiles = (0, fs_1.readdirSync)(eventPath);
            eventFiles.forEach((eventFile) => __awaiter(this, void 0, void 0, function* () {
                try {
                    /*if (!eventFile.endsWith('.ts') || !eventFile.endsWith('.js'))
                      return this.logger.debug(
                        `Not a TypeScript file ${eventFile}. Skipping.`
                      )*/
                    // eslint-disable-next-line @typescript-eslint/no-var-requires
                    const { default: event } = require(`../events/${eventFile}`);
                    if (!event.name)
                        return this.logger.debug(`Event ${eventFile} has no name. Skipping.`);
                    this.events.set(event.name, event);
                    this.logger.debug(`Loaded event ${eventFile}`);
                }
                catch (error) {
                    this.logger.error(`Error loading events '${eventFile}'.\n` + error.stack);
                }
            }));
            this.logger.debug(`Succesfully loaded events. count: ${this.events.size}`);
            this.start();
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.debug('Starting event files...');
            this.events.forEach((event, eventName) => {
                var _a;
                if (!Event_1.Event.isEvent(event))
                    return;
                if ((_a = event.options) === null || _a === void 0 ? void 0 : _a.once) {
                    this.client.once(eventName, (...args) => {
                        // @ts-ignore
                        event.execute(this.client, ...args);
                    });
                    this.logger.debug(`Started event '${eventName}' once.`);
                }
                else {
                    this.client.on(eventName, (...args) => {
                        // @ts-ignore
                        event.execute(this.client, ...args);
                    });
                    this.logger.debug(`Started event '${eventName}' on.`);
                }
            });
        });
    }
    reload(eventPath = (0, path_1.join)(__dirname, '../events')) {
        this.logger.debug('Reloading events...');
        this.events.clear();
        this.load(eventPath);
    }
    /**
     * @example EventManager.register('ready', (client) => {
     *  console.log(`${client.user.tag} is ready!`)
     * })
     */
    register(eventName, fn) {
        const eventFuntion = {
            name: eventName,
            execute: fn,
            options: {
                once: true
            }
        };
        this.events.set(eventName, eventFuntion);
        // @ts-ignore
        this.client.on(eventName, fn);
        this.logger.debug(`Registered event '${eventName}'`);
    }
}
exports.default = EventManager;
