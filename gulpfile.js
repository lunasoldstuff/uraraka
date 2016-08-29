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
var mainBowerFiles = require('main-bower-files');
var filter = require('gulp-filter');
var order = require("gulp-order");
var cleanCSS = require('gulp-clean-css');
var cssmin = require('gulp-cssmin');
var concatCss = require('gulp-concat-css');
var jade = require('gulp-jade');
var templateCache = require('gulp-angular-templatecache');
var gulpSequence = require('gulp-sequence');

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

    gulp.watch('public/stylesheets/less/*.less', ['build-less']);
    gulp.watch('views/partials/*.jade', ['build-jade-templatecache']);
    // gulp.watch('public/stylesheets/css/*.css', ['build-css']);
    // gulp.watch('public/javascript/ng-app/*.js', ['build-js']);
});

//task to swquence first build-jade then build-templatecache
gulp.task('build-jade-templatecache', function(callback) {
    gulpSequence('build-jade', 'build-templatecache')(callback);
});

// Jade to HTML
gulp.task('build-jade', function() {
    console.log('build-jade');
    return gulp.src('views/partials/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('views/html/'));

});

gulp.task('build-templatecache', function() {
    console.log('[build-templatecache]');
    return gulp.src('views/html/*.html')
        .pipe(templateCache('rpTemplates.js', {
            standalone: true,
            module: 'rpTemplates'
        }))
        .pipe(gulp.dest('public/javascript/ng-app/'));
});

// Less to CSS: Run manually with: "gulp build-css"
gulp.task('build-less', function() {
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
        // .pipe(plugins.cssmin())
        .pipe(gulp.dest('public/stylesheets/css')).on('error', gutil.log);


});

gulp.task('build-css', function() {

    var cssFiles = ['public/stylesheets/css/*'];

    return gulp.src(mainBowerFiles().concat(cssFiles))
        .pipe(filter('**/*.css'))
        .pipe(order([
            'angular-material.css',
            'font-awesome.css',
            'normalize.css',
            'materialdesignicons.css',
            'mfb.css',
            'twitter-widget.css',
            'style.css'
        ]))
        .pipe(concatCss('scrolls.min.css'))
        .pipe(cleanCSS())
        // .pipe(cssmin())
        .pipe(gulp.dest('public/stylesheets/dist')).on('error', gutil.log);

});

//prepare ng-app js
gulp.task('build-js', function() {

    var jsFiles = ['public/javascript/ng-app/*', 'public/javascript/resources/*'];
    // var ignoreBowerComponents = ['angular-material'];

    //(http://stackoverflow.com/questions/34547873/exclude-a-folder-from-main-bower-files?lq=1)
    function mainBowerFilesFilter(filePath) {
        for (var i = 0; i < ignoreBowerComponents.length; i++) {
            if (filePath.indexOf(ignoreBowerComponents[i]) !== -1)
                return false;
        }
        return true;
    }

    return gulp.src(mainBowerFiles({
            filter: mainBowerFilesFilter
        }).concat(jsFiles))
        .pipe(filter('**/*.js'))
        .pipe(stripDebug())
        .pipe(concat('spells.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/javascript/dist/'));
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
