const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js');
const ms = require('ms');
const client = require('..'); // 引入你的機器人客戶端
const config = require('../config.json'); // 引入配置文件

const prefix = client.prefix; // 獲取機器人的指令前綴
const cooldown = new Collection(); // 創建一個用於處理冷卻時間的集合

client.on('messageCreate', async message => { // 當有新訊息時觸發的事件處理器
	if(message.author.bot) return; // 如果訊息是由機器人發送，則不處理
	if(message.channel.type !== 0) return; // 如果訊息不是在文本頻道中，則不處理
	if(!message.content.startsWith(prefix)) return; // 如果訊息不以指令前綴開頭，則不處理
	const args = message.content.slice(prefix.length).trim().split(/ +/g); // 切割指令參數
	const cmd = args.shift().toLowerCase(); // 提取指令
	if(cmd.length == 0 ) return; // 如果指令為空，則不處理
	let command = client.commands.get(cmd); // 獲取指令
	if(!command) command = client.commands.get(client.aliases.get(cmd)); // 如果指令不存在，則查找指令的別名
	
	if(command) {
		if(command.cooldown) {
			if(cooldown.has(`${command.name}${message.author.id}`)) return message.channel.send({ content: config.messages["COOLDOWN_MESSAGE"].replace('<duration>', ms(cooldown.get(`${command.name}${message.author.id}`) - Date.now(), {long : true}) ) });
			if(command.userPerms || command.botPerms) {
				if(!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
					const userPerms = new EmbedBuilder()
					.setDescription(`🚫 ${message.author}, 你沒有足夠的 \`${command.userPerms}\` 權限來使用這個指令！`)
					.setColor('Red')
					return message.reply({ embeds: [userPerms] })
				}
				if(!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
					const botPerms = new EmbedBuilder()
					.setDescription(`🚫 ${message.author}, 我沒有足夠的 \`${command.botPerms}\` 權限來使用這個指令！`)
					.setColor('Red')
					return message.reply({ embeds: [botPerms] })
				}
			}

			command.run(client, message, args) // 執行指令
			cooldown.set(`${command.name}${message.author.id}`, Date.now() + command.cooldown) // 設置冷卻時間
			setTimeout(() => {
				cooldown.delete(`${command.name}${message.author.id}`)
			}, command.cooldown);
		} else {
			if(command.userPerms || command.botPerms) {
				if(!message.member.permissions.has(PermissionsBitField.resolve(command.userPerms || []))) {
					const userPerms = new EmbedBuilder()
					.setDescription(`🚫 ${message.author}, 你沒有足夠的 \`${command.userPerms}\` 權限來使用這個指令！`)
					.setColor('Red')
					return message.reply({ embeds: [userPerms] })
				}
			
				if(!message.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(command.botPerms || []))) {
					const botPerms = new EmbedBuilder()
					.setDescription(`🚫 ${message.author}, 我沒有足夠的 \`${command.botPerms}\` 權限來使用這個指令！`)
					.setColor('Red')
					return message.reply({ embeds: [botPerms] })
				}
			}
			command.run(client, message, args) // 執行指令
		}
	}
});
