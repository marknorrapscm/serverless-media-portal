module.exports = {
	"env": {
		"es2021": true,
		"node": true
	},
	"extends": [
		"eslint:recommended",
		"airbnb-base/legacy"
	],
	"rules": {
		"indent": ["error", "tab"],
		"linebreak-style": ["error", "windows"],
		"quotes": ["error", "double"],
		"no-unused-vars": [
			"warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }
		],
		"no-else-return": "off",
		"strict": "off",
		"no-tabs": "off",
		"quote-props": "off",
		"no-use-before-define": "off",
		"arrow-parens": ["error", "as-needed"],
		"prefer-template": "error"
	}
};
