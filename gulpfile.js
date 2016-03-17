var gulp = require('gulp'),
	livereload = require('gulp-livereload'),
	plumber = require('gulp-plumber'),
	notify = require('gulp-notify'),
	less = require('gulp-less'),
	autoprefixer = require('gulp-autoprefixer'),
	rename = require('gulp-rename'),
	minifyCSS = require('gulp-minify-css');


//编译less文件，生成普通css文件与压缩css文件
gulp.task('less', function(){
	return gulp.src('public/less/**/*.less')
		//错误处理，防止进程挂了
		.pipe(plumber({
			errorHandler: notify.onError("Error: <%= error.message %>")
		}))
		.pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions', 'Android >= 4.0'],
            cascade: true, 	//是否美化属性值 默认：true 像这样：
            				//-webkit-transform: rotate(45deg);
            				//        transform: rotate(45deg);
            remove:true 	//是否去掉不必要的前缀 默认：true 
        }))
        .pipe(gulp.dest('public/css'))
        .pipe(rename({suffix: '.min'}))
		.pipe(minifyCSS())
        .pipe(gulp.dest('public/css'))
        //.pipe(livereload());
});

//监听文件的变化
gulp.task('watch', function(){
	//浏览器livereload监听html,css,js文件(不监听less和image)
	livereload.listen();
    gulp.watch('{public/**,html}/*.{html,css,js}', function (file) {
        livereload.changed(file.path);
    });

	//less文件变化，重新编译压缩
    gulp.watch('public/**/*.less', ['less']);
});

//默认任务
gulp.task('default', ['less', 'watch']);


