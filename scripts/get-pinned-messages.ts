import { Rest } from '@cordis/rest';
import type { APIMessage, RESTGetAPIChannelPinsResult } from 'discord-api-types';
import { checkEnvVariables } from './util';

const main = async () => {
	const rest = new Rest(process.env.DISCORD_TOKEN);
	let originChannelPins: APIMessage[];
	try {
		originChannelPins = await rest.get<RESTGetAPIChannelPinsResult>(`/channels/${process.env.ORIGIN_CHANNEL_ID}/pins`);
	} catch (e) {
		console.log(`There was an error retrieving the specified channel. ${(e as Error).message}`);
		return process.exit(1);
	}

	console.log(`Received ${originChannelPins.length} pins from origin channel.`);
	const sortedOriginChannelPins = originChannelPins.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
	console.log(
		sortedOriginChannelPins
			.map((message) => `https://discord.com/channels/${process.env.GUILD_ID ?? message.guild_id}/${message.channel_id}/${message.id}`)
			.join('\n')
	);
	console.log('Pins listed.');
};

checkEnvVariables(['DISCORD_TOKEN', 'ORIGIN_CHANNEL_ID', 'GUILD_ID']);
void main();
