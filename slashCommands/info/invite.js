const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandType, ButtonStyle } = require('discord.js');

module.exports = {
    name: 'invite', // 指令名稱
    description: "獲取機器人的邀請連結", // 指令描述
    cooldown: 3000, // 冷卻時間（毫秒）
    type: ApplicationCommandType.ChatInput, // 指令類型
    userPerms: [], // 用戶權限（空白表示無需特殊權限）
    botPerms: [], // 機器人權限（空白表示無需特殊權限）
    run: async (client, interaction) => { // 指令的執行函數
        const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=8&scope=bot%20applications.commands`; // 機器人的邀請連結
        const embed = new EmbedBuilder() // 創建一個嵌入式消息（Embed）
            .setTitle('邀請我') // 設置標題
            .setDescription(`邀請機器人到您的伺服器。[點擊這裡](${inviteUrl})`) // 設置描述，包含邀請連結
            .setColor('#03fcdb') // 設置嵌入式消息的顏色
            .setTimestamp() // 設置時間戳
            .setThumbnail(client.user.displayAvatarURL()) // 設置縮略圖，使用機器人的頭像
            .setFooter({ text: client.user.tag }); // 設置頁腳，包括機器人的名稱

        const actionRow = new ActionRowBuilder() // 創建一個互動行（Action Row）
            .addComponents([
                new ButtonBuilder() // 創建一個按鈕
                    .setLabel('邀請') // 設置按鈕上顯示的標籤
                    .setURL(inviteUrl) // 設置按鈕的URL，即邀請連結
                    .setStyle(ButtonStyle.Link) // 設置按鈕的樣式為連結
            ]);

        return interaction.reply({ embeds: [embed], components: [actionRow] }); // 回覆用戶包含嵌入式消息和按鈕的訊息
    }
};
