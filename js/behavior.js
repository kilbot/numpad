var Mn = require('backbone.marionette');
var Modernizr = {
  touch: true
};
var Radio = require('backbone.radio');
var $ = require('jquery');
var _ = require('lodash');

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