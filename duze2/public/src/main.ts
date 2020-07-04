const host : string = "http://localhost:3000";

let script : HTMLScriptElement = document.scripts[1];
let quizId : string = script.getAttribute("data-id");
let token : string = script.getAttribute("data-token");

let StartScreen = document.querySelector('#start_screen') as HTMLElement;
let MainScreen = document.querySelector('#main_screen') as HTMLElement;
let EndScreen = document.querySelector('#end_screen') as HTMLElement;

let StartButton = document.querySelector('input[value="Start quiz"]') as HTMLInputElement;
let NextButton = document.querySelector('input[value="Next"]') as HTMLInputElement;
let PreviousButton = document.querySelector('input[value="Previous"]') as HTMLInputElement;
let FinishButton = document.querySelector('input[value="Finish"]') as HTMLInputElement;
let CancelButton = document.querySelector('input[value="Cancel"]') as HTMLInputElement;
let ReturnButton = document.querySelector('input[value="Return"]') as HTMLInputElement;
let BackButton = document.querySelector('input[value="Back"]') as HTMLInputElement;

let Statement = document.querySelector('#statement') as HTMLElement;
let Answer = document.querySelector('input[type=text]') as HTMLInputElement;

let Timer = document.querySelector('#timer') as HTMLElement;
let Scoring = document.querySelector('#scoring') as HTMLElement;
let ScoresButton = document.querySelector('input[value="Best scores"]') as HTMLInputElement;
let ScoresScreen = document.querySelector('#scores_screen') as HTMLElement;

export type Question = {
	statement: string;
	answer: string;
	penalty: number;
}

export class QuizResult {
	answers: string[];
	fraction: number[];

	constructor(quiz: Quiz) {
		const totalTime: number = quiz.getTotalTime();

		this.answers = [...quiz.answers];
		this.fraction = new Array(quiz.questions.length);

		for (let i = 0; i < quiz.questions.length; i++) {
			this.fraction[i] = quiz.time[i] / totalTime;
		}
	}
}

export class Quiz {
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

	timeToDisplay(ms: number) : string {
        const sec = Math.floor(ms / 1000);
        const tensOfSec = Math.floor(ms / 100 - 10 * sec);
        return sec + '.' + tensOfSec;
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
}

async function saveWithPostRequest(result : QuizResult) {
	await fetch(host + `/quiz/${quizId}/save`, {
		credentials: 'same-origin',
		method: 'Post',
		body: JSON.stringify(result),
		headers: {
			'CSRF-Token': token,
			'Content-Type': 'application/json'
		}
	});
}

async function saveScore(quiz : Quiz) {
	await saveWithPostRequest(new QuizResult(quiz));
}

function timeToDisplay(ms: number): string {
	const sec = Math.floor(ms / 1000);
	const tensOfSec = Math.floor(ms / 100 - 10 * sec);
	return sec + '.' + tensOfSec;
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

async function finishQuiz() : Promise<void> {
	currentQuiz.finish();
	await saveScore(currentQuiz);
	showScores();
}

async function startQuiz(): Promise<void> {
	const json : string = await fetch(host + `/quiz/${quizId}/start`, {
		credentials: 'same-origin',
		method: 'Post',
		headers: {
			'CSRF-Token': token,
			'Content-Type': 'plain/text'
		}
	})
	.then(response => response.json());

	if (JSON.parse(json) === null) {
		StartButton.value = 'Already solved';
		return;
	}

	currentQuiz = new Quiz(json);
	NextButton.addEventListener('click', currentQuiz.nextQuestion);
	PreviousButton.addEventListener('click', currentQuiz.previousQuestion);
	FinishButton.addEventListener('click', finishQuiz);
	CancelButton.addEventListener('click', reloadPage);
	Answer.addEventListener('input', currentQuiz.saveAnswer);
}

function showScores(): void {
	window.location.replace(host + `/quiz/${quizId}/stats`);
}

function homeScreen(): void {
	window.location.replace(host + `/`);
}

function addStartEvent(): void {
	StartButton.addEventListener('click', startQuiz);
}

function addScoresEvent(): void {
	ScoresButton.addEventListener('click', showScores);
	ReturnButton.addEventListener('click', reloadPage);
	BackButton.addEventListener('click', homeScreen);
}

function main(): void {
	hideAllScreens();
	showScreen(StartScreen);
	addStartEvent();
	addScoresEvent();
}

main();