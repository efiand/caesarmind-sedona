import gulp from 'gulp';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import stylint from 'stylelint';
import bemlinter from 'gulp-html-bemlinter';
import scssSyntax from 'postcss-scss';
import browser from 'browser-sync';
import { htmlValidator } from 'gulp-w3c-html-validator';

// Server
const server = (done) => {
	browser.init({
		server: {
			baseDir: 'source'
		},
		cors: true,
		ui: false,
		notify: false,
	});
	done()
}

//Compile SCSS files
const sassCompiler = () => {
	return gulp
		.src('source/sass/*.scss')
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest('source/css'))
		.pipe(browser.reload({ stream: true }));

}

// Linter for SASS
const stylesLinter = () => {
	return gulp
	.src('source/sass/**/*.scss')
	.pipe(
		postcss([stylint()],{ syntax: scssSyntax })
	)
}

// Linter for BEM
const bemLinter = () => {
	return gulp
	.src('source/*.html')
	.pipe(bemlinter());
}

// HTML W3C Validator
const validateMarkup = () => {
	return gulp
	.src('source/*.html')
	.pipe(htmlValidator.analyzer())
	.pipe(htmlValidator.reporter({throwErrors: true}));
}

// Watcher
const watcher = () => {
		gulp.watch('source/sass/**/*.scss', gulp.series(sassCompiler));
		gulp.watch('source/**/*.html').on('change', browser.reload);
}


export { stylesLinter, bemLinter, validateMarkup};
//Default
export default gulp.series(server, watcher);
