import { API } from '@discordjs/core';
import { REST } from '@discordjs/rest';
import { checkEnvVariables } from './util';

const main = async () => {
	const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
	const api = new API(rest);

	const originChannelPins = await api.channels.getPins(process.env.ORIGIN_CHANNEL_ID).catch((e) => {
		console.log(`There was an error retrieving the specified channel. ${(e as Error).message}`);
		return null;
	});
	if (originChannelPins === null) return process.exit(1);

	console.log(`Received ${originChannelPins.length} pins from origin channel.`);
	const sortedOriginChannelPins = originChannelPins.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
	console.log(
		sortedOriginChannelPins.map((message) => `https://discord.com/channels/${process.env.GUILD_ID}/${message.channel_id}/${message.id}`).join('\n')
	);
	console.log('Pins listed.');
};

checkEnvVariables(['DISCORD_TOKEN', 'ORIGIN_CHANNEL_ID', 'GUILD_ID']);
void main();
