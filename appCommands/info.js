const { SlashCommandBuilder } = require('discord.js');
const { version, supported } = require('../config.json')

module.exports =  { //! Garbage code
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Provides information about bot.'),
	execute (interaction) {
		interaction.reply(`Corrent bot version is ${version}, supported languages: ${supported}`);
	},
}