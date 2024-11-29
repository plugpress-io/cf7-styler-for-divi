(() => {
    document.addEventListener('DOMContentLoaded', function () {
        var notice = document.getElementById(dfsAdminNoticeData.notice_slug);
        if (notice) {
            notice.querySelector('.notice-dismiss').addEventListener('click', function () {
                var request = new XMLHttpRequest();
                request.open('POST', dfsAdminNoticeData.ajax_url, true);
                request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
                request.onreadystatechange = function () {
                    if (request.readyState === 4 && request.status === 200) {
                        const response = JSON.parse(request.responseText);
                        if (response.success === true) {
                            document.getElementById(dfsAdminNoticeData.notice_slug).style.display =
                                'none';

                            console.log(dfsAdminNoticeData.notice_slug);
                        }
                    }
                };

                request.send(
                    'action=dismiss_notice&notice=' +
                        encodeURIComponent(dfsAdminNoticeData.notice_slug) +
                        '&security=' +
                        encodeURIComponent(dfsAdminNoticeData.security)
                );
            });
        }
    });
})();
