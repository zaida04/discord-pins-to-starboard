declare namespace NodeJS {
	export interface ProcessEnv {
		DISCORD_TOKEN: string;
		ORIGIN_CHANNEL_ID: string;
		DESTINATION_CHANNEL_ID: string;
		GUILD_ID: string;
		DESTINATION_GUILD_ID: string | undefined;
	}
}
