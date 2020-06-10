import {expect} from "chai";
import "mocha";
import {Meme, MemeList} from "../public/meme";

describe("meme class", () => {
	const name : string = "NAME";
	const url : string = "URL";
	const price : number = 213;
	const meme = new Meme(url, name, price);
	const new_price : number = 214;

	it('constructor', () => {
		expect(meme.getPrice()).to.equal(price);
		expect(meme.name).to.equal(name);
		expect(meme.url).to.equal(url);
		expect(meme.getHistory()[0]).to.equal(price);
	});

	it('price update', () => {	
		meme.changePrice(new_price);
		expect(meme.getPrice()).to.equal(new_price);
	});

	it('history after price update', () => {	
		expect(meme.getHistory()[0]).to.equal(price);
		expect(meme.getHistory()[1]).to.equal(new_price);
	});
});

describe("meme list class", () => {
	const name1 : string = "NAME1";
	const url1 : string = "URL1";
	const price1 : number = 10;
	const meme1 = new Meme(url1, name1, price1);

	const name2 : string = "NAME2";
	const url2 : string = "URL2";
	const price2 : number = 5;
	const meme2 = new Meme(url2, name2, price2);

	const name3 : string = "NAME3";
	const url3 : string = "URL3";
	const price3 : number = 100;
	const meme3 = new Meme(url3, name3, price3);

	let list = new MemeList();
	list.add(meme1);
	list.add(meme2);
	list.add(meme3);
	
	it('get meme', () => {
		expect(list.getMeme(meme1.getId())).to.equal(meme1);
		expect(list.getMeme(meme2.getId())).to.equal(meme2);
		expect(list.getMeme(meme3.getId())).to.equal(meme3);
	});

	it('most expensive', () => {
		const expensive : Meme[] = list.mostExpensive(2);
		expect(expensive[0].getPrice()).to.equal(price3);
		expect(expensive[1].getPrice()).to.equal(price1);
	});
});