module.exports = {
	'env': {
		'browser': true,
		'es2021': true
	},
	'extends': [
		'eslint:recommended',
		'plugin:vue/vue3-recommended'
	],
	'parserOptions': {
		'ecmaVersion': 12,
		'sourceType': 'module'
	},
	'plugins': [
		'vue'
	],
	'rules': {
		'indent': [
			'error',
			'tab'
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		'semi': [
			'error',
			'never'
		],
		'vue/html-indent': ['error', 'tab']
	},
	'overrides': [
		{
			'files': ['**/__tests__/**/*.js', '**/*.test.js', '**/*.spec.js'],
			'globals': {
				'vi': 'readonly',
				'describe': 'readonly',
				'it': 'readonly',
				'expect': 'readonly',
				'beforeEach': 'readonly',
				'afterEach': 'readonly'
			}
		}
	]
}
