//Тут используется Gulp 4.0.2
//для запуска терминала нажмите alt+shift+ctrl+T
//gulp +
//gulp-less +
//gulp-sourcemaps +
//gulp-concat +
//gulp-autoprefixer +
//gulp-if +
//browser-sync +
//gulp-clean-css +

//подключаем необходимые пакеты
const gulp = require("gulp");
const less = require("gulp-less"); 
const autoprefixer = require("gulp-autoprefixer"); 
const cleanCss = require("gulp-clean-css");
const concat = require("gulp-concat"); 
const sourcemaps = require("gulp-sourcemaps"); 
const gulpIf = require("gulp-if");
//const debug = require("gulp-debug");
const browserSync = require("browser-sync").create();
//////////////////// конфигурационная информация ////////////////////
var config = {
	paths: {
		less:'./src/less/**/*.less',
		html:'./public/index.html'
	},
	output:{
		cssName:"bundle.min.css",
		path:'./public'
	},
	isDevelop: false
};
////////////////// задачи ///////////////////////////
gulp.task('less', function(done){
	return gulp.src(config.paths.less)
		.pipe(gulpIf(config.isDevelop, sourcemaps.init()))
		.pipe(less())
		.pipe(concat(config.output.cssName))
		.pipe(autoprefixer())
		.pipe(gulpIf(!config.isDevelop, cleanCss()))
		.pipe(gulpIf(config.isDevelop, sourcemaps.write()))
		.pipe(gulp.dest(config.output.path))
		.pipe(browserSync.stream());
		done();
});

gulp.task("serve",function(done){
	//здесь напишем содержимое для запуска сервера
	browserSync.init({
		server: {
			baseDir: config.output.path
		}
	});
	//gulp.watch(config.paths.less, ["less"])
	gulp.watch(config.paths.less, gulp.series('less'));
	//gulp.watch(config.paths.html).on("change", browserSync.reload)
	gulp.watch(config.paths.html).on('change', ()=>{browserSync.reload(); done()});
	done();
});

//gulp.task('default', ["less",  "serve"]);
gulp.task('default',gulp.series('less', 'serve'));