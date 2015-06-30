/*
 * grunt-html-json-wrapper
 * https://github.com/paulwittmann/grunt-html-json-wrapper
 *
 * Copyright (c) 2013 Paul Wittmann
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('html_json_wrapper', 'Wraps several HTML files in JSON.', function() {
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      //punctuation: '.',
      separator: ',',
      prefix: '[',
      suffix: ']\n'
    });

    // Iterate over all specified file groups.
    this.files.forEach(function(f) {
      // Concat specified files.
      var src = f.src.filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).map(function(filePath) {
        // Read file source.
        var metaFilePath, metaData = {}, yamlFile, file, result;

        metaFilePath = filePath.replace('.html', '.json');
        if (grunt.file.exists(metaFilePath)) {
          try {
            metaData = grunt.file.readJSON(metaFilePath);
          } catch (exception) {
            console.log('WARNING: The following error occurred when trying to parse the .json file: ', exception);
            console.log('Usually no need to worry, this can be caused by an empty .json file. Continuing with empty meta data.');
            metaData = {};
          }
        }
        file = grunt.file.read(filePath).replace(/(\r\n|\n|\r)/gm, '').split('<hr>').map(function(slideBody, index) {
          var returnValue = {"body": slideBody};
          if (metaData.slides && metaData.slides[index]) {
            returnValue.style = metaData.slides[index].style;
          }
          return returnValue;
        });
        result = metaData || {};
        result.slides = file;

        return JSON.stringify(result, null, 2); // pretty print it
      }).join(grunt.util.normalizelf(options.separator));

      // Handle options.
      // src += options.punctuation;
      src = options.prefix + src + options.suffix;

      // Write the destination file.
      grunt.file.write(f.dest, src);

      // Print a success message.
      grunt.log.writeln('File "' + f.dest + '" created.');
    });
  });

};
