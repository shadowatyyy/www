import {expect} from "chai";
import "mocha";
import {Meme, createMeme} from "../src/meme";

describe("meme class", () => {
	const name : string = "NAME";
	const url : string = "URL";
	const price : number = 213;
	const meme : Meme = createMeme(name, url, price);
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