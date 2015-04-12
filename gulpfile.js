/* File: gulpfile.js */

// grab our gulp packages
var gulp  = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    plugins = require('gulp-load-plugins')();;

// create a default task and just log a message
gulp.task('default', function() {
  return gutil.log('Gulp is running!')
});

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

// gulp.task('jshint', function() {
//   return gulp.src('source/javascript/**/*.js')
//     .pipe(jshint())
//     .pipe(jshint.reporter('jshint-stylish'));
// });

// gulp.task('build-js', function() {
//   return gulp.src('source/javascript/**/*.js')
//     .pipe(sourcemaps.init())
//       .pipe(concat('bundle.js'))
//       //only uglify if gulp is ran with '--type production'
//       .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop()) 
//     .pipe(sourcemaps.write())
//     .pipe(gulp.dest('public/assets/javascript'));
// });

// Minify Custom JS: Run manually with: "gulp build-js"
// gulp.task('build-js', function() {
//   return gulp.src('assets/js/*.js')
//     .pipe(plugins.jshint())
//     .pipe(plugins.jshint.reporter('jshint-stylish'))
//     .pipe(plugins.uglify())
//     .pipe(plugins.concat('scripts.min.js'))
//     .pipe(gulp.dest('build'));
// });

// Less to CSS: Run manually with: "gulp build-css"
gulp.task('build-css', function() {
    //return gulp.src('public/stylesheets/less/*.less')
    return gulp.src('public/stylesheets/less/style.less')
        .pipe(plugins.plumber())
        .pipe(plugins.less())
        .on('error', function (err) {
            gutil.log(err);
            this.emit('end');
        })
        .pipe(plugins.autoprefixer(
            {
                browsers: [
                    '> 1%',
                    'last 2 versions',
                    'firefox >= 4',
                    'safari 7',
                    'safari 8',
                    'IE 8',
                    'IE 9',
                    'IE 10',
                    'IE 11'
                ],
                cascade: false
            }
        ))
        .pipe(plugins.cssmin())
        .pipe(gulp.dest('public/stylesheets/css')).on('error', gutil.log);
});

// Default task
gulp.task('watch', function() {
    // gulp.watch('assets/js/libs/**/*.js', ['squish-jquery']);
    // gulp.watch('assets/js/*.js', ['build-js']);
    gulp.watch('public/stylesheets/less/*.less', ['build-css']);
});