var gulp = require('gulp'),
	npm = require('rollup-plugin-npm'),
	commonjs = require('rollup-plugin-commonjs'),
	// gulp-load-plugins lets you lazyload plugins without a giant list of
	// `require` statements...
	$ = require('gulp-load-plugins')({pattern: ['gulp-*', 'gulp.*', '*']});



// Application Scripts
gulp.task('lint', function() {
	return gulp.src(['exampleSrc.js'])
		// .pipe($.cached('js'))
    	.pipe($.jshint())
    	.pipe($.jshint.reporter('jshint-stylish'))
    	.pipe($.jshint.reporter('fail'));
});

gulp.task('build', ['lint'], function(){

	return gulp.src('exampleSrc.js')
	// return gulp.src(['src/layouts/**/*.js', 'src/document-templates/**/*.js'])
		// .pipe( $.concat('./layouts/app.js') ) // #1 comment this to NOT concatenate scripts
		// .pipe( $.es6ModuleTranspiler({ formatter: 'bundle' }))
		.pipe( $.rollup({
			format: 'iife',
			plugins: [npm(), commonjs()]
		}) )
		.pipe( $.babel() )
		.pipe( $.rename('examplePublic.js'))
		// .pipe($.flatten() ) // <-- #2 uncomment this to NOT concatenate scripts
		.pipe( gulp.dest(''));
});
