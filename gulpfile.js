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
const sassLint = require('gulp-sass-lint');
const extract = require('gulp-html-extract');
const plumber = require('gulp-plumber');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const merge = require('merge-stream');
const rename = require("gulp-rename");
const reload = browserSync.reload;

const siteRoot = './_site';
const siteRootHtml = siteRoot + '/**/*.html';
const cssFiles = ['./src/scss/**/*.s+(a|c)ss'];
const jsFiles = './src/js/*.js';
const html = ['./**/*.html', '!./_site/*'];

gulp.task('css', () => {

  var plugins = [
    autoprefixer({browsers: ['last 2 versions']})
  ];

  var base = gulp.src(cssFiles)
    .pipe(plumber())
    .pipe(sassLint({
      configFile: '.sass-lint.yml'
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    .pipe(sass({
      includePaths: './src/scss'
    }).on('error', sass.logError))
    .pipe(postcss(plugins));

  var partials = gulp.src(html)
    .pipe(plumber())
    .pipe(extract({
      sel: '.scss',
      strip: true
    }))
    .pipe(rename(function(path){
      path.extname = ".scss"
    }))
    .pipe(sassLint({
      configFile: '.sass-lint.yml'
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    .pipe(sass({
      includePaths: './src/scss'
    }).on('error', sass.logError))
    .pipe(postcss(plugins));

  return merge(base, partials)
    .pipe(concat('master.css'))
    .pipe(gulp.dest('./_assets/css'))
    .pipe(browserSync.stream());
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
    .pipe(gulp.dest('./_assets/js'))
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
    port: 4000,
    server: './_site'
  });

  gulp.watch(jsFiles, ['js']);
  gulp.watch([cssFiles, html], ['css']);
  gulp.watch(siteRootHtml).on('change', reload);
});

gulp.task('default', ['css', 'js', 'jekyll', 'serve']);
