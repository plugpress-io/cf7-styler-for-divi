/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/pro/phone-number/countries.js"
/*!*******************************************!*\
  !*** ./src/pro/phone-number/countries.js ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   COUNTRIES: () => (/* binding */ COUNTRIES),\n/* harmony export */   flagEmoji: () => (/* binding */ flagEmoji)\n/* harmony export */ });\nfunction _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(r, a) { if (r) { if (\"string\" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return \"Object\" === t && r.constructor && (t = r.constructor.name), \"Map\" === t || \"Set\" === t ? Array.from(r) : \"Arguments\" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }\nfunction _iterableToArray(r) { if (\"undefined\" != typeof Symbol && null != r[Symbol.iterator] || null != r[\"@@iterator\"]) return Array.from(r); }\nfunction _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }\nfunction _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }\n/** Country list: iso2, name, dial. Sorted A–Z by name for dropdown. */\nvar COUNTRY_LIST = [{\n  iso2: 'AF',\n  name: 'Afghanistan',\n  dial: '+93'\n}, {\n  iso2: 'AL',\n  name: 'Albania',\n  dial: '+355'\n}, {\n  iso2: 'DZ',\n  name: 'Algeria',\n  dial: '+213'\n}, {\n  iso2: 'AR',\n  name: 'Argentina',\n  dial: '+54'\n}, {\n  iso2: 'AU',\n  name: 'Australia',\n  dial: '+61'\n}, {\n  iso2: 'AT',\n  name: 'Austria',\n  dial: '+43'\n}, {\n  iso2: 'BD',\n  name: 'Bangladesh',\n  dial: '+880'\n}, {\n  iso2: 'BE',\n  name: 'Belgium',\n  dial: '+32'\n}, {\n  iso2: 'BR',\n  name: 'Brazil',\n  dial: '+55'\n}, {\n  iso2: 'CA',\n  name: 'Canada',\n  dial: '+1'\n}, {\n  iso2: 'CL',\n  name: 'Chile',\n  dial: '+56'\n}, {\n  iso2: 'CN',\n  name: 'China',\n  dial: '+86'\n}, {\n  iso2: 'CO',\n  name: 'Colombia',\n  dial: '+57'\n}, {\n  iso2: 'CU',\n  name: 'Cuba',\n  dial: '+53'\n}, {\n  iso2: 'CZ',\n  name: 'Czech Republic',\n  dial: '+420'\n}, {\n  iso2: 'DK',\n  name: 'Denmark',\n  dial: '+45'\n}, {\n  iso2: 'DO',\n  name: 'Dominican Republic',\n  dial: '+1'\n}, {\n  iso2: 'EC',\n  name: 'Ecuador',\n  dial: '+593'\n}, {\n  iso2: 'EG',\n  name: 'Egypt',\n  dial: '+20'\n}, {\n  iso2: 'ES',\n  name: 'Spain',\n  dial: '+34'\n}, {\n  iso2: 'FI',\n  name: 'Finland',\n  dial: '+358'\n}, {\n  iso2: 'FR',\n  name: 'France',\n  dial: '+33'\n}, {\n  iso2: 'DE',\n  name: 'Germany',\n  dial: '+49'\n}, {\n  iso2: 'GR',\n  name: 'Greece',\n  dial: '+30'\n}, {\n  iso2: 'GT',\n  name: 'Guatemala',\n  dial: '+502'\n}, {\n  iso2: 'HK',\n  name: 'Hong Kong',\n  dial: '+852'\n}, {\n  iso2: 'HU',\n  name: 'Hungary',\n  dial: '+36'\n}, {\n  iso2: 'IN',\n  name: 'India',\n  dial: '+91'\n}, {\n  iso2: 'ID',\n  name: 'Indonesia',\n  dial: '+62'\n}, {\n  iso2: 'IE',\n  name: 'Ireland',\n  dial: '+353'\n}, {\n  iso2: 'IL',\n  name: 'Israel',\n  dial: '+972'\n}, {\n  iso2: 'IT',\n  name: 'Italy',\n  dial: '+39'\n}, {\n  iso2: 'JM',\n  name: 'Jamaica',\n  dial: '+1'\n}, {\n  iso2: 'JP',\n  name: 'Japan',\n  dial: '+81'\n}, {\n  iso2: 'KR',\n  name: 'South Korea',\n  dial: '+82'\n}, {\n  iso2: 'MY',\n  name: 'Malaysia',\n  dial: '+60'\n}, {\n  iso2: 'MX',\n  name: 'Mexico',\n  dial: '+52'\n}, {\n  iso2: 'NL',\n  name: 'Netherlands',\n  dial: '+31'\n}, {\n  iso2: 'NZ',\n  name: 'New Zealand',\n  dial: '+64'\n}, {\n  iso2: 'NG',\n  name: 'Nigeria',\n  dial: '+234'\n}, {\n  iso2: 'NO',\n  name: 'Norway',\n  dial: '+47'\n}, {\n  iso2: 'PK',\n  name: 'Pakistan',\n  dial: '+92'\n}, {\n  iso2: 'PE',\n  name: 'Peru',\n  dial: '+51'\n}, {\n  iso2: 'PH',\n  name: 'Philippines',\n  dial: '+63'\n}, {\n  iso2: 'PL',\n  name: 'Poland',\n  dial: '+48'\n}, {\n  iso2: 'PT',\n  name: 'Portugal',\n  dial: '+351'\n}, {\n  iso2: 'PR',\n  name: 'Puerto Rico',\n  dial: '+1'\n}, {\n  iso2: 'RO',\n  name: 'Romania',\n  dial: '+40'\n}, {\n  iso2: 'RU',\n  name: 'Russia',\n  dial: '+7'\n}, {\n  iso2: 'SA',\n  name: 'Saudi Arabia',\n  dial: '+966'\n}, {\n  iso2: 'SG',\n  name: 'Singapore',\n  dial: '+65'\n}, {\n  iso2: 'ZA',\n  name: 'South Africa',\n  dial: '+27'\n}, {\n  iso2: 'SE',\n  name: 'Sweden',\n  dial: '+46'\n}, {\n  iso2: 'CH',\n  name: 'Switzerland',\n  dial: '+41'\n}, {\n  iso2: 'TW',\n  name: 'Taiwan',\n  dial: '+886'\n}, {\n  iso2: 'TH',\n  name: 'Thailand',\n  dial: '+66'\n}, {\n  iso2: 'TR',\n  name: 'Turkey',\n  dial: '+90'\n}, {\n  iso2: 'UA',\n  name: 'Ukraine',\n  dial: '+380'\n}, {\n  iso2: 'AE',\n  name: 'United Arab Emirates',\n  dial: '+971'\n}, {\n  iso2: 'GB',\n  name: 'United Kingdom',\n  dial: '+44'\n}, {\n  iso2: 'US',\n  name: 'United States',\n  dial: '+1'\n}, {\n  iso2: 'UY',\n  name: 'Uruguay',\n  dial: '+598'\n}, {\n  iso2: 'VE',\n  name: 'Venezuela',\n  dial: '+58'\n}, {\n  iso2: 'VN',\n  name: 'Vietnam',\n  dial: '+84'\n}];\nvar COUNTRIES = COUNTRY_LIST;\nfunction flagEmoji(iso2) {\n  if (!iso2 || iso2.length !== 2) return '';\n  var a = 0x1f1e6 - 65;\n  return String.fromCodePoint.apply(String, _toConsumableArray(_toConsumableArray(iso2.toUpperCase()).map(function (c) {\n    return a + c.charCodeAt(0);\n  })));\n}\n\n//# sourceURL=webpack://cf7-mate/./src/pro/phone-number/countries.js?\n}");

/***/ },

/***/ "./src/pro/phone-number/index.js"
/*!***************************************!*\
  !*** ./src/pro/phone-number/index.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./style.scss */ \"./src/pro/phone-number/style.scss\");\n/* harmony import */ var _countries__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./countries */ \"./src/pro/phone-number/countries.js\");\nfunction _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }\nfunction _nonIterableSpread() { throw new TypeError(\"Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.\"); }\nfunction _unsupportedIterableToArray(r, a) { if (r) { if (\"string\" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return \"Object\" === t && r.constructor && (t = r.constructor.name), \"Map\" === t || \"Set\" === t ? Array.from(r) : \"Arguments\" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }\nfunction _iterableToArray(r) { if (\"undefined\" != typeof Symbol && null != r[Symbol.iterator] || null != r[\"@@iterator\"]) return Array.from(r); }\nfunction _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }\nfunction _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }\n\n\nvar DEFAULT_ISO2 = 'US';\nfunction findCountry(iso2) {\n  return _countries__WEBPACK_IMPORTED_MODULE_1__.COUNTRIES.find(function (c) {\n    return c.iso2 === iso2;\n  }) || _countries__WEBPACK_IMPORTED_MODULE_1__.COUNTRIES.find(function (c) {\n    return c.iso2 === DEFAULT_ISO2;\n  });\n}\nfunction initOne(root) {\n  if (root.dataset.cf7mPhoneInit) return;\n  root.dataset.cf7mPhoneInit = '1';\n  var wrap = root.querySelector('.cf7m-phone-wrap');\n  var trigger = root.querySelector('.cf7m-phone-trigger');\n  var visibleInput = root.querySelector('.cf7m-phone-input');\n  var hiddenInput = root.querySelector('.cf7m-phone-hidden');\n  if (!wrap || !trigger || !visibleInput || !hiddenInput) return;\n  var currentIso2 = (hiddenInput.dataset.defaultCountry || DEFAULT_ISO2).toUpperCase();\n  var dropdown = null;\n  var searchInput = null;\n  var listEl = null;\n  function getCurrent() {\n    return findCountry(currentIso2);\n  }\n  function setCountry(iso2) {\n    var c = findCountry(iso2);\n    if (!c) return;\n    currentIso2 = c.iso2;\n    trigger.querySelector('.cf7m-phone-flag').textContent = (0,_countries__WEBPACK_IMPORTED_MODULE_1__.flagEmoji)(c.iso2);\n    trigger.querySelector('.cf7m-phone-dial').textContent = c.dial;\n    syncHidden();\n    closeDropdown();\n  }\n  function syncHidden() {\n    var local = (visibleInput.value || '').trim().replace(/\\s/g, '');\n    var prefix = getCurrent().dial;\n    hiddenInput.value = local ? prefix + ' ' + local : prefix;\n  }\n  function openDropdown() {\n    trigger.setAttribute('aria-expanded', 'true');\n    if (dropdown) {\n      dropdown.classList.remove('cf7m-phone-dropdown--hidden');\n      if (searchInput) {\n        searchInput.value = '';\n        searchInput.focus();\n      }\n      renderList('');\n      return;\n    }\n    dropdown = document.createElement('div');\n    dropdown.className = 'cf7m-phone-dropdown';\n    dropdown.setAttribute('role', 'listbox');\n    var searchWrap = document.createElement('div');\n    searchWrap.className = 'cf7m-phone-search-wrap';\n    searchInput = document.createElement('input');\n    searchInput.type = 'text';\n    searchInput.className = 'cf7m-phone-search';\n    searchInput.placeholder = 'Search';\n    searchInput.setAttribute('aria-label', 'Search country');\n    searchWrap.appendChild(searchInput);\n    listEl = document.createElement('div');\n    listEl.className = 'cf7m-phone-list';\n    listEl.setAttribute('role', 'list');\n    dropdown.appendChild(searchWrap);\n    dropdown.appendChild(listEl);\n    var combo = root.querySelector('.cf7m-phone-combo');\n    if (combo) combo.appendChild(dropdown);\n    function renderList(q) {\n      var qn = (q || '').toLowerCase().trim();\n      var filtered = qn ? _countries__WEBPACK_IMPORTED_MODULE_1__.COUNTRIES.filter(function (c) {\n        return c.name.toLowerCase().includes(qn) || c.dial.includes(qn) || c.iso2.toLowerCase().includes(qn);\n      }) : _toConsumableArray(_countries__WEBPACK_IMPORTED_MODULE_1__.COUNTRIES);\n      listEl.innerHTML = '';\n      filtered.forEach(function (c) {\n        var opt = document.createElement('button');\n        opt.type = 'button';\n        opt.className = 'cf7m-phone-option' + (c.iso2 === currentIso2 ? ' cf7m-phone-option--selected' : '');\n        opt.setAttribute('role', 'option');\n        opt.dataset.iso2 = c.iso2;\n        opt.innerHTML = '<span class=\"cf7m-phone-option-flag\">' + (0,_countries__WEBPACK_IMPORTED_MODULE_1__.flagEmoji)(c.iso2) + '</span><span class=\"cf7m-phone-option-label\">' + escapeHtml(c.name) + '</span><span class=\"cf7m-phone-option-dial\">' + escapeHtml(c.dial) + '</span>';\n        opt.addEventListener('click', function () {\n          return setCountry(c.iso2);\n        });\n        listEl.appendChild(opt);\n      });\n    }\n    searchInput.addEventListener('input', function () {\n      return renderList(searchInput.value);\n    });\n    searchInput.addEventListener('keydown', function (e) {\n      if (e.key === 'Escape') closeDropdown();\n    });\n    renderList('');\n    dropdown.classList.remove('cf7m-phone-dropdown--hidden');\n    searchInput.focus();\n  }\n  function closeDropdown() {\n    trigger.setAttribute('aria-expanded', 'false');\n    if (dropdown) dropdown.classList.add('cf7m-phone-dropdown--hidden');\n  }\n  function toggleDropdown() {\n    var isHidden = !dropdown || dropdown.classList.contains('cf7m-phone-dropdown--hidden');\n    if (isHidden) openDropdown();else closeDropdown();\n  }\n  function escapeHtml(s) {\n    var div = document.createElement('div');\n    div.textContent = s;\n    return div.innerHTML;\n  }\n  trigger.addEventListener('click', function (e) {\n    e.preventDefault();\n    toggleDropdown();\n  });\n  visibleInput.addEventListener('input', syncHidden);\n  visibleInput.addEventListener('blur', syncHidden);\n  document.addEventListener('click', function (e) {\n    if (root.contains(e.target)) return;\n    closeDropdown();\n  });\n\n  // Initial display\n  var cur = getCurrent();\n  trigger.querySelector('.cf7m-phone-flag').textContent = (0,_countries__WEBPACK_IMPORTED_MODULE_1__.flagEmoji)(cur.iso2);\n  trigger.querySelector('.cf7m-phone-dial').textContent = cur.dial;\n  syncHidden();\n}\nfunction init() {\n  document.querySelectorAll('.cf7m-phone-number').forEach(initOne);\n}\nfunction onReady() {\n  init();\n  if (typeof window.jQuery !== 'undefined') {\n    window.jQuery(document).on('wpcf7mailsent wpcf7invalid wpcf7spam wpcf7mailfailed wpcf7submit', function () {\n      return setTimeout(init, 100);\n    });\n  }\n}\nif (document.readyState === 'loading') {\n  document.addEventListener('DOMContentLoaded', onReady);\n} else {\n  onReady();\n}\n\n//# sourceURL=webpack://cf7-mate/./src/pro/phone-number/index.js?\n}");

/***/ },

/***/ "./src/pro/phone-number/style.scss"
/*!*****************************************!*\
  !*** ./src/pro/phone-number/style.scss ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

eval("{__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://cf7-mate/./src/pro/phone-number/style.scss?\n}");

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Check if module exists (development only)
/******/ 		if (__webpack_modules__[moduleId] === undefined) {
/******/ 			var e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/pro/phone-number/index.js");
/******/ 	
/******/ })()
;