module.exports = {
	extends: '@sapphire',
	ignorePatterns: ['**/node_modules/**', '**/dist/**', '**/types/**', '*.d.ts'],
	rules: {
		'@typescript-eslint/no-base-to-string': 'off',
		'@typescript-eslint/dot-notation': 'off'
	}
};
