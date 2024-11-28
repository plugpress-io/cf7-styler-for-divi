const wpTextdomain = require('wp-textdomain');

wpTextdomain(process.argv[2], {
    domain: 'form-styler-for-divi',
    fix: true,
});
