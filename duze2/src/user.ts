const bcrypt = require('bcrypt');
import * as sqlite from "sqlite3";
import {queryGet, queryRun} from "./database";

export async function addUser(db : sqlite.Database, login : string, password : string) {
    return queryRun(db, "INSERT OR REPLACE INTO user (login, password) VALUES (?, ?);", 
        [login, await bcrypt.hash(password, 12)]);
}

export async function checkUser(db : sqlite.Database, login : string, password : string) : Promise<boolean> {
    const found: any = await queryGet(db, "SELECT login, password FROM user WHERE login = ?;", [login]);
	
	if (found == undefined)
		return false;

    return await bcrypt.compare(password, found.password);
}

export async function changePassword(db : sqlite.Database, login : string, newPassword : string) : Promise<void> {
    return addUser(db, login, newPassword);
}