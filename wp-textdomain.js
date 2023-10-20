const wpTextdomain = require('wp-textdomain');

wpTextdomain(process.argv[2], {
    domain: 'torque-forms-styler',
    fix: true,
});
