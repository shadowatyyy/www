import bcrypt from "bcrypt"
import * as sqlite from "sqlite3";
import {queryGet, queryRun} from "./database";

export async function addUser(db : sqlite.Database, login : string, password : string) {
    return queryRun(db, "INSERT OR REPLACE INTO users (login, password) VALUES (?, ?);", 
        [login, await bcrypt.hash(password, 12)]);
}

export async function checkUser(db : sqlite.Database, login : string, password : string) : Promise<boolean> {
    const found: any = await queryGet(db, "SELECT login, password FROM users WHERE login = ?;", [login]);
	
	if (found == undefined)
		return false;

    return await bcrypt.compare(password, found.password);
}