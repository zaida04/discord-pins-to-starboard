import { Rest } from '@cordis/rest';
import { stripIndent } from 'common-tags';
import type { APIMessage, RESTDeleteAPIChannelMessageResult, RESTGetAPIChannelPinsResult } from 'discord-api-types';
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

	console.log(`Received ${originChannelPins.length} pins from origin channel. Removing...`);
	const sortedOriginChannelPins = originChannelPins.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
	for (const message of sortedOriginChannelPins) {
		try {
			await rest.delete<RESTDeleteAPIChannelMessageResult>(`/channels/${process.env.ORIGIN_CHANNEL_ID}/pins/${message.id}`);
		} catch (e) {
			console.log(`There was an error unpinning the message ${message.id}. ${e}`);
			continue;
		}
	}
	console.log(stripIndent`
		List of urls:
        ${sortedOriginChannelPins
					.map((message) => `https://discord.com/channels/${process.env.GUILD_ID ?? message.guild_id}/${message.channel_id}/${message.id}`)
					.join('\n\t\t')}
    `);
	console.log('Messages unpinned.');
};

checkEnvVariables(['DISCORD_TOKEN', 'ORIGIN_CHANNEL_ID', 'GUILD_ID']);
void main();
