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