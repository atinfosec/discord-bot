const {SlashCommandBuilder} = require('discord.js')
const QRCode = require('qrcode');
const path = require('path');
const fs = require('fs/promises')


const data = new SlashCommandBuilder()
.setName('user')
.setDescription('Provides information about the user.')
.addStringOption(option => 
	option.setName('url').setDescription('URL for to convert to QR code')
)

module.exports = {
  data,
  async execute(interaction) {

		try {
			const urlOption = interaction.options.getString('url');
			new URL(urlOption);

			console.log(urlOption)

			const fileName = `${new Date().valueOf()}_qr.png`;
			const qrPath = path.resolve('qrcodes',fileName);
			
			QRCode.toFile(qrPath, urlOption, {
				color: {
				  dark: '#000000',  // QR code color
				  light: '#FFFFFF'  // Background color
				}
			  }, async function (err) {
				if (err) throw err;
				console.log('QR code saved as qrcode.png');
			    await interaction.reply({ files: [qrPath], ephemeral: true });
				await fs.unlink(qrPath);
			  });
		} catch(e) {
			console.log(e)	
			await interaction.reply('Enter correct URL');
		}
		
	},
}