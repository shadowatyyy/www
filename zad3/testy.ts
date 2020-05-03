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
const tadeusz = 'Tadeusz';
const sznuk = 'Sznuk'
const la = 'la'
const krakow = 'krakow';

async function wypelnijFormularz(skad: string, dokad: string, data: string, imie: string, nazwisko: string) {
	const poleSkad = await driver.find('select[id=start]');
	const poleDokad = await driver.find('select[id=destination]');
	const poleData = await driver.find('input[type=date]');
	const poleImie = await driver.find('input[name=imie]');
	const poleNazwisko = await driver.find('input[name=nazwisko]');
	poleSkad.sendKeys(skad);
	poleDokad.sendKeys(dokad);
	poleData.sendKeys(data);
	poleImie.sendKeys(imie);
	poleNazwisko.sendKeys(nazwisko);
}

describe('niepoprawny formularz', () => {
	it('bez wpisanej daty', async () => {
		await driver.get(plik);
		await wypelnijFormularz(la, krakow, '', tadeusz, sznuk);
		expect(await (await driver.find('input[type=submit]')).isEnabled()).to.equal(false);
	});

	it('data w przeszlosci', async () => {
		await driver.get(plik);
		await wypelnijFormularz(la, krakow, przeszlosc, tadeusz, sznuk);
		expect(await (await driver.find('input[type=submit]')).isEnabled()).to.equal(false);
	});

	it('bez imienia', async () => {
		await driver.get(plik);
		await wypelnijFormularz(la, krakow, przyszlosc, '', sznuk);
		expect(await (await driver.find('input[type=submit]')).isEnabled()).to.equal(false);
	});

	it('nazwisko to spacje', async () => {
		await driver.get(plik);
		await wypelnijFormularz(la, krakow, przyszlosc, tadeusz, '   ');
		expect(await (await driver.find('input[type=submit]')).isEnabled()).to.equal(false);
	});

	it('bez celu podrozy', async () => {
		await driver.get(plik);
		await wypelnijFormularz(la, '', przyszlosc, tadeusz, sznuk);
		expect(await (await driver.find('input[type=submit]')).isEnabled()).to.equal(false);
	});

	it('usuniecie imienia', async () => {
		await driver.get(plik);
		await wypelnijFormularz(la, krakow, przyszlosc, tadeusz, sznuk);
		const poleImie = await driver.find('input[name=imie]');
		await poleImie.clear();
		expect(await (await driver.find('input[type=submit]')).isEnabled()).to.equal(false);
	});
});

describe('poprawny formularz', () => {
	it('wypelniony formularz', async () => {
		await driver.get(plik);
		await wypelnijFormularz(la, krakow, przyszlosc, tadeusz, sznuk);
		expect(await (await driver.find('input[type=submit]')).isEnabled()).to.equal(true);
	});

	it('klikniety formularz', async () => {
		await driver.get(plik);
		await wypelnijFormularz(la, krakow, przyszlosc, tadeusz, sznuk);
		const submit = driver.find('input[type=submit]');
		await submit.doClick();
		const komunikat = await driver.find('.prostokat');
		expect(await komunikat.isDisplayed()).to.equal(true);
		expect(await komunikat.getText()).to.equal(
			'Zarezerwowano lot ' +
			`Pasazer: ${tadeusz} ${sznuk} ` +
			`Skad: ${la} ` +
			`Dokad: ${krakow} ` +
			`Kiedy: ${przyszlosc}`);
	});

	it('zakryty link', async () => {
		await driver.get(plik);
		await wypelnijFormularz(la, krakow, przyszlosc, tadeusz, sznuk);
		const submit = driver.find('input[type=submit]');
		await submit.doClick();
		expect(await driver.find('a').click().then(() => true, () => false)).to.equal(false);
	});
});