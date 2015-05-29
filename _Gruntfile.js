module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        clean: [
                    '<%= pkg.cookieDocs.dist %>/',
                    '<%= pkg.privacyDocs.dist %>/',
               ],

        markdown: {
            all: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= pkg.cookieDocs.src %>/',
                        src: '**/*.md',
                        dest: '<%= pkg.cookieDocs.dist %>/',
                        ext: '.html'
                    },
                    {
                        expand: true,
                        cwd: '<%= pkg.privacyDocs.src %>',
                        src: '**/*.md',
                        dest: '<%= pkg.privacyDocs.dist %>/',
                        ext: '.html'
                    }
                ],
                options: {
                    template: 'template.html',
                    autoTemplate: true,
                    autoTemplateFormat: 'html'
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-markdown');
    /*grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-imagemin');
    grunt.loadNpmTasks('grunt-contrib-copy');*/

    // Default task.
    grunt.registerTask('default', [
        'clean',
        'markdown'
        /*'clean',
        'cssmin',
        'uglify',
        'processhtml',
        'htmlmin',
        'imagemin',
        'copy',*/
    ]);
};
