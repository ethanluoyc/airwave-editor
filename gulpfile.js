var gulp = require('gulp'),
    webserver = require('gulp-webserver'),
    browserify = require('browserify'),
    watchify = require('watchify'),
    debowerify = require('debowerify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    assign = require('lodash.assign'),
    coffee = require('gulp-coffee'),
    coffeeify = require('coffeeify'),
    reactify = require('reactify'),
    plumber = require('gulp-plumber'),
    sass = require('gulp-sass');

gulp.task('default', ['webserver', 'watch', 'bundle', 'sass', 'css'], function() {
  plumber();
  // place code for your default task here
});

gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: false
    }));
});

gulp.task('coffee', function() {
  gulp.src('./src/*.coffee')
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
  gulp.watch(['./src/**/*'],['css', 'html']);
});

gulp.task('css', function(){
    gulp.src(['./src/**/*.css'])
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('sass', function(){
    gulp.src('./src/sass/**/*.scss')
		gulp.src('./src/sass/**/*.sass')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./dist/css'));
});

gulp.task('html', function() {
    gulp.src(['./src/**/*.html'])
    .pipe(gulp.dest('./dist'));
});

// Adapted from https://github.com/gulpjs/gulp/blob/master/docs/recipes/fast-browserify-builds-with-watchify.md
// watchify for building
// add custom browserify options here
var customOpts = {
  entries: ['./src/editor.jsx'],
  debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

// add transformations here
// i.e. b.transform(coffeeify);
b.transform(reactify);
b.transform(debowerify);

gulp.task('bundle', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
  return b.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    .pipe(source('bundle.js'))
    // optional, remove if you don't need to buffer file contents
    .pipe(buffer())
    // optional, remove if you dont want sourcemaps
    .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
    // Add transformation tasks to the pipeline here.
    .pipe(sourcemaps.write('./')) // writes .map file
    .pipe(gulp.dest('./dist'));
}
