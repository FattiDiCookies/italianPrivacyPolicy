/*
 * grunt-htmljson
 * https://github.com/jonjaques/htmljson
 *
 * Copyright (c) 2013 Jon Jaques, Tom Tang
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
      tests: ['example/dist'],
    },

    // Configuration to be run (and then tested).
    htmljson: {
      default_options: {
        src: ['example/src/**/*'],
        dest: 'example/dist/default.json'
      },
      custom_options: {
        src: ['example/src/**/*'],
        dest: 'example/dist/custom.json',
        options: {
          separator: 2,
        },
      },
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/**/*.js'],
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
  grunt.registerTask('test', ['clean', 'htmljson']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
