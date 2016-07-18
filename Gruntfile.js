'use strict';

module.exports = function (grunt) {

    // Load all grunt plugins
    require('matchdep')
        .filterDev('grunt-*')
        .forEach(grunt.loadNpmTasks);

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
                dest: './www/js/app.min.js'
            }
        },

        browserify: {
            prd: {
                files: {
                    './www/js/app.min.js': './app/app.js'
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
                tasks: ['jade', 'replace']
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
        postcss: {
            prd: {
                options: {
                    map: false,
                    processors: [
                        require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
                        require('cssnano')() // minify the result
                    ]
                },
                dist: {
                    src: './www/css/app.min.css'
                }
            }
        },

        jade: {
            ngTmpls: {
                options: {
                    client: true,
                    amd: false,
                    namespace: 'ngTmpls'
                },
                files: {
                    './www/js/templates.min.js': ['./app/templates/layout/*.jade', './app/templates/modules/*.jade', './app/templates/layout/main.jade']
                }
            },
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

    var devTasks = ['jade', 'browserify:dev', 'sass:dev', 'watch_dev'];
    var prdTasks = ['jade', 'browserify:prd', 'sass:prd', 'postcss:prd'];

    grunt.registerTask('default', prdTasks);
    grunt.registerTask('dev', devTasks);
    grunt.registerTask('prd', prdTasks);
};
