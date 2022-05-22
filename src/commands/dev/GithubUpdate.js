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
const discord_js_1 = __importDefault(require("discord.js"));
const Embed_1 = __importDefault(require("../../utils/Embed"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const child_process_1 = __importDefault(require("child_process"));
const package_json_1 = require("../../../package.json");
const Command_1 = require("../../structures/Command");
exports.default = new Command_1.MessageCommand({
    name: 'update',
    description: '최신 업데이트 내용을 확인합니다.',
    aliases: ['업데이트', 'djqepdlxm', '촏차', 'check']
}, (client, message, args) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    // @ts-ignore
    if (!client.dokdo.owners.includes(message.author.id))
        return message.reply(`해당 명령어는 ${(_a = client.user) === null || _a === void 0 ? void 0 : _a.username}의 주인이 사용할 수 있는 명령어입니다.`);
    let LoadingEmbed = new Embed_1.default(client, 'warn')
        .setTitle('잠시만 기다려주십시요')
        .setDescription('최신 업데이트 내용을 불러오는 중입니다...');
    let msg = yield message.reply({ embeds: [LoadingEmbed] });
    if ((package_json_1.repository === null || package_json_1.repository === void 0 ? void 0 : package_json_1.repository.includes('Your github url')) || !package_json_1.repository) {
        LoadingEmbed.setTitle('이런...')
            .setDescription('업데이트 내용을 불러오는 중에 오류가 발생했습니다.\n오류 내용: package.json에 `repository` 값이 없습니다.')
            .setType('error');
        yield msg.edit({ embeds: [LoadingEmbed] });
    }
    let repo = package_json_1.repository.replaceAll('https://github.com/', '');
    if ((_b = process.env.GITHUB_TOKEN) !== null && _b !== void 0 ? _b : client.config.githubToken !== '') {
        (0, node_fetch_1.default)(`https://api.github.com/repos/${repo}/commits`, {
            headers: {
                Authorization: `token ${client.config.githubToken}`
            }
        }).then((res) => {
            if (!res.ok && res.status === 404) {
                LoadingEmbed.setTitle('이런...')
                    .setDescription('업데이트 내용을 불러오는 중에 오류가 발생했습니다.\n오류 내용: `package.json`에 있는 `repository` 에 있는 주소를 찾을수 없습니다.')
                    .setType('error');
                msg.edit({ embeds: [LoadingEmbed] });
            }
            else {
                res.json().then((json) => {
                    if (json[0].sha.trim().substring(0, 6) === client.BUILD_NUMBER) {
                        let SuccessEmbed = new Embed_1.default(client, 'success')
                            .setColor('#2f3136')
                            .setTitle('확인 완료!')
                            .setDescription('현재 최신 버전을 이용중입니다!')
                            .addField('현재 버전', `v${client.VERSION}`, true)
                            .addField('현재 빌드 번호', `${client.BUILD_NUMBER}`, true);
                        return msg.edit({ embeds: [SuccessEmbed] });
                    }
                    else {
                        let count = 0;
                        json.forEach((commit) => {
                            count++;
                            if (commit.sha.trim().substring(0, 6) === client.BUILD_NUMBER) {
                                let NewUpdateEmbed = new Embed_1.default(client, 'success')
                                    .setColor('#2f3136')
                                    .setTitle('최신 업데이트가 있습니다!')
                                    .setDescription(`최신 업데이트된 ${count}개의 내용이 있습니다. 지금 업데이트 하시겠습니까?`)
                                    .addField('현재 버전', `v${client.VERSION}`, true)
                                    .addField('현재 빌드 번호', `${client.BUILD_NUMBER}`, true)
                                    .addField('최신 빌드 번호', `${json[0].sha.trim().substring(0, 6)}`, true);
                                let buttonData = new discord_js_1.default.MessageButton()
                                    .setStyle('SUCCESS')
                                    .setLabel('업데이트 하기')
                                    .setEmoji('✅')
                                    .setCustomId('update.run');
                                let components = new discord_js_1.default.MessageActionRow().addComponents(buttonData);
                                let collector = msg.channel.createMessageComponentCollector({
                                    time: 10 * 1000
                                });
                                collector.on('collect', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
                                    if (interaction.customId === 'update.run') {
                                        collector.stop();
                                        child_process_1.default.execSync(`git pull https://username:${client.config.githubToken}@github.com/${repo}`);
                                        yield interaction.reply('업데이트가 완료되었습니다!');
                                    }
                                    else if (interaction.user.id !== message.author.id) {
                                        interaction.reply(`메세지를 작성한 **${interaction.user.username}**만 업데이트할 수 있습니다.`);
                                    }
                                }));
                                msg.edit({
                                    embeds: [NewUpdateEmbed],
                                    components: [components]
                                });
                            }
                            else {
                                let BranchErrorEmbed = new Embed_1.default(client, 'error')
                                    .setTitle('뭔가 잘못된거 같아요...')
                                    .setDescription('업데이트를 정보를 찾을수 없습니다. 브랜치가 다른걸수도 있습니다.\n기본 브랜치를 바꿔보는건 어떨까요?');
                                msg.edit({ embeds: [BranchErrorEmbed] });
                            }
                        });
                    }
                });
            }
        });
    }
    else {
        (0, node_fetch_1.default)(`https://api.github.com/repos/${repo}/commits`).then((res) => {
            if (!res.ok && res.status === 404) {
                LoadingEmbed.setTitle('이런...')
                    .setDescription('업데이트 내용을 불러오는 중에 오류가 발생했습니다.\n오류 내용: 찾을수 없거나 비공개되어 있습니다.')
                    .setType('error');
                msg.edit({ embeds: [LoadingEmbed] });
            }
            else {
                res.json().then((json) => {
                    if (json[0].sha.trim().substring(0, 6) === client.BUILD_NUMBER) {
                        let SuccessEmbed = new Embed_1.default(client, 'success')
                            .setColor('#2f3136')
                            .setTitle('확인 완료!')
                            .setDescription('현재 최신 버전을 이용중입니다!')
                            .addField('현재 버전', `v${client.VERSION}`, true)
                            .addField('현재 빌드 번호', `[${client.BUILD_NUMBER}](${package_json_1.repository}/commit/${client.BUILD_NUMBER})`, true);
                        return msg.edit({ embeds: [SuccessEmbed] });
                    }
                    else {
                        let count = 0;
                        json.forEach((commit) => {
                            count++;
                            if (commit.sha.trim().substring(0, 6) === client.BUILD_NUMBER) {
                                let NewUpdateEmbed = new Embed_1.default(client, 'success')
                                    .setColor('#2f3136')
                                    .setTitle('최신 업데이트가 있습니다!')
                                    .setDescription(`최신 업데이트된 ${count}개의 내용이 있습니다. 지금 업데이트 하시겠습니까?`)
                                    .addField('현재 버전', `v${client.VERSION}`, true)
                                    .addField('현재 빌드 번호', `[${client.BUILD_NUMBER}](${package_json_1.repository}/commit/${client.BUILD_NUMBER})`, true)
                                    .addField('최신 빌드 번호', `[${json[0].sha
                                    .trim()
                                    .substring(0, 6)}](${package_json_1.repository}/commit/${json[0].sha})`, true);
                                let buttonData = new discord_js_1.default.MessageButton()
                                    .setStyle('SUCCESS')
                                    .setLabel('업데이트 하기')
                                    .setEmoji('✅')
                                    .setCustomId('update.run');
                                let components = new discord_js_1.default.MessageActionRow().addComponents(buttonData);
                                let collector = msg.channel.createMessageComponentCollector({
                                    time: 10 * 1000
                                });
                                collector.on('collect', (interaction) => __awaiter(void 0, void 0, void 0, function* () {
                                    if (interaction.customId === 'update.run') {
                                        collector.stop();
                                        child_process_1.default.execSync(`git pull https://username:${client.config.githubToken}@github.com/${repo}`);
                                        yield interaction.reply('업데이트가 완료되었습니다!');
                                    }
                                    else if (interaction.user.id !== message.author.id) {
                                        interaction.reply(`메세지를 작성한 **${interaction.user.username}**만 업데이트할 수 있습니다.`);
                                    }
                                }));
                                return msg.edit({
                                    embeds: [NewUpdateEmbed],
                                    components: [components]
                                });
                            }
                            else {
                                let BranchErrorEmbed = new Embed_1.default(client, 'error')
                                    .setTitle('뭔가 잘못된거 같아요...')
                                    .setDescription('업데이트를 정보를 찾을수 없습니다. 브랜치가 다른걸수도 있습니다.\n기본 브랜치를 바꿔보는건 어떨까요?');
                                msg.edit({ embeds: [BranchErrorEmbed] });
                            }
                        });
                    }
                });
            }
        });
    }
}));
