var Mn = require('backbone.marionette');
var hbs = require('handlebars');
var tmpl = require('./numpad.hbs');
var Model = require('./model');
var _ = require('lodash');
var $ = require('jquery');
var accounting = global['accounting'];

// numpad header input btns
var inputBtns = {
  amount: function(){
    return {
      left: { addOn: accounting.settings.currency.symbol }
    };
  },
  discount: function(){
    return {
      left: { btn: accounting.settings.currency.symbol },
      right: { btn: '%' },
      toggle: true
    };
  },
  cash: function(){
    return {
      left: { addOn: accounting.settings.currency.symbol }
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
    'target', 'parent', 'numpad', 'label', 'decimal', 'name', 'value'
  ],

  initialize: function(options){
    options = options || {};

    // get name and value from target / parent.model
    options.name = options.target ? options.target.attr('name') : 'numpad';
    if(options.parent){
      options.value = options.parent.model.get(options.name);
    } else {
      options.value = 0;
    }

    options = _.defaults(options, {
      numpad  : 'amount',
      decimal : accounting.settings.currency.decimal
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
    'input[name="value"]': 'value'
  },

  templateHelpers: function(){
    var data = {
      label   : this.label,
      input   : inputBtns[this.numpad](),
      keys    : extraKeys[this.numpad](this.value),
      decimal : this.decimal,
      'return': 'return'
    };

    return data;
  },

  ui: {
    common  : '.numpad-keys .common .btn',
    discount: '.numpad-keys .discount .btn',
    cash    : '.numpad-keys .cash .btn'
  },

  events: {
    'click @ui.common'  : 'commonKeys',
    'click @ui.discount': 'discountKeys',
    'click @ui.cash'    : 'cashKeys'
  },

  /* jshint -W074 */
  commonKeys: function(e){
    e.preventDefault();
    var key = $(e.currentTarget).data('key');

    switch(key) {
      case 'ret':
        this.trigger('input');
        this.target.popover('hide');
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
  },

  cashKeys: function(e){
    e.preventDefault();
  }

});