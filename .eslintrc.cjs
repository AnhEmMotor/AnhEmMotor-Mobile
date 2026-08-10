module.exports = {
	root: true,
	extends: ["expo"],
	env: {
		browser: true,
		node: true,
		es2021: true,
	},
	plugins: ["unused-imports"],
	rules: {
		"no-unused-vars": ["warn", { "varsIgnorePattern": "^_", "argsIgnorePattern": "^_" }],
		"react/display-name": "off",
		"import/namespace": "off"
	}
};
