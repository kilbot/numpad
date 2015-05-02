(function () {

  // global variables
  var $ = window.jQuery,
      //_ = window._,
      bb = window.Backbone,
      Mn = window.Marionette,
      Numpad = window.Numpad;

  var numpadService = new Numpad.Service();

  /**
   * Service 1
   */
  var Service1 = bb.Radio.request('numpad', 'view', {

  });

  var LayoutView = Mn.LayoutView.extend({
    el: '#page',
    template: function(){
      return $('#page').html();
    },
    regions: {
      n1: '#numpad1',
      n2: '#numpad2',
      n3: '#numpad3',
      n4: '#numpad4'
    },
    onRender: function(){
      var n1 = this.showChildView( 'n1', Service1 );
      n1.currentView.on('event', function(){
        console.log(arguments);
      });
    }
  });


  var Application = Mn.Application.extend({
    initialize: function(){
      this.layout = new LayoutView();
      this.layout.render();
      this.numpadService = numpadService;
    }
  });

  window.app = new Application();

})();