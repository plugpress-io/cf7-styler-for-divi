<?php
$current = time();
if (mktime(0, 0, 0, 11, 23, 2023) <= $current && $current < mktime(0, 0, 0, 12, 24, 2023)) {
    if (get_option('tfs_bfcm_2023') != '1') {

        add_action('admin_notices', function () {
?>
            <div class="notice notice-info is-dismissible" data-tfsdismissable="tfs_bfcm_2023" style="display:grid;grid-template-columns: 100px auto;padding-top: 25px; padding-bottom: 22px;">
                <img alt="Divi Torque Pro" src="<?php echo esc_url('https://assets.divitorque.com/dashboard/dt-favicon.png'); ?>" width="74" height="74" style="grid-row: 1 / 4; align-self: center;justify-self: center">

                <h3 style="margin:0;">Don't miss out on our biggest sale of the year!</h3>

                <p style="margin:0 0 2px;">Get your <b>Divi Torque Pro plan</b> with <b> 50% OFF</b>! This limited time offer expires on November 29.</p>

                <p style="margin:0;">
                    <a class="button button-primary" href="https://divitorque.com/pricing/?coupon=BF2023&utm_source=wpfree&utm_medium=wp&utm_campaign=bf23" target="_blank">
                        Buy Now</a>
                    <a class="button button-dismiss" href="#">Dismiss</a>
                </p>

            </div>
        <?php
        });

        add_action('admin_footer', function () {
        ?>
            <script>
                (function() {
                    function ready(fn) {
                        if (document.readyState === "complete" || document.readyState === "interactive") {
                            fn();
                        } else {
                            document.addEventListener("DOMContentLoaded", fn);
                        }
                    }

                    function serialize(obj) {
                        return Object.keys(obj).reduce(function(a, k) {
                            a.push(k + '=' + encodeURIComponent(obj[k]));
                            return a;
                        }, []).join('&');
                    }

                    ready(function() {
                        setTimeout(function() {
                            const buttons = document.querySelectorAll("div[data-tfsdismissable] .notice-dismiss, div[data-tfsdismissable] .button-dismiss");
                            for (let i = 0; i < buttons.length; i++) {
                                buttons[i].addEventListener('click', function(e) {
                                    e.preventDefault();

                                    const http = new XMLHttpRequest();
                                    http.open('POST', ajaxurl, true);
                                    http.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");

                                    http.send(serialize({
                                        'action': 'tfs_dismiss_admin_notice',
                                        'nonce': <?php echo json_encode(wp_create_nonce('tfs-dismissible-notice')); ?>
                                    }));

                                    e.target.closest('.is-dismissible').remove();
                                });
                            }
                        }, 1000);
                    });
                })();
            </script>
<?php
        });

        add_action('wp_ajax_tfs_dismiss_admin_notice', function () {
            check_ajax_referer('tfs-dismissible-notice', 'nonce');

            update_option('tfs_bfcm_2023', '1');
            wp_die();
        });
    }
}
