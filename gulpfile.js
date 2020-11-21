const gulp = require(`gulp`);
const plumber = require(`gulp-plumber`);
const clean = require(`gulp-clean`);
const imagemin = require(`gulp-imagemin`);
const webp = require(`gulp-webp`);
const htmlhint = require(`gulp-htmlhint`);
const htmlValidator = require(`gulp-w3c-html-validator`);
const htmlmin = require(`gulp-htmlmin`);
const sourcemap = require(`gulp-sourcemaps`);
const postcss = require(`gulp-postcss`);
const autoprefixer = require(`autoprefixer`);
const csso = require(`postcss-csso`);
const rename = require(`gulp-rename`);
const browserify = require(`browserify`);
const babelify = require(`babelify`);
const terser = require(`gulp-terser`);
const source = require(`vinyl-source-stream`);
const buffer = require(`vinyl-buffer`);
const concat = require(`gulp-concat`);
const argv = require(`yargs`).argv;
const gulpif = require(`gulp-if`);
const server = require(`browser-sync`).create();

const copy = (paths) => {
  return gulp.src(paths, {base: `source/`})
    .pipe(gulp.dest(`build/`));
};

const minifyPictures = (paths) => {
  return gulp.src(paths, {base: `source/`})
    .pipe(
        gulpif(
            argv.production,
            imagemin([
              imagemin.mozjpeg({progressive: true}),
              imagemin.optipng({optimizationLevel: 3}),
              imagemin.svgo({plugins: [{removeViewBox: false}]})
            ])
        )
    )
    .pipe(gulp.dest(`build/`));
};

const formattedPictures = (paths) => {
  const method = argv.production ? 6 : 0;

  return gulp.src(paths, {base: `source/`})
    .pipe(webp({method}))
    .pipe(gulp.dest(`build/`));
};

const addNewImg = (path) => {
  minifyPictures([path]);
  formattedPictures([path]);
};

const addNewWebp = (path) => {
  formattedPictures([path]);
};

const addNewSvg = (path) => {
  minifyPictures([path]);
};

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
  return gulp.src(`build/`, {allowEmpty: true})
    .pipe(clean());
});

gulp.task(`copy-static-files`, () => {
  return copy(
      [
        `source/fonts/**/*.{woff,woff2}`,
        `source/favicon.ico`
      ]
  );
});

gulp.task(`minify-pictures`, () => {
  return minifyPictures([`source/img/**/*.{png,jpg,svg}`]);
});

gulp.task(`formatted-pictures`, () => {
  return formattedPictures([`source/img/**/*.{png,jpg}`]);
});

gulp.task(`markup`, () => {
  return gulp.src(`source/html/**/*.html`)
    .pipe(
        gulpif(
            argv.production,
            htmlmin({
              collapseWhitespace: true,
              removeComments: true,
              removeRedundantAttributes: true,
            })
        )
    )
    .pipe(gulp.dest(`build/`));
});

gulp.task(`styles`, () => {
  const isProd = Boolean(argv.production);

  return gulp.src(
      [
        `source/css/normalize.css`,
        `source/css/style.css`
      ]
  )
    .pipe(plumber())
    .pipe(
        gulpif(
            !isProd,
            sourcemap.init()
        )
    )
    .pipe(concat(`concat-style.css`))
    .pipe(postcss([
      autoprefixer,
      csso(
          {
            comments: false,
          }
      )
    ]))
    .pipe(rename(`style.min.css`))
    .pipe(
        gulpif(
            !isProd,
            sourcemap.write()
        )
    )
    .pipe(gulp.dest(`build/css/`));
});

gulp.task(`scripts`, () => {
  const isProd = Boolean(argv.production);

  return Promise.resolve(
      browserify({
        entries: `source/js/index.js`,
        debug: !isProd
      })
        .transform(babelify)
        .bundle()
        .pipe(source(`bundle.js`))
        .pipe(buffer())
        .pipe(
            gulpif(
                !isProd,
                sourcemap.init({loadMaps: true})
            )
        )
        .pipe(
            gulpif(
                isProd,
                terser()
            )
        )
        .pipe(rename(`app.min.js`))
        .pipe(
            gulpif(
                !isProd,
                sourcemap.write()
            )
        )
        .pipe(gulp.dest(`build/js/`))
  ).catch(() => {});
});

gulp.task(`build`, gulp.series(
    `clean`,
    `copy-static-files`,
    `minify-pictures`,
    `formatted-pictures`,
    `markup`,
    `styles`,
    `scripts`
));

gulp.task(`refresh`, () => {
  server.reload();
});

gulp.task(`server`, () => {
  server.init({
    server: {
      baseDir: `build/`
    }
  });

  gulp.watch(`source/html/*.html`).on(`all`, gulp.series(`markup`, `refresh`));
  gulp.watch(`source/css/**/*.css`).on(`all`, gulp.series(`styles`, `refresh`));
  gulp.watch(`source/js/**/*.js`).on(`all`, gulp.series(`scripts`, `refresh`));
  gulp.watch(`source/img/**/*.{png,jpg}`).on(`add`, (args) => {
    addNewImg(args);
    server.reload();
  });
  gulp.watch(`source/img/**/*.webp`).on(`add`, (args) => {
    addNewWebp(args);
    server.reload();
  });
  gulp.watch(`source/img/**/*.svg`).on(`add`, (args) => {
    addNewSvg(args);
    server.reload();
  });
  gulp.watch(`source/img/**/*.svg`).on(`change`, (args) => {
    copy(args);
    server.reload();
  });
});

gulp.task(`start`, gulp.series(`build`, `server`));
