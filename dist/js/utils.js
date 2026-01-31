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

/***/ "./src/utils/index.js"
/*!****************************!*\
  !*** ./src/utils/index.js ***!
  \****************************/
() {

eval("{jQuery(function ($) {\n  var gridShortcodeTypes = ['dipe_row',\n  // Full width container\n  'dipe_one',\n  // Single column (12/12)\n  'dipe_one_half',\n  // Half width (6/12)\n  'dipe_one_third',\n  // One third (4/12)\n  'dipe_one_fourth',\n  // One fourth (3/12)\n  'dipe_two_third',\n  // Two thirds (8/12)\n  'dipe_three_fourth' // Three fourths (9/12)\n  ];\n  $('#tag-generator-list button').on('click', function (e) {\n    e.preventDefault();\n    var target = $(this).data('target');\n    var shortcodeType = extractShortcodeType('target', target);\n    if (shortcodeType.startsWith('dipe')) {\n      $(\"#\".concat(target)).dialog({\n        modal: true,\n        dialogClass: 'wp-dialog',\n        width: 'auto',\n        title: $(this).text()\n      });\n    }\n  });\n  window.insertGridShortcode = function (shortcodeType) {\n    insertGridLayoutShortcode(shortcodeType);\n    $(\"#tag-generator-panel-\".concat(shortcodeType)).dialog('close');\n  };\n  function extractShortcodeType(paramName, target) {\n    if (!target) {\n      return '';\n    }\n    return target.replace('tag-generator-panel-', '');\n  }\n  function insertGridLayoutShortcode(shortcodeType) {\n    var $formEditor = $('#wpcf7-form');\n    var formElement = $formEditor[0];\n    var shortcodeOpen = \"[\".concat(shortcodeType, \"]\");\n    var shortcodeClose = \"[/\".concat(shortcodeType, \"]\");\n    var cursorStart = formElement.selectionStart;\n    var cursorEnd = formElement.selectionEnd;\n    var currentContent = $formEditor.val();\n    var updatedContent = currentContent.slice(0, cursorStart) + shortcodeOpen + currentContent.slice(cursorStart, cursorEnd) + shortcodeClose + currentContent.slice(cursorEnd);\n    $formEditor.val(updatedContent);\n  }\n});\n\n//# sourceURL=webpack://cf7-styler-for-divi/./src/utils/index.js?\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/utils/index.js"]();
/******/ 	
/******/ })()
;