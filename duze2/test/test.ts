import {driver, By} from "mocha-webdriver";
import {expect} from "chai";
import "mocha";

const host : string = "http://localhost:3000";
const startPage : string = host + "/";
const loginPage : string = host + "/login";
const logoutPage : string = host + "/logout";
const passwordPage : string = host + "/password";
const quizPage : string = host + "/quiz/1";
const personalPage : string = host + "/quiz/1/personal";

const startButton : string = '//input[@value="Start quiz"]';
const solvedButton : string = '//input[@value="Already solved"]'
const nextButton : string = '//input[@value="Next"]'
const finishButton : string = '//input[@value="Finish"]'
const returnButton : string = '//input[@value="Return"]';
const inputCell : string = '//input[@type="text"]'

async function makeLogin(login : string, password : string) {
	await driver.get(loginPage);
	await driver.find('input[name="login"]').sendKeys(login);
	await driver.find('input[name="password"]').sendKeys(password);
	await driver.find('input[type="submit"]').click();
}

async function makeLogout() {
	await driver.find('a[href="/logout"]').click();
}

async function xpathExists(xpath : string) {
	return await driver.findElement(By.xpath(xpath))
	.then(_ => true).then(null, err => false);
}

async function isLogged() {
	await driver.get(startPage);
	return await driver.find('a[href="/logout"]').then(_ => true).then(null, err => false);
}

async function changePassword(password1 : string, password2 : string) {
	await driver.get(passwordPage);
	await driver.find('input[name="new_password1"]').sendKeys(password1);
	await driver.find('input[name="new_password2"]').sendKeys(password2);
	await driver.find('input[type="submit"]').click();
}

describe('login system', () => {
	it('login', async () => {
		await makeLogin('user1', 'user1');
		expect(await isLogged()).to.equal(true);
	});
	
	it('logout', async () => {
		await makeLogout();
		expect(await isLogged()).to.equal(false);
	});
});

describe('cookie', () => {
	let cookie;

	it('login', async () => {
		await makeLogin('user1', 'user1');
		expect(await isLogged()).to.equal(true);
	});

	it('delete cookie', async () => {
		cookie = await driver.manage().getCookie('connect.sid');
		await driver.manage().deleteCookie('connect.sid');
		expect(await isLogged()).to.equal(false);
	});
	
	it('restore cookie', async () => {
		await driver.manage().addCookie({name: cookie.name, value: cookie.value});
		expect(await isLogged()).to.equal(true);
	});
	
	it('change password and restore cookie', async () => {
		await changePassword("user1", "user1");
		await driver.manage().addCookie({name: cookie.name, value: cookie.value});
		expect(await isLogged()).to.equal(false);
	});
});

describe('solve quiz', () => {
	it('login', async () => {
		await makeLogin('user1', 'user1');
		expect(await isLogged()).to.equal(true);
	})

	it('first time', async () => {
		await driver.get(quizPage);
		expect(await xpathExists(startButton)).to.equal(true);
	})

	it('solve quiz', async () => {
		await driver.get(quizPage);
		await (await driver.findElement(By.xpath(startButton))).click();

		for (let i = 0; i < 6; i++) {
			await driver.sleep(i * 100);
			await (await driver.findElement(By.xpath(inputCell))).sendKeys("1");
			
			if (i < 6)
				await (await driver.findElement(By.xpath(nextButton))).click();
		}

		await (await driver.findElement(By.xpath(finishButton))).click();
	});

	it('check score', async() => {
		await driver.get(personalPage);
		let cells = (await driver.findElements(By.id('time_cell')));

		for (let i = 0; i < cells.length; i++) {
			expect(cells[i].value).to.equal(new String(i) + ".0");
		}
	})

	it('second time', async () => {
		await driver.get(quizPage);
		expect(await xpathExists(startButton)).to.equal(true);
		await (await driver.findElement(By.xpath(startButton))).click();
		await driver.sleep(500);
		expect(await xpathExists(solvedButton)).to.equal(true);
	})
});