var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    uglify = require('gulp-uglify'),
    cleanCss = require('gulp-clean-css'),
    gulpIf = require('gulp-if'),
    htmlMin = require('gulp-html-minify');
    jsonMin = require('gulp-jsonminify');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir, 
    sassStyle,
    prodBuild;

var env = process.env.NODE_ENV || 'dev';
// if an environment variable has been set, use it, otherwise assume
// that we are in a development environment

if ( env === 'dev' ){
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
    prodBuild = false;
} else if ( env === 'prod' ) {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
    prodBuild = true;
} else {
    console.log( 'Error: invalid environment variable' );
}

coffeeSources = ['components/coffee/tagline.coffee'];    
jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];

sassSources = ['components/sass/style.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];

gulp.task('html', function() {
    gulp.src('builds/development/*.html')
        .pipe(gulpIf(prodBuild, htmlMin()))
        .pipe(gulpIf(prodBuild, gulp.dest(outputDir)))
        .pipe(connect.reload())
});

gulp.task('json', function() {
    gulp.src(jsonSources)
        .pipe(gulpIf(prodBuild, jsonMin()))
        .pipe(gulpIf(prodBuild, gulp.dest(outputDir + 'js')))
        .pipe(connect.reload())
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
        .pipe(gulpIf(prodBuild, uglify()))
    	.pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload())
});

gulp.task('compass', function() {
  	gulp.src(sassSources)
    	.pipe(compass({
    		sass: 'components/sass',
    		image: outputDir + 'images',
            style: sassStyle
    	})
    	.on('error', gutil.log))
        .pipe(gulpIf(prodBuild, cleanCss()))
    	.pipe(gulp.dest(outputDir + 'css'))
        .pipe(connect.reload())
});

gulp.task('connect', function() { // rem 'callback' == 'anonymous function'
  connect.server({
    root: outputDir,
    port: 8000, 
    livereload: true 
  });
});

gulp.task('watch', function() {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch('builds/development/*.html', ['html']);
    gulp.watch(jsonSources, ['json']);
});

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);


