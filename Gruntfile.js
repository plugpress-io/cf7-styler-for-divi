module.exports = function (grunt) {
	'use strict';

	const platform = grunt.option('platform') || 'et';
	const pkg = grunt.file.readJSON('package.json');

	grunt.initConfig({
		copy: {
			main: {
				options: {
					mode: true,
				},
				src: [
					'**',
					'!node_modules/**',
					'!build/**',
					'!css/sourcemap/**',
					'!.git/**',
					'!.github/**',
					'!bin/**',
					'!.gitlab-ci.yml',
					'!cghooks.lock',
					'!tests/**',
					'!*.sh',
					'!*.map',
					'!Gruntfile.js',
					'!postcss.config.js',
					'!tailwind.config.js',
					'!package.json',
					'!.gitignore',
					'!phpunit.xml',
					'!README.md',
					'!sass/**',
					'!src/**',
					'!composer.json',
					'!composer.lock',
					'!package-lock.json',
					'!phpcs.xml.dist',
					'!.eslintignore',
					'!.eslintrc.json',
					'!.vscode/**',
					'!*.zip',
					'!webpack.mix.js',
					'!wp-textdomain.js',
				],
				dest: 'package/torque-forms-styler-pro/',
			},
		},

		bumpup: {
			options: {
				updateProps: {
					pkg: 'package.json',
				},
			},
			file: 'package.json',
		},

		replace: {
			plugin_const: {
				src: ['plugin.php'],
				overwrite: true,
				replacements: [
					{
						from: /TFS_FORMS_STYLER_VERSION', '.*?'/g,
						to: "TFS_FORMS_STYLER_VERSION', '<%= pkg.version %>'",
					},
				],
			},

			plugin_main: {
				src: ['cf7-styler.php'],
				overwrite: true,
				replacements: [
					{
						from: /Version: \bv?(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[\da-z-A-Z-]+(?:\.[\da-z-A-Z-]+)*)?(?:\+[\da-z-A-Z-]+(?:\.[\da-z-A-Z-]+)*)?\b/g,
						to: 'Version: <%= pkg.version %>',
					},
				],
			},
		},

		compress: {
			main: {
				options: {
					archive: 'torque-forms-styler-pro-' + pkg.version + '.zip',
					mode: 'zip',
					level: 5,
				},
				files: [
					{
						expand: true,
						cwd: 'package/',
						src: ['torque-forms-styler-pro/**'],
						dest: '/',
					},
				],
			},
		},

		clean: {
			main: ['package'],
			zip: ['*.zip'],
		},
	});

	// Load grunt tasks
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-clean');

	/* Version Bump Task */
	grunt.loadNpmTasks('grunt-bumpup');
	grunt.loadNpmTasks('grunt-text-replace');

	// Version Bump `grunt bump-version --ver=<version-number>`
	grunt.registerTask('bump-version', function () {
		let newVersion = grunt.option('ver');

		if (newVersion) {
			newVersion = newVersion ? newVersion : 'patch';

			grunt.task.run('bumpup:' + newVersion);
			grunt.task.run('replace:plugin_const');
			grunt.task.run('replace:plugin_main');
		}
	});

	grunt.registerTask('package', [
		'clean:zip',
		'replace-platform',
		'copy:main',
		'compress:main',
		'clean:main',
	]);

	grunt.registerTask('action-package', ['clean:main', 'copy:main']);
};
