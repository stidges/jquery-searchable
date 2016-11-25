var gulp = require('gulp');
var uglify = require('gulp-uglify');
var eslint = require('gulp-eslint');
var rename = require('gulp-rename');
var babel = require('gulp-babel');

gulp.task('lint', function() {
    return gulp.src('./src/jquery.searchable.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('uglify', ['scripts'], function() {
    return gulp.src('./dist/jquery.searchable.js')
        .pipe(uglify({
            preserveComments: 'license'
        }))
        .pipe(rename('jquery.searchable.min.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('scripts', function() {
    return gulp.src('./src/jquery.searchable.js')
        .pipe(babel({
            presets: [
                ['es2015', { modules: false }]
            ],
        }))
        .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
    gulp.watch('./src/**/*.js', ['scripts']);
});

gulp.task('default', ['lint']);
