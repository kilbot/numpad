var jsdom = require('jsdom').jsdom;
global.document = jsdom('hello world');
global.window = global.document.parentWindow;
global.$ = global.jQuery = require('jquery');

global._ = require('lodash');
global.Backbone = require('backbone');
global.Backbone.$ = require('jquery');

global.sinon = require('sinon');
var sinonChai = require('sinon-chai');

var chai = require('chai');
chai.use(sinonChai);
chai.should();