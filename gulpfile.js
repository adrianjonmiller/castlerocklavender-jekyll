const child = require('child_process');
const browserSync = require('browser-sync').create();

const gulp = require('gulp');
const concat = require('gulp-concat');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const rjs = require('gulp-requirejs');
const sourcemaps = require('gulp-sourcemaps');
const jshint = require('gulp-jshint');
const stylish = require('jshint-stylish');
const watch = require('gulp-watch');

const siteRoot = './_site';
const cssFiles = './_src/scss/**/*.scss';
const jsFiles = './_src/js/*.js';

gulp.task('css', () => {
  return watch(cssFiles, function () {
    gulp.src(cssFiles)
    .pipe(sass({
      includePaths: cssFiles
    }).on('error', sass.logError))
    .pipe(gulp.dest('./_css'));
  })
});

gulp.task('js', () => {
  return gulp.src([
      jsFiles
    ])
    .pipe(jshint({
      node: true
    }))
    .pipe(jshint.reporter(stylish))
    .on('error', gutil.log.bind(gutil, 'JSHint Error'))
    .pipe(gulp.dest('_js'))
});

gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['build',
    '--watch'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
    };

  jekyll.stdout.on('data', jekyllLogger);
  jekyll.stderr.on('data', jekyllLogger);
});

gulp.task('serve', () => {
  browserSync.init({
    files: [siteRoot + '/**'],
    port: 4000,
    server: {
      baseDir: siteRoot
    }
  });

  gulp.watch(jsFiles, ['js']);
  gulp.watch(cssFiles, ['css']);
});

gulp.task('default', ['css', 'js', 'jekyll', 'serve']);
