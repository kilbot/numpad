var Mn = require('backbone.marionette');
var Radio = require('backbone.radio');
var View = require('./view');
var cashKeys = require('./cashkeys');

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