describe('Numpad', function() {

  describe('the numpad model', function(){

    var Model = require('../js/model.js');

    beforeEach(function(){
      this.model = new Model({
        value  : 9.99
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
    })

    it('should add input', function(){
      this.model.clearInput().key(1);
      this.model.get('value').should.eql(1);
      this.model.key(0);
      this.model.get('value').should.eql(10);
    })

    it('should handle decimals', function(){
      this.model.decimal();
      this.model.get('value').should.eql(9.99);

      this.model.clearInput().key(1).decimal().key(1);
      this.model.get('value').should.eql(1.1);

      this.model.clearInput().decimal();
      this.model.get('value').should.eql(0);
      this.model.key(1).key(1);
      this.model.get('value').should.eql(0.11);
    })

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