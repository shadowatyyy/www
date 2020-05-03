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
function ukryjSubmit() {
    var submit = document.querySelector('input[type=submit]');
    submit.disabled = true;
}
function pokazSubmit() {
    var submit = document.querySelector('input[type=submit]');
    submit.disabled = false;
}
function wypiszImie() {
    console.log(imie.value);
}
function zmienHeader() {
    var header = document.querySelector('header');
    header.textContent = 'inny header';
}
function nowyAkapit() {
    var akapit = document.createElement('p');
    akapit.textContent = "nowy akapit";
    document.body.appendChild(akapit);
}
function teczoweKolory(el) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('red');
                    el.style.backgroundColor = 'red';
                    return [4 /*yield*/, poczekaj(1000)];
                case 1:
                    _a.sent();
                    console.log('orange');
                    el.style.backgroundColor = 'orange';
                    return [4 /*yield*/, poczekaj(1000)];
                case 2:
                    _a.sent();
                    console.log('yellow');
                    el.style.backgroundColor = 'yellow';
                    return [4 /*yield*/, poczekaj(1000)];
                case 3:
                    _a.sent();
                    console.log('blue');
                    el.style.backgroundColor = 'blue';
                    return [4 /*yield*/, poczekaj(1000)];
                case 4:
                    _a.sent();
                    console.log('indigo');
                    el.style.backgroundColor = 'indigo';
                    return [4 /*yield*/, poczekaj(1000)];
                case 5:
                    _a.sent();
                    console.log('purple');
                    el.style.backgroundColor = 'purple';
                    return [4 /*yield*/, poczekaj(1000)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// zadanie 6 czesc 1
function teczowaTabelka() {
    return __awaiter(this, void 0, void 0, function () {
        var tabelka;
        return __generator(this, function (_a) {
            tabelka = document.querySelector('#tabelka');
            teczoweKolory(tabelka);
            return [2 /*return*/];
        });
    });
}
function poczekaj(ile) {
    return new Promise(function (resolve, reject) { return setTimeout(function () { resolve(); }, ile); });
}
function pokazObrazek(url) {
    var el = document.createElement('img');
    el.src = url;
    document.body.appendChild(el);
}
// zadanie 6 czesc 2
function znajdzPokazAvatar() {
    fetch('https://api.github.com/repos/Microsoft/TypeScript/commits')
        .then(function (response) { return response.json(); })
        .then(function (data) { return pokazObrazek(data[0].author.avatar_url); })["catch"](function () { return console.log('błąd'); });
}
var opoznienia = document.querySelector('#opoznienia');
var rezerwacja = document.querySelector('#rezerwacja');
function losowyKolor() {
    var color = "";
    for (var i = 0; i < 3; i++) {
        var sub = Math.floor(Math.random() * 256).toString(16);
        color += (sub.length === 1 ? "0" + sub : sub);
    }
    return "#" + color;
}
var klikniecia = 0;
function fib(x) {
    if (x <= 1)
        return x;
    return fib(x - 1) + fib(x - 2);
}
function kolorujKolumne() {
    klikniecia++; // zadanie 7 czesc 4
    console.log(fib(10 * klikniecia)); // przegladarka zawiesza sie, poniewaz obliczenia wykonuja sie zbyt dlugp
    var kolor = losowyKolor();
    opoznienia.style.backgroundColor = kolor;
    rezerwacja.style.backgroundColor = kolor;
}
function sprawdzCzyKolumna(klik) {
    var gdzie = klik.target;
    if (opoznienia.contains(gdzie) || rezerwacja.contains(gdzie))
        kolorujKolumne();
}
// zadanie 7 czesc 1
// Czy kliknięcie w pole input formularza zmienia kolor tła? Tak
// Ilu handlerów potrzeba do zrobienia zadania? 2, poniewaz kolorujemy dwa pola grida
function klikniecie1() {
    opoznienia.addEventListener('click', kolorujKolumne);
    rezerwacja.addEventListener('click', kolorujKolumne);
}
// zadanie 7 czesc 2
function klikniecie2() {
    var grid = document.querySelector('#grid');
    grid.addEventListener('click', sprawdzCzyKolumna);
}
var zatrzymajKlik = function (klik) {
    klik.stopPropagation();
};
// zadanie 7 czesc 3
// nie wiem czy rozumiem tresc zadania, zakladam ze chodzi w nim o "wylaczenie" w jakis sposob reakcji formularza na klikniecie
function klikniecie3() {
    var grid = document.querySelector('#grid');
    grid.addEventListener('click', sprawdzCzyKolumna);
    rezerwacja.addEventListener('click', zatrzymajKlik);
}
var skad = document.querySelector('select[id=start]');
var dokad = document.querySelector('select[id=destination]');
var wpisanaData = document.querySelector('input[type=date]');
var imie = document.querySelector('input[id=imie]');
var nazwisko = document.querySelector('input[id=nazwisko]');
function sprawdzSlowo(slowo) {
    var len = slowo.length;
    for (var i = 0; i < len; i++) {
        if (slowo[i] !== ' ')
            return true;
    }
    return false;
}
function sprawdzFormularz() {
    var dzis = new Date();
    dzis.setHours(0, 0, 0, 0);
    var data = new Date(wpisanaData.value);
    data.setHours(0, 0, 0, 0);
    if (wpisanaData.value.length === 0 || skad.value === 'wybierz' || dokad.value === 'wybierz' ||
        data < dzis || !sprawdzSlowo(imie.value) || !sprawdzSlowo(nazwisko.value))
        ukryjSubmit();
    else
        pokazSubmit();
}
// zadanie 7 czesc 5
function poczekajNaWybor() {
    ukryjSubmit();
    rezerwacja.addEventListener('change', sprawdzFormularz);
}
var pokazWpisane = function (klik) {
    klik.preventDefault();
    var wypisz = 'Zarezerwowano lot\n';
    wypisz += "Pasazer: " + imie.value + " " + nazwisko.value + "\n";
    wypisz += "Skad: " + skad.value + "\n";
    wypisz += "Dokad: " + dokad.value + "\n";
    wypisz += "Kiedy: " + wpisanaData.value + "\n";
    var wiadomosc = document.querySelector('.prostokat');
    wiadomosc.style.display = 'block';
    wiadomosc.textContent = wypisz;
};
function klikniecieSubmit() {
    var submit = document.querySelector('input[type=submit]');
    submit.addEventListener('click', pokazWpisane);
}
poczekajNaWybor();
klikniecieSubmit();
