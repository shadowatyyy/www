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
exports.__esModule = true;
exports.rollback = exports.commit = exports.beginTransaction = exports.queryRun = exports.queryAll = exports.queryGet = exports.openDatabase = void 0;
var sqlite = __importStar(require("sqlite3"));
function openDatabase(path) {
    return new Promise(function (resolve, reject) {
        var db = new sqlite.Database(path, function (error) {
            if (error)
                reject(error);
            else
                resolve(db);
        });
    });
}
exports.openDatabase = openDatabase;
function queryGet(db, query, args) {
    return new Promise(function (resolve, reject) {
        db.get(query, args, function (error, result) {
            if (error)
                reject(error);
            else
                resolve(result);
        });
    });
}
exports.queryGet = queryGet;
function queryAll(db, query, args) {
    return new Promise(function (resolve, reject) {
        db.all(query, args, function (error, result) {
            if (error)
                reject(error);
            else
                resolve(result);
        });
    });
}
exports.queryAll = queryAll;
function queryRun(db, query, args) {
    return new Promise(function (resolve, reject) {
        db.run(query, args, function (error, result) {
            if (error)
                reject(error);
            else
                resolve(result);
        });
    });
}
exports.queryRun = queryRun;
function beginTransaction(db) {
    return queryRun(db, "BEGIN IMMEDIATE;", []);
}
exports.beginTransaction = beginTransaction;
function commit(db) {
    return queryRun(db, "COMMIT;", []);
}
exports.commit = commit;
function rollback(db) {
    return queryRun(db, "ROLLBACK;", []);
}
exports.rollback = rollback;
