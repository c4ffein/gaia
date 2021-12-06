let gulp = require('gulp');
let cleanCSS = require('gulp-clean-css');
gulp.task('minify-css', () => gulp.src('assets/css/*.css').pipe(cleanCSS()).pipe(gulp.dest('assets/built')));
gulp.task('default', () => { gulp.watch('assets/css/*.css', evt => { gulp.task('minify-css'); }); });

