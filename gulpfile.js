const gulp = require('gulp');
const concatenate = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const autoPrefix = require('gulp-autoprefixer');
const gulpSASS = require('gulp-sass');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');

const sassFiles = [
	"./node_modules/bootstrap/scss/_variables.scss",
	"./node_modules/bootstrap/scss/_grid.scss",
	"./node_modules/bootstrap/scss/bootstrap-grid.scss",
	  "./node_modules/bootstrap/scss/_card.scss",
	  "./node_modules/bootstrap/scss/_buttons.scss",
	  "./node_modules/bootstrap/scss/_button-group.scss",
	  "./node_modules/bootstrap/scss/bootstrap.scss",
	  "./node_modules/bootstrap/scss/_modal.scss",
	 "./src/style/custom.scss",
];

const vendorJsFiles = [
	'./node_modules/jquery/dist/jquery.js',
	'./node_modules/popper.js/dist/umd/popper.min.js'
];


gulp.task('sass', function(done) {
	gulp
		 .src(sassFiles)
		 .pipe(gulpSASS())
		.pipe(concatenate('styles.css'))
		.pipe(gulp.dest('./public/css/'))
		.pipe(autoPrefix())
		.pipe(cleanCSS())
		.pipe(rename('styles.min.css'))
		.pipe(gulp.dest('./public/css/'));
	done();
});

gulp.task("imageMin", function(done){
	gulp.src('./src/images/*')
	.pipe(imagemin())
	.pipe(gulp.dest('./public/images/'));
	done();
});

gulp.task('js:vendor', function(done) {
	gulp
    .src(vendorJsFiles)
    .pipe(concatenate("vendor.min.js"))
    .pipe(gulp.dest("./public/js/"));
  done();
});

gulp.task('build', gulp.parallel([ 'sass', 'js:vendor' ]));

gulp.task('watch', function(done) {
	gulp.watch(sassFiles, gulp.series('sass'));
	gulp.watch(vendorJsFiles, gulp.series('js:vendor'));
	done();
});

gulp.task('default', gulp.series('watch'));
