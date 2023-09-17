const { EmbedBuilder, PermissionsBitField } = require('discord.js');
const client = require('..'); // 引入你的機器人客戶端

client.on('interactionCreate', async interaction => { // 當有互動事件（如按鈕點擊）時觸發的事件處理器
	if (!interaction.isButton()) return; // 如果不是按鈕互動，則不處理

    const button = client.buttons.get(interaction.customId); // 從機器人的按鈕設定中獲取相應的按鈕處理函數
    if (!button) return; // 如果找不到相應的按鈕處理函數，則不處理

    try {
        if(button.permissions) {
            if(!interaction.memberPermissions.has(PermissionsBitField.resolve(button.permissions || []))) {
                const perms = new EmbedBuilder()
                .setDescription(`🚫 ${interaction.user}, 你沒有足夠的 \`${button.permissions}\` 權限來互動這個按鈕！`)
                .setColor('Red')
                return interaction.reply({ embeds: [perms], ephemeral: true }) // 回覆一個私密的訊息給用戶
            }
        }
        await button.run(client, interaction); // 執行按鈕處理函數
    } catch (error) {
        console.log(error);
    }
});
