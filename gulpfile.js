"use strict";

const gulp = require("gulp");
const server = require("browser-sync").create();
const del = require("del");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const concat = require("gulp-concat");
const minify = require("gulp-minify");

sass.compiler = require("node-sass");

gulp.task("images", function() {
  return gulp
    .src("assets/img/**/*.{png,jpg,svg}")
    .pipe(
      imagemin([
        imagemin.optipng({ optimizationLevel: 3 }),
        imagemin.mozjpeg({ progressive: true }),
        imagemin.svgo({
          plugins: [{ removeViewBox: false }]
        })
      ])
    )
    .pipe(gulp.dest("build/assets/img"));
});

gulp.task("webp", function() {
  return gulp
    .src("assets/img/**/*.{png,jpg}")
    .pipe(webp({ quality: 75 }))
    .pipe(gulp.dest("build/assets/img"));
});

gulp.task("refresh", function(done) {
  server.reload();
  done();
});

gulp.task("server", function() {
  server.init({
    server: "build/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("assets/scss/**/*.scss", gulp.series("css", "refresh"));
  gulp.watch("assets/js/**/*.js", gulp.series("js", "refresh"));
  gulp.watch("*.html", gulp.series("copy:html", "refresh"));
});

gulp.task("copy:html", function() {
  return gulp.src("*.html").pipe(gulp.dest("build"));
});

gulp.task("css", function() {
  return gulp
    .src("assets/scss/main.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(rename("style.css"))
    .pipe(gulp.dest("build/assets/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("build/assets/css"));
});

gulp.task("copy:fonts", function() {
  return gulp
    .src(["assets/fonts/**/*.{ttf,woff,woff2}"], {
      base: "assets"
    })
    .pipe(gulp.dest("build/assets"));
});

gulp.task("js", function() {
  return gulp
    .src(["assets/js/polyfills.js", "assets/js/modernizr.custom.js", "assets/js/index.js"])
    .pipe(concat("main.js"))
    .pipe(
      minify({
        ext: {
          src: ".js",
          min: ".min.js"
        }
      })
    )
    .pipe(gulp.dest("build/assets/js"));
});

gulp.task("clean", function() {
  return del(["build/assets/css", "build/assets/fonts", "build/assets/js", "build/index.html"]);
});

gulp.task("images", gulp.series("images", "webp"));
gulp.task("build", gulp.series("clean", "copy:fonts", "js", "css", "copy:html"));
gulp.task("start", gulp.series("build", "server"));
