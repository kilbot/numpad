module.exports = function(grunt) {

  var webpack = require('webpack');

  // autoload tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({

    watch: {
      options: {
        livereload: true
      },
      compass: {
        files: ['./css/**/*.scss' ],
        tasks: ['compass']
      },
      js: {
        files: ['<%= jshint.files %>', './js/*.hbs'],
        tasks: ['webpack', 'jshint']
      }
    },

    compass: {
      build: {
        options: {
          outputStyle: 'compressed',
          sassDir: './css',
          cssDir: './dist',
          relativeAssets: true,
          raw: "Sass::Script::Number.precision = 10\n"
        }
      }
    },

    jshint: {
      options: {
        jshintrc : true,
        reporter: require('jshint-stylish'),
        verbose: true
      },
      files: [
        'index.js',
        './js/*.js'
      ]
    },

    webpack: {
      options: {
        entry: {
          buttons: './index.js'
        },
        module: {
          loaders: [
            { test: /\.hbs$/, loader: 'raw-loader' }
          ]
        },
        resolve: {
          alias: {
            marionette: 'backbone.marionette',
            'backbone.wreqr': 'backbone.radio',
            radio: 'backbone.radio',
            underscore: 'lodash'
          }
        },
        externals: {
          jquery: 'jQuery',
          lodash: '_',
          underscore: '_',
          backbone: 'Backbone',
          'backbone.radio': 'Backbone.Radio',
          'backbone.marionette': 'Marionette',
          handlebars: 'Handlebars'
        },
        cache: true,
        watch: true,
        plugins: [
          new webpack.optimize.UglifyJsPlugin({minimize: true})
        ]
      },
      build: {
        output: {
          path: './dist/',
          filename: '[name].js'
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 9001,
          base: './',
          open: 'http://localhost:9001/demo/'
        }
      }
    }

  });

  // dev
  grunt.registerTask('dev', ['compass', 'jshint', 'webpack', 'connect', 'watch']);

  // default
  grunt.registerTask('default', ['dev']);

};