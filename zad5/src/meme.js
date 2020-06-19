"use strict";
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
exports.__esModule = true;
exports.updatePrice = exports.changePrice = exports.addMeme = exports.getMostExpensive = exports.getMeme = exports.createMeme = exports.Meme = void 0;
var database_1 = require("./database");
var Meme = /** @class */ (function () {
    function Meme(id, name, url, historyString) {
        this.url = url;
        this.name = name;
        this.id = id;
        this.history = JSON.parse(historyString);
    }
    Meme.prototype.getId = function () {
        return this.id;
    };
    Meme.prototype.getPrice = function () {
        return this.history[this.history.length - 1][0];
    };
    Meme.prototype.getHistory = function () {
        return this.history;
    };
    Meme.prototype.getHistoryString = function () {
        return JSON.stringify(this.history);
    };
    Meme.prototype.getUrl = function () {
        return this.url;
    };
    Meme.prototype.getName = function () {
        return this.name;
    };
    Meme.prototype.changePrice = function (price, login) {
        this.history.push([price, login]);
    };
    Meme.nextId = 0;
    return Meme;
}());
exports.Meme = Meme;
function createMeme(name, url, price, login) {
    return new Meme(Meme.nextId++, name, url, JSON.stringify([[price, login]]));
}
exports.createMeme = createMeme;
function getMeme(db, id) {
    return __awaiter(this, void 0, void 0, function () {
        var found;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.queryGet(db, "SELECT * FROM memes WHERE id = ?;", [id])];
                case 1:
                    found = _a.sent();
                    if (found)
                        return [2 /*return*/, new Meme(found.id, found.name, found.url, found.history)];
                    else
                        return [2 /*return*/, null];
                    return [2 /*return*/];
            }
        });
    });
}
exports.getMeme = getMeme;
function getAllMemes(db) {
    return __awaiter(this, void 0, void 0, function () {
        var json, found, _i, json_1, row;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.queryAll(db, "SELECT id, name, url, history FROM memes;", [])];
                case 1:
                    json = _a.sent();
                    found = [];
                    for (_i = 0, json_1 = json; _i < json_1.length; _i++) {
                        row = json_1[_i];
                        found.push(new Meme(row.id, row.name, row.url, row.history));
                    }
                    return [2 /*return*/, found];
            }
        });
    });
}
function getMostExpensive(db, count) {
    return __awaiter(this, void 0, void 0, function () {
        var allMemes;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAllMemes(db)];
                case 1:
                    allMemes = _a.sent();
                    return [2 /*return*/, allMemes.sort(function (a, b) {
                            return b.getPrice() - a.getPrice();
                        }).slice(0, count)];
            }
        });
    });
}
exports.getMostExpensive = getMostExpensive;
function addMeme(db, meme) {
    return database_1.queryRun(db, "INSERT OR REPLACE INTO memes (id, name, url, history) VALUES (?, ?, ?, ?);", [meme.getId(), meme.getName(), meme.getUrl(), meme.getHistoryString()]);
}
exports.addMeme = addMeme;
function changePrice(db, meme, price, login) {
    meme.changePrice(price, login);
    addMeme(db, meme);
}
exports.changePrice = changePrice;
function updatePrice(db, id, price, login) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, database_1.beginTransaction(db)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, getMeme(db, id)
                            .then(function (meme) {
                            meme.changePrice(price, login);
                            return meme;
                        })
                            .then(function (meme) {
                            return addMeme(db, meme);
                        })
                            .then(function () {
                            return database_1.commit(db);
                        })["catch"](function () {
                            database_1.rollback(db);
                            updatePrice(db, id, price, login);
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.updatePrice = updatePrice;
