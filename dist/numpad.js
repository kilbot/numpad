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
	  Behavior: __webpack_require__(1),
	  Service: __webpack_require__(2)
	};
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var Mn = __webpack_require__(3);
	var Modernizr = {
	  touch: true
	};
	var Radio = __webpack_require__(4);
	var $ = __webpack_require__(5);
	//var _ = require('lodash');

	module.exports = Mn.Behavior.extend({

	  ui: {
	    target: '*[data-numpad]'
	  },

	  events: {
	    'click @ui.target'       : 'numpadPopover'
	  },

	  onRender: function() {
	    if(Modernizr.touch) {
	      this.ui.target.each(function(){
	        if( $(this).is('input') ){
	          $(this).attr('readonly', true);
	        }
	      });
	    }
	  },

	  numpadPopover: function(e, arg){
	    var target = $(e.target);

	    // normally would init Popover view here via Popover Service
	    if(!arg){ return; }

	    var numpad = Radio.request('numpad', 'view', target.data());

	    var region = this.view.getRegion('n3').show(numpad);
	    this.listenTo(region.currentView, {
	      'all': function(e){
	        console.log(e);
	      }
	    });

	  }

	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Mn = __webpack_require__(3);
	var Radio = __webpack_require__(4);
	var View = __webpack_require__(6);
	var cashKeys = __webpack_require__(7);

	module.exports = Mn.Object.extend({

	  initialize: function(){
	    this.channel = Radio.channel('numpad');
	    this.channel.reply({
	      'view' : this.view
	    }, this);
	  },

	  view: function(options){
	    options = options || {};

	    if(options.numpad === 'discount'){
	      options.numpad = {
	        discount: {
	          keys: [5, 10, 20, 50]
	        }
	      };
	    }

	    if(options.numpad === 'cash'){
	      var attr = options.target.attr('name');
	      var total = options.model.get(attr);
	      options.numpad = {
	        amount: {
	          keys: cashKeys(total)
	        }
	      };
	    }

	    if(!options.numpad){
	      options.numpad = {
	        amount: {}
	      };
	    }

	    var view = new View(options);
	    return view;
	  }

	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Marionette;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Backbone.Radio;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = jQuery;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var Mn = __webpack_require__(3);
	var hbs = __webpack_require__(8);
	var tmpl = __webpack_require__(11);
	var accounting = __webpack_require__(9);

	module.exports = Mn.ItemView.extend({
	  template: hbs.compile(tmpl),

	  viewOptions: [
	    'numpad', 'label'
	  ],

	  initialize: function(options){
	    this.mergeOptions(options, this.viewOptions);
	  },

	  templateHelpers: function(){
	    var data = {
	      numpad   : this.getOption('numpad'),
	      label    : this.getOption('label'),
	      number   : accounting.settings.number,
	      currency : accounting.settings.currency,
	      buttons  : {
	        'return': 'return'
	      }
	    };

	    return data;
	  },

	  ui: {
	    keys: '.numpad-keys .btn'
	  },

	  events: {

	  }

	});

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(10);
	var accounting = __webpack_require__(9);

	// example denominations
	var denominations = {
	  name: 'US Dollars',
	  coins: [ 0.05, 0.1, 0.25, 0.5, 1 ],
	  notes: [ 1, 2, 5, 10, 20, 50, 100 ]
	};

	function round(num){
	  return parseFloat( accounting.toFixed(num, 2) );
	}

	function nearest(num, dem){
	  var n = Math.ceil(num / dem) * dem;
	  return round(n);
	}

	module.exports = function(amount){
	  var keys = [amount];

	  if(amount === 0) {
	    return denominations.notes.slice(-4);
	  }

	  // round for two coins
	  _.each( denominations.coins, function(coin) {
	    keys.push( nearest(amount, coin) );
	  });

	  // removes smaller amounts, eg: 9.96: [9.97, 10, 20, 50], removes 9.97
	  if(round(keys[1] - keys[0]) === denominations.coins[0]){
	    keys.splice(1, 1);
	  }

	  keys = _.uniq(keys).slice(0, 3);

	  // round for two notes
	  _.each( denominations.notes, function(note) {
	    keys.push( nearest(amount, note) );
	  });

	  return _.uniq(keys).slice(1, 5);
	};

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Handlebars;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = accounting;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = _;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "<div class=\"numpad\">\n  <div class=\"numpad-header\">\n    <strong class=\"title\">{{label}}</strong>\n\n  {{#if numpad.amount}}\n    <div class=\"input-group\">\n      <span class=\"input-group-addon\">{{{currency.symbol}}}</span>\n      <input type=\"text\" name=\"{{name}}\" class=\"form-control autogrow\">\n    </div>\n  {{/if}}\n\n  {{#if numpad.discount}}\n    <div class=\"input-group input-toggle\">\n      <span class=\"input-group-btn\"><a href=\"#\" data-modifier=\"value\">{{{currency.symbol}}}</a></span>\n      <input type=\"text\" name=\"{{name}}\" class=\"form-control autogrow\">\n      <input type=\"text\" name=\"percentage\" class=\"form-control autogrow\">\n      <span class=\"input-group-btn\"><a href=\"#\" data-modifier=\"percentage\">%</a></span>\n    </div>\n  {{/if}}\n\n  </div>\n\n  <div class=\"numpad-keys\">\n    <div class=\"keys common\">\n      <div class=\"row\">\n        <a href=\"#\" data-key=\"1\" class=\"btn\">1</a>\n        <a href=\"#\" data-key=\"2\" class=\"btn\">2</a>\n        <a href=\"#\" data-key=\"3\" class=\"btn\">3</a>\n      </div>\n      <div class=\"row\">\n        <a href=\"#\" data-key=\"4\" class=\"btn\">4</a>\n        <a href=\"#\" data-key=\"5\" class=\"btn\">5</a>\n        <a href=\"#\" data-key=\"6\" class=\"btn\">6</a>\n      </div>\n      <div class=\"row\">\n        <a href=\"#\" data-key=\"7\" class=\"btn\">7</a>\n        <a href=\"#\" data-key=\"8\" class=\"btn\">8</a>\n        <a href=\"#\" data-key=\"9\" class=\"btn\">9</a>\n      </div>\n      <div class=\"row\">\n        <a href=\"#\" data-key=\"0\" class=\"btn\">0</a>\n        <a href=\"#\" data-key=\"00\" class=\"btn\">00</a>\n        <a href=\"#\" data-key=\".\" class=\"btn decimal\">{{{currency.decimal}}}</a>\n      </div>\n    </div>\n    <div class=\"keys common extra-keys\">\n      <a href=\"#\" data-key=\"del\" class=\"btn\"><i class=\"icon icon-delete\"><span>del</span></i></a>\n      <a href=\"#\" data-key=\"+/-\" class=\"btn\">+/-</a>\n      <a href=\"#\" data-key=\"ret\" class=\"btn return\">{{buttons.return}}</a>\n    </div>\n\n    {{#if numpad.discount}}\n      {{#if numpad.discount.keys}}\n      <div class=\"keys extra-keys discount\">\n        {{#each numpad.discount.keys}}\n          <a href=\"#\" data-key=\"{{this}}\" class=\"btn\">{{this}}%</a>\n        {{/each}}\n      </div>\n      {{/if}}\n    {{/if}}\n\n    {{#if numpad.amount}}\n      {{#if numpad.amount.keys}}\n      <div class=\"keys extra-keys cash\">\n        {{#each numpad.amount.keys}}\n          <a href=\"#\" data-key=\"{{this}}\" class=\"btn\">{{this}}</a>\n        {{/each}}\n      </div>\n      {{/if}}\n    {{/if}}\n\n  </div>\n</div>"

/***/ }
/******/ ]);