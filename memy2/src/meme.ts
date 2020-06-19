import {queryAll, queryGet, queryRun, commit, beginTransaction, rollback} from "./database"
import * as sqlite from "sqlite3";

export class Meme {
	url: string;
	name: string;
	id: number;
	history: number[];
	static nextId: number = 0;
	
	constructor(id : number, name : string, url : string, historyString : string) {
		this.url = url;
		this.name = name;
		this.id = id;
		this.history = JSON.parse(historyString)
	}
  
	getId() : number {
		return this.id;
	}
  
	getPrice() : number {
		return this.history[this.history.length - 1];
	}
  
	getHistory() : number[] {
		return this.history;
	}

	getHistoryString() : string {
		return JSON.stringify(this.history);
	}

	getUrl() : string {
		return this.url;
	}

	getName() : string {
		return this.name;
	}
  
	changePrice(price : number) : void {
		this.history.push(price);
	}
}

export function createMeme(name : string, url : string, price : number) : Meme {
	return new Meme(Meme.nextId++, name, url, JSON.stringify([price]));
}

export async function getMeme(db : sqlite.Database, id : number) : Promise<Meme> {
	const found: any = await queryGet(db, "SELECT * FROM memes WHERE id = ?;", [id]);

	if (found)
		return new Meme(found.id, found.name, found.url, found.history);
	else
		return null;	
}

async function getAllMemes(db : sqlite.Database) : Promise<Meme[]> {
	const json : any = await queryAll(db, "SELECT id, name, url, history FROM memes;", []);

	let found : Meme[] = [];

	for (let row of json) {
		found.push(new Meme(row.id, row.name, row.url, row.history));
	}
		
	return found;	
}

export async function getMostExpensive(db : sqlite.Database, count : number) : Promise<Meme[]> {
	let allMemes : Meme[] = await getAllMemes(db);

	return allMemes.sort(function(a : Meme, b : Meme) {
		return b.getPrice() - a.getPrice();
	}).slice(0, count);
}

export function addMeme(db : sqlite.Database, meme : Meme) : Promise<any> {
	return queryRun(db, "INSERT OR REPLACE INTO memes (id, name, url, history) VALUES (?, ?, ?, ?);", 
		[meme.getId(), meme.getName(), meme.getUrl(), meme.getHistoryString()]);
}

export function changePrice(db : sqlite.Database, meme : Meme, price : number) : void {
	meme.changePrice(price);
	addMeme(db, meme);
}

export async function updatePrice(db : sqlite.Database, id : number, price : number) : Promise<void> {
	console.log(id, price);
	await beginTransaction(db);
	await getMeme(db, id)
	.then((meme : Meme) => {
		meme.changePrice(price);
		return meme;
	})
	.then((meme : Meme) => {
		return addMeme(db, meme);
	})
	.then(() => {
		return commit(db);
	})
	.catch(() => {
		rollback(db);
		updatePrice(db, id, price);
	});
}