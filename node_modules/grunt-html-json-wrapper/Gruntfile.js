/*
 * grunt-html-json-wrapper
 * https://github.com/paulwittmann/grunt-html-json-wrapper
 *
 * Copyright (c) 2013 Paul Wittmann
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>',
      ],
      options: {
        jshintrc: '.jshintrc',
      },
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp'],
    },

    // Configuration to be run (and then tested).
    html_json_wrapper: {
      default_options: {
        options: {
        },
        files: {
          'tmp/default_options': ['test/fixtures/project_a.html', 'test/fixtures/project_b.html', 'test/fixtures/dingfabrik.html', 'test/fixtures/project_empty.html'],
        },
      }
      // custom_options: {
      //   options: {
      //     separator: ': ',
      //     punctuation: ' !!!',
      //   },
      //   files: {
      //     'tmp/custom_options': ['test/fixtures/testing', 'test/fixtures/123'],
      //   },
      // },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js'],
    },

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'html_json_wrapper', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
