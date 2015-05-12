
var _ = require('lodash');
var accounting = require('accounting');
var d = require('./denominations.json');

if( _.isString(d) ){
  var JSON = global['JSON'];
  d = JSON.parse(d);
}

/* jshint -W071 */

function round(num){
  return parseFloat( accounting.toFixed(num, 2) );
}

function nearest(num, dem){
  var n = Math.ceil(num / dem) * dem;
  return round(n);
}

module.exports = function(amount, currency){
  var keys = [amount],
      denominations = d[currency] || d['USD'];

  if(amount === 0) {
    return denominations.notes.slice(-4);
  }

  // remove 1 & 2 cents
  _.pull( denominations.coins, 0.01, 0.02 );

  // find nearest match for coins
  _.each( denominations.coins, function(coin) {
    keys.push( nearest(amount, coin) );
  });

  // unique, sorted
  keys = _.chain(keys).uniq().sortBy().value();

  // higher rep of coin for low amounts
  if(amount > denominations.notes[0]){
    keys.slice(0, 3);
  }

  // find nearest match for notes
  _.each( denominations.notes, function(note) {
    keys.push( nearest(amount, note) );
  });

  // return 4 results - unique, sorted
  return _.chain(keys).uniq().sortBy().value().slice(1, 5);
};
/* jshint +W071 */