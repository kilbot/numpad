describe('Numpad', function() {

  describe('quick keys for amount tendered', function(){

    var cashKeys = require('../js/cashkeys.js');
    // using USD denominations
    // "coins": [ 0.01, 0.05, 0.1, 0.25, 0.5, 1 ],
    // "notes": [ 1, 2, 5, 10, 20, 50, 100 ]

    it('should return top 4 notes if amount is 0', function(){
      cashKeys(0).should.eql([10, 20, 50, 100]);
    });

    it('should return sensible options for $0.01', function(){
      cashKeys(0.01).should.eql([0.05, 0.1, 1, 2]);
    });

    it('should return sensible options for $1.99', function(){
      cashKeys(1.99).should.eql([2, 5, 10, 20]);
    });

    it('should return sensible options for $0.65', function(){
      cashKeys(0.65).should.eql([0.7, 0.75, 1, 2]);
    });

    it('should return sensible options', function(){
      for (i = 1; i < 1000; i++) {
        var amount = i/100;
        var result = cashKeys(amount);

        //console.log(amount + ': ' + result);

        // unique
        result.should.eql( _.uniq(result) );

        // in order
        result.should.eql( _.sortBy(result, function(a, b){ return a < b; } ) );
      }
    });

  });

});