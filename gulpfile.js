/* File: gulpfile.js */

// grab our gulp packages
var gulp = require('gulp');
var gutil = require('gulp-util');
var plugins = require('gulp-load-plugins')();
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var stripDebug = require('gulp-strip-debug');
var ngmin = require('gulp-ngmin');
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var order = require('gulp-order');
var cleanCSS = require('gulp-clean-css');
var cssmin = require('gulp-cssmin');
var concatCss = require('gulp-concat-css');
var pug = require('gulp-pug');
var templateCache = require('gulp-angular-templatecache');
var sequence = require('gulp-sequence');
var svgSprite = require('gulp-svg-sprite');
var plumber = require('gulp-plumber');
var svgMin = require('gulp-svgmin');
var cheerio = require('gulp-cheerio');
var svgNg = require('gulp-svg-ngmaterial');
var gzip = require('gulp-gzip');
var watch = require('gulp-watch');
var less = require('gulp-less');
var nultiProcess = require('gulp-multi-process');
var babel = require('gulp-babel');

// create a default task and just log a message
gulp.task('default', function () {
  return gutil.log('Gulp is running!');
});

// define the default task and add the watch task to it
gulp.task('default', ['watch']);

// Default task
// gulp.task('watch', function() {
// gulp.watch(['rpApp/**/*.pug'], ['build-pug-templatecache']);
// gulp.watch(['rpApp/**/*.less'], ['build-all']);
// // gulp.watch('public/stylesheets/less/*.less', ['build-less']);
// // gulp.watch('public/javascript/ng-app/*.js', ['build-spells']);
// // gulp.watch('public/stylesheets/css/*.css', ['build-css']);
// // gulp.watch('public/stylesheets/less/*.less', ['build-scrolls']);
// });
//
gulp.task('watch', function () {
  watch('rpApp/src/**/*.less', function () {
    nultiProcess(['build-less'], function () {});
  });

  watch('rpApp/src/**/*.pug', function () {
    gulp.start('build-pug-templatecache');
  });

  watch('rpApp/src/**/*.js', function () {
    gulp.start('build-src');
  });
});

/*
SEQUENCES
 */
gulp.task('build-all', function (callback) {
  sequence('build-scrolls', 'build-svg-ng', 'build-spells')(callback);
});

gulp.task('build-scrolls', function (callback) {
  sequence('build-less', 'build-css')(callback);
});

gulp.task('build-spells', function (callback) {
  sequence(
    'build-deferred',
    'build-pug-templatecache',
    'build-src',
    'build-js'
  )(callback);
});

// task to sequence first build-pug then build-templatecache
gulp.task('build-pug-templatecache', function (callback) {
  sequence('build-pug', 'build-templatecache')(callback);
});

gulp.task('build-svg-ng', function () {
  return gulp
    .src('public/icons/*.svg')
    .pipe(svgMin())
    .pipe(svgNg({
      filename: 'sprite.svg'
    }))
    .pipe(gulp.dest('public/icons/sprite/'));
});

// PUG to HTML
gulp.task('build-pug', function () {
  var templateFiles = ['rpApp/src/**/*.pug'];

  return gulp
    .src(templateFiles)
    .pipe(pug())
    .pipe(gulp.dest('views/html/'))
    .on('error', gutil.log);
});

gulp.task('build-templatecache', function () {
  return gulp
    .src('views/html/**/*.html')
    .pipe(templateCache('rpTemplates.js', {
      standalone: true,
      module: 'rpTemplates'
    }))
    .pipe(gulp.dest('rpApp/build'))
    .on('error', gutil.log);
});

gulp.task('build-less', function () {
  return gulp
    .src('public/stylesheets/less/style.less')
    .pipe(plumber())
    .pipe(less())
    .on('error', function (err) {
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
    .pipe(gulp.dest('public/stylesheets/css'))
    .on('error', gutil.log);
});

gulp.task('build-css', function () {
  var cssFiles = ['public/stylesheets/css/*.css'];

  var ignoreBowerComponents = ['material-design-color-palette'];

  function mainBowerFilesFilter(filePath) {
    var i;
    for (i = 0; i < ignoreBowerComponents.length; i++) {
      if (filePath.indexOf(ignoreBowerComponents[i]) !== -1) return false;
    }
    return true;
  }

  return gulp
    .src(mainBowerFiles({
      filter: mainBowerFilesFilter
    }).concat(cssFiles))
    .pipe(filter('**/*.css'))
    .pipe(order([
      'bower_components/angular-material/angular-material.css',
      'bower_components/normalize.css/normalize.css',
      'public/stylesheets/css/twitter-widget.css',
      'public/stylesheets/css/style.css'
    ]))
    .pipe(concatCss('scrolls.min.css'))
    .pipe(cleanCSS())
    .pipe(gulp.dest('public/stylesheets/dist'))
    .on('error', gutil.log);
});

// prepare spells.js
gulp.task('build-js', function () {
  var jsFiles = ['rpApp/build/**/*.js', 'public/javascript/resources/*'];
  var ignoreBowerComponents = ['angular-material', 'dashjs'];

  // http://stackoverflow.com/questions/34547873/exclude-a-folder-from-main-bower-files?lq=1
  function mainBowerFilesFilter(filePath) {
    var i;
    for (i = 0; i < ignoreBowerComponents.length; i++) {
      if (filePath.indexOf(ignoreBowerComponents[i]) !== -1) return false;
    }
    return true;
  }

  return gulp
    .src(mainBowerFiles({
      filter: mainBowerFilesFilter
    }).concat(jsFiles))
    .pipe(filter('**/*.js'))
    .pipe(stripDebug())
    .pipe(concat('spells.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/javascript/dist/'))
    .on('error', gutil.log);
});

gulp.task('build-src', function () {
  return gulp
    .src('rpApp/src/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('rpApp/build/'))
    .on('error', gutil.log);
});

gulp.task('build-deferred', function () {
  return gulp
    .src('public/javascript/resources-deferred/*.js')
    .pipe(stripDebug())
    .pipe(concat('deferred.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest('public/javascript/dist/'));
});

function onError(err) {
  console.log(err);
  this.emit('end');
}
