const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
    name: 'verify', // 指令名稱
    description: "設置伺服器的簡單驗證系統。", // 指令描述
    cooldown: 3000, // 冷卻時間（毫秒）
    type: ApplicationCommandType.ChatInput, // 指令類型
    default_member_permissions: 'Administrator', // 默認的成員權限（設置為管理員）
    options: [
        {
            name: 'set', // 子指令名稱
            description: '為使用者添加角色。', // 子指令描述
            type: 1, // 子指令類型
            options: [
                {
                    name: 'channel', // 子指令選項名稱
                    description: '驗證頻道', // 子指令選項描述
                    type: ApplicationCommandOptionType.Channel, // 選項類型（頻道）
                    required: true // 是否必需
                },
                {
                    name: 'embed_title', // 子指令選項名稱
                    description: '驗證嵌入標題', // 子指令選項描述
                    type: ApplicationCommandOptionType.String, // 選項類型（字符串）
                    required: false // 是否必需
                },
                {
                    name: 'embed_description', // 子指令選項名稱
                    description: '驗證嵌入描述', // 子指令選項描述
                    type: ApplicationCommandOptionType.String, // 選項類型（字符串）
                    required: false // 是否必需
                }
            ]
        }
    ],
    run: async (client, interaction) => { // 指令的執行函數
        if (interaction.options._subcommand === 'set') { // 檢查是否選擇了 'set' 子指令
            try {
                const title = interaction.options.get('embed_title').value; // 獲取嵌入標題
                const description = interaction.options.get('embed_description').value; // 獲取嵌入描述
                const channel = interaction.options.get('channel').channel; // 獲取頻道

                const embed = new EmbedBuilder() // 創建一個嵌入式消息（Embed）
                    .setTitle(title || '驗證') // 設置標題，如果未提供，則使用默認值
                    .setDescription(description || `點擊下面的按鈕進行驗證。`) // 設置描述，如果未提供，則使用默認值
                    .setColor('Green') // 設置嵌入式消息的顏色
                    .setFooter({ text: interaction.guild.name, iconURL: interaction.guild.iconURL() }); // 設置頁腳，包括伺服器的名稱和圖標

                const buttons = new ActionRowBuilder() // 創建一個互動行（Action Row）
                    .addComponents(
                        new ButtonBuilder() // 創建一個按鈕
                            .setLabel('驗證') // 設置按鈕上顯示的標籤
                            .setStyle('Success') // 設置按鈕的樣式（成功）
                            .setCustomId('verify_button') // 設置按鈕的自定義ID
                    );

                await channel.send({ embeds: [embed], components: [buttons] }); // 發送包含嵌入式消息和按鈕的訊息到指定頻道
                return interaction.reply({ content: `設置了驗證。`, ephemeral: true }); // 回覆用戶設定成功的消息，並設為私密訊息

            } catch {
                return interaction.reply({ content: `抱歉，設置失敗...`, ephemeral: true }); // 如果設置失敗，回覆用戶錯誤消息，並設為私密訊息
            }
        }
    }
};
