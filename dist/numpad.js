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
	var _ = __webpack_require__(6);

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

	    var options = _.defaults( target.data(), {
	      value : this.view.model.get( target.attr('name') )
	    });

	    var numpad = Radio.request('numpad', 'view', options);

	    var region = this.view.getRegion('n3').show(numpad);
	    this.listenTo(region.currentView, 'input', function(value){
	      target.val(value).trigger('input');
	    });

	  }

	});

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var Mn = __webpack_require__(3);
	var Radio = __webpack_require__(4);
	var View = __webpack_require__(7);

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

	module.exports = _;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {var Mn = __webpack_require__(3);
	var hbs = __webpack_require__(8);
	var tmpl = __webpack_require__(13);
	var Model = __webpack_require__(9);
	var _ = __webpack_require__(6);
	var $ = __webpack_require__(5);
	var accounting = global['accounting'];

	// numpad header input btns
	// - could be improved if _.result allowed custom bind?
	var inputBtns = {
	  amount: function(){
	    return {
	      left: { addOn: this.symbol }
	    };
	  },
	  discount: function(){
	    return {
	      left: { btn: this.symbol },
	      right: { btn: '%' },
	      toggle: true
	    };
	  },
	  cash: function(){
	    return {
	      left: { addOn: this.symbol }
	    };
	  },
	  quantity: function(){
	    return {
	      left: { btn: '-' },
	      right: { btn: '+' }
	    };
	  }
	};

	// numpad extra keys
	// - could be improved if _.result allowed custom bind?
	var extraKeys = {
	  amount: function(){},
	  discount: function(){
	    return _.map([5, 10, 20, 50], function(n){ return n + '%'; });
	  },
	  cash: __webpack_require__(10),
	  quantity: function(){}
	};


	module.exports = Mn.ItemView.extend({
	  template: hbs.compile(tmpl),

	  viewOptions: [
	    'numpad', 'label', 'value', 'decimal', 'symbol'
	  ],

	  initialize: function(options){
	    options = options || {};

	    options = _.defaults(options, {
	      label   : 'Numpad',
	      numpad  : 'amount',
	      value   : 0,
	      decimal : accounting.settings.currency.decimal,
	      symbol  : accounting.settings.currency.symbol
	    });

	    this.mergeOptions(options, this.viewOptions);

	    this.model = new Model({ value: this.value }, options);
	  },

	  render: function(){
	    var args = Array.prototype.slice.apply(arguments);
	    var result = Mn.ItemView.prototype.render.apply(this, args);

	    this.stickit();

	    return result;
	  },

	  bindings: {
	    'input[name="value"]': {
	      observe: ['value', 'percentage', 'active'],
	      onGet: function(arr){
	        if(arr[2] === 'percentage'){
	          return accounting.formatNumber(arr[1]);
	        } else {
	          return accounting.formatNumber(arr[0]);
	        }
	      }
	    },
	    '.numpad-discount [data-btn="left"]': {
	      observe: ['value', 'percentage', 'active'],
	      onGet: function(arr){
	        if(arr[2] === 'percentage'){
	          return accounting.formatMoney(arr[0]);
	        } else {
	          return this.symbol;
	        }
	      }
	    },
	    '.numpad-discount [data-btn="right"]': {
	      observe: ['percentage', 'value', 'active'],
	      onGet: function(arr){
	        if(arr[2] === 'percentage'){
	          return '%';
	        } else {
	          return accounting.toFixed(arr[0], 0) + '%';
	        }
	      }
	    }
	  },

	  templateHelpers: function(){
	    var data = {
	      numpad  : this.numpad,
	      label   : this.label,
	      input   : inputBtns[this.numpad].call(this),
	      keys    : extraKeys[this.numpad].call(this, this.value),
	      decimal : this.decimal,
	      'return': 'return'
	    };

	    return data;
	  },

	  ui: {
	    input   : '.numpad-header input',
	    toggle  : '.numpad-header .input-group',
	    common  : '.numpad-keys .common .btn',
	    discount: '.numpad-keys .discount .btn',
	    cash    : '.numpad-keys .cash .btn'
	  },

	  events: {
	    'click @ui.toggle a': 'toggle',
	    'click @ui.common'  : 'commonKeys',
	    'click @ui.discount': 'discountKeys',
	    'click @ui.cash'    : 'cashKeys'
	  },

	  toggle: function(e){
	    e.preventDefault();
	    var modifier = $(e.currentTarget).data('btn');

	    if(this.numpad === 'quantity'){
	      this.model.quantity( modifier === 'right' ? 'increase' : 'decrease' );
	    }

	    if(this.numpad === 'discount'){
	      this.ui.toggle.toggleClass('toggle');
	      this.model.toggle('percentage');
	    }
	  },

	  /* jshint -W074 */
	  commonKeys: function(e){
	    e.preventDefault();
	    var key = $(e.currentTarget).data('key');

	    switch(key) {
	      case 'ret':
	        this.trigger('input', this.model.get('value'), this.model);
	        return;
	      case 'del':
	        if(this.selected) {
	          this.model.clearInput();
	        }
	        this.model.backspace();
	        break;
	      case '+/-':
	        this.model.plusMinus();
	        break;
	      case '.':
	        this.model.decimal();
	        break;
	      default:
	        if(this.selected) {
	          this.model.clearInput();
	        }
	        this.model.key(key);
	    }

	  },
	  /* jshint +W074 */

	  discountKeys: function(e){
	    e.preventDefault();
	    var key = $(e.currentTarget).data('key');
	    this.model.set({
	      active: 'percentage',
	      percentage: key.replace('%', '')
	    });
	    this.ui.toggle.addClass('toggle');
	  },

	  cashKeys: function(e){
	    e.preventDefault();
	    var key = $(e.currentTarget).data('key');
	    this.model.clearInput().key(key);
	  }

	});
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Handlebars;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var bb = __webpack_require__(11);
	var _ = __webpack_require__(6);

	module.exports = bb.Model.extend({

	  dec: '',

	  defaults: {
	    active: 'value'
	  },

	  initialize: function(attributes, options){
	    options = options || {};
	    this.numpad = options.numpad;

	    if(options.original){
	      if(options.percentage === 'off'){
	        this.percentageOff = true;
	      }

	      this.set({ original: options.original });
	      this.set({ percentage: this.calcPercentage() });

	      this.on({
	        'change:value': function(){
	          this.set({ percentage: this.calcPercentage() }, { silent: true });
	        },
	        'change:percentage': function(){
	          this.set({ value: this.calcValue() }, { silent: true });
	        }
	      });
	    }
	  },

	  // helper set with check for valid float value
	  _set: function(name, num){
	    if(this.dec === '.'){
	      this.dec = '';
	    }
	    if( !_.isNumber(num) ){
	      num = parseFloat(num);
	    }
	    if( _.isNaN(num) ){
	      num = 0;
	    }
	    this.set(name, num);
	  },

	  backspace: function(){
	    var name = this.get('active');
	    var num = this.get( name ).toString().slice(0, -1);
	    this._set( name, num );
	    return this;
	  },

	  plusMinus: function(){
	    var name = this.get('active');
	    var num = this.get( name ) * -1;
	    this._set( name, num );
	    return this;
	  },

	  clearInput: function(){
	    var name = this.get('active');
	    this.set( name, 0 );
	    return this;
	  },

	  key: function(key){
	    var name = this.get('active');
	    var num = this.get( name ).toString() + this.dec + key;
	    this._set( name, num );
	    return this;
	  },

	  decimal: function(){
	    var name = this.get('active');
	    var num = this.get( name ).toString();
	    this.dec = num.indexOf('.') === -1 ? '.' : '';
	    return this;
	  },

	  quantity: function( type ) {
	    var name = this.get('active');
	    var num = this.get( name );
	    this._set( name, (type === 'increase' ? ++num : --num) );
	    return this;
	  },

	  calcPercentage: function(){
	    var percentage = ( this.get('value') / this.get('original') ) * 100;
	    if(this.percentageOff){
	      return 100 - percentage;
	    }
	    return percentage;
	  },

	  calcValue: function(){
	    var multiplier = this.get('percentage') / 100;
	    if(this.percentageOff){
	      return ( 1 - multiplier ) * this.get('original');
	    }
	    return multiplier * this.get('original');
	  },

	  toggle: function(attr){
	    var active = this.get('active');
	    this.set({ active: (attr === active ? 'value' : attr) });
	  }

	});

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {
	var _ = __webpack_require__(6);
	var accounting = __webpack_require__(12);
	var d = __webpack_require__(14);

	if( _.isString(d) ){
	  var JSON = global['JSON'];
	  d = JSON.parse(d);
	}

	/* jshint -W071 */

	function round(num){
	  return parseFloat( accounting.toFixed(num, 2) );
	}

	function nearest(num, dem){
	  var n = Math.ceil(num / dem) * dem;
	  return round(n);
	}

	module.exports = function(amount, currency){
	  var keys = [amount],
	      denominations = d[currency] || d['USD'];

	  if(amount === 0) {
	    return denominations.notes.slice(-4);
	  }

	  // remove 1 & 2 cents
	  _.pull( denominations.coins, 0.01, 0.02 );

	  // find nearest match for coins
	  _.each( denominations.coins, function(coin) {
	    keys.push( nearest(amount, coin) );
	  });

	  // unique, sorted
	  keys = _.chain(keys).uniq().sortBy().value();

	  // higher rep of coin for low amounts
	  if(amount > denominations.notes[0]){
	    keys.slice(0, 3);
	  }

	  // find nearest match for notes
	  _.each( denominations.notes, function(note) {
	    keys.push( nearest(amount, note) );
	  });

	  // return 4 results - unique, sorted
	  return _.chain(keys).uniq().sortBy().value().slice(1, 5);
	};
	/* jshint +W071 */
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = Backbone;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = accounting;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "<div class=\"numpad numpad-{{numpad}}\">\n  <div class=\"numpad-header\">\n    <strong class=\"title\">{{label}}</strong>\n\n    {{#if input}}\n    <div class=\"input-group {{#if input.toggle}}input-toggle{{/if}}\">\n      {{#if input.left}}\n        {{#if input.left.addOn}}<span class=\"input-group-addon\">{{{input.left.addOn}}}</span>{{/if}}\n        {{#if input.left.btn}}<span class=\"input-group-btn\"><a href=\"#\" data-btn=\"left\">{{{input.left.btn}}}</a></span>{{/if}}\n      {{/if}}\n      <input type=\"text\" name=\"value\" class=\"form-control autogrow\" readonly=\"readonly\">\n      {{#if input.right}}\n        {{#if input.right.btn}}<span class=\"input-group-btn\"><a href=\"#\" data-btn=\"right\">{{{input.right.btn}}}</a></span>{{/if}}\n        {{#if input.right.addOn}}<span class=\"input-group-addon\">{{{input.right.addOn}}}</span>{{/if}}\n      {{/if}}\n    </div>\n    {{/if}}\n\n  </div>\n\n  <div class=\"numpad-keys\">\n    <div class=\"keys common\">\n      <div class=\"row\">\n        <a href=\"#\" data-key=\"1\" class=\"btn\">1</a>\n        <a href=\"#\" data-key=\"2\" class=\"btn\">2</a>\n        <a href=\"#\" data-key=\"3\" class=\"btn\">3</a>\n      </div>\n      <div class=\"row\">\n        <a href=\"#\" data-key=\"4\" class=\"btn\">4</a>\n        <a href=\"#\" data-key=\"5\" class=\"btn\">5</a>\n        <a href=\"#\" data-key=\"6\" class=\"btn\">6</a>\n      </div>\n      <div class=\"row\">\n        <a href=\"#\" data-key=\"7\" class=\"btn\">7</a>\n        <a href=\"#\" data-key=\"8\" class=\"btn\">8</a>\n        <a href=\"#\" data-key=\"9\" class=\"btn\">9</a>\n      </div>\n      <div class=\"row\">\n        <a href=\"#\" data-key=\"0\" class=\"btn\">0</a>\n        <a href=\"#\" data-key=\"00\" class=\"btn\">00</a>\n        <a href=\"#\" data-key=\".\" class=\"btn decimal\">{{{decimal}}}</a>\n      </div>\n    </div>\n    <div class=\"keys common extra-keys\">\n      <a href=\"#\" data-key=\"del\" class=\"btn\"><i class=\"icon icon-delete\"><span>del</span></i></a>\n      <a href=\"#\" data-key=\"+/-\" class=\"btn\">+/-</a>\n      <a href=\"#\" data-key=\"ret\" class=\"btn return\">{{return}}</a>\n    </div>\n\n    {{#if keys}}\n      <div class=\"keys extra-keys {{numpad}}\">\n        {{#each keys}}\n          <a href=\"#\" data-key=\"{{this}}\" class=\"btn\">{{this}}</a>\n        {{/each}}\n      </div>\n    {{/if}}\n\n  </div>\n</div>"

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = "\n{\n  \"AED\": {\n    \"name\": \"United Arab Emirates Dirham\",\n    \"coins\": [ 0.25, 0.50, 1 ],\n    \"notes\": [ 5, 10, 20, 50, 100, 200, 500, 1000 ]\n  },\n  \"AUD\": {\n    \"name\": \"Australian Dollars\",\n    \"coins\": [ 0.05, 0.1, 0.2, 0.5, 1, 2 ],\n    \"notes\": [ 5, 10, 20, 50, 100 ]\n  },\n  \"BDT\": {\n    \"name\": \"Bangladeshi Taka\",\n    \"coins\": [ 1, 2, 5 ],\n    \"notes\": [ 2, 5, 10, 20, 50, 100, 500, 1000 ]\n  },\n  \"BGN\": {\n    \"name\": \"Bulgarian Lev\",\n    \"coins\": [ 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1 ],\n    \"notes\": [ 2, 5, 10, 20, 50, 100 ]\n  },\n  \"BRL\": {\n    \"name\": \"Brazilian Real\",\n    \"coins\": [ 0.05, 0.10, 0.25, 0.50, 1 ],\n    \"notes\": [ 2, 5, 10, 20, 50, 100 ]\n  },\n  \"CAD\": {\n    \"name\": \"Canadian Dollars\",\n    \"coins\": [ 0.01, 0.05, 0.1, 0.25, 0.5, 1, 2 ],\n    \"notes\": [ 5, 10, 20, 50, 100 ]\n  },\n  \"CHF\": {\n    \"name\": \"Swiss Franc\",\n    \"coins\": [ 0.05, 0.1, 0.2, 0.5, 1, 2, 5 ],\n    \"notes\": [ 10, 20, 50, 100, 200, 500, 1000 ]\n  },\n  \"CLP\": {\n    \"name\": \"Chilean Peso\",\n    \"coins\": [ 1, 5, 10, 50, 100, 500 ],\n    \"notes\": [ 1000, 2000, 5000, 10000, 20000 ]\n  },\n  \"CNY\": {\n    \"name\": \"Chinese Yuan\",\n    \"coins\": [ 0.1, 0.5, 1 ],\n    \"notes\": [ 0.1, 0.5, 1, 5, 10, 20, 50, 100 ]\n  },\n  \"COP\": {\n    \"name\": \"Colombian Peso\",\n    \"coins\": [ 50, 100, 200, 500, 1000 ],\n    \"notes\": [ 1000, 2000, 5000, 10000, 20000, 50000 ]\n  },\n  \"CZK\": {\n    \"name\": \"Czech Koruna\",\n    \"coins\": [ 1, 2, 5, 10, 20, 50 ],\n    \"notes\": [ 100, 200, 500, 1000, 2000 ]\n  },\n  \"DKK\": {\n    \"name\": \"Danish Krone\",\n    \"coins\": [ 0.25, 0.5, 1, 2, 5, 10, 20 ],\n    \"notes\": [ 50, 100, 200, 500, 1000 ]\n  },\n  \"DOP\": {\n    \"name\": \"Dominican Peso\",\n    \"coins\": [ 1, 5, 10, 25 ],\n    \"notes\": [ 20, 50, 100, 200, 500, 1000, 2000 ]\n  },\n  \"EGP\": {\n    \"name\": \"Egyptian Pound\",\n    \"coins\": [ 0.25, 0.5, 1 ],\n    \"notes\": [ 5, 10, 20, 50, 100, 200 ]\n  },\n  \"EUR\": {\n    \"name\": \"Euros\",\n    \"coins\": [ 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2 ],\n    \"notes\": [ 5, 10, 20, 50, 100, 200, 500 ]\n  },\n  \"GBP\": {\n    \"name\": \"Pounds Sterling\",\n    \"coins\": [ 0.01, 0.02, 0.05, 0.1, 0.5, 1, 2 ],\n    \"notes\": [ 5, 10, 20, 50 ]\n  },\n  \"HKD\": {\n    \"name\": \"Hong Kong Dollar\",\n    \"coins\": [ 0.1, 0.2, 0.5, 1, 2, 5, 10 ],\n    \"notes\": [ 10, 20, 50, 100, 500, 1000 ]\n  },\n  \"HRK\": {\n    \"name\": \"Croatia kuna\",\n    \"coins\": [ 0.05, 0.1, 0.2, 0.5, 1, 2, 5 ],\n    \"notes\": [ 5, 10, 20, 50, 100, 200, 500 ]\n  },\n  \"HUF\": {\n    \"name\": \"Hungarian Forint\",\n    \"coins\": [ 5, 10, 20, 50, 100, 200 ],\n    \"notes\": [ 500, 1000, 2000, 5000, 10000, 20000 ]\n  },\n  \"IDR\": {\n    \"name\": \"Indonesia Rupiah\",\n    \"coins\": [ 100, 200, 500, 1000 ],\n    \"notes\": [ 1000, 2000, 5000, 10000, 20000, 50000, 100000 ]\n  },\n  \"ILS\": {\n    \"name\": \"Israeli Shekel\",\n    \"coins\": [ 0.1, 0.5, 1, 2, 5, 10 ],\n    \"notes\": [ 20, 50, 100, 200 ]\n  },\n  \"INR\": {\n    \"name\": \"Indian Rupee\",\n    \"coins\": [ 0.5, 1, 2, 5, 10 ],\n    \"notes\": [ 1, 2, 5, 10, 20, 50, 100, 500, 1000 ]\n  },\n  \"ISK\": {\n    \"name\": \"Icelandic krona\",\n    \"coins\": [ 1, 5, 10, 50, 100 ],\n    \"notes\": [ 500, 1000, 2000, 5000, 10000 ]\n  },\n  \"JPY\": {\n    \"name\": \"Japanese Yen\",\n    \"coins\": [ 1, 5, 10, 50, 100, 500 ],\n    \"notes\": [ 1000, 2000, 5000, 10000 ]\n  },\n  \"KRW\": {\n    \"name\": \"South Korean Won\",\n    \"coins\": [ 1, 5, 10, 50, 100, 500 ],\n    \"notes\": [ 1000, 5000, 10000 ]\n  },\n  \"MXN\": {\n    \"name\": \"Mexican Peso\",\n    \"coins\": [ 0.5, 1, 2, 5, 10 ],\n    \"notes\": [ 20, 50, 100, 200, 500 ]\n  },\n  \"MYR\": {\n    \"name\": \"Malaysian Ringgits\",\n    \"coins\": [ 0.05, 0.1, 0.2, 0.5 ],\n    \"notes\": [ 1, 5, 10, 20, 50, 100 ]\n  },\n  \"NGN\": {\n    \"name\": \"Nigerian Naira\",\n    \"coins\": [ 0.5, 1, 2 ],\n    \"notes\": [ 5, 10, 20, 50, 100, 200, 500, 1000 ]\n  },\n  \"NOK\": {\n    \"name\": \"Norwegian Krone\",\n    \"coins\": [ 0.5, 1, 5, 10, 20 ],\n    \"notes\": [ 50, 100, 200, 500, 1000 ]\n  },\n  \"NZD\": {\n    \"name\": \"New Zealand Dollar\",\n    \"coins\": [ 0.1, 0.2, 0.5, 1, 2 ],\n    \"notes\": [ 5, 10, 20, 50, 100 ]\n  },\n  \"PHP\": {\n    \"name\": \"Philippine Pesos\",\n    \"coins\": [ 1, 5, 10 ],\n    \"notes\": [ 20, 50, 100, 500, 1000 ]\n  },\n  \"PLN\": {\n    \"name\": \"Polish Zloty\",\n    \"coins\": [ 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2, 5 ],\n    \"notes\": [ 10, 20, 50, 100, 200 ]\n  },\n  \"RON\": {\n    \"name\": \"Romanian Leu\",\n    \"coins\": [ 0.1, 0.5 ],\n    \"notes\": [ 1, 5, 10, 50, 100 ]\n  },\n  \"RUB\": {\n    \"name\": \"Russian Ruble\",\n    \"coins\": [ 0.1, 0.5, 1, 2, 5, 10, 25 ],\n    \"notes\": [ 50, 100, 500, 1000 ]\n  },\n  \"SEK\": {\n    \"name\": \"Swedish Krona\",\n    \"coins\": [ 0.5, 1, 2, 5, 10 ],\n    \"notes\": [ 20, 50, 100, 500, 1000 ]\n  },\n  \"SGD\": {\n    \"name\": \"Singapore Dollar\",\n    \"coins\": [ 0.05, 0.1, 0.2, 0.5, 1 ],\n    \"notes\": [ 2, 5, 10, 50, 100, 1000 ]\n  },\n  \"THB\": {\n    \"name\": \"Thai Baht\",\n    \"coins\": [ 0.25, 0.5, 1, 2, 5, 10 ],\n    \"notes\": [ 20, 50, 100, 500, 1000 ]\n  },\n  \"TRY\": {\n    \"name\": \"Turkish Lira\",\n    \"coins\": [ 0.05, 0.1, 0.25, 0.5, 1 ],\n    \"notes\": [ 5, 10, 20, 50, 100, 200 ]\n  },\n  \"TWD\": {\n    \"name\": \"Taiwan New Dollars\",\n    \"coins\": [ 1, 5, 10, 50 ],\n    \"notes\": [ 100, 500, 1000 ]\n  },\n  \"USD\": {\n    \"name\": \"US Dollars\",\n    \"coins\": [ 0.01, 0.05, 0.1, 0.25, 0.5, 1 ],\n    \"notes\": [ 1, 2, 5, 10, 20, 50, 100 ]\n  },\n  \"VND\": {\n    \"name\": \"Vietnamese Dong\",\n    \"coins\": [],\n    \"notes\": [ 100, 200, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000, 200000, 500000 ]\n  },\n  \"ZAR\": {\n    \"name\": \"South African rand\",\n    \"coins\": [ 0.1, 0.2, 0.5, 1, 2, 5 ],\n    \"notes\": [ 10, 20, 50, 100, 200 ]\n  },\n  \"PYG\": {\n    \"name\": \"Paraguayan Guaraní\",\n    \"coins\": [ 50, 100, 500, 1000 ],\n    \"notes\": [ 2000, 5000, 10000, 20000, 50000, 100000 ]\n  }\n}"

/***/ }
/******/ ]);