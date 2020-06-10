"use strict";
exports.__esModule = true;
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();
var meme_1 = require("./public/meme");
var memeList = new meme_1.MemeList();
memeList.add(new meme_1.Meme('https://i.redd.it/h7rplf9jt8y21.png', 'Gold', 1000));
memeList.add(new meme_1.Meme('http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg', 'Platinum', 1100));
memeList.add(new meme_1.Meme('https://i.imgflip.com/30zz5g.jpg', 'Elite', 1200));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.get('/', function (req, res) {
    var toDisplay = memeList.mostExpensive(3);
    res.render('index', { title: 'Meme market', message: 'Hello there!', memes: toDisplay });
});
app.get('/meme/:memeId', function (req, res) {
    var meme = memeList.getMeme(req.params.memeId);
    res.render('meme', { meme: meme });
});
app.use(express.urlencoded({
    extended: true
}));
app.post('/meme/:memeId', function (req, res) {
    var meme = memeList.getMeme(req.params.memeId);
    var price = req.body.price;
    meme.changePrice(price);
    console.log(req.body.price);
    res.render('meme', { meme: meme });
});
//
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/users', usersRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
