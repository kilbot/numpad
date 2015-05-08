var Mn = require('backbone.marionette');
var hbs = require('handlebars');
var tmpl = require('./numpad.hbs');
var accounting = require('accounting');

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