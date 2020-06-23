import createError = require("http-errors");
import express = require("express");
import path = require('path');
import cookieParser = require('cookie-parser');
import logger = require('morgan');

const app : express.Application = express();

import {Meme} from "./public/meme";
import {MemeList} from "./public/memelist";
import { nextTick } from "process";

let memeList : MemeList = new MemeList();

memeList.add(new Meme('https://i.redd.it/h7rplf9jt8y21.png', 'Gold', 1000));
memeList.add(new Meme('http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg', 'Platinum', 1100));
memeList.add(new Meme('https://i.imgflip.com/30zz5g.jpg', 'Elite', 1200));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.get('/', function(req, res) {
  let toDisplay : Meme[] = memeList.mostExpensive(3);
  res.render('index', { title: 'Meme market', message: 'Hello there!', memes: toDisplay })
});

app.get('/meme/:memeId', function (req, res, next) {
  let id : number = parseInt(req.params.memeId);

  if (isNaN(id) || 0 > id || id >= Meme.nextId)
    next(createError(404));

  let meme : Meme = memeList.getMeme(req.params.memeId);
  res.render('meme', { meme: meme })
})

app.use(express.urlencoded({
  extended: true
})); 

app.post('/meme/:memeId', function (req, res, next) {
    let id : number = parseInt(req.params.memeId);

    if (isNaN(id) || 0 > id || id >= Meme.nextId)
      next(createError(404));

    if (isNaN(req.body.price))
      next(createError(422));

    let meme : Meme = memeList.getMeme(req.params.memeId);
    let price : number = req.body.price;
    meme.changePrice(price);
    res.render('meme', { meme: meme })
})
//

app.use(express.urlencoded({ extended: false }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;