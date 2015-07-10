var Mn = require('backbone.marionette');
var hbs = require('handlebars');
var tmpl = require('./numpad.hbs');
var Model = require('./model');
var _ = require('lodash');
var $ = require('jquery');
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
  cash: require('./cashkeys'),
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
      label     : 'Numpad',
      numpad    : 'amount',
      value     : 0,
      decimal   : accounting.settings.currency.decimal,
      symbol    : accounting.settings.currency.symbol,
      precision : accounting.settings.number.precision
    });

    this.mergeOptions(options, this.viewOptions);

    this.model = new Model({}, options);
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
        this.trigger('input', this.model.getFloatValue(), this.model);
        return;
      case 'del':
        if(this.selected) {
          this.model.clearInput();
        }
        this.model.backSpace();
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