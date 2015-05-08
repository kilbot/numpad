(function () {

  // global variables
  var $ = window.jQuery,
      _ = window._,
      bb = window.Backbone,
      Mn = window.Marionette,
      Numpad = window.Numpad;

  var numpadService = new Numpad.Service();

  function rand(){
    var x = _.random(0, 10, true).toFixed(2);
    if( _.random(0, 1) ){
      return parseFloat(x);
    }
    return parseInt(x, 10);
  }

  /**
   * Model
   * - attribute name = input[name]
   */
  var model = new bb.Model({
    input2: rand(),
    input3: rand(),
    input4: rand()
  });

  /**
   * Service 1
   */
  var Service1 = bb.Radio.request('numpad', 'view', {
    label: 'Simple Numpad'
  });

  var LayoutView = Mn.LayoutView.extend({

    el: '#page',

    template: '#page',

    regions: {
      n1: '#numpad1',
      n2: '#numpad2',
      n3: '#numpad3',
      n4: '#numpad4'
    },

    behaviors: {
      Numpad: {
        behaviorClass: Numpad.Behavior
      }
    },

    events: {
      'open:numpad': 'openNumpad'
    },

    onRender: function(){
      var n1 = this.showChildView( 'n1', Service1 );
      n1.currentView.on('event', function(){
        console.log(arguments);
      });

      this.$('#input2').val( this.model.get('input2') );
      this.$('#input3').val( this.model.get('input3') );
      this.$('#input4').val( this.model.get('input4') );

      this.$('#input2').trigger('open:numpad', 'n2');
      this.$('#input3').trigger('click', true);
      this.$('#input4').trigger('open:numpad', 'n4');
    },

    openNumpad: function(e, regionId){
      if(e) { e.preventDefault(); }

      // get setup options from target
      var target = $(e.target);
      var options = _.defaults( target.data(), {
        target: target,
        model: model
      });

      var numpad = bb.Radio.request('numpad', 'view', options);

      var region = this.showChildView( regionId, numpad );
      region.currentView.on('event', function(){
        console.log(arguments);
      });
    }

  });


  var Application = Mn.Application.extend({
    initialize: function(){
      this.layout = new LayoutView({
        model: model
      });
      this.layout.render();
      this.numpadService = numpadService;
    }
  });

  window.app = new Application();

})();