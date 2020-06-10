import {Meme} from "./meme"

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