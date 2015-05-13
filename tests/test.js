describe('Numpad', function() {

  describe('the numpad model', function(){

    var Model = require('../js/model.js');

    beforeEach(function(){
      this.model = new Model({
        value  : 9.99
      }, {
        original : 15
      });
    });

    it('should be in a valid state', function(){
      this.model.should.be.ok;
    });

    it('should init with the correct values', function(){
      var name = this.model.get('active');
      this.model.get(name).should.eql(9.99);
    });

    it('should backspace', function(){
      this.model.backspace();
      this.model.get('value').should.eql(9.9);
      this.model.backspace();
      this.model.get('value').should.eql(9);
      this.model.backspace();
      this.model.get('value').should.eql(0);
    });

    it('should plus/minus', function(){
      this.model.plusMinus();
      this.model.get('value').should.eql(-9.99);
      this.model.plusMinus();
      this.model.get('value').should.eql(9.99);
    });

    it('should clear input', function(){
      this.model.clearInput();
      this.model.get('value').should.eql(0);
    });

    it('should add input', function(){
      this.model.clearInput().key(1);
      this.model.get('value').should.eql(1);
      this.model.key(0);
      this.model.get('value').should.eql(10);
    });

    it('should handle decimals', function(){
      this.model.decimal();
      this.model.get('value').should.eql(9.99);

      this.model.clearInput().key(1).decimal().key(1);
      this.model.get('value').should.eql(1.1);

      this.model.clearInput().decimal();
      this.model.get('value').should.eql(0);
      this.model.key(1).key(1);
      this.model.get('value').should.eql(0.11);
    });

    it('should toggle quantity up and down', function(){
      this.model.quantity('increase');
      this.model.get('value').should.eql(10.99);

      this.model.quantity('decrease');
      this.model.get('value').should.eql(9.99);

      // default is decrease
      this.model.quantity();
      this.model.get('value').should.eql(8.99);
    });

    it('should calculate the percentage', function(){
      this.model.get('original').should.eql(15);
      this.model.get('percentage').should.eql( (9.99/15)*100 );
    });

    it('should change the percentage on value change', function(){
      this.model.set({ value: 12 });
      this.model.get('percentage').should.eql( (12/15)*100 );
    });

    it('should change the value on percentage change', function(){
      this.model.set({ percentage: 60 });
      this.model.get('value').should.eql( 9 );
    });

    it('should toggle the active input value', function(){
      this.model.toggle('percentage');
      this.model.get('active').should.eql('percentage');
      this.model.toggle('percentage');
      this.model.get('active').should.eql('value');
    });

    it('should calculate the percentage-off', function(){
      var model = new Model({ value  : 9.99}, {
        original    : 15,
        percentage  : 'off'
      });
      model.get('original').should.eql(15);
      model.get('percentage').should.eql( 100 - (9.99/15)*100 );
    });

    it('should change the percentage-off on value change', function(){
      var model = new Model({ value  : 9.99}, {
        original    : 15,
        percentage  : 'off'
      });
      model.set({ value: 12 });
      model.get('percentage').should.eql( 100 - (12/15)*100 );
    });

    it('should change the value on percentage-off change', function(){
      var model = new Model({ value  : 9.99}, {
        original    : 15,
        percentage  : 'off'
      });
      model.set({ percentage: 60 });
      model.get('value').should.eql( 6 );
    });

  });

  describe('quick keys for amount tendered', function(){

    var cashKeys = require('../js/cashkeys.js');

    describe('USD', function(){

      // USD
      // "coins": [ 0.01, 0.05, 0.1, 0.25, 0.5, 1 ],
      // "notes": [ 1, 2, 5, 10, 20, 50, 100 ]

      it('should return top 4 notes if amount is 0', function(){
        cashKeys(0).should.eql([10, 20, 50, 100]); // USD
      });

      it('should return sensible options for $0.01', function(){
        cashKeys(0.01).should.eql([0.05, 0.1, 0.25, 0.5]); // USD
      });

      it('should return sensible options for $0.65', function(){
        cashKeys(0.65).should.eql([0.7, 0.75, 1, 2]); // USD
      });

      it('should return sensible options for $9.96', function(){
        cashKeys(9.96, 'AUD').should.eql([10, 20, 50, 100]);
      });

      //it('should return sensible options', function(){
      //  for (i = 1; i < 1000; i++) {
      //    var amount = i/100;
      //    var result = cashKeys(amount, 'AUD');
      //
      //    //console.log(amount + ': ' + result);
      //
      //    // unique
      //    result.should.eql( _.uniq(result) );
      //
      //    // in order
      //    var clone = result.slice(0).sort(function(a,b) { return a - b; });
      //    result.should.eql( clone );
      //  }
      //});

    });

    describe('AUD', function(){

      // AUD
      // "coins": [0.05, 0.1, 0.2, 0.5, 1, 2],
      // "notes": [5, 10, 20, 50, 100]

      it('should return top 4 notes if amount is 0', function(){
        cashKeys(0, 'AUD').should.eql([10, 20, 50, 100]);
      });

      it('should return sensible options for $0.01', function(){
        cashKeys(0.01, 'AUD').should.eql([0.05, 0.1, 0.2, 0.5]);
      });

      it('should return sensible options for $0.65', function(){
        cashKeys(0.65, 'AUD').should.eql([0.7, 0.8, 1, 2]);
      });

      it('should return sensible options for $9.96', function(){
        cashKeys(9.96, 'AUD').should.eql([10, 20, 50, 100]);
      });

      //it('should return sensible options', function(){
      //  for (i = 1; i < 1000; i++) {
      //    var amount = i/100;
      //    var result = cashKeys(amount, 'AUD');
      //
      //    //console.log(amount + ': ' + result);
      //
      //    // unique
      //    result.should.eql( _.uniq(result) );
      //
      //    // in order
      //    var clone = result.slice(0).sort(function(a,b) { return a - b; });
      //    result.should.eql( clone );
      //  }
      //});

    });



    describe('EUR', function(){

      // Euros
      // "coins": [ 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2 ],
      // "notes": [ 5, 10, 20, 50, 100, 200, 500 ]

      it('should return top 4 notes if amount is 0', function(){
        cashKeys(0, 'EUR').should.eql([50, 100, 200, 500]);
      });

      it('should return sensible options for 0.01', function(){
        cashKeys(0.01, 'EUR').should.eql([0.05, 0.1, 0.2, 0.5]);
      });

      it('should return sensible options for 0.65', function(){
        cashKeys(0.65, 'EUR').should.eql([0.7, 0.8, 1, 2]);
      });

      it('should return sensible options for 9.96', function(){
        cashKeys(9.96, 'EUR').should.eql([10, 20, 50, 100]);
      });

      it('should return sensible options for 0.14', function(){
        cashKeys(0.14, 'EUR').should.eql([0.15, 0.2, 0.5, 1]);
      });

      //it('should return sensible options', function(){
      //  for (i = 1; i < 1000; i++) {
      //    var amount = i/100;
      //    var result = cashKeys(amount, 'EUR');
      //
      //    //console.log(amount + ': ' + result);
      //
      //    // unique
      //    result.should.eql( _.uniq(result) );
      //
      //    // in order
      //    var clone = result.slice(0).sort(function(a,b) { return a - b; });
      //    result.should.eql( clone );
      //  }
      //});

    });

  });

});