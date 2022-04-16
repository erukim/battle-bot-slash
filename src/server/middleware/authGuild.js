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
const userSchema_1 = __importDefault(require("../../schemas/userSchema"));
const authGuild = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.cookies)
        return res
            .status(401)
            .json({ status: 401, message: '로그인 후 이용해주세요' });
    const token = req.cookies.auth;
    if (!token)
        return res
            .status(401)
            .json({ status: 401, message: '로그인 후 이용해주세요' });
    const user = yield userSchema_1.default.findOne({ token: token });
    if (!user)
        return res
            .status(401)
            .json({ status: 401, message: '로그인 후 이용해주세요' });
    const guild = req.client.guilds.cache.get(req.params.guild);
    if (!guild)
        return res
            .status(404)
            .json({ status: 404, message: '찾을 수 없는 서버 입니다' });
    if (!guild.members.cache.get(user.id))
        return res
            .status(404)
            .json({ status: 404, message: '해당 서버에 입장되어 있지 않습니다' });
    req.auth = user;
    req.guild = guild;
    next();
});
exports.default = authGuild;
