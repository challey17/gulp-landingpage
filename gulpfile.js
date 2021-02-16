// The require statement tells Node to look into the node_modules folder for a package named gulp(or whatever).
//Once the package is found, we assign its contents to variables.
const { src, dest, watch, series } = require("gulp");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const cssnano = require("cssnano");
const terser = require("gulp-terser");
const browsersync = require("browser-sync").create();

//Sass Task
function scssTask() {
  return src("app/scss/style.scss", { sourcemaps: true })
    .pipe(sass())
    .pipe(postcss([cssnano()]))
    .pipe(dest("dist", { sourcemaps: "." }));
}

// JavaScript Task
function jsTask() {
  return src("app/js/script.js", { sourcemaps: true })
    .pipe(terser())
    .pipe(dest("dist", { sourcemaps: "." }));
}

//Browsersync Tasks, serve and reload
function browsersyncServe(cb) {
  browsersync.init({
    server: {
      baseDir: "app",
    },
  });
  cb();
}

function browsersyncReload(cb) {
  browsersync.reload();
  cb();
}

// Watch Task
function watchTask() {
  watch("*.html", browsersyncReload);
  //if *any* js or scss file changes, run gulp tasks, then refresh browser
  watch(
    ["app/scss/**/*.scss", "app/js/**/*.js"],
    series(scssTask, jsTask, browsersyncReload)
  );
}

// set Defualt Gulp task
exports.default = series(scssTask, jsTask, browsersyncServe, watchTask);
