/*
 * grunt-htmljson
 * https://github.com/jonjaques/grunt-htmljson
 *
 * Copyright (c) 2012 Jon Jaques, Tom Tang
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
  "use strict";

  function filenameToKey(filename){
    return (filename.split('/').pop()).split('.').shift();
  }

  function makeJson(files, options) {
    var defaults, o, result;
    defaults = { separator: null };
    result = {};
    o = grunt.util._.extend(defaults, options);

    files.map(function(filepath) {
      var html = grunt.file.read(filepath);
      result[filenameToKey(filepath)] = html;
    });

    return JSON.stringify(result, null, o.separator);
  }

  grunt.task.registerMultiTask('htmljson', 'Compile html or any txt files into a json file.', function() {

    var self = this;

    var files;

    this.files.forEach(function(file) {
     files = file.src.filter(function(filepath) {
        // Remove nonexistent files (it's up to you to filter or warn here).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      });
    });

    // Construct the JSON file.
    var json = makeJson(files, this.data.options);

    grunt.file.write(this.data.dest, json);

    // Fail task if errors were logged.
    if (this.errorCount) {
      return false;
    }

    // Otherwise, print a success message.
    grunt.log.verbose.ok(files.forEach(function(file) { return 'Template "'+ file +'" added.'; }));
    grunt.log.ok('File "' + this.data.dest + '" created.');

  });
};