/* eslint-disable prettier/prettier */
import { stripIndents } from 'common-tags';
import { checkEnvVariables } from './util';
import { REST, RawFile } from '@discordjs/rest';
import { API } from '@discordjs/core';

const main = async () => {
	const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
	const api = new API(rest);

	const originChannelPins = await api.channels.getPins(process.env.ORIGIN_CHANNEL_ID).catch((e) => {
		console.log(`There was an error retrieving the specified origin channels. ${(e as Error).message}`);
		return null;
	});
	if (!originChannelPins) return process.exit(1);

	const destinationChannel = await api.channels.get(process.env.DESTINATION_CHANNEL_ID).catch((e) => {
		console.log(`There was an error retrieving the specified dest channels. ${(e as Error).message}`);
		return null;
	});
	if (!destinationChannel) return process.exit(1);

	console.log(`Received ${originChannelPins.length} pins from origin channel. Sending to ${destinationChannel.name}`);
	const sortedOriginChannelPins = originChannelPins.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
	for (const message of sortedOriginChannelPins) {
		try {
			const url = `https://discord.com/channels/${process.env.GUILD_ID}/${message.channel_id}/${message.id}`;
			const image = message.attachments.length
				? {
					url: message.attachments[0].url,
					width: message.attachments[0].width ?? undefined,
					height: message.attachments[0].height ?? undefined
				}
				: undefined;
			const embeds = [
				{
					author: {
						icon_url: `https://cdn.discordapp.com/avatars/${message.author.id}/${message.author.avatar}`,
						name: `${message.author.username}#${message.author.discriminator}`
					},
					color: (process.env.EMBED_COLOR && parseInt(process.env.EMBED_COLOR, 16)) || 16755763,
					description: stripIndents`
						${message.content}

						[Jump to this message!](${url})
					`,
					image,
					timestamp: new Date(message.timestamp).toISOString()
				}
			];

			await api.channels.createMessage(
				process.env.DESTINATION_CHANNEL_ID,
				{ embeds }
			);
		} catch (e) {
			console.log(`There was an error sending the embed message for message ${message.id}. ${e}`);
			continue;
		}
	}
	console.log('Messages transferred.');
};

checkEnvVariables(['DISCORD_TOKEN', 'ORIGIN_CHANNEL_ID', 'DESTINATION_CHANNEL_ID', 'GUILD_ID']);
void main();
