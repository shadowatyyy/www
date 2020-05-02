import { fib } from "./fib";
import { expect } from "chai";
import "mocha";
import { driver } from 'mocha-webdriver';

describe("Fibonacci", () => {
	it("should equal 0 for call with 0", () => {
		expect(fib(0)).to.equal(0);
	});

	it("should equal 1 for call with 1", () => {
		expect(fib(1)).to.equal(1);
	});

	it("should equal 1 for call with 2", () => {
		expect(fib(2)).to.equal(1);
	});

	it("should equal 5 for call with 5", () => {
		expect(fib(5)).to.equal(5);
	});

	it("should equal 21 for call with 8", () => {
		expect(fib(8)).to.equal(21);
	});

	it("should equal 144 for call with 12", () => {
		expect(fib(12)).to.equal(144);
	});
});

const plik = `file://${process.cwd()}/lista.html`;
const przeszlosc = '2000-01-01';
const przyszlosc = '2030-06-07';
const imie = 'Tadeusz';
const nazwisko = 'Sznuk'

describe('niepoprawny formularz', () => {
	it('bez wpisanej daty', async () => {
		await driver.get(plik);
		const skad = await driver.find('select[id=start]');
		const dokad = await driver.find('select[id=destination]');
		const data = await driver.find('input[type=date]');
		const poleImie = await driver.find('input[name=imie]');
		const poleNazwisko = await driver.find('input[name=nazwisko]');
		skad.sendKeys('la');
		dokad.sendKeys('krakow');
		data.sendKeys('');
		poleImie.sendKeys(imie);
		poleNazwisko.sendKeys(nazwisko);
		expect(await (await driver.find('input[type=submit]')).isDisplayed()).to.equal(false);
	});

	it('data w przeszlosci', async () => {
		await driver.get(plik);
		const skad = await driver.find('select[id=start]');
		const dokad = await driver.find('select[id=destination]');
		const data = await driver.find('input[type=date]');
		const poleImie = await driver.find('input[name=imie]');
		const poleNazwisko = await driver.find('input[name=nazwisko]');
		skad.sendKeys('la');
		dokad.sendKeys('krakow');
		data.sendKeys(przeszlosc);
		poleImie.sendKeys(imie);
		poleNazwisko.sendKeys(nazwisko);
		expect(await (await driver.find('input[type=submit]')).isDisplayed()).to.equal(false);
	});

	it('bez imienia', async () => {
		await driver.get(plik);
		const skad = await driver.find('select[id=start]');
		const dokad = await driver.find('select[id=destination]');
		const data = await driver.find('input[type=date]');
		const poleImie = await driver.find('input[name=imie]');
		const poleNazwisko = await driver.find('input[name=nazwisko]');
		skad.sendKeys('la');
		dokad.sendKeys('krakow');
		data.sendKeys(przeszlosc);
		poleImie.sendKeys('');
		poleNazwisko.sendKeys(nazwisko);
		expect(await (await driver.find('input[type=submit]')).isDisplayed()).to.equal(false);
	});

	it('bez celu podrozy', async () => {
		await driver.get(plik);
		const skad = await driver.find('select[id=start]');
		const dokad = await driver.find('select[id=destination]');
		const data = await driver.find('input[type=date]');
		const poleImie = await driver.find('input[name=nazwisko]');
		const poleNazwisko = await driver.find('input[name=nazwisko]');
		skad.sendKeys('la');
		dokad.sendKeys('krakow');
		data.sendKeys(przeszlosc);
		poleImie.sendKeys(imie);
		poleNazwisko.sendKeys(nazwisko);
		expect(await (await driver.find('input[type=submit]')).isDisplayed()).to.equal(false);
	});
});

describe('poprawny formularz', () => {
	it('wypelniony formularz', async () => {
		await driver.get(plik);
		const skad = await driver.find('select[id=start]');
		const dokad = await driver.find('select[id=destination]');
		const data = await driver.find('input[type=date]');
		const poleImie = await driver.find('input[name=imie]');
		const poleNazwisko = await driver.find('input[name=nazwisko]');
		skad.sendKeys('la');
		dokad.sendKeys('krakow');
		data.sendKeys(przyszlosc);
		poleImie.sendKeys(imie);
		poleNazwisko.sendKeys(nazwisko);
		expect(await (await driver.find('input[type=submit]')).isDisplayed()).to.equal(true);
	});
});