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
exports.Event = void 0;
class Event {
    constructor(name, execute, options) {
        this.name = name;
        this.execute = execute;
        this.options = options;
    }
    static isEvent(event) {
        return event instanceof Event;
    }
    static waitUntil(client, event, checkFunction = () => true, timeout) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield new Promise((resolve) => {
                let timeoutID;
                if (timeout !== undefined) {
                    timeoutID = setTimeout(() => {
                        client.off(event, eventFunction);
                        resolve([]);
                    }, timeout);
                }
                const eventFunction = (...args) => {
                    if (checkFunction(...args)) {
                        resolve(args);
                        client.off(event, eventFunction);
                        if (timeoutID !== undefined)
                            clearTimeout(timeoutID);
                    }
                };
                client.on(event, eventFunction);
            });
        });
    }
}
exports.Event = Event;