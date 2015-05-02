var Mn = require('backbone.marionette');
var hbs = require('handlebars');
var tmpl = require('./numpad.hbs');
var accounting = require('accounting');

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