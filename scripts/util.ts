export const checkEnvVariables = (envs: string[]) => {
	const missingKeys: string[] = [];
	for (const envKey of envs) {
		if (!process.env[envKey]) missingKeys.push(envKey);
	}
	if (missingKeys.length) throw new Error(`Missing required env variable(s): ${missingKeys.join(', ')}.`);
};
