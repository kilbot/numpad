var Mn = require('backbone.marionette');
var Radio = require('backbone.radio');
var View = require('./view');

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