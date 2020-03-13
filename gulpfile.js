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

sass.compiler = require("node-sass");

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
  gulp.watch("assets/js/**/*.js", gulp.series("copy:js", "refresh"));
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

gulp.task("copy:assets", function() {
  return gulp
    .src(["assets/fonts/**/*.{ttf,woff,woff2}", "assets/img/**"], {
      base: "assets"
    })
    .pipe(gulp.dest("build/assets"));
});

gulp.task("copy:js", function() {
  return gulp
    .src("assets/js/*", {
      base: "assets"
    })
    .pipe(gulp.dest("build/assets"));
});

gulp.task("clean", function() {
  return del("build");
});

gulp.task("build", gulp.series("clean", "copy:assets", "copy:js", "css", "copy:html"));
gulp.task("start", gulp.series("build", "server"));
