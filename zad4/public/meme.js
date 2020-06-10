"use strict";
exports.__esModule = true;
exports.MemeList = exports.Meme = void 0;
var Meme = /** @class */ (function () {
    function Meme(url, name, price) {
        this.url = url;
        this.name = name;
        this.price = price;
        this.id = Meme.nextId++;
        this.history = [price];
    }
    Meme.prototype.getId = function () {
        return this.id;
    };
    Meme.prototype.getPrice = function () {
        return this.price;
    };
    Meme.prototype.getHistory = function () {
        return this.history;
    };
    Meme.prototype.changePrice = function (price) {
        this.price = price;
        this.history.push(price);
    };
    Meme.nextId = 0;
    return Meme;
}());
exports.Meme = Meme;
var MemeList = /** @class */ (function () {
    function MemeList() {
        this.memes = [];
    }
    MemeList.prototype.add = function (meme) {
        this.memes.push(meme);
    };
    MemeList.prototype.mostExpensive = function (count) {
        return this.memes.sort(function (a, b) {
            return b.getPrice() - a.getPrice();
        }).slice(0, count);
    };
    MemeList.prototype.getMeme = function (id) {
        return this.memes.find(function (meme) { return meme.getId() == id; });
    };
    return MemeList;
}());
exports.MemeList = MemeList;
