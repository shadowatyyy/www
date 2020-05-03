"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var fib_1 = require("./fib");
var chai_1 = require("chai");
require("mocha");
var mocha_webdriver_1 = require("mocha-webdriver");
describe("Fibonacci", function () {
    it("should equal 0 for call with 0", function () {
        chai_1.expect(fib_1.fib(0)).to.equal(0);
    });
    it("should equal 1 for call with 1", function () {
        chai_1.expect(fib_1.fib(1)).to.equal(1);
    });
    it("should equal 1 for call with 2", function () {
        chai_1.expect(fib_1.fib(2)).to.equal(1);
    });
    it("should equal 5 for call with 5", function () {
        chai_1.expect(fib_1.fib(5)).to.equal(5);
    });
    it("should equal 21 for call with 8", function () {
        chai_1.expect(fib_1.fib(8)).to.equal(21);
    });
    it("should equal 144 for call with 12", function () {
        chai_1.expect(fib_1.fib(12)).to.equal(144);
    });
});
var plik = "file://" + process.cwd() + "/lista.html";
var przeszlosc = '2000-01-01';
var przyszlosc = '2030-06-07';
var tadeusz = 'Tadeusz';
var sznuk = 'Sznuk';
var la = 'la';
var krakow = 'krakow';
function wypelnijFormularz(skad, dokad, data, imie, nazwisko) {
    return __awaiter(this, void 0, void 0, function () {
        var poleSkad, poleDokad, poleData, poleImie, poleNazwisko;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, mocha_webdriver_1.driver.find('select[id=start]')];
                case 1:
                    poleSkad = _a.sent();
                    return [4 /*yield*/, mocha_webdriver_1.driver.find('select[id=destination]')];
                case 2:
                    poleDokad = _a.sent();
                    return [4 /*yield*/, mocha_webdriver_1.driver.find('input[type=date]')];
                case 3:
                    poleData = _a.sent();
                    return [4 /*yield*/, mocha_webdriver_1.driver.find('input[name=imie]')];
                case 4:
                    poleImie = _a.sent();
                    return [4 /*yield*/, mocha_webdriver_1.driver.find('input[name=nazwisko]')];
                case 5:
                    poleNazwisko = _a.sent();
                    poleSkad.sendKeys(skad);
                    poleDokad.sendKeys(dokad);
                    poleData.sendKeys(data);
                    poleImie.sendKeys(imie);
                    poleNazwisko.sendKeys(nazwisko);
                    return [2 /*return*/];
            }
        });
    });
}
describe('niepoprawny formularz', function () {
    it('bez wpisanej daty', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, mocha_webdriver_1.driver.get(plik)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, wypelnijFormularz(la, krakow, '', tadeusz, sznuk)];
                case 2:
                    _b.sent();
                    _a = chai_1.expect;
                    return [4 /*yield*/, mocha_webdriver_1.driver.find('input[type=submit]')];
                case 3: return [4 /*yield*/, (_b.sent()).isEnabled()];
                case 4:
                    _a.apply(void 0, [_b.sent()]).to.equal(false);
                    return [2 /*return*/];
            }
        });
    }); });
    it('data w przeszlosci', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, mocha_webdriver_1.driver.get(plik)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, wypelnijFormularz(la, krakow, przeszlosc, tadeusz, sznuk)];
                case 2:
                    _b.sent();
                    _a = chai_1.expect;
                    return [4 /*yield*/, mocha_webdriver_1.driver.find('input[type=submit]')];
                case 3: return [4 /*yield*/, (_b.sent()).isEnabled()];
                case 4:
                    _a.apply(void 0, [_b.sent()]).to.equal(false);
                    return [2 /*return*/];
            }
        });
    }); });
    it('bez imienia', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, mocha_webdriver_1.driver.get(plik)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, wypelnijFormularz(la, krakow, przyszlosc, '', sznuk)];
                case 2:
                    _b.sent();
                    _a = chai_1.expect;
                    return [4 /*yield*/, mocha_webdriver_1.driver.find('input[type=submit]')];
                case 3: return [4 /*yield*/, (_b.sent()).isEnabled()];
                case 4:
                    _a.apply(void 0, [_b.sent()]).to.equal(false);
                    return [2 /*return*/];
            }
        });
    }); });
    it('nazwisko to spacje', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, mocha_webdriver_1.driver.get(plik)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, wypelnijFormularz(la, krakow, przyszlosc, tadeusz, '   ')];
                case 2:
                    _b.sent();
                    _a = chai_1.expect;
                    return [4 /*yield*/, mocha_webdriver_1.driver.find('input[type=submit]')];
                case 3: return [4 /*yield*/, (_b.sent()).isEnabled()];
                case 4:
                    _a.apply(void 0, [_b.sent()]).to.equal(false);
                    return [2 /*return*/];
            }
        });
    }); });
    it('bez celu podrozy', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, mocha_webdriver_1.driver.get(plik)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, wypelnijFormularz(la, '', przyszlosc, tadeusz, sznuk)];
                case 2:
                    _b.sent();
                    _a = chai_1.expect;
                    return [4 /*yield*/, mocha_webdriver_1.driver.find('input[type=submit]')];
                case 3: return [4 /*yield*/, (_b.sent()).isEnabled()];
                case 4:
                    _a.apply(void 0, [_b.sent()]).to.equal(false);
                    return [2 /*return*/];
            }
        });
    }); });
    it('usuniecie imienia', function () { return __awaiter(void 0, void 0, void 0, function () {
        var poleImie, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, mocha_webdriver_1.driver.get(plik)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, wypelnijFormularz(la, krakow, przyszlosc, tadeusz, sznuk)];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, mocha_webdriver_1.driver.find('input[name=imie]')];
                case 3:
                    poleImie = _b.sent();
                    return [4 /*yield*/, poleImie.clear()];
                case 4:
                    _b.sent();
                    _a = chai_1.expect;
                    return [4 /*yield*/, mocha_webdriver_1.driver.find('input[type=submit]')];
                case 5: return [4 /*yield*/, (_b.sent()).isEnabled()];
                case 6:
                    _a.apply(void 0, [_b.sent()]).to.equal(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('poprawny formularz', function () {
    it('wypelniony formularz', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, mocha_webdriver_1.driver.get(plik)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, wypelnijFormularz(la, krakow, przyszlosc, tadeusz, sznuk)];
                case 2:
                    _b.sent();
                    _a = chai_1.expect;
                    return [4 /*yield*/, mocha_webdriver_1.driver.find('input[type=submit]')];
                case 3: return [4 /*yield*/, (_b.sent()).isEnabled()];
                case 4:
                    _a.apply(void 0, [_b.sent()]).to.equal(true);
                    return [2 /*return*/];
            }
        });
    }); });
    it('klikniety formularz', function () { return __awaiter(void 0, void 0, void 0, function () {
        var submit, komunikat, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, mocha_webdriver_1.driver.get(plik)];
                case 1:
                    _c.sent();
                    return [4 /*yield*/, wypelnijFormularz(la, krakow, przyszlosc, tadeusz, sznuk)];
                case 2:
                    _c.sent();
                    submit = mocha_webdriver_1.driver.find('input[type=submit]');
                    return [4 /*yield*/, submit.doClick()];
                case 3:
                    _c.sent();
                    return [4 /*yield*/, mocha_webdriver_1.driver.find('.prostokat')];
                case 4:
                    komunikat = _c.sent();
                    _a = chai_1.expect;
                    return [4 /*yield*/, komunikat.isDisplayed()];
                case 5:
                    _a.apply(void 0, [_c.sent()]).to.equal(true);
                    _b = chai_1.expect;
                    return [4 /*yield*/, komunikat.getText()];
                case 6:
                    _b.apply(void 0, [_c.sent()]).to.equal('Zarezerwowano lot ' +
                        ("Pasazer: " + tadeusz + " " + sznuk + " ") +
                        ("Skad: " + la + " ") +
                        ("Dokad: " + krakow + " ") +
                        ("Kiedy: " + przyszlosc));
                    return [2 /*return*/];
            }
        });
    }); });
    it('zakryty link', function () { return __awaiter(void 0, void 0, void 0, function () {
        var submit, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, mocha_webdriver_1.driver.get(plik)];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, wypelnijFormularz(la, krakow, przyszlosc, tadeusz, sznuk)];
                case 2:
                    _b.sent();
                    submit = mocha_webdriver_1.driver.find('input[type=submit]');
                    return [4 /*yield*/, submit.doClick()];
                case 3:
                    _b.sent();
                    _a = chai_1.expect;
                    return [4 /*yield*/, mocha_webdriver_1.driver.find('a').click().then(function () { return true; }, function () { return false; })];
                case 4:
                    _a.apply(void 0, [_b.sent()]).to.equal(false);
                    return [2 /*return*/];
            }
        });
    }); });
});
