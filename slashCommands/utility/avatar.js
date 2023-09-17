const { ApplicationCommandType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ApplicationCommandOptionType } = require('discord.js');

module.exports = {
    name: 'avatar', // 指令名稱
    description: "顯示用戶的頭像", // 指令描述
    type: ApplicationCommandType.ChatInput, // 指令類型
    cooldown: 3000, // 冷卻時間（毫秒）
    options: [
        {
            name: 'user', // 選項名稱
            description: '要顯示頭像的用戶。', // 選項描述
            type: ApplicationCommandOptionType.User // 選項類型（用戶）
        }
    ],
    run: async (client, interaction) => { // 指令的執行函數
        const user = interaction.options.get('user')?.user || interaction.user; // 獲取選項中的用戶，如果未指定，則使用執行指令的用戶

        const embed = new EmbedBuilder() // 創建一個嵌入式消息（Embed）
            .setTitle(`${user.tag} 的頭像`) // 設置標題
            .setImage(user.displayAvatarURL({ size: 4096 })) // 設置圖片，顯示用戶的頭像（最大尺寸為 4096）
            .setColor('Fuchsia') // 設置嵌入式消息的顏色
            .setTimestamp(); // 設置時間戳

        const formats = ['png', 'jpg', 'jpeg', 'gif']; // 可用的圖片格式
        const components = [];
        formats.forEach(format => {
            let imageOptions = { extension: format, forceStatic: format == 'gif' ? false : true };

            if (user.avatar == null && format !== 'png') return; // 如果用戶沒有自訂頭像且格式不是 PNG，則忽略
            if (!user.avatar.startsWith('a_') && format === 'gif') return; // 如果用戶頭像不是 GIF 但要求 GIF 格式，則忽略
            components.push(
                new ButtonBuilder() // 創建一個按鈕
                    .setLabel(format.toUpperCase()) // 設置按鈕上顯示的標籤，將格式轉為大寫
                    .setStyle('Link') // 設置按鈕的樣式為連結
                    .setURL(user.displayAvatarURL(imageOptions)) // 設置按鈕的 URL，連結到用戶的頭像
            )
        })

        const row = new ActionRowBuilder() // 創建一個互動行（Action Row）
            .addComponents(components);

        return interaction.reply({ embeds: [embed], components: [row] }) // 回覆用戶一條包含用戶頭像和格式按鈕的消息
    }
};
