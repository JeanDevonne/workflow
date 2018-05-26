//Automate and enhance your worckflow
//require('gulp') busca el modulo gulp en el directorio node_modules y lo asigna a la constante gulp
const gulp = require('gulp');
const sass = require('gulp-sass');
var uglify = require('gulp-uglify');
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
gulp.task('default', ['css', 'javascript'], function() {
    browserSync.init({
        server: "./app"
    });

    gulp.watch("app/js/*js", ['javascript']).on('change', browserSync.reload);
    gulp.watch("scss/**/*.scss", ['css']);
    gulp.watch("app/*.html").on('change', browserSync.reload);
    gulp.watch("./*.html", ["html"]);
});

//minificar html
gulp.task('html', function() {
    return gulp.src('./*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('app'));
  });

//Tarea independiente para optimizar imágenes
gulp.task('imagenes', function() {
    gulp.src('img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('app/img'))
});

//Tarea para comprimir JS
gulp.task('javascript', function () {
    gulp.src('app/js/*.js')
        .pipe(uglify())
        .pipe(gulp.dest('app/js/dist'));
});

//Creamos otra tarea para convertir SCSS a CSS
//gulp.src es el origen (ubicación del archivo .scss)
//pipe es un metodo de gulp que sirve para encadenar diferentes módulos.
gulp.task('css', function(){
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