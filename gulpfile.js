const gulp = require("gulp");
const nodemon = require("gulp-nodemon");
const livereload = require("gulp-livereload");
const sass = require("gulp-ruby-sass");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
const minifyCss = require("gulp-minify-css");
const rev = require("gulp-rev");
const revCollector = require("gulp-rev-collector");
const babel = require("gulp-babel");
const del = require("del");

gulp.task("sass", () => {
  return sass("./public/css/**/*.scss")
    .pipe(concat("main.min.css"))
    .pipe(minifyCss())
    .pipe(rev())
    .pipe(gulp.dest("./public/dist"))
    .pipe(rev.manifest({base: "./public/dist/", merge: true}))
    .pipe(gulp.dest("./public/dist"));
});

gulp.task("clean:css", () => {
  return del(["./public/dist/*.css"]);
});
gulp.task("clean:js", () => {
  return del(["./public/dist/*.js"]);
});

gulp.task("jsuglify", () => {
  return gulp
    .src("./public/js/**/*.js")
    .pipe(concat("main.min.js"))
    .pipe(babel({presets: ["../../node_modules/babel-preset-es2015"]}))
    .pipe(uglify())
    .pipe(rev())
    .pipe(gulp.dest("./public/dist"))
    .pipe(rev.manifest({base: "./public/dist/", merge: true}))
    .pipe(gulp.dest("./public/dist"));
});

gulp.task("rev", () => {
  return gulp
    .src(["./rev-manifest.json", "./template/*.ejs"])
    .pipe(revCollector())
    .pipe(gulp.dest("./app/views/partial/"))
});

gulp.task("watch", () => {
  gulp.watch("./public/css/*.scss", gulp.series("clean:css", "sass", "rev"));
  gulp.watch("./public/js/*.js", gulp.series("clean:js", "jsuglify", "rev"));
});

gulp.task("develop", () => {
  livereload.listen();
  nodemon({script: "app.js", ext: "js coffee ejs", stdout: false}).on("readable", function () {
    this
      .stdout
      .on("data", (chunk) => {
        if (/^Express server listening on port/.test(chunk)) {
          livereload.changed(__dirname);
        }
      });
    this
      .stdout
      .pipe(process.stdout);
    this
      .stderr
      .pipe(process.stderr);
  });
});

gulp.task("default", gulp.series("sass", "jsuglify", "rev", gulp.parallel("develop", "watch")));
