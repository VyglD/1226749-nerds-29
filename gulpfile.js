'use strict';

const gulp = require(`gulp`);
const plumber = require(`gulp-plumber`);
const clean = require(`gulp-clean`);
const imagemin = require(`gulp-imagemin`);
const webp = require(`gulp-webp`);
const htmlhint = require(`gulp-htmlhint`);
const htmlValidator = require(`gulp-w3c-html-validator`);
const htmlmin = require(`gulp-htmlmin`);
const sourcemap = require(`gulp-sourcemaps`);
const concatCss = require(`gulp-concat-css`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const csso = require(`postcss-csso`);
const rename = require(`gulp-rename`);
const terser = require(`gulp-terser`);
const concat = require(`gulp-concat`);
const server = require(`browser-sync`).create();

gulp.task(`test`, () => {
  return gulp.src([
    `source/html/**/*.html`,
    `build/*.html`
  ])
    .pipe(plumber())
    .pipe(htmlhint(`.htmlhintrc`))
    .pipe(htmlhint.reporter())
    .pipe(htmlValidator())
    .pipe(htmlValidator.reporter());
});

gulp.task(`clean`, () => {
  return gulp.src(
      `build`,
      {allowEmpty: true}
  )
    .pipe(clean());
});

gulp.task(`copy`, () => {
  return gulp.src(
      [
        `source/fonts/**/*.{woff,woff2}`,
        `source/img/**/*.{png,jpg,svg,webp}`
      ],
      {
        base: `source`,
      }
  )
    .pipe(gulp.dest(`build`));
});

gulp.task(`minify-pictures`, () => {
  return gulp.src(`source/img/**/*.{png,jpg,svg}`)
  .pipe(imagemin([
    imagemin.mozjpeg({progressive: true}),
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.svgo({plugins: [{removeViewBox: false}]})
  ]))
  .pipe(gulp.dest(`build/img`));
});

gulp.task(`formatted-pictures`, () => {
  return gulp.src(`source/img/**/*.{png,jpg}`)
    .pipe(webp({method: 6}))
    .pipe(gulp.dest(`build/img`));
});

gulp.task(`markup`, () => {
  return gulp.src(`source/html/**/*.html`)
  .pipe(htmlmin({
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
  }))
  .pipe(gulp.dest(`build`));
});

gulp.task(`styles`, () => {
  return gulp.src(
      [
        `source/css/normalize.css`,
        `source/css/style.css`
      ]
  )
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(concatCss(`concatStyle.css`))
    .pipe(postcss([
      autoprefixer,
      csso(
          {
            comments: false,
          }
      )
    ]))
    .pipe(rename(`style.min.css`))
    .pipe(sourcemap.write(`.`))
    .pipe(gulp.dest(`build/css/`))
    .pipe(server.stream());
});

gulp.task(`scripts`, () => {
  return gulp.src(`source/js/modules/**/*.js`)
    .pipe(sourcemap.init())
    .pipe(concat(`app.min.js`))
    .pipe(terser())
    .pipe(sourcemap.write())
    .pipe(gulp.dest(`build/js/`));
});

gulp.task(`server`, () => {
  server.init({
    server: `build`,
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch(`source/html/*.html`).on(`change`, gulp.series(`markup`, server.reload));
  gulp.watch(`source/img/**/*.{png,jpg,svg,webp}`).on(`change`, gulp.series(`copy`, server.reload));
  gulp.watch(`source/css/**/*.css`).on(`change`, gulp.series(`styles`, server.reload));
  gulp.watch(`source/js/**/*.js`).on(`change`, gulp.series(`scripts`, server.reload));
});

gulp.task(
    `build`,
    gulp.series(
        `clean`,
        `copy`,
        `minify-pictures`,
        `formatted-pictures`,
        `markup`,
        `styles`,
        `scripts`
    )
);
gulp.task(`start`, gulp.series(`build`, `server`));
