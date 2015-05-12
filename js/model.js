var bb = require('backbone');
var _ = require('lodash');

module.exports = bb.Model.extend({

  dec: '',

  defaults: {
    active: 'value'
  },

  initialize: function(attributes, options){
    options = options || {};
    this.numpad = options.numpad;
  },

  // helper set with check for valid float value
  _set: function(name, num){
    if(this.dec === '.'){
      this.dec = '';
    }
    if( !_.isNumber(num) ){
      num = parseFloat(num);
    }
    if( _.isNaN(num) ){
      num = 0;
    }
    this.set(name, num);
  },

  backspace: function(){
    var name = this.get('active');
    var num = this.get( name ).toString().slice(0, -1);
    this._set( name, num );
    return this;
  },

  plusMinus: function(){
    var name = this.get('active');
    var num = this.get( name ) * -1;
    this._set( name, num );
    return this;
  },

  clearInput: function(){
    var name = this.get('active');
    this.set( name, 0 );
    return this;
  },

  key: function(key){
    var name = this.get('active');
    var num = this.get( name ).toString() + this.dec + key;
    this._set( name, num );
    return this;
  },

  decimal: function(){
    var name = this.get('active');
    var num = this.get( name ).toString();
    this.dec = num.indexOf('.') === -1 ? '.' : '';
    return this;
  }

});