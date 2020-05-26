type Question = {
	statement: string;
	answer: string;
	penalty: number;
}

let jsonString = '[{"statement":"2+2","answer":"4","penalty":10},' +
'{"statement":"1<<16","answer":"65536","penalty":3},' +
'{"statement":"8 xor 4","answer":"12","penalty":6},' +
'{"statement":"5-12","answer":"-7","penalty":7},' +
'{"statement":"14*19","answer":"266","penalty":2},' +
'{"statement":"11*11","answer":"121","penalty":5}]';

let StartScreen = document.querySelector('#start_screen') as HTMLElement;
let MainScreen = document.querySelector('#main_screen') as HTMLElement;
let EndScreen = document.querySelector('#end_screen') as HTMLElement;

let StartButton = document.querySelector('input[value="Start quiz"]') as HTMLInputElement;
let NextButton = document.querySelector('input[value="Next"]') as HTMLInputElement;
let PreviousButton = document.querySelector('input[value="Previous"]') as HTMLInputElement;
let FinishButton = document.querySelector('input[value="Finish"]') as HTMLInputElement;
let CancelButton = document.querySelector('input[value="Cancel"]') as HTMLInputElement;
let ReturnButton = document.querySelector('input[value="Return"]') as HTMLInputElement;

let Statement = document.querySelector('#statement') as HTMLElement;
let Answer = document.querySelector('input[type=text]') as HTMLInputElement;

let Timer = document.querySelector('#timer') as HTMLElement;
let Scoring = document.querySelector('#scoring') as HTMLElement;
let SaveScoreButton = document.querySelector('input[value="Save score"]') as HTMLInputElement;
let SaveWithStatsButton = document.querySelector('input[value="Save with stats"]') as HTMLInputElement;
let ScoresButton = document.querySelector('input[value="Best scores"]') as HTMLInputElement;
let ScoresScreen = document.querySelector('#scores_screen') as HTMLElement;
let ScoresTable = document.querySelector('#scores_table') as HTMLTableElement;

class Quiz {
	questions: Question[];
	answers: string[];
	time: number[];
	currentQuestion: number;
	lastSwitch: number;
	startMoment: number;
	finishMoment: number;

	constructor(jsonString: string) {
		this.questions = JSON.parse(jsonString);
		this.answers = new Array(this.questions.length);
		this.time = new Array(this.questions.length);
		for (let i = 0; i < this.answers.length; i++) {
			this.answers[i] = '';
			this.time[i] = 0;
		}
		this.currentQuestion = 0;
		this.startMoment = Date.now();
		this.lastSwitch = Date.now();
		this.refreshTimer();
		setInterval(this.refreshTimer, 100);
		hideScreen(StartScreen);
		showScreen(MainScreen);
		disableButton(FinishButton);
		this.showQuestion();
	}

	getTimeArray(): number[] {
		return [...this.time];
	}

	getQuestions(): Question[] {
		return [...this.questions];
	}

	getAnswers(): string[] {
		return [...this.answers];
	}

	finish(): void {
		this.saveTimeInterval();
		this.finishMoment = Date.now();
	}
 
	saveTimeInterval(): void {
		const now: number = Date.now();
		this.time[this.currentQuestion] += now - this.lastSwitch;
		this.lastSwitch = now;
	}

	getTotalPenalty(): number {
		let penalty: number = 0;
		for (let i = 0; i < this.answers.length; i++) {
			if (this.answers[i] != this.questions[i].answer)
				penalty += this.questions[i].penalty;
		}
		return penalty;
	}

	getTotalTime(): number {
		return this.finishMoment - this.startMoment;
	}

	getTimeElapsed() {
		return Date.now() - this.startMoment;
	}

	showScore(): void {
		const time: number = this.getTimeElapsed();
		const penalty: number = this.getTotalPenalty();
		const score: number = time + 1000 * penalty;
		Scoring.textContent = `Time: ${timeToDisplay(time)}\n` +
			`Penalty: ${penalty}\n` +
			`Score: ${timeToDisplay(score)}\n`;
	}

	refreshTimer = () => {
		Timer.textContent = timeToDisplay(this.getTimeElapsed());
	}

	showQuestion(): void {
		Statement.textContent = this.questions[this.currentQuestion].statement;
		Answer.value = this.answers[this.currentQuestion];

		if (this.currentQuestion === 0)
			disableButton(PreviousButton);
		else
			enableButton(PreviousButton);

		if (this.currentQuestion == this.questions.length - 1) 
			disableButton(NextButton);
		else
			enableButton(NextButton);
	}

	nextQuestion = () => {
		this.saveTimeInterval();
		this.currentQuestion++;
		this.showQuestion();
	}

