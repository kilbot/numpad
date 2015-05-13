/* jshint -W071 */
(function () {

  // global variables
  var $ = window.jQuery,
      _ = window._,
      bb = window.Backbone,
      Mn = window.Marionette,
      accounting = window.accounting,
      Numpad = window.Numpad;

  accounting.settings = {
    currency: {
      symbol : '$',   // default currency symbol is '$'
      format: '%s%v', // controls output: %s = symbol, %v = value/number
      decimal : ',',  // decimal point separator
      thousand: '.',  // thousands separator
      precision : 3   // decimal places
    },
    number: {
      precision : 3,  // default precision on numbers is 0
      thousand: '.',
      decimal : ','
    }
  };

  var numpadService = new Numpad.Service();

  function rand(){
    var x = _.random(0, 10, true).toFixed(3);
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
    input1: rand(),
    input2: rand(),
    input3: 0,
    input4: rand()
  });

  /**
   * Service 0
   */
  var Service0 = bb.Radio.request('numpad', 'view', {
    label: 'Simple Numpad'
  });

  var LayoutView = Mn.LayoutView.extend({

    el: '#page',

    template: '#page',

    regions: {
      n0: '#numpad0',
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

    bindings: {
      'input[name="input1"]': {
        observe: 'input1',
        onGet: accounting.formatNumber,
        onSet: accounting.unformat
      },
      'input[name="input2"]': {
        observe: 'input2',
        onGet: accounting.formatNumber,
        onSet: accounting.unformat
      },
      'input[name="input3"]': {
        observe: 'input3',
        onGet: accounting.formatNumber,
        onSet: accounting.unformat
      },
      'input[name="input4"]': {
        observe: 'input4',
        onGet: accounting.formatNumber,
        onSet: accounting.unformat
      }
    },

    render: function(){
      var args = Array.prototype.slice.apply(arguments);
      var result = Mn.LayoutView.prototype.render.apply(this, args);

      this.stickit();

      return result;
    },

    onRender: function(){
      var n0 = this.showChildView( 'n0', Service0 );
      n0.currentView.on('input', function(){
        console.log(arguments);
      });

      this.$('[name="input1"]').trigger('open:numpad', 'n1');
      this.$('[name="input2"]').trigger('open:numpad', 'n2');
      this.$('[name="input3"]').trigger('click', true);
      this.$('[name="input4"]').trigger('open:numpad', 'n4');
    },

    openNumpad: function(e, regionId){
      if(e) { e.preventDefault(); }

      // get setup options from target
      var target = $(e.target);
      var options = _.defaults( target.data(), {
        value : this.model.get( target.attr('name') )
      });

      var numpad = bb.Radio.request('numpad', 'view', options);

      var region = this.showChildView( regionId, numpad );
      region.currentView.on('input', function(){
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
/* jshint +W071 */