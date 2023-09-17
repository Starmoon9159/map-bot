const { EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
	name: 'role',
	description: "Manage roles of the server or members.",
	cooldown: 3000,
	type: ApplicationCommandType.ChatInput,
    	default_member_permissions: 'ManageRoles', // permission required
	options: [
        {
            name: 'add',
            description: 'Add role to a user.',
            type: 1,
            options: [
                {
                    name: 'role',
                    description: 'The role you want to add to the user.',
                    type: 8,
                    required: true
                },
                {
                    name: 'user',
                    description: 'The user you want to add role to.',
                    type: 6,
                    required: true
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
                return interaction.reply({ content: `已設定驗證。`, ephemeral: true }); // 回覆用戶設定成功的信息，並設為私密訊息

            } catch {
                return interaction.reply({ content: `對不起，設定失敗...`, ephemeral: true }); // 如果設定失敗，回覆用戶錯誤信息，並設為私密訊息
            }
        }
    }
};