	previousQuestion = () => {
		this.saveTimeInterval();
		this.currentQuestion--;
		this.showQuestion();
	}

	checkCompleted(): void {
		for (let i = 0; i < this.questions.length; i++) {
			if (!this.answers[i].length) {
				disableButton(FinishButton);
				return;
			}
		}
		enableButton(FinishButton);
	}
	
	saveAnswer = () => {
		this.answers[this.currentQuestion] = Answer.value;
		this.checkCompleted();
	}

	saveToLocalStorage = (result: QuizResult) => {
		let randomKey: number = -1;
		
		do {
			randomKey = Math.floor(Math.random() * 1e9);
		} while (localStorage.getItem(randomKey.toString()) != null)

		localStorage.setItem(("quiz result" + randomKey.toString()), JSON.stringify(result))
	}

	saveScore = () => {
		this.saveToLocalStorage(new QuizResult(this, false));
		reloadPage();
	}

	saveWithStats = () => {
		this.saveToLocalStorage(new QuizResult(this, true));
		reloadPage();
	}	
}

class QuizStatistics {
	questions: Question[];
	answers: string[];
	time: number[];

	constructor(quiz: Quiz) {
		this.questions = quiz.getQuestions();
		this.answers = quiz.getAnswers();
		this.time = quiz.getTimeArray();
	}
}

class QuizResult {
	score: number;
	time: number;
	penalty: number;
	stats: QuizStatistics;

	constructor(quiz: Quiz, withStats: boolean) {
		if (withStats)
			this.stats = new QuizStatistics(quiz);
		else
			this.stats = null;
		this.time = quiz.getTotalTime();
		this.penalty = quiz.getTotalPenalty();
		this.score = this.time + 1000 * this.penalty;
	}
}

function timeToDisplay(ms: number): string {
	const sec = Math.floor(ms / 1000);
	const tensOfSec = Math.floor(ms / 100 - 10 * sec);
	return sec + '.' + tensOfSec;
}

function printScores(): void {
	let results: QuizResult[] = new Array();

	for (let i = 0; i < localStorage.length; i++) {
		const key = localStorage.key(i);
		if (key != null && key.startsWith("quiz result")) {
			const value = localStorage.getItem(key);
			results.push(JSON.parse(value));
		}
	}

	results.sort((q1, q2) => q1.score - q2.score);
	
	while (results.length > 10)
		results.pop();
	
	for (let i = 0; i < results.length; i++) {
		let row: HTMLTableRowElement = ScoresTable.insertRow(-1);
		let scoreCell: HTMLTableCellElement = row.insertCell(-1);
		scoreCell.textContent = timeToDisplay(results[i].score);
		let timeCell: HTMLTableCellElement = row.insertCell(-1);
		timeCell.textContent = timeToDisplay(results[i].time);
		let penaltyCell: HTMLTableCellElement = row.insertCell(-1);
		penaltyCell.textContent = results[i].penalty.toString();
	}
}

let currentQuiz: Quiz = null;

function showScreen(screen: HTMLElement): void {
	screen.style.display = 'flex';
}

function hideScreen(screen: HTMLElement): void {
	screen.style.display = 'none';
}

function disableButton(button: HTMLInputElement): void {
	button.disabled = true;
}

function enableButton(button: HTMLInputElement): void {
	button.disabled = false;
}

function hideAllScreens(): void {
	hideScreen(MainScreen);
	hideScreen(StartScreen);
	hideScreen(EndScreen);
	hideScreen(ScoresScreen);
}

function reloadPage(): void {
	window.location.reload();
}

function finishQuiz(): void {
	hideScreen(MainScreen);
	showScreen(EndScreen);
	currentQuiz.finish();
	currentQuiz.showScore();
}

function startQuiz(): void {
	currentQuiz = new Quiz(jsonString);
	NextButton.addEventListener('click', currentQuiz.nextQuestion);
	PreviousButton.addEventListener('click', currentQuiz.previousQuestion);
	FinishButton.addEventListener('click', finishQuiz);
	CancelButton.addEventListener('click', reloadPage);
	Answer.addEventListener('input', currentQuiz.saveAnswer);
	SaveScoreButton.addEventListener('click', currentQuiz.saveScore);
	SaveWithStatsButton.addEventListener('click', currentQuiz.saveWithStats);
}

function showScores(): void {
	hideScreen(StartScreen);
	showScreen(ScoresScreen);
	printScores();
}

function addStartEvent(): void {
	StartButton.addEventListener('click', startQuiz);
}

function addScoresEvent(): void {
	ScoresButton.addEventListener('click', showScores);
	ReturnButton.addEventListener('click', reloadPage);
}

function main(): void {
	hideAllScreens();
	showScreen(StartScreen);
	addStartEvent();
	addScoresEvent();
}

main();