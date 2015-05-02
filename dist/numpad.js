/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {global['Numpad'] = {
	  Service: __webpack_require__(1)
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Mn = __webpack_require__(2);
	var Radio = __webpack_require__(3);
	var View = __webpack_require__(4);

	module.exports = Mn.Object.extend({

	  initialize: function(){

	    this.channel = Radio.channel('numpad');

	    this.channel.reply({
	      'view' : this.view
	    }, this);

	  },

	  view: function(options){
	    var view = new View(options);
	    return view;
	  }

	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Marionette;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Backbone.Radio;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var Mn = __webpack_require__(2);
	var hbs = __webpack_require__(5);
	var tmpl = __webpack_require__(7);
	var accounting = __webpack_require__(6);

	module.exports = Mn.ItemView.extend({
	  template: hbs.compile(tmpl),

	  templateHelpers: function(){
	    var data = {};
	    data.label = 'Numpad';
	    data.number = accounting.settings.number;
	    data.currency = accounting.settings.currency;
	    data.buttons = {
	      'return': 'return'
	    };
	    return data;
	  }
	});

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Handlebars;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = accounting;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "<div class=\"numpad\">\n  <div class=\"numpad-header\">\n    <strong class=\"title\">{{label}}</strong>\n\n    <div class=\"input-group\">\n      <span class=\"input-group-addon\">{{{currency.symbol}}}</span>\n      <input type=\"text\" name=\"{{name}}\" class=\"form-control autogrow\">\n    </div>\n  </div>\n\n  <div class=\"numpad-keys\">\n    <div class=\"keys common\">\n      <div class=\"row\">\n        <a href=\"#\" data-key=\"1\" class=\"btn\">1</a>\n        <a href=\"#\" data-key=\"2\" class=\"btn\">2</a>\n        <a href=\"#\" data-key=\"3\" class=\"btn\">3</a>\n      </div>\n      <div class=\"row\">\n        <a href=\"#\" data-key=\"4\" class=\"btn\">4</a>\n        <a href=\"#\" data-key=\"5\" class=\"btn\">5</a>\n        <a href=\"#\" data-key=\"6\" class=\"btn\">6</a>\n      </div>\n      <div class=\"row\">\n        <a href=\"#\" data-key=\"7\" class=\"btn\">7</a>\n        <a href=\"#\" data-key=\"8\" class=\"btn\">8</a>\n        <a href=\"#\" data-key=\"9\" class=\"btn\">9</a>\n      </div>\n      <div class=\"row\">\n        <a href=\"#\" data-key=\"0\" class=\"btn\">0</a>\n        <a href=\"#\" data-key=\"00\" class=\"btn\">00</a>\n        <a href=\"#\" data-key=\".\" class=\"btn decimal\">{{{currency.decimal}}}</a>\n      </div>\n    </div>\n    <div class=\"keys common extra-keys\">\n      <a href=\"#\" data-key=\"del\" class=\"btn\"><i class=\"icon icon-delete\"><span>del</span></i></a>\n      <a href=\"#\" data-key=\"+/-\" class=\"btn\">+/-</a>\n      <a href=\"#\" data-key=\"ret\" class=\"btn return\">{{buttons.return}}</a>\n    </div>\n  </div>\n</div>"

/***/ }
/******/ ]);