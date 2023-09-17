module.exports = {
	name: 'ping', // 指令名稱
	description: "檢查機器人的延遲.", // 指令描述
	cooldown: 3000, // 冷卻時間（毫秒）
	userPerms: [], // 用戶需要的權限（這裡設定為空，即任何用戶都可以使用）
	botPerms: [], // 機器人需要的權限（這裡設定為空，即不需要特定權限）
	run: async (client, message, args) => { // 指令的執行函數
		const msg = await message.reply('正在測試延遲...'); // 回覆一條訊息顯示正在測試延遲

		// 使用機器人的 ping 屬性獲取機器人的延遲，並回覆給用戶
		await msg.edit(`Pong! **${client.ws.ping} ms**`); // 編輯之前的訊息，顯示延遲信息
	}
};
