const fs = require('fs')

module.exports = api => {

	const build = api.service.commands.build.fn
	const serve = api.service.commands.serve.fn

	const verPath = api.resolve('./version.json')
	let _args = [{dest: 'dist'}]

	const version = get_version_in_package()
	const build_id = next_build_id()

	api.service.commands.serve.fn = (...args) => {
		process.env['VUE_APP_VERSION'] = version
		serve(...args)
	}

	api.service.commands.build.fn = (...args) => {
		_args = args
		process.env['VUE_APP_VERSION'] = version
		process.env['VUE_APP_BUILD_ID'] = build_id
		build(...args).then(() => {
			if (!process.env.VUE_CLI_MODERN_BUILD) {
				inject()
			}
		})
	}

	function get_version_in_package() {
		const path = api.resolve('./package.json')
		let content = fs.readFileSync(path)
		content = JSON.parse(content)
		console.log('构建版本: ' + content['version'])

		return content['version']
	}


	function next_build_id() {
		try {
			fs.accessSync(verPath, fs.constants.R_OK | fs.constants.W_OK)
			const json = JSON.parse(fs.readFileSync(verPath).toString())
			if (json['version'] !== version || !Number.isInteger(json['build_id'])) {
				return 1
			}
			return ++json['build_id']
		} catch (err) {
			return 1
		}
	}


	function inject() {
		let lines = {}
		lines['version'] = version
		lines['build_id'] = build_id
		const content = JSON.stringify(lines)
		console.log('当前版本: ' + lines['version'] + '-' + lines['build_id'])
		console.log('正在写入 version.json')
		fs.writeFileSync(verPath, content, {encoding: 'utf-8'})
		console.log('正在复制 version.json')
		fs.copyFileSync(verPath, api.resolve('./' + _args[0].dest + '/version.json'))
		console.log('Done')
	}
}

module.exports.defaultModes = {
	build: 'production'
}
