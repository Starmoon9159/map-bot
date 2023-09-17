const { EmbedBuilder, Collection, PermissionsBitField } = require('discord.js');
const ms = require('ms');
const client = require('..'); // 引入你的機器人客戶端
const config = require('../config.json'); // 引入配置文件

const cooldown = new Collection(); // 創建一個用於處理冷卻時間的集合

client.on('interactionCreate', async interaction => { // 當有互動事件（如Slash指令）時觸發的事件處理器
	const slashCommand = client.slashCommands.get(interaction.commandName); // 獲取Slash指令的相應處理函數
	if (interaction.type == 4) { // 如果是互動的類型是4（Autocomplete）
		if(slashCommand.autocomplete) {
			const choices = [];
			await slashCommand.autocomplete(interaction, choices); // 執行Autocomplete處理函數
		}
	}
	if (!interaction.type == 2) return; // 如果互動的類型不是2（Slash Command），則不處理

	if(!slashCommand) return client.slashCommands.delete(interaction.commandName); // 如果找不到相應的Slash指令處理函數，則刪除該指令
	try {
		if(slashCommand.cooldown) {
			if(cooldown.has(`slash-${slashCommand.name}${interaction.user.id}`)) return interaction.reply({ content: config.messages["COOLDOWN_MESSAGE"].replace('<duration>', ms(cooldown.get(`slash-${slashCommand.name}${interaction.user.id}`) - Date.now(), {long : true}) ) })
			if(slashCommand.userPerms || slashCommand.botPerms) {
				if(!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
					const userPerms = new EmbedBuilder()
					.setDescription(`🚫 ${interaction.user}, 你沒有足夠的 \`${slashCommand.userPerms}\` 權限來使用這個指令！`)
					.setColor('Red')
					return interaction.reply({ embeds: [userPerms] })
				}
				if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
					const botPerms = new EmbedBuilder()
					.setDescription(`🚫 ${interaction.user}, 我沒有足夠的 \`${slashCommand.botPerms}\` 權限來使用這個指令！`)
					.setColor('Red')
					return interaction.reply({ embeds: [botPerms] })
				}
			}

			await slashCommand.run(client, interaction); // 執行Slash指令處理函數
			cooldown.set(`slash-${slashCommand.name}${interaction.user.id}`, Date.now() + slashCommand.cooldown) // 設置冷卻時間
			setTimeout(() => {
				cooldown.delete(`slash-${slashCommand.name}${interaction.user.id}`)
			}, slashCommand.cooldown)
		} else {
			if(slashCommand.userPerms || slashCommand.botPerms) {
				if(!interaction.memberPermissions.has(PermissionsBitField.resolve(slashCommand.userPerms || []))) {
					const userPerms = new EmbedBuilder()
					.setDescription(`🚫 ${interaction.user}, 你沒有足夠的 \`${slashCommand.userPerms}\` 權限來使用這個指令！`)
					.setColor('Red')
					return interaction.reply({ embeds: [userPerms] })
				}
				if(!interaction.guild.members.cache.get(client.user.id).permissions.has(PermissionsBitField.resolve(slashCommand.botPerms || []))) {
					const botPerms = new EmbedBuilder()
					.setDescription(`🚫 ${interaction.user}, 我沒有足夠的 \`${slashCommand.botPerms}\` 權限來使用這個指令！`)
					.setColor('Red')
					return interaction.reply({ embeds: [botPerms] })
				}
			}
			await slashCommand.run(client, interaction); // 執行Slash指令處理函數
		}
	} catch (error) {
		console.log(error);
	}
});
