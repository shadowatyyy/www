import * as sqlite from "sqlite3";
import {openDatabase, queryRun, queryAll} from "./database"
import {addUser} from "./user"
const json1 : string = '[{"statement":"2+2","answer":"4","penalty":10},' +
'{"statement":"1<<16","answer":"65536","penalty":3},' +
'{"statement":"8 xor 4","answer":"12","penalty":6},' +
'{"statement":"5-12","answer":"-7","penalty":7},' +
'{"statement":"14*19","answer":"266","penalty":2},' +
'{"statement":"11*11","answer":"121","penalty":5}]';

const json2 : string = '[{"statement":"sqrt(144)","answer":"12","penalty":3},' +
'{"statement":"8 xor 7","answer":"15","penalty":2},' +
'{"statement":"8 - 9","answer":"-1","penalty":6},' +
'{"statement":"5^5","answer":"3125","penalty":7},' +
'{"statement":"-5*-5","answer":"25","penalty":3}]';

// testowy
const json3 : string = '[{"statement":"2+2","answer":"4","penalty":0}]';

async function createDb() : Promise<void> {
    let db : sqlite.Database = await openDatabase("database.db");
    
    await queryRun(db, "CREATE TABLE IF NOT EXISTS user (login TEXT PRIMARY KEY, password TEXT);", []);
	await queryRun(db, "CREATE TABLE IF NOT EXISTS quiz (id INTEGER PRIMARY KEY, json TEXT);", []);
	await queryRun(db, "CREATE TABLE IF NOT EXISTS stats (id INTEGER PRIMARY KEY, quiz_id INTEGER, user_login TEXT, json TEXT, FOREIGN KEY(quiz_id) REFERENCES quiz(id), FOREIGN KEY(user_login) REFERENCES user(login));", []);
	
	await addUser(db, 'user1', 'user1');
	await addUser(db, 'user2', 'user2');
	await addUser(db, 'x', 'd');

	await queryRun(db, "INSERT OR REPLACE INTO quiz (id, json) VALUES (?, ?);", [1, json1]);
	await queryRun(db, "INSERT OR REPLACE INTO quiz (id, json) VALUES (?, ?);", [2, json2]);
	await queryRun(db, "INSERT OR REPLACE INTO quiz (id, json) VALUES (?, ?);", [3, json3]);
}

createDb()
.then(() => {
	console.log("createdb OK");
});