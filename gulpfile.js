var gulp = require("gulp");
var browserify = require("browserify");
var reactify = require("reactify");
var source = require("vinyl-source-stream");

gulp.task("bundle", function () {
    return browserify({
        
        entries: "./src/index.jsx",
        debug: true
    }).transform(reactify)
        .bundle()
        .pipe(source("index.js"))
        .pipe(gulp.dest("./src"))
});

gulp.task("copy", ["bundle"], function () {
    return gulp.src(["puclic/index.html"])
        .pipe(gulp.dest("/dist"));
});

gulp.task("default",["copy"],function(){
   console.log("Gulp completed..."); 
});