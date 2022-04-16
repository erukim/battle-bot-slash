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
const config_1 = __importDefault(require("../config"));
const chalk_1 = __importDefault(require("chalk"));
const package_json_1 = require("../package.json");
const Logger_1 = __importDefault(require("./utils/Logger"));
const logger = new Logger_1.default('shard');
const loggerWeb = new Logger_1.default('web');
console.log(chalk_1.default.cyanBright(`
                  =========================================================


                              ${package_json_1.name}@${config_1.default.BUILD_NUMBER}
                            Version : ${config_1.default.BUILD_VERSION}


                  =========================================================`));
if (!config_1.default.bot.sharding) {
    require('./bot');
}
else {
    const manager = new discord_js_1.ShardingManager('./src/bot.js', config_1.default.bot.shardingOptions);
    manager.spawn();
    manager.on('shardCreate', (shard) => __awaiter(void 0, void 0, void 0, function* () {
        logger.info(`Shard #${shard.id} created.`);
    }));
}
