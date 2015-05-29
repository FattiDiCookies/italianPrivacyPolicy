module.exports = function(grunt) {

    'use strict';
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: ["docs/cookie-policy/html/","docs/privacy-policy/html/"],

        md2html: {
            multiple_files: {
                options: {},
                files: [
                    {
                        expand: true,
                        cwd: 'docs/cookie-policy/md/',
                        src: ['**/*.md'],
                        dest: 'docs/cookie-policy/html/',
                        ext: '.html'
                    },
                    {
                        expand: true,
                        cwd: 'docs/privacy-policy/md/',
                        src: ['**/*.md'],
                        dest: 'docs/privacy-policy/html/',
                        ext: '.html'
                    }
                ]
            }
        },
        
        'string-replace': {
            dist: {
                files: {
                    expand: true,
                    cwd: 'docs/',
                    src: '**/*.html',
                    dest: 'docs/'
                },
                options: {
                    replacements: [
                        {
                            pattern: /<h1 (\\S+)=[\"']?((?:.(?![\"']?\\s+(?:\\S+)=|[>\"']))+.)[\"']>?/,
                            replacement: ''
                        }
                    ]
                }
            }
        }


    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-md2html');
    grunt.loadNpmTasks('grunt-string-replace');

    // Default task(s).
    grunt.registerTask('default', [
        'clean',
        'md2html',
        'string-replace'
    ]);

};