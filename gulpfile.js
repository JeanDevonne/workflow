//require('gulp') busca el modulo gulp en el directorio node_modules y lo asigna a la constante gulp
const gulp = require('gulp');
const sass = require('gulp-sass');
var uglify = require('gulp-uglify');
var pump = require('pump');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var htmlmin = require('gulp-htmlmin');
var browserSync = require('browser-sync').create();

//creación de la tarea "saludar" (si llamamos a la tarea "default" solo usar gulp)
//gulp saludar
// gulp.task('default', function() {
//     console.log('Hola mundo!!!');
// });

// Static Server + watching scss/html files
gulp.task('serve', ['sass'], function() {

    browserSync.init({
        server: "./app"
    });
    gulp.watch("app/js/*js", ['comprimir']);
    gulp.watch("scss/**/*.scss", ['sass']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
    gulp.watch("./*.html", ["minificar"]);
});

//minificar html
gulp.task('minificar', function() {
    return gulp.src('./*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('app'));
  });

//autoprefijar
gulp.task('autoprefijar', () =>
    gulp.src('scss/**/*.scss')
        .pipe(autoprefixer({
            browsers: ['last 5 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css'))
);

//Tarea independiente para optimizar imágenes
gulp.task('optimizar', () =>
    gulp.src('img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('app/img'))
);

//Tarea para comprimir JS
gulp.task('comprimir', function (cb) {
    pump([
          gulp.src('app/js/*.js'),
          uglify(),
          gulp.dest('app/js/dist')
      ],
      cb
    );
  });

//Creamos otra tarea para convertir SCSS a CSS
//gulp.src es el origen (ubicación del archivo .scss)
//pipe es un metodo de gulp que sirve para encadenar diferentes módulos.
gulp.task('sass', function(){
    return gulp.src('scss/**/*.scss')
        .pipe(sass())
        .pipe(cssnano())
        .pipe(autoprefixer({
            browsers: ['last 10 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('app/css'))
        .pipe(browserSync.stream());
});