export class Meme {
	url: string;
	name: string;
	price: number;
	id: number;
	history: number[];
	static nextId: number = 0;
	
	constructor(url : string, name : string, price : number) {
	  this.url = url;
	  this.name = name;
	  this.price = price;
	  this.id = Meme.nextId++;
	  this.history = [price];
	}
  
	getId() : number {
	  return this.id;
	}
  
	getPrice() : number {
	  return this.price;
	}
  
	getHistory() : number[] {
	  return this.history;
	}
  
	changePrice(price : number) : void {
	  this.price = price;
	  this.history.push(price);
	}
  }
    
  export class MemeList {
	memes: Meme[];
  
	constructor() {
	  this.memes = [];
	}
  
	add(meme : Meme) : void {
	  this.memes.push(meme);
	}
  
	mostExpensive(count : number) : Meme[] {
	  return this.memes.sort(function(a : Meme, b : Meme) {
		return b.getPrice() - a.getPrice();
	  }).slice(0, count);
	}
  
	getMeme(id : number) : Meme {
	  return this.memes.find(meme => meme.getId() == id);
	}
  }