'use strict';

module.exports = function (grunt) {

    // Load all grunt plugins
    require('matchdep')
        .filterDev('grunt-*')
        .forEach(grunt.loadNpmTasks);


    // JS files
    var jsfiles = [ "app/js/submission.js" ];

    grunt.initConfig({

        serve: {
            options: {
                serve: {
                    path: './www/'
                },
                port: 9099
            }
        },

        watchify: {
            dev: {
                options: {
                    verbose: true
                },
                src: './app/app.js',
                dest: './app/js/app.min.js' //'./www/js/app.min.js'
            }
        },

        // for js
        uglify: {
            dev: {
                files: {
                    'www/js/app.min.js': jsfiles
                }
            }
        },

        watch: {
            sass: {
                files: './scss/**/*.scss',
                tasks: ['sass:dev'],
                options: {
                    livereload: true
                }
            },
            jade: {
                files: './app/templates/**/*.jade',
                tasks: ['jade']
            }
        },

        // Sass
        sass: {
            dev: {
                options: {
                    sourceMaps: true
                },
                files: {
                    'www/css/app.min.css': 'scss/app.scss'
                }
            },
            prd: {
                options: {
                    sourceMaps: false,
                    outputStyle: 'compressed'
                },
                files: {
                    'www/css/app.min.css': 'scss/app.scss'
                }
            }
        },

        jade: {
            //ngTmpls: {
            //    options: {
            //        client: true,
            //        amd: false,
            //        namespace: 'ngTmpls'
            //    },
            //    files: {
            //        './www/js/templates.min.js': ['./app/templates/layout/*.jade', './app/templates/modules/*.jade', './app/templates/layout/main.jade']
            //    }
            //},
            compile: {
                options: {
                    data: {
                        debug: false,
                        expanded: true
                    }
                },
                files: {
                    './www/home.html': './app/templates/home.jade',
                    './www/submission.html': './app/templates/submission.jade',
                    './www/about.html': './app/templates/about.jade'
                }
            }
        }
    });

    var devTasks = ['jade', 'uglify', 'sass:dev', 'watch_dev'];
    var prdTasks = ['jade', 'uglify', 'sass:prd'];

    grunt.registerTask('default', prdTasks);
    grunt.registerTask('dev', devTasks);
    grunt.registerTask('prd', prdTasks);
};
