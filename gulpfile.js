var gulp         = require('gulp'),
    glob         = require('glob'),
    isProduction = false,
    $            = require('gulp-load-plugins')();

var globs = {
    css: 'assets/css/**/style.less',
    js: 'assets/js/proauth.js',
    html: 'assets/**/*.{ejs,html}',
    images: 'assets/**/*.{jpg,jpeg,svg,png,gif}',
    misc: 'assets/**/*.{ico,eot,woff,ttf,xml}'
};

gulp.task('css', function() {
    gulp.src('assets/css/style.less')
        .pipe($.less())
        .pipe($.autoprefixer('last 3 versions'))
        .pipe($.if(isProduction, $.minifyCss()))
        .pipe(gulp.dest('.tmp/public/css'));
});
gulp.task('js', function () {
    gulp.src(globs.js)
        .pipe($.browserify({
            insertGlobals : true,
            debug : !gulp.env.production
        }))
        .pipe($.if(isProduction, $.uglify()))
        .pipe(gulp.dest('.tmp/public/js'));
});
gulp.task('html', function() {
    gulp.src(globs.html)
        .pipe($.if(isProduction, $.htmlmin({collapseWhitespace: true})))
        .pipe(gulp.dest('.tmp/public'));
});
gulp.task('images', function() {
    gulp.src(globs.images)
        .pipe($.if(isProduction, $.imagemin({
            progressive: true
        })))
        .pipe(gulp.dest('.tmp/public/img'));
});
gulp.task('misc', function () {
    gulp.src(globs.misc).pipe(gulp.dest('.tmp/public'));
});

gulp.task('setProduction', function() {
    isProduction = true;
});

gulp.task('dist', ['setProduction', 'default']);
gulp.task('default', ['html', 'js', 'css', 'images', 'misc']);