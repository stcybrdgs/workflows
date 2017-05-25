var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat');
    connect = require('gulp-connect');

var coffeeSources = ['components/coffee/tagline.coffee'];    
var jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];

var sassSources = ['components/sass/style.scss'];

gulp.task('log', function(){
    gutil.log('Workflows are awesome');
});

gulp.task('coffee', function(){
    gulp.src('components/coffee/tagline.coffee')
        .pipe(coffee({ bare: true })
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});

gulp.task('js', function() {
  	gulp.src(jsSources)
    	.pipe(concat('script.js'))
    	.pipe(browserify())
    	.pipe(gulp.dest('builds/development/js'))
        .pipe(connect.reload())
});

gulp.task('compass', function() {
  	gulp.src(sassSources)
    	.pipe(compass({
    		sass: 'components/sass',
    		image: 'builds/development/images'
    	})
    	.on('error', gutil.log))
    	.pipe(gulp.dest('builds/development/css'))
        .pipe(connect.reload())
});

gulp.task('watch', function() {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
});

gulp.task('default', ['coffee', 'js', 'compass', 'connect', 'watch']);

gulp.task('connect', function() { // rem 'callback' == 'anonymous function'
  connect.server({
    root: 'builds/development',
    port: 8000, // numbers don't need quotes
    livereload: true // booleans don't need quotes
  });
});
