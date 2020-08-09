const { src, dest, series } = require('gulp');
const zip                   = require('gulp-zip');
const replace               = require('gulp-replace');
const clean                 = require('gulp-clean');
const minifyCSS             = require('gulp-csso');
const minifyJS              = require('gulp-minify');
const concatCss             = require('gulp-concat-css');
const merge                 = require('merge-stream');

function cleanBuild() {
    return src('./build', {
    	read: false, 
    	allowEmpty: true
    }).pipe(clean());
}

function cleanZip() {
    return src('./wow-divi-carousel.zip', {
    	read: false, 
    	allowEmpty: true
    }).pipe(clean());
}

function makeBuild() {
    return src([
        './**/*.*',
        '!./wp_org/**/*.*',
        '!./build/**/*.*',
        '!./scripts/frontend.js',
        '!./includes/**/index.js',
        '!./includes/loader.js',
        '!./includes/**/**/*.jsx',
        '!./includes/**/**/*.css',
        '!./node_modules/**/*.*',
        '!./*.zip',
        '!./gulpfile.js',
        '!./README.md',
        '!./package.json',
        '!./asset-manifest.json',
        '!./package-lock.json',
    ]).pipe(dest('build/cf7-styler-for-divi/'));
}

function makeOrgCopy() {
    return src('./build/cf7-styler-for-divi/**/*.*')
        .pipe(dest('wp_org/trunk/'));
}

function makeZip() {
    return src('./build/**/*.*')
		.pipe(zip('cf7-styler-for-divi.zip'))
        .pipe(dest('./'))
}

exports.makeBuild   = makeBuild;
// exports.prodMode = prodMode;
exports.cleanBuild  = cleanBuild;
exports.cleanZip    = cleanZip;
exports.makeZip     = makeZip;
exports.makeOrgCopy = makeOrgCopy;
exports.default     = series(cleanBuild, cleanZip, makeBuild, makeZip, cleanBuild);
exports.wporg       = series(cleanBuild, makeBuild, makeOrgCopy, cleanBuild);
