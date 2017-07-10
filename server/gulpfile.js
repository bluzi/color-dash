var gulp = require('gulp');
var ts = require('gulp-typescript');
var ts = require('gulp-typescript');
var exec = require('child_process').exec;

gulp.task("default", function () {
    return gulp.src('src/**/*.ts')
        .pipe(ts('tsconfig.json'))
        .pipe(gulp.dest('./build'));
});