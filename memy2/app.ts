import {Meme, createMeme, addMeme, getMeme, getMostExpensive, updatePrice} from "./src/meme";
import {openDatabase, queryRun} from "./src/database";
import {addUser, checkUser} from "./src/user";
import * as sqlite from "sqlite3";
import csurf from "csurf";
import express = require("express");
import session from 'express-session';
import createError = require("http-errors");
import cookieParser = require("cookie-parser");
import logger = require("morgan");
import path = require("path");

const app : express.Application = express();
const antiCsrf = csurf({
    cookie: true
});
sqlite.verbose();

app.set('view engine', 'pug');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(session({
	secret: 'abacabadabacaba',
	resave: false,
	saveUninitialized: true
}));

async function init() : Promise<void> {
    let db : sqlite.Database = await openDatabase("database.db");
    
    await queryRun(db, "CREATE TABLE IF NOT EXISTS memes (id INTEGER PRIMARY KEY, name TEXT, url TEXT, history TEXT);", []);
    await queryRun(db, "CREATE TABLE IF NOT EXISTS users (login TEXT PRIMARY KEY, password TEXT);", []);
    
    await addMeme(db, createMeme('Gold', 'https://i.redd.it/h7rplf9jt8y21.png', 1000));
    await addMeme(db, createMeme('Platinum', 'http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg', 1100));
    await addMeme(db, createMeme('Elite', 'https://i.imgflip.com/30zz5g.jpg', 1200));

    await addUser(db, 'admin', 'admin');
    await addUser(db, 'user', 'user');
}

app.use(async function(req : express.Request, res : express.Response, next : express.NextFunction) {
    res.locals.db = await openDatabase("database.db");
    next();
});

app.get('/', async function(req : express.Request, res : express.Response) {
	let toDisplay : Meme[] = await getMostExpensive(res.locals.db, 3);
	res.render('index', { title: 'Meme market', message: 'Hello there!', memes: toDisplay, login: req.session!.login})
});

app.get('/meme/:memeId', antiCsrf, async function (req : express.Request, res : express.Response, next : express.NextFunction) {
    const meme : Meme = await getMeme(res.locals.db, parseInt(req.params.memeId));
    
    if (!meme)
        next(createError(404));

	res.render('meme', { meme: meme, token: req.csrfToken() })
})

app.post('/meme/:memeId', antiCsrf, async function (req : express.Request, res : express.Response, next : express.NextFunction) {
    if (!req.session!.login)
        next(createError(403));
    
    if (isNaN(req.body.price))
        next(createError(400));

    await updatePrice(res.locals.db, parseInt(req.params.memeId), parseInt(req.body.price));
    res.render('meme', { meme: await getMeme(res.locals.db, parseInt(req.params.memeId)), token: req.csrfToken()})
})

app.get("/login", antiCsrf, function(req : express.Request, res : express.Response) {
    return res.render("login", { token: req.csrfToken() });
});

app.post("/login", antiCsrf, async function(req : express.Request, res : express.Response, next: express.NextFunction) {
    if (await checkUser(res.locals.db, req.body.login, req.body.password))
        req.session!.login = req.body.login;
    else
        next(createError(401));

    res.redirect('/');
})

app.get('/logout', function (req: express.Request, res: express.Response, next: express.NextFunction) {
    delete(req.session!.login);
    res.redirect('/');
});

// catch 404 and forward to error handler
app.use(function(req : express.Request, res : express.Response, next : express.NextFunction) {
	next(createError(404));
});

// error handler
app.use(function(err, req : express.Request, res : express.Response, next : express.NextFunction) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

init()
.then(() => {
    app.listen(3000);
});
