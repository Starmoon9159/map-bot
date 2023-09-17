const { EmbedBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');

module.exports = {
	name: 'invite', // 指令名稱
	description: "獲取機器人的邀請連結", // 指令描述
	cooldown: 3000, // 冷卻時間（毫秒）
	userPerms: ['Administrator'], // 用戶需要的權限（這裡設定為Administrator，即管理員權限）
	botPerms: ['Administrator'], // 機器人需要的權限（同樣設定為Administrator）
	run: async (client, message, args) => { // 指令的執行函數
		const inviteUrl = `https://discord.com/api/oauth2/authorize?client_id=${process.env.CLIENT_ID}&permissions=8&scope=bot%20applications.commands`; // 機器人的邀請連結
		const embed = new EmbedBuilder() // 創建一個嵌入式消息（Embed）
		.setTitle('邀請我') // 設置標題
		.setDescription(`邀請機器人加入你的伺服器。 [點擊這裡](${inviteUrl})`) // 設置描述，包括邀請連結
		.setColor('#03fcdb') // 設置嵌入式消息的顏色
		.setTimestamp() // 設置時間戳記
		.setThumbnail(client.user.displayAvatarURL()) // 設置縮略圖，使用機器人的頭像
		.setFooter({ text: client.user.tag }) // 設置頁腳，包括機器人的標籤

		const actionRow = new ActionRowBuilder() // 創建一個互動行（Action Row）
		.addComponents([
			new ButtonBuilder() // 創建一個按鈕
			.setLabel('邀請') // 設置按鈕上顯示的標籤
			.setURL(inviteUrl) // 設置按鈕的URL，即邀請連結
			.setStyle(5) // 設置按鈕的樣式（這裡設定為超連結樣式）
		])
		message.reply({ embeds: [embed], components: [actionRow] }); // 回覆一個包含嵌入式消息和互動行的訊息
	}
};
