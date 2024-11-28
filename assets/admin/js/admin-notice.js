/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/admin-notice.js":
/*!*****************************!*\
  !*** ./src/admin-notice.js ***!
  \*****************************/
/***/ (() => {

eval("(function () {\n  document.addEventListener('DOMContentLoaded', function () {\n    var notice = document.getElementById(adminNoticeData.notice_slug);\n    if (notice) {\n      notice.querySelector('.notice-dismiss').addEventListener('click', function () {\n        var request = new XMLHttpRequest();\n        request.open('POST', adminNoticeData.ajax_url, true);\n        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');\n        request.onreadystatechange = function () {\n          if (request.readyState === 4 && request.status === 200) {\n            JSON.parse(request.responseText);\n          }\n        };\n        request.send('action=dismiss_admin_notice&notice=' + encodeURIComponent(adminNoticeData.notice_slug) + '&security=' + encodeURIComponent(adminNoticeData.security));\n      });\n    }\n  });\n})();//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJkb2N1bWVudCIsImFkZEV2ZW50TGlzdGVuZXIiLCJub3RpY2UiLCJnZXRFbGVtZW50QnlJZCIsImFkbWluTm90aWNlRGF0YSIsIm5vdGljZV9zbHVnIiwicXVlcnlTZWxlY3RvciIsInJlcXVlc3QiLCJYTUxIdHRwUmVxdWVzdCIsIm9wZW4iLCJhamF4X3VybCIsInNldFJlcXVlc3RIZWFkZXIiLCJvbnJlYWR5c3RhdGVjaGFuZ2UiLCJyZWFkeVN0YXRlIiwic3RhdHVzIiwiSlNPTiIsInBhcnNlIiwicmVzcG9uc2VUZXh0Iiwic2VuZCIsImVuY29kZVVSSUNvbXBvbmVudCIsInNlY3VyaXR5Il0sInNvdXJjZXMiOlsid2VicGFjazovL2Zvcm0tc3R5bGVyLWZvci1kaXZpLy4vc3JjL2FkbWluLW5vdGljZS5qcz82M2NhIl0sInNvdXJjZXNDb250ZW50IjpbIigoKSA9PiB7XG4gICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIG5vdGljZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGFkbWluTm90aWNlRGF0YS5ub3RpY2Vfc2x1Zyk7XG4gICAgICAgIGlmIChub3RpY2UpIHtcbiAgICAgICAgICAgIG5vdGljZS5xdWVyeVNlbGVjdG9yKCcubm90aWNlLWRpc21pc3MnKS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgcmVxdWVzdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgICAgICAgIHJlcXVlc3Qub3BlbignUE9TVCcsIGFkbWluTm90aWNlRGF0YS5hamF4X3VybCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XG4gICAgICAgICAgICAgICAgcmVxdWVzdC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXF1ZXN0LnJlYWR5U3RhdGUgPT09IDQgJiYgcmVxdWVzdC5zdGF0dXMgPT09IDIwMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgSlNPTi5wYXJzZShyZXF1ZXN0LnJlc3BvbnNlVGV4dCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJlcXVlc3Quc2VuZChcbiAgICAgICAgICAgICAgICAgICAgJ2FjdGlvbj1kaXNtaXNzX2FkbWluX25vdGljZSZub3RpY2U9JyArXG4gICAgICAgICAgICAgICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoYWRtaW5Ob3RpY2VEYXRhLm5vdGljZV9zbHVnKSArXG4gICAgICAgICAgICAgICAgICAgICAgICAnJnNlY3VyaXR5PScgK1xuICAgICAgICAgICAgICAgICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KGFkbWluTm90aWNlRGF0YS5zZWN1cml0eSlcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbn0pKCk7XG4iXSwibWFwcGluZ3MiOiJBQUFBLENBQUMsWUFBTTtFQUNIQSxRQUFRLENBQUNDLGdCQUFnQixDQUFDLGtCQUFrQixFQUFFLFlBQVk7SUFDdEQsSUFBSUMsTUFBTSxHQUFHRixRQUFRLENBQUNHLGNBQWMsQ0FBQ0MsZUFBZSxDQUFDQyxXQUFXLENBQUM7SUFDakUsSUFBSUgsTUFBTSxFQUFFO01BQ1JBLE1BQU0sQ0FBQ0ksYUFBYSxDQUFDLGlCQUFpQixDQUFDLENBQUNMLGdCQUFnQixDQUFDLE9BQU8sRUFBRSxZQUFZO1FBQzFFLElBQUlNLE9BQU8sR0FBRyxJQUFJQyxjQUFjLENBQUMsQ0FBQztRQUNsQ0QsT0FBTyxDQUFDRSxJQUFJLENBQUMsTUFBTSxFQUFFTCxlQUFlLENBQUNNLFFBQVEsRUFBRSxJQUFJLENBQUM7UUFDcERILE9BQU8sQ0FBQ0ksZ0JBQWdCLENBQUMsY0FBYyxFQUFFLG1DQUFtQyxDQUFDO1FBQzdFSixPQUFPLENBQUNLLGtCQUFrQixHQUFHLFlBQVk7VUFDckMsSUFBSUwsT0FBTyxDQUFDTSxVQUFVLEtBQUssQ0FBQyxJQUFJTixPQUFPLENBQUNPLE1BQU0sS0FBSyxHQUFHLEVBQUU7WUFDcERDLElBQUksQ0FBQ0MsS0FBSyxDQUFDVCxPQUFPLENBQUNVLFlBQVksQ0FBQztVQUNwQztRQUNKLENBQUM7UUFDRFYsT0FBTyxDQUFDVyxJQUFJLENBQ1IscUNBQXFDLEdBQ2pDQyxrQkFBa0IsQ0FBQ2YsZUFBZSxDQUFDQyxXQUFXLENBQUMsR0FDL0MsWUFBWSxHQUNaYyxrQkFBa0IsQ0FBQ2YsZUFBZSxDQUFDZ0IsUUFBUSxDQUNuRCxDQUFDO01BQ0wsQ0FBQyxDQUFDO0lBQ047RUFDSixDQUFDLENBQUM7QUFDTixDQUFDLEVBQUUsQ0FBQyIsImZpbGUiOiIuL3NyYy9hZG1pbi1ub3RpY2UuanMiLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./src/admin-notice.js\n");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval-source-map devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./src/admin-notice.js"]();
/******/ 	
/******/ })()
;