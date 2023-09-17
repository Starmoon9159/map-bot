const { ApplicationCommandType } = require('discord.js');

module.exports = {
    name: 'ping', // 指令名稱
    description: "檢查機器人的延遲。", // 指令描述
    type: ApplicationCommandType.ChatInput, // 指令類型
    cooldown: 3000, // 冷卻時間（毫秒）
    run: async (client, interaction) => { // 指令的執行函數
        interaction.reply({ content: `🏓 Pong! 延遲：**${Math.round(client.ws.ping)} ms**` }); // 回覆用戶一條包含機器人延遲的消息
    }
};
