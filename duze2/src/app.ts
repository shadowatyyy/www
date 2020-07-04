import * as sqlite from "sqlite3";
import * as csurf from "csurf";
import * as express from "express";
import * as session from 'express-session';
import * as createError from "http-errors";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as logger from "morgan";
import {promisify} from "util";
import {MOVED_PERMANENTLY} from "http-status-codes";
import {openDatabase} from "./database";
import {checkUser, changePassword} from "./user";
import {getQuiz, getAllStats, addStats, getQuizList, isSolved, getMyStats, QuizStatistics} from "./quiz";
import {QuizResult} from "../public/src/main";

const app : express.Application = express();
const antiCsrf = csurf({
	cookie: true
});
const storage: session.MemoryStore = new session.MemoryStore();

sqlite.verbose();

app.use(cors());
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
	saveUninitialized: true,
	store: storage
}));

app.use(express.static('public'))

app.use(async function(req : express.Request, res : express.Response, next : express.NextFunction) {
	res.locals.db = await openDatabase("database.db");
	next();
});

app.get('/', antiCsrf, async function(req : express.Request, res : express.Response) {
	res.render('index', { login: req.session!.login, list: await getQuizList(res.locals.db)});
});

app.get("/login", antiCsrf, function(req : express.Request, res : express.Response) {
	return res.render("login", { token: req.csrfToken() });
});

app.post("/login", antiCsrf, async function(req : express.Request, res : express.Response, next: express.NextFunction) {
	if (await checkUser(res.locals.db, req.body.login, req.body.password)) {
		req.session!.login = req.body.login;
		req.session!.quizStart = new Map<string, string>();
	}
	res.redirect('/');
})

app.get('/password', antiCsrf, async function(req : express.Request, res : express.Response, next : express.NextFunction) {
	if (!req.session!.login)
		next(createError(401));

	res.render('password', { token: req.csrfToken()});
});

app.post('/password', antiCsrf, async function(req : express.Request, res : express.Response, next : express.NextFunction) {
	if (!req.session!.login)
		next(createError(401));

	if (req.body.new_password1 != req.body.new_password2) {
		res.render('errorMessage', { message: "Passwords doesn't match!" });
	} else {
		await changePassword(res.locals.db, req.session!.login, req.body.new_password1);
		storage.all((err: any, sessions: any) => {
			const deletionPromises = Object.entries(sessions)
			.filter(([key, value]: [any, any]) => value.login === req.session.login)
			.map(([key, value]) => (promisify(storage.destroy.bind(storage))(key)));
			
			(Promise.all(deletionPromises))
			.then(() => {
				return res.redirect(MOVED_PERMANENTLY, '/login');
			}).catch(() => {
				return next(createError(400));
			});
		})
		res.redirect('/');
	}	
});

app.get('/logout', antiCsrf, function (req: express.Request, res: express.Response, next: express.NextFunction) {
	req.session.destroy((error : any) => {
		if (error)
			next(error);

		res.redirect('/');
	});
});

app.get('/quiz/:quizId', antiCsrf, async function(req : express.Request, res : express.Response, next : express.NextFunction) {
	if (!req.session!.login)
		next(createError(401));
		
	res.render('quiz', { quizId: parseInt(req.params.quizId), token: req.csrfToken() });
});

app.post('/quiz/:quizId/start', antiCsrf, async function (req : express.Request, res : express.Response, next : express.NextFunction) {
	const id : number = parseInt(req.params.quizId);
	
	if (!req.session!.login)
		next(createError(401));
		
	if (isNaN(id))
		next(createError(404));
	
	if (await isSolved(res.locals.db, id, req.session!.login)) {
		const content : String = JSON.stringify(null);
		res.json(content);
	} else {
		const content : String = await getQuiz(res.locals.db, id);

		if (content == null)
			next(createError(404));

		req.session!.quizStart[id] = Date.now();
		res.json(content);
	}
})

app.post('/quiz/:quizId/save', antiCsrf, async function (req : express.Request, res : express.Response, next : express.NextFunction) {
	if (!req.session!.login)
		next(createError(401));

	if (!req.is('application/json'))
		next(createError(415));

	let id : number = parseInt(req.params.quizId);

	if (isNaN(id))
		next(createError(404));

	if (!req.session!.quizStart[id])
		next(createError(403));

	if (await isSolved(res.locals.db, id, req.session!.login))
		next(createError(403));

	let timeSpent : number = Date.now() - req.session!.quizStart[id];

	if (timeSpent < 0)
		next(createError(500));

	delete req.session!.quizStart[id];
	const result : QuizResult = req.body;

	let sumFractions = 0;

	for (let i = 0; i < result.fraction.length; i++) {
		if (result.fraction[i] < 0 || result.fraction[i] > 1)
			next(createError(422));

		sumFractions += result.fraction[i];
	}	

	const eps = 1e-5;

	if (sumFractions > 1 + eps || sumFractions < 1 - eps)
		next(createError(422));

	await addStats(res.locals.db, id, req.session!.login, result, timeSpent);
	res.send();
})

app.get('/quiz/:quizId/stats', antiCsrf, async function (req : express.Request, res : express.Response, next : express.NextFunction) {
	if (!req.session!.login)
		next(createError(1));

	let id : number = parseInt(req.params.quizId);

	if (isNaN(id))
		next(createError(404));

	const stats : QuizStatistics[] = await getAllStats(res.locals.db, id, 5);

	if (stats == null)
		next(createError(404));

	res.render('stats', { stats: stats })
})

app.get('/quiz/:quizId/personal', antiCsrf, async function (req : express.Request, res : express.Response, next : express.NextFunction) {
	if (!req.session!.login)
		next(createError(401));

	let id : number = parseInt(req.params.quizId);

	if (isNaN(id))
		next(createError(404));

	const stat : QuizStatistics = await getMyStats(res.locals.db, id, req.session!.login);

	if (stat == null)
		res.render('errorMessage', { message: "You haven't solved this quiz!"})
	else
		res.render('personal', { stat: stat, quizId: id });
})

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

app.listen(3000);
