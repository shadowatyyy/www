function ukryjSubmit() {
	const submit = document.querySelector('input[type=submit]') as HTMLInputElement;
	submit.style.display = 'none';
}

function pokazSubmit() {
	const submit = document.querySelector('input[type=submit]') as HTMLInputElement;
	submit.style.display = 'block';
}

function wypiszImie() {
	console.log(imie.value);
}

function zmienHeader() {
	const header = document.querySelector('header') as HTMLHeadElement;
	header.textContent = 'inny header';
}

function nowyAkapit() {
	const akapit = document.createElement('p');
	akapit.textContent = "nowy akapit";
	document.body.appendChild(akapit);
}

async function teczoweKolory(el: HTMLElement) {
	console.log('red');
	el.style.backgroundColor = 'red';
	await poczekaj(1000);

	console.log('orange');
	el.style.backgroundColor = 'orange';
	await poczekaj(1000);

	console.log('yellow');
	el.style.backgroundColor = 'yellow';
	await poczekaj(1000);

	console.log('blue');
	el.style.backgroundColor = 'blue';
	await poczekaj(1000);

	console.log('indigo');
	el.style.backgroundColor = 'indigo';
	await poczekaj(1000);

	console.log('purple');
	el.style.backgroundColor = 'purple';
	await poczekaj(1000);
}

// zadanie 6 czesc 1
async function teczowaTabelka() {
	const tabelka = document.querySelector('#tabelka') as HTMLTableElement;
	teczoweKolory(tabelka);
}

function poczekaj(ile: number) {
	return new Promise((resolve, reject) => setTimeout(() => {resolve()}, ile));
}

function pokazObrazek(url: string) {
	const el = document.createElement('img') as HTMLImageElement;
	el.src = url;
	document.body.appendChild(el);
}

// zadanie 6 czesc 2
function znajdzPokazAvatar() {
	fetch('https://api.github.com/repos/Microsoft/TypeScript/commits')
		.then(response => response.json())
		.then(data => pokazObrazek(data[0].author.avatar_url))
		.catch(() => console.log('błąd'));
}

const opoznienia = document.querySelector('#opoznienia') as HTMLTableElement;
const rezerwacja = document.querySelector('#rezerwacja') as HTMLFormElement;

function losowyKolor() {
	let color = "";
	for (let i = 0; i < 3; i++) {
		const sub = Math.floor(Math.random() * 256).toString(16);
		color += (sub.length === 1 ? "0" + sub : sub);
	}
	return "#" + color;
}

let klikniecia = 0;

function fib(x : number) : number {
	if (x <= 1)
		return x;

	return fib(x - 1) + fib(x - 2);
}

function kolorujKolumne() {
	klikniecia++; // zadanie 7 czesc 4
	console.log(fib(10 * klikniecia)); // przegladarka zawiesza sie, poniewaz obliczenia wykonuja sie zbyt dlugp

	const kolor = losowyKolor();
	opoznienia.style.backgroundColor = kolor;
	rezerwacja.style.backgroundColor = kolor;
}

function sprawdzCzyKolumna(klik: MouseEvent) {
	const gdzie = klik.target as Node;
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
	const grid = document.querySelector('#grid');
	grid.addEventListener('click', sprawdzCzyKolumna);
}

const zatrzymajKlik = (klik: Event) : void => {
	klik.stopPropagation();
}

// zadanie 7 czesc 3
// nie wiem czy rozumiem tresc zadania, zakladam ze chodzi w nim o "wylaczenie" w jakis sposob reakcji formularza na klikniecie
function klikniecie3() {
	const grid = document.querySelector('#grid');
	grid.addEventListener('click', sprawdzCzyKolumna);
	rezerwacja.addEventListener('click', zatrzymajKlik);
}

const skad = document.querySelector('select[id=start]') as HTMLSelectElement;
const dokad = document.querySelector('select[id=destination]') as HTMLSelectElement;
const wpisanaData = document.querySelector('input[type=date]') as HTMLInputElement;
const imie = document.querySelector('input[id=imie]') as HTMLInputElement;
const nazwisko = document.querySelector('input[id=nazwisko]') as HTMLInputElement;

function sprawdzFormularz() {
	const dzis = new Date();
	dzis.setHours(0, 0, 0, 0);
	const data = new Date(wpisanaData.value);
	data.setHours(0, 0, 0, 0);

	let ok = true;

	if (wpisanaData.value.length === 0)
		ok = false;

	if (skad.value === 'wybierz')
		ok = false;

	if (dokad.value === 'wybierz')
		ok = false;

	if (data < dzis)
		ok = false;

	if (imie.value.length === 0)
		ok = false;

	if (nazwisko.value.length === 0)
		ok = false;

	if (ok)
		pokazSubmit();
	else
		ukryjSubmit();
}

// zadanie 7 czesc 5
function poczekajNaWybor() {
	ukryjSubmit();
	rezerwacja.addEventListener('input', sprawdzFormularz);
}

const pokazWpisane = (klik: Event) : void => {
	klik.preventDefault();

	let wypisz = 'Zarezerwowano lot\n';
	wypisz += `Pasazer: ${imie.value} ${nazwisko.value}\n`;
	wypisz += `Skad: ${skad.value}\n`
	wypisz += `Dokad: ${dokad.value}\n`
	wypisz += `Kiedy: ${wpisanaData.value}\n`

	const wiadomosc = document.querySelector('.prostokat') as HTMLElement;
	wiadomosc.style.display = 'block';
	wiadomosc.textContent = wypisz;
}
function klikniecieSubmit() {
	const submit = document.querySelector('input[type=submit]') as HTMLInputElement;
	submit.addEventListener('click', pokazWpisane);
}

poczekajNaWybor();
klikniecieSubmit();