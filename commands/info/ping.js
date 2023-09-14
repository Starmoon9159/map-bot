module.exports = {
	name: 'ping',
	description: "查看機器人的延遲.",
	cooldown: 3000,
	userPerms: [],
	botPerms: [],
	run: async (client, message, args) => {
		const msg = await message.reply('測量中...')
		await msg.edit(`完成! **${client.ws.ping} ms**`)
	}
};