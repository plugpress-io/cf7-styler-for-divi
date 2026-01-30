module.exports = function (grunt) {
	'use strict';

	/**
	 * Freemius Deployment Model:
	 * - Use `grunt package --platform=fs` for Freemius deployment
	 * - Freemius auto-strips files/folders with __premium_only suffix
	 * - Free version: Deployed to WordPress.org (premium code removed)
	 * - Premium version: Delivered via Freemius to paying customers
	 *
	 * @see https://freemius.com/help/documentation/wordpress-sdk/software-licensing/
	 */

	// Configuration
	const platform = grunt.option('platform') || 'et';
	const pkg = grunt.file.readJSON('package.json');

	// Common exclude patterns (for all builds)
	const commonExcludes = [
		'!node_modules/**',
		'!build/**',
		'!css/sourcemap/**',
		'!.git/**',
		'!.github/**',
		'!.wordpress-org/**',
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
		'!.gitattributes',
		'!.distignore',
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
		'!webpack.divi5.config.js',
		'!.cursorrules',
		'!docs/**',
	];

	// Source files config
	// ET (Elegant Themes): Without Freemius SDK
	const et_src = [
		'**',
		...commonExcludes,
		'!vendor/freemius/**',
		'!freemius.php',
	];
	// FS (Freemius): Full plugin with SDK and premium features
	// Freemius deployment system will auto-strip __premium_only files for free version
	const fs_src = ['**', ...commonExcludes];
	// Pro package: same as fs but folder cf7-mate-pro, exclude free main file (cf7-styler.php)
	const pro_src = ['**', ...commonExcludes, '!cf7-styler.php'];

	grunt.initConfig({
		// Copy task
		copy: {
			main: {
				options: { mode: true },
				src: platform === 'fs' ? fs_src : et_src,
				dest: 'package/cf7-styler-for-divi/',
			},
			pro: {
				options: { mode: true },
				src: pro_src,
				dest: 'package/cf7-mate-pro/',
			},
		},

		// Version bump task
		bumpup: {
			options: {
				updateProps: { pkg: 'package.json' },
			},
			file: 'package.json',
		},

		// Text replacement tasks (free main file only; Pro main is generated in package)
		replace: {
			plugin_const: {
				src: ['cf7-styler.php'],
				overwrite: true,
				replacements: [
					{
						from: /CF7M_VERSION', '.*?'/g,
						to: "CF7M_VERSION', '<%= pkg.version %>'",
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
						src: ['cf7-styler-for-divi/**'],
						dest: '/',
					},
				],
			},
			pro: {
				options: {
					archive: `cf7-mate-pro-${pkg.version}.zip`,
					mode: 'zip',
					level: 5,
				},
				files: [
					{
						expand: true,
						cwd: 'package/',
						src: ['cf7-mate-pro/**'],
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

	// Generate Pro main file in package (same bootstrap as free, Pro headers).
	// Pro zip must have one main file: cf7-mate-pro.php (free main cf7-styler.php excluded).
	grunt.registerTask('write_pro_main', function () {
		const pkg = grunt.config('pkg') || grunt.file.readJSON('package.json');
		const version = pkg.version || '3.0.0';
		const content = `<?php
/*
Plugin Name: CF7 Mate Pro
Plugin URI: https://divipeople.com/cf7-mate
Description: Pro features for CF7 Mate for Divi.
Version: ${version}
Author: PlugPress
Author URI: https://divipeople.com
License: GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: cf7-styler-for-divi
Domain Path: /languages
*/

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit;
}

define('CF7M_VERSION', '${version}');
define('CF7M_BASENAME', plugin_basename(__FILE__));
define('CF7M_BASENAME_DIR', plugin_basename(__DIR__));
define('CF7M_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('CF7M_PLUGIN_URL', plugin_dir_url(__FILE__));
define('CF7M_MODULES_JSON_PATH', CF7M_PLUGIN_PATH . 'modules-json/');
define('CF7M_SELF_HOSTED_ACTIVE', 'true');

// Freemius
if ('true' === CF7M_SELF_HOSTED_ACTIVE) {
    require_once CF7M_PLUGIN_PATH . 'freemius.php';
}

require_once CF7M_PLUGIN_PATH . 'includes/plugin.php';
`;
		grunt.file.write('package/cf7-mate-pro/cf7-mate-pro.php', content);
		grunt.log.writeln('Written package/cf7-mate-pro/cf7-mate-pro.php (Version: ' + version + ')');
	});

	// Pro package: cf7-mate-pro.zip with cf7-mate-pro/cf7-mate-pro.php (no cf7-styler.php)
	grunt.registerTask('package:pro', [
		'clean:zip',
		'copy:pro',
		'write_pro_main',
		'compress:pro',
		'clean:main',
	]);

	grunt.registerTask('action-package', ['clean:main', 'copy:main']);
	grunt.registerTask('action-package:pro', ['clean:main', 'copy:pro']);
};
