const { ApplicationCommandType, ActionRowBuilder, ButtonBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	name: 'color', // 指令名稱
	description: "選擇一種顏色！", // 指令描述
	type: ApplicationCommandType.ChatInput, // 指令類型
	cooldown: 3000, // 冷卻時間（毫秒）
	run: async (client, interaction) => { // 指令的執行函數
        /** 獲取按鈕
         * @param {Boolean} toggle - 切換按鈕禁用狀態
         * @param {string} [choice = null] choice - 用戶選擇的顏色
         */
        const getButtons = (toggle = false, choice) => {
            const row = new ActionRowBuilder().addComponents(
                new ButtonBuilder()
                        .setLabel('綠色')
                        .setCustomId('green')
                        .setStyle(toggle == true && choice == 'green' ? 'Secondary' : 'Success')
                        .setDisabled(toggle),
    
                    new ButtonBuilder()
                        .setLabel('紅色')
                        .setCustomId('red')
                        .setStyle(toggle == true && choice == 'red' ? 'Secondary' : 'Danger')
                        .setDisabled(toggle),
    
                    new ButtonBuilder()
                        .setLabel('藍色')
                        .setCustomId('blue')
                        .setStyle(toggle == true && choice == 'blue' ? 'Secondary' : 'Primary')
                        .setDisabled(toggle),
    
                    new ButtonBuilder()
                        .setLabel(toggle == true && choice == 'exit' ? '已退出' : '退出')
                        .setEmoji(toggle == true && choice == 'exit' ? '✅' : '❌')
                        .setCustomId('exit')
                        .setStyle(toggle == true && choice == 'exit' ? 'Danger' : 'Secondary')
                        .setDisabled(toggle)
            );

            return row;
        }

        const embed = new EmbedBuilder() // 創建一個嵌入式消息（Embed）
        .setTitle('選擇一種顏色')
        .setDescription('選擇綠色、紅色或藍色。\n如果你不想選擇，請按退出。')
        .setColor('Aqua') // 設置嵌入式消息的顏色
        .setFooter({ text: interaction.user.tag, iconURL: interaction.user.displayAvatarURL() }); // 設置頁腳，包括用戶的標籤和頭像

        interaction.reply({ embeds: [embed], components: [getButtons()] }) // 回覆一個包含嵌入式消息和按鈕的訊息
        .then((m) => {
            const collector = m.createMessageComponentCollector({ time: 15000 }); // 創建一個按鈕互動的收集器，持續時間為15秒

            collector.on('collect', async (i) => {
                if (!i.isButton()) return; // 如果不是按鈕互動，則不處理

                await i.deferUpdate(); // 延遲確認按鈕互動
                if (i.user.id !== interaction.user.id) return i.followUp({ content: `這些按鈕不是給你的！`, ephemeral: true }); // 如果互動的用戶不是發起者，則回覆一條私密訊息

                m.interaction.editReply({ components: [getButtons(true, i.customId)] }) // 編輯回覆訊息，禁用已選擇的按鈕
                if (i.customId === 'exit') return collector.stop(); // 如果選擇的是退出按鈕，則停止收集器

                return i.followUp(`${i.user}, 你選擇了 **${i.customId.charAt(0).toUpperCase() + i.customId.slice(1)} :${i.customId}_circle:**!`); // 回覆用戶選擇的顏色
            });
            
            collector.on('end', (collected, reason) => {
                if (reason === 'user') {
                    return interaction.followUp({ content: '結束了收集器。', ephemeral: true }); // 如果結束原因是用戶，回覆一條私密訊息
                }
                if (reason === 'time') {
                    return;
                }
            });

        });
	}
};
