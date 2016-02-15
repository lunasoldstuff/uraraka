/* File: gulpfile.js */

// grab our gulp packages
var gulp = require('gulp');
var gutil = require('gulp-util');
var jshint = require('gulp-jshint');
var plugins = require('gulp-load-plugins')();
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var ngmin = require('gulp-ngmin');

// create a default task and just log a message
gulp.task('default', function() {
	return gutil.log('Gulp is running!');
});

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

// Default task
gulp.task('watch', function() {
	// gulp.watch('assets/js/libs/**/*.js', ['squish-jquery']);
	// gulp.watch('assets/js/*.js', ['build-js']);
	gulp.watch('public/stylesheets/less/*.less', ['build-css']);
	gulp.watch('public/javascript/ng-app/*.js', ['build-ng-app']);
});

// Less to CSS: Run manually with: "gulp build-css"
gulp.task('build-css', function() {
	//return gulp.src('public/stylesheets/less/*.less')
	return gulp.src('public/stylesheets/less/style.less')
		.pipe(plugins.plumber())
		.pipe(plugins.less())
		.on('error', function(err) {
			gutil.log(err);
			this.emit('end');
		})
		.pipe(plugins.autoprefixer({
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
		}))
		.pipe(plugins.cssmin())
		.pipe(gulp.dest('public/stylesheets/css')).on('error', gutil.log);
});

//prepare ng-app js
gulp.task('build-ng-app', function() {
	return gulp.src('public/javascript/ng-app/*.js')
		.pipe(ngmin())
		.pipe(stripDebug())
		.pipe(concat('rp.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/javascript/rp/'));
});

function onError(err) {
	console.log(err);
	this.emit('end');
}

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