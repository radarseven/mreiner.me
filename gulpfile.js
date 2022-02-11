// Manually require `gulp`
const gulp = require('gulp'); // Gulp!

// load all plugins in 'devDependencies' into the variable `$`
const $ = require('gulp-load-plugins')({
  pattern: ['*'],
  scope: ['devDependencies']
});

// read in package vars from `package.json`
const pkg = require('./package.json');

// Browsersync
const browserSync = $.browserSync.create();

// Auto Prefixer Options
var autoprefixerOptions = {
  browsers: [
    'last 2 versions'
  ],
  cascade: false
};

// Error Logging
var onError = function(err) {
  console.log(err.toString());
  this.emit('end');
};

// Browsersync
gulp.task('browser-sync', function() {
  browserSync.init({
    logLevel: 'info',
    open: 'ui',
    proxy: 'mreiner.dev'
  });
});

// Copy JS files
gulp.task('jscopy', function() {
  gulp.src(filesToMove)
    .pipe(gulp.dest(paths.build + 'js/vendor/'))
});

// JS Hint
gulp.task('jshint', function() {
  return gulp.src(pkg.paths.src.js + 'modules/*.js')
    .pipe($.jshint())
    .pipe($.jshint.reporter($.jshintStylish))
    .pipe($.jshint.reporter('fail'));
});

// Combine JS Plugins
gulp.task('combine-js-plugins', ['clean-combine-js-plugins'], function() {
  return gulp.src(pkg.paths.src.js + 'plugins.js')
    .pipe($.include())
    .pipe(gulp.dest(pkg.paths.src.js + 'combined/'))
    .pipe($.notify('JS Plugins Combined'))
  ;
});

// Clean out the combined JS file
gulp.task('clean-combine-js-plugins', function() {
  $.del(pkg.paths.src.js + 'combined/plugins.js');
});

// Combine JS Modules
gulp.task('combine-js-modules', ['clean-combine-js-modules', 'jshint'], function() {
  return gulp.src(pkg.paths.src.js + 'modules/*.js')
    .pipe($.concat('modules.js'))
    .pipe($.insert.prepend('$(function() {')) // jQuery Opening tags
    .pipe($.insert.append('});')) // jQuery closing tags
    .pipe($.sourcemaps.write('maps'))
    .pipe(gulp.dest(pkg.paths.src.js + 'combined/'))
    .pipe($.notify('JS Modules Combined'))
  ;
});

// Clean JS modules
gulp.task('clean-combine-js-modules', function() {
  $.del(pkg.paths.src.js + 'combined/modules.js');
});

// Concatenate & Minify JS
gulp.task('build-js', ['combine-js-plugins', 'combine-js-modules', 'clean-build-js'], function() {
  return gulp.src([
    pkg.paths.src.js + 'combined/plugins.js',
    pkg.paths.src.js + 'combined/modules.js'
  ])
    .pipe($.sourcemaps.init())
    .pipe($.plumber())
    .pipe($.concat('production.js'))
    .pipe(gulp.dest(pkg.paths.src.js))
    .pipe($.rename('production.min.js'))
    .pipe($.uglify())
    .pipe($.sourcemaps.write('maps'))
    .pipe(gulp.dest(pkg.paths.dist.js))
    .pipe($.notify('JS Compiled'))
  ;
});

// Clean JS build file
gulp.task('clean-build-js', function() {
  $.del(pkg.paths.dist.js + '**.js');
});

// Modernizr Custom File Builder -- https://github.com/doctyper/gulp-modernizr
gulp.task('modernizr', function() {
  gulp.src(pkg.paths.src.js + '*.js')
    .pipe($.modernizr('modernizr-custom.js', {
      tests: [
        'touchevents'
      ]
    }))
    .pipe($.uglify())
    .pipe(gulp.dest(pkg.paths.dist.js))
});

// SCSS
gulp.task('styles', function() {
  return gulp.src(pkg.paths.src.scss + 'main.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      errLogToConsole: false,
      outputStyle: 'compressed'
    }))
    .on('error', function(err) {
      $.notify().write(err);
        this.emit('end');
    })
    .pipe($.autoprefixer(autoprefixerOptions))
    .pipe($.sourcemaps.write('maps'))
    .pipe($.size({ gzip: true, showFiles: true }))
    .pipe(gulp.dest(pkg.paths.dist.css))
    .pipe(browserSync.stream({match: '**/*.css'}))
    .pipe($.notify('SCSS Processed'))
  ;
});

// Image Minifying
gulp.task('imagemin', function() {
  gulp.src(pkg.paths.src.img + '**/*')
    .pipe($.changed(pkg.paths.dist.img))
    .pipe($.imagemin({
      progressive: true,
      svgoPlugins: [
        { collapseGroups            : false },
        { removeUnknownsAndDefaults : false },
        { removeViewBox             : false }
      ],
      use: [$.imageminPngcrush()]
    }))
    .pipe(gulp.dest(pkg.paths.dist.img))
    .pipe($.notify('Images Optimized'))
});

// SVG sprite
gulp.task('svgSprites', function () {
  return gulp.src(pkg.paths.src.svg + '*.svg')
  .pipe($.plumber())
  .pipe($.rename({prefix: 'icon-'}))
  .pipe($.cheerio({
    run: function ($) {
      $('[fill]').removeAttr('fill');
    },
    parserOptions: { xmlMode: true }
  }))
  .pipe($.svgmin({
    plugins: [
      { removeTitle: true },
      { removeUselessStrokeAndFill: true }
    ],
    s2svg: {
      pretty: true
    }
  }))
  .pipe($.svgstore({
    inlineSvg: true
  }))
  .pipe(gulp.dest(pkg.paths.dist.svg));
});

// Watch
gulp.task('watch', function() {
  // gulp.watch(pkg.paths.src.js + 'modules/*.js', ['jshint', 'combine-js-modules', 'build-js']);
  // gulp.watch(pkg.paths.src.js + 'plugins.js', ['combine-js-plugins', 'build-js']);
  gulp.watch(pkg.paths.src.scss + '**/*.scss', ['styles']);
  gulp.watch(pkg.paths.src.img + '**/*.*', ['imagemin']);
  gulp.watch(pkg.paths.src.svg + '**/*.svg', ['svgSprites']);
});

gulp.task('webpack', () => {
  var webpackConfig = Object.create(require('./webpack.config.js'));
  webpackConfig.watch = true;
  return $.webpackStream(webpackConfig, $.webpack)
            .pipe(gulp.dest(pkg.paths.dist.js))
  ;
});

// Webpack default task
gulp.task('default', [
  'browser-sync',
  'webpack',
  'styles',
  'imagemin',
  'svgSprites',
  'watch'
]);

// Default Task
// gulp.task('default', ['browser-sync', 'jshint', 'styles', 'build-js', 'imagemin', 'svgSprites', 'combine-js-plugins', 'combine-js-modules', 'watch']);

