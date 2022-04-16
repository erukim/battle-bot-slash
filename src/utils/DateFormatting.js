"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Day = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
exports.Day = dayjs_1.default;
require("dayjs/locale/ko");
const relativeTime_1 = __importDefault(require("dayjs/plugin/relativeTime"));
const localizedFormat_1 = __importDefault(require("dayjs/plugin/localizedFormat"));
class DateFormatting {
    static _format(date, style) {
        return (`<t:${Math.floor(Number(date) / 1000)}` + (style ? `:${style}` : '') + '>');
    }
    static relative(date) {
        return this._format(date, 'R');
    }
    static date(date) {
        const dates = new Date(date);
        const year = dates.getFullYear().toString().slice(-2);
        const month = ('0' + (dates.getMonth() + 1)).slice(-2);
        const day = ('0' + dates.getDate()).slice(-2);
        const hour = ('0' + dates.getHours()).slice(-2);
        const minute = ('0' + dates.getMinutes()).slice(-2);
        return year + '.' + month + '.' + day + '. ' + hour + ':' + minute;
    }
}
exports.default = DateFormatting;
dayjs_1.default.extend(relativeTime_1.default);
dayjs_1.default.extend(localizedFormat_1.default);
dayjs_1.default.locale('ko');
