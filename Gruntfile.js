module.exports = function(grunt) {

  'use strict';
  // Project configuration.
  grunt.initConfig({
    pkg : grunt.file.readJSON('package.json'),
      
    meta: {
            banner: "/*!\n" +
                " *  <%= pkg.tool.name %> - v<%= pkg.tool.version %>\n" +
                " *  <%= pkg.tool.description %>\n" +
                " *  GitHub: <%= pkg.tool.github %>\n" +
                " *  Docs: <%= pkg.tool.docs %>\n" +
                " *  Bugs: <%= pkg.bugs.url %>\n" +
                " *\n" +
                " *  (c) 2015 by <%= pkg.author %>\n" +
                " *  Made by <%= pkg.author %> and released under <%= pkg.license.tool %> License\n" +
		        " */\n"
    },  

    clean : {
      dev : ["dev/docs/**/*.*", "!dev/docs/**/*.md"],
      dist : ["dist/docs/", "dist/tool/"]
    },

    md2html : {
      dev : {
        files :[{
          expand : true,
          cwd : 'dev/docs/md/cookie-policy/',
          src : ['**/*.md'],
          dest : 'dev/docs/cookie-policy/html/',
          ext : '.html'
        }, {
          expand : true,
          cwd : 'dev/docs/md/privacy-policy/',
          src : ['**/*.md'],
          dest : 'dev/docs/privacy-policy/html/',
          ext : '.html'
        }]
      },
      dist : {
        files :[{
          expand : true,
          cwd : 'dev/docs/md/cookie-policy/',
          src : ['**/*.md'],
          dest : 'dist/docs/cookie-policy/html/',
          ext : '.html'
        }, {
          expand : true,
          cwd : 'dev/docs/md/privacy-policy/',
          src : ['**/*.md'],
          dest : 'dist/docs/privacy-policy/html/',
          ext : '.html'
        }]
      }
    },

    dom_munger : {
      options : { 
        update :[{
          selector : 'h1',
          attribute : 'id',
          value : 'none'
        }, {
          selector : 'h2',
          attribute : 'id',
          value : 'none'
        }, {
          selector : 'h3',
          attribute : 'id',
          value : 'none'
        }, {
          selector : 'h4',
          attribute : 'id',
          value : 'none'
        }, {
          selector : 'h5',
          attribute : 'id',
          value : 'none'
        }, {
          selector : 'h6',
          attribute : 'id',
          value : 'none'
        }]
      },
      dev : {
        files : [{
          expand : true,
          cwd : 'dev/docs/',
          src : ['**/*.html'],
          dest : 'dev/docs/'
        }]
      },
      dist : {
        files : [{
          expand : true,
          cwd : 'dist/docs/',
          src : ['**/*.html'],
          dest : 'dist/docs/'
        }]
      }
    },

    'string-replace' : {
      options : {
        saveUnchanged : true,
        replacements : [{
          //pattern: /<h1 (\\S+)=[\"']?((?:.(?![\"']?\\s+(?:\\S+)=|[>\"']))+.)[\"']>?/,
          pattern : / id="none"/g,
          replacement : ''
        }]
      },
      dev : {
        files : [{
          expand : true,
          cwd : 'dev/docs/',
          src : '**/*.html',
          dest : 'dev/docs/'
        }]
      },
      dist : {
        files : [{
          expand : true,
          cwd : 'dist/docs/',
          src : '**/*.html',
          dest : 'dist/docs/'
        }]
      }
    },

    htmljson : {
      dev_1 : {
        src : ['dev/docs/cookie-policy/**/*.html'],
        dest : 'dev/docs/cookie-policy/json/cookie_policy_docs.json'
      },
      dev_2 : {
        src : ['dev/docs/privacy-policy/html/*.html'],
        dest : 'dev/docs/privacy-policy/json/privacy_policy_docs.json',
        options: {
          separator: 2,
        },
      },
      dist_1 : {
        src : ['dist/docs/cookie-policy/**/*.html'],
        dest : 'dist/docs/cookie-policy/json/cookie_policy_docs.json'
      },
      dist_2 : {
        src : ['dist/docs/privacy-policy/html/*.html'],
        dest : 'dist/docs/privacy-policy/json/privacy_policy_docs.json',
        options: {
          separator: 2,
        },
      }
    },

    merge_data : {
      options : {
        // Task-specific options go here.
      },
      dev : {
        src : ["dev/docs/cookie-policy/json/cookie_policy_docs.json", "dev/docs/privacy-policy/json/privacy_policy_docs.json"],
        dest : 'dev/docs/docs.complete.json'
      },
      dist : {
        src : ["dist/docs/cookie-policy/json/cookie_policy_docs.json", "dist/docs/privacy-policy/json/privacy_policy_docs.json"],
        dest : 'dist/docs/docs.complete.json'
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dev: {
        files: [{
          src: 'dev/docs/docs.complete.json',
          dest: 'dev/tool/docs/docs.complete.json'
        }]
      },
      dist: {
        files: [{
          src: 'dev/docs/docs.complete.json',
          dest: 'dist/tool/docs/docs.complete.json'
        }, {
          src: 'dev/tool/css/demo.css',
          dest: 'dist/tool/css/demo.css',
        },
        {
          src: 'dev/tool/js/jquery.fdCookieLaw.js',
          dest: 'dist/tool/js/jquery.fdCookieLaw.js',
        },
        /*{
          expand: true,
          cwd: 'dev/tool/js/',
          src: '*.js',
          dest: 'dist/tool/js/',
        },*/ {
          expand: true,
          cwd: 'dev/tool/',
          src: '*.*',
          dest: 'dist/tool/',
        }]
      }
    },

    jshint : {
      dev : ['dev/tool/js/*.js'],
      dist : ['dist/tool/js/*.js']
    },

    less : {
      development : {
        options : {
          sourceMap : true,
          sourceMapFileInline : true
        },
        files : [{
          "dev/tool/css/fdCookieLaw.css" : "dev/tool/less/fdCookieLaw.less"
        }]
      },
      production : {
        options : {
          banner: "<%= meta.banner %>"
        },
        files : [{
          "dist/tool/css/fdCookieLaw.css" : "dev/tool/less/fdCookieLaw.less"
        }]
      }
    },

    watch : {
      styles : {
        files : ['**/*.less'], // which files to watch
        tasks : ['less'],
        options : {
          nospawn : true
        }
      }
    },
    cssmin: {
        options: {
            shorthandCompacting: false,
            roundingPrecision: -1,
            banner: "<%= meta.banner %>"
        },
        dist: {
            files: {
                'dist/tool/css/fdCookieLaw.min.css': ['dist/tool/css/fdCookieLaw.css']
            }   
        }
    },
    concat: {
        options: {
          banner: "<%= meta.banner %>"
        },
        dist: {
          src: ['dist/tool/js/jquery.fdCookieLaw.js'],
          dest: 'dist/tool/js/jquery.fdCookieLaw.js',
        }
    },  
    uglify: {
        options: {
          banner: "<%= meta.banner %>"
        },
        dist: {
            files: {
                'dist/tool/js/jquery.fdCookieLaw.min.js': ['dev/tool/js/jquery.fdCookieLaw.js']
            }
        }
    }

  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-md2html');
  grunt.loadNpmTasks('grunt-dom-munger');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-htmljson');
  grunt.loadNpmTasks('grunt-html-json-wrapper');
  grunt.loadNpmTasks('grunt-merge-data');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');   
  grunt.loadNpmTasks('grunt-contrib-uglify');   
  grunt.loadNpmTasks('grunt-contrib-concat');    

  // Default task(s).
  grunt.registerTask('default', [
    'clean:dev',
    'md2html:dev',
    'dom_munger:dev',
    'string-replace:dev',
    'htmljson:dev_1',
    'htmljson:dev_2',
    'merge_data:dev',
    'less:development',
    'copy:dev',
    'jshint:dev',
  ]);

  grunt.registerTask('dist', [
    'clean:dist',
    'md2html:dist',
    'dom_munger:dist',
    'string-replace:dist',
    'htmljson:dist_1',
    'htmljson:dist_2',
    'merge_data:dist',
    'less:production',
    'copy:dist',
    'jshint:dist',
    'cssmin:dist',
    'concat:dist',  
    'uglify:dist'  
  ]);

};