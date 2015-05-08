var _ = require('lodash');
var accounting = require('accounting');

// example denominations
var denominations = {
  name: 'US Dollars',
  coins: [ 0.05, 0.1, 0.25, 0.5, 1 ],
  notes: [ 1, 2, 5, 10, 20, 50, 100 ]
};

function round(num){
  return parseFloat( accounting.toFixed(num, 2) );
}

function nearest(num, dem){
  var n = Math.ceil(num / dem) * dem;
  return round(n);
}

module.exports = function(amount){
  var keys = [amount];

  if(amount === 0) {
    return denominations.notes.slice(-4);
  }

  // round for two coins
  _.each( denominations.coins, function(coin) {
    keys.push( nearest(amount, coin) );
  });

  // removes smaller amounts, eg: 9.96: [9.97, 10, 20, 50], removes 9.97
  if(round(keys[1] - keys[0]) === denominations.coins[0]){
    keys.splice(1, 1);
  }

  keys = _.uniq(keys).slice(0, 3);

  // round for two notes
  _.each( denominations.notes, function(note) {
    keys.push( nearest(amount, note) );
  });

  return _.uniq(keys).slice(1, 5);
};