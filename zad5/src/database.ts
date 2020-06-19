import * as sqlite from "sqlite3";

export function openDatabase(path : string) : Promise<any> {
	return new Promise<sqlite.Database>((resolve : Function, reject : Function) => {
		let db = new sqlite.Database(path, function(error : any) {
			if (error)
				reject(error);
			else
				resolve(db);
		});
	});
}

export function queryGet(db : sqlite.Database, query : string, args : any[]) : Promise<any> {
	return new Promise((resolve : Function, reject : Function) => {
		db.get(query, args, function(error : any, result : any) {
			if (error)
				reject(error);
			else
				resolve(result);
		});
	});
}

export function queryAll(db : sqlite.Databae, query : string, args : any[]) : Promise<any> {
	return new Promise((resolve : Function, reject : Function) => {
		db.all(query, args, function(error : any, result : any) {
			if (error)
				reject(error);
			else
				resolve(result);
		})
	})
}

export function queryRun(db : sqlite.Database, query : string, args : any[]) : Promise<any> {
	return new Promise((resolve : Function, reject : Function) => {
		db.run(query, args, function(error : any, result : any) {
			if (error)
				reject(error);
			else
				resolve(result);
		});
	})
}

export function beginTransaction(db : sqlite.Database) : Promise<any> {
	return queryRun(db, "BEGIN IMMEDIATE;", []);
}

export function commit(db : sqlite.Database) : Promise<any> {
	return queryRun(db, "COMMIT;", []);
}

export function rollback(db : sqlite.Database) : Promise<any> {
	return queryRun(db, "ROLLBACK;", []);
}