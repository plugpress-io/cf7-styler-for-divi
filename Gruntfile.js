module.exports = function (grunt) {
	'use strict';

	const pkg = grunt.file.readJSON('package.json');

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
		'!.claude/**',
		'!**/*.LICENSE.txt',
	];

	const wp_src = ['**', ...commonExcludes];
	const pro_src = ['**', ...commonExcludes, '!cf7-styler.php'];

	grunt.initConfig({
		copy: {
			wp: {
				options: { mode: true },
				src: wp_src,
				dest: 'package/cf7-styler-for-divi/',
			},
			pro: {
				options: { mode: true },
				src: pro_src,
				dest: 'package/cf7-mate-pro/',
			},
		},

		bumpup: {
			options: { updateProps: { pkg: 'package.json' } },
			file: 'package.json',
		},

		replace: {
			plugin_const: {
				src: ['cf7-styler.php'],
				overwrite: true,
				replacements: [{ from: /CF7M_VERSION', '.*?'/g, to: "CF7M_VERSION', '<%= pkg.version %>'" }],
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
			// Strip premium-only helper functions from freemius.php in the free wp.org build.
			// These are only called by includes/pro/ which is excluded from the free package.
			freemius_free: {
				src: ['package/cf7-styler-for-divi/freemius.php'],
				overwrite: true,
				replacements: [
					{ from: /\nfunction cf7m_can_use_premium\(\)[\s\S]*?^}\n/m, to: '' },
					{ from: /\nfunction cf7m_is_premium\(\)[\s\S]*?^}\n/m, to: '' },
				],
			},
			// Patch freemius.php inside the pro package: is_premium=>false → true.
			freemius_premium: {
				src: ['package/cf7-mate-pro/freemius.php'],
				overwrite: true,
				replacements: [
					{ from: "'is_premium'          => false,", to: "'is_premium'          => true," },
				],
			},
		},

		compress: {
			wp: {
				options: { archive: `cf7-styler-for-divi-${pkg.version}.zip`, mode: 'zip', level: 5 },
				files: [{ expand: true, cwd: 'package/', src: ['cf7-styler-for-divi/**'], dest: '/' }],
			},
			pro: {
				options: { archive: `cf7-mate-pro-${pkg.proVersion || pkg.version}.zip`, mode: 'zip', level: 5 },
				files: [{ expand: true, cwd: 'package/', src: ['cf7-mate-pro/**'], dest: '/' }],
			},
		},

		clean: {
			main: ['package'],
			zip: ['*.zip'],
		},
	});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-compress');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-bumpup');
	grunt.loadNpmTasks('grunt-text-replace');

	grunt.registerTask('bump-version', function () {
		const ver = grunt.option('ver');
		if (ver) {
			grunt.task.run(['bumpup:' + (ver || 'patch'), 'replace:plugin_const', 'replace:plugin_main']);
		}
	});

	grunt.registerTask('write_pro_main', function () {
		const pkg = grunt.config('pkg') || grunt.file.readJSON('package.json');
		const v = pkg.proVersion || pkg.version || '1.0.0';
		const content = `<?php
/*
Plugin Name: CF7 Mate Pro
Plugin URI: https://cf7mate.com
Description: Pro features for CF7 Mate for Divi.
Version: ${v}
Author: PlugPress
Author URI: https://plugpress.io
License: GPL2
License URI: https://www.gnu.org/licenses/gpl-2.0.html
Text Domain: cf7-styler-for-divi
Domain Path: /languages

@fs_premium_only /includes/pro/, /assets/pro/
*/

if (!defined('ABSPATH')) exit;

define('CF7M_VERSION', '${v}');
define('CF7M_BASENAME', plugin_basename(__FILE__));
define('CF7M_BASENAME_DIR', plugin_basename(__DIR__));
define('CF7M_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('CF7M_PLUGIN_URL', plugin_dir_url(__FILE__));
define('CF7M_MODULES_JSON_PATH', CF7M_PLUGIN_PATH . 'modules-json/');
require_once CF7M_PLUGIN_PATH . 'freemius.php';
require_once CF7M_PLUGIN_PATH . 'includes/plugin.php';
`;
		grunt.file.write('package/cf7-mate-pro/cf7-mate-pro.php', content);
		grunt.log.writeln('Written package/cf7-mate-pro/cf7-mate-pro.php (v' + v + ')');
	});

	// WP repo zip (free, with Freemius)
	grunt.registerTask('package:wp', ['clean:main', 'clean:zip', 'copy:wp', 'replace:freemius_free', 'compress:wp', 'clean:main']);

	// Pro zip (cf7-mate-pro.php, for Freemius deploy)
	grunt.registerTask('package:pro', ['clean:main', 'clean:zip', 'copy:pro', 'replace:freemius_premium', 'write_pro_main', 'compress:pro', 'clean:main']);
};
