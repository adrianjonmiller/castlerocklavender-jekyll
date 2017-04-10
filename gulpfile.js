const child = require('child_process');
const browserSync = require('browser-sync').create();

const gulp = require('gulp');
const concat = require('gulp-concat');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const watch = require('gulp-debounced-watch');

const siteRoot = '_site';
const cssFiles = '_assets/**/*.?(s)css';

gulp.task('css', () => {
  gulp.src(cssFiles)
    .pipe(sass())
    .pipe(concat('all.css'))
    .pipe(gulp.dest('assets'));
});

gulp.task('htmlProofer', () => {
  const proofer = child.spawn('htmlproofer', [
    './_site',
    '--allow-hash-href',
    '--check-favicon',
    '--check-html',
    '--disable-external'
  ]);

  const jekyllLogger = (buffer) => {
    buffer.toString()
      .split(/\n/)
      .forEach((message) => gutil.log('Jekyll: ' + message));
  };

  proofer.stderr.on('data', jekyllLogger);
  proofer.stdout.on('data', jekyllLogger);
})

gulp.task('jekyll', () => {
  const jekyll = child.spawn('jekyll', ['build',
    '--watch',
    '--incremental'
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

  watch(siteRoot, function () {
    const proofer = child.spawn('htmlproofer', [
      './_site',
      '--allow-hash-href',
      '--check-favicon',
      '--check-html',
      '--disable-external'
    ]);

    const jekyllLogger = (buffer) => {
      buffer.toString()
        .split(/\n/)
        .forEach((message) => gutil.log('Jekyll: ' + message));
    };

    proofer.stderr.on('data', jekyllLogger);
    proofer.stdout.on('data', jekyllLogger);
  }).on('change', browserSync.reload);
  gulp.watch(cssFiles, ['css']);
  // gulp.watch(siteRoot, ['htmlProofer']).on('change', browserSync.reload);
});

gulp.task('default', ['css', 'jekyll', 'serve']);
