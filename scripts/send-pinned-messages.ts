import { Rest } from '@cordis/rest';
import { stripIndents } from 'common-tags';
import type {
	APIChannel,
	APIMessage,
	RESTGetAPIChannelPinsResult,
	RESTGetAPIChannelResult,
	RESTPostAPIChannelMessageJSONBody,
	RESTPostAPIChannelMessageResult
} from 'discord-api-types';
import { checkEnvVariables } from './util';

const main = async () => {
	const rest = new Rest(process.env.DISCORD_TOKEN);
	let originChannelPins: APIMessage[];
	let destinationChannel: APIChannel;

	try {
		originChannelPins = await rest.get<RESTGetAPIChannelPinsResult>(`/channels/${process.env.ORIGIN_CHANNEL_ID}/pins`);
		destinationChannel = await rest.get<RESTGetAPIChannelResult>(`/channels/${process.env.DESTINATION_CHANNEL_ID}`);
	} catch (e) {
		console.log(`There was an error retrieving the specified channels. ${(e as Error).message}`);
		return process.exit(1);
	}

	console.log(`Received ${originChannelPins.length} pins from origin channel. Sending to ${destinationChannel.name}`);
	const sortedOriginChannelPins = originChannelPins.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
	for (const message of sortedOriginChannelPins) {
		try {
			await rest.post<RESTPostAPIChannelMessageResult, RESTPostAPIChannelMessageJSONBody>(
				`/channels/${process.env.DESTINATION_CHANNEL_ID}/messages`,
				{
					data: {
						embeds: [
							{
								author: {
									icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`,
									name: `${message.author.username}#${message.author.discriminator}`
								},
								color: (process.env.EMBED_COLOR && parseInt(process.env.EMBED_COLOR, 16)) || 16755763,
								description: stripIndents`
									${message.content}

									[Jump to this message!](https://discord.com/channels/${
										/** Support for cross guild posting */
										process.env.DESTINATION_GUILD_ID ?? process.env.GUILD_ID ?? message.guild_id
									}/${message.channel_id}/${message.id})
								`,
								image: message.attachments.length
									? {
											url: message.attachments[0].url,
											width: message.attachments[0].width ?? undefined,
											height: message.attachments[0].height ?? undefined
									  }
									: undefined,
								timestamp: new Date(message.timestamp).toISOString()
							}
						]
					}
				}
			);
		} catch (e) {
			console.log(`There was an error sending the embed message for message ${message.id}.`);
			continue;
		}
	}
	console.log('Messages transferred.');
};

checkEnvVariables(['DISCORD_TOKEN', 'ORIGIN_CHANNEL_ID', 'DESTINATION_CHANNEL_ID', 'GUILD_ID']);
void main();
