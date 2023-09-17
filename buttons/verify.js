const { verifyRole } = require('../config.json');

module.exports = {
	id: 'verify_button',
	permissions: [],
	run: async (client, interaction) => {
		await interaction.member.roles.add(verifyRole);
        if (interaction.member.roles.cache.get(verifyRole)) return interaction.reply({ content: `${interaction.user}, 你以驗證過了.`, ephemeral: true })
        return interaction.reply({ content: `✅ ${interaction.user},成功驗證❤.`, ephemeral: true })
	}
};