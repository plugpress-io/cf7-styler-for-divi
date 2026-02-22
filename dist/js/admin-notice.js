/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/admin/admin-notice.js"
/*!***********************************!*\
  !*** ./src/admin/admin-notice.js ***!
  \***********************************/
() {

eval("{jQuery(document).ready(function ($) {\n  'use strict';\n\n  $(document).on('click', '.cf7m-admin-notice .notice-dismiss', function (e) {\n    e.preventDefault();\n    var $notice = $(this).closest('.cf7m-admin-notice');\n    var noticeId = $notice.attr('id');\n    var action = 'dcs_dismiss_pro_notice';\n    if (noticeId === 'dcs_review_notice') {\n      action = 'dcs_dismiss_review_notice';\n    }\n    $.ajax({\n      url: dcs_admin_notice.ajax_url,\n      type: 'POST',\n      data: {\n        action: action,\n        nonce: dcs_admin_notice.nonce,\n        notice_id: noticeId\n      },\n      success: function success(response) {\n        if (response.success) {\n          $notice.fadeOut(300, function () {\n            $(this).remove();\n          });\n        }\n      },\n      error: function error() {\n        $notice.fadeOut(300, function () {\n          $(this).remove();\n        });\n      }\n    });\n  });\n  $('.cf7m-admin-notice').each(function () {\n    var $notice = $(this);\n    $notice.css({\n      opacity: '0',\n      transform: 'translateY(-20px)'\n    }).animate({\n      opacity: '1'\n    }, 500).css({\n      transform: 'translateY(0)',\n      transition: 'transform 0.5s ease'\n    });\n  });\n  $('.cf7m-upgrade-button').hover(function () {\n    $(this).addClass('hover');\n  }, function () {\n    $(this).removeClass('hover');\n  });\n});\n\n//# sourceURL=webpack://cf7-mate/./src/admin/admin-notice.js?\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/admin/admin-notice.js"]();
/******/ 	
/******/ })()
;