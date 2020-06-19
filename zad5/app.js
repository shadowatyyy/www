"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var meme_1 = require("./src/meme");
var database_1 = require("./src/database");
var user_1 = require("./src/user");
var sqlite = __importStar(require("sqlite3"));
var csurf_1 = __importDefault(require("csurf"));
var express = require("express");
var express_session_1 = __importDefault(require("express-session"));
var createError = require("http-errors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var app = express();
var antiCsrf = csurf_1["default"]({
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
app.use(express_session_1["default"]({
    secret: 'abacabadabacaba',
    resave: false,
    saveUninitialized: true
}));
function init() {
    return __awaiter(this, void 0, void 0, function () {
        var db;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.openDatabase("database.db")];
                case 1:
                    db = _a.sent();
                    return [4 /*yield*/, database_1.queryRun(db, "CREATE TABLE IF NOT EXISTS memes (id INTEGER PRIMARY KEY, name TEXT, url TEXT, history TEXT);", [])];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, database_1.queryRun(db, "CREATE TABLE IF NOT EXISTS users (login TEXT PRIMARY KEY, password TEXT);", [])];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, meme_1.addMeme(db, meme_1.createMeme('Gold', 'https://i.redd.it/h7rplf9jt8y21.png', 1000, "init"))];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, meme_1.addMeme(db, meme_1.createMeme('Platinum', 'http://www.quickmeme.com/img/90/90d3d6f6d527a64001b79f4e13bc61912842d4a5876d17c1f011ee519d69b469.jpg', 1100, "init"))];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, meme_1.addMeme(db, meme_1.createMeme('Elite', 'https://i.imgflip.com/30zz5g.jpg', 1200, "init"))];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, user_1.addUser(db, 'admin', 'admin')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, user_1.addUser(db, 'user', 'user')];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
app.use(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = res.locals;
                    return [4 /*yield*/, database_1.openDatabase("database.db")];
                case 1:
                    _a.db = _b.sent();
                    next();
                    return [2 /*return*/];
            }
        });
    });
});
app.get('/', function (req, res) {
    return __awaiter(this, void 0, void 0, function () {
        var toDisplay;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, meme_1.getMostExpensive(res.locals.db, 3)];
                case 1:
                    toDisplay = _a.sent();
                    res.render('index', { title: 'Meme market', message: 'Hello there!', memes: toDisplay, login: req.session.login });
                    return [2 /*return*/];
            }
        });
    });
});
app.get('/meme/:memeId', antiCsrf, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var meme;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, meme_1.getMeme(res.locals.db, parseInt(req.params.memeId))];
                case 1:
                    meme = _a.sent();
                    if (!meme)
                        next(createError(404));
                    res.render('meme', { meme: meme, token: req.csrfToken() });
                    return [2 /*return*/];
            }
        });
    });
});
app.post('/meme/:memeId', antiCsrf, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    if (!req.session.login)
                        next(createError(403));
                    if (isNaN(req.body.price))
                        next(createError(400));
                    if (isNaN(parseInt(req.params.memeId)))
                        next(createError(400));
                    if (meme_1.getMeme(res.locals.db, parseInt(req.params.memeId)) == null)
                        next(createError(400));
                    return [4 /*yield*/, meme_1.updatePrice(res.locals.db, parseInt(req.params.memeId), req.body.price, req.session.login)];
                case 1:
                    _e.sent();
                    _b = (_a = res).render;
                    _c = ['meme'];
                    _d = {};
                    return [4 /*yield*/, meme_1.getMeme(res.locals.db, parseInt(req.params.memeId))];
                case 2:
                    _b.apply(_a, _c.concat([(_d.meme = _e.sent(), _d.token = req.csrfToken(), _d)]));
                    return [2 /*return*/];
            }
        });
    });
});
app.get("/login", antiCsrf, function (req, res) {
    return res.render("login", { token: req.csrfToken() });
});
app.post("/login", antiCsrf, function (req, res, next) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, user_1.checkUser(res.locals.db, req.body.login, req.body.password)];
                case 1:
                    if (_a.sent())
                        req.session.login = req.body.login;
                    else
                        next(createError(401));
                    res.redirect('/');
                    return [2 /*return*/];
            }
        });
    });
});
app.get('/logout', function (req, res, next) {
    delete (req.session.login);
    res.redirect('/');
});
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
init()
    .then(function () {
    app.listen(3000);
});
