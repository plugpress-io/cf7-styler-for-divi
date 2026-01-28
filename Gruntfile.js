module.exports = function (grunt) {
	'use strict';

	// Configuration
	const platform = grunt.option('platform') || 'et';
	const pkg = grunt.file.readJSON('package.json');

	// Common exclude patterns
	const commonExcludes = [
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
		'!webpack.config.js',
		'!.cursorrules',
		'!docs/**',
	];

	// Source files config
	const et_src = [
		'**',
		...commonExcludes,
		'!vendor/freemius/**',
		'!freemius.php',
	];
	const fs_src = ['**', ...commonExcludes];

	grunt.initConfig({
		// Copy task
		copy: {
			main: {
				options: { mode: true },
				src: platform === 'fs' ? fs_src : et_src,
				dest: 'package/cf7-styler-for-divi/',
			},
		},

		// Version bump task
		bumpup: {
			options: {
				updateProps: { pkg: 'package.json' },
			},
			file: 'package.json',
		},

		// Text replacement tasks
		replace: {
			plugin_const: {
				src: ['cf7-styler.php'],
				overwrite: true,
				replacements: [
					{
						from: /DCS_VERSION', '.*?'/g,
						to: "DCS_VERSION', '<%= pkg.version %>'",
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

		// Compression task
		compress: {
			main: {
				options: {
					archive: `cf7-styler-for-divi-${pkg.version}.zip`,
					mode: 'zip',
					level: 5,
				},
				files: [
					{
						expand: true,
						cwd: 'package/',
						src: [`cf7-styler-for-divi/**`],
						dest: '/',
					},
				],
			},
		},

		// Cleanup tasks
		clean: {
			main: ['package'],
			zip: ['*.zip'],
		},
	});

	// Load NPM tasks
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-bumpup');
	grunt.loadNpmTasks('grunt-text-replace');

	// Version Bump Task
	grunt.registerTask('bump-version', function () {
		const newVersion = grunt.option('ver');
		if (newVersion) {
			grunt.task.run([
				`bumpup:${newVersion || 'patch'}`,
				'replace:plugin_const',
				'replace:plugin_main',
			]);
		}
	});

	// Main Tasks
	grunt.registerTask('package', [
		'clean:zip',
		'copy:main',
		'compress:main',
		'clean:main',
	]);

	grunt.registerTask('action-package', ['clean:main', 'copy:main']);
};
