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

	getTimeArray = () => {
		return [...this.time];
	}

	getQuestions = () => {
		return [...this.questions];
	}

	getAnswers = () => {
		return [...this.answers];
	}

	finish = () => {
		this.saveTimeInterval();
		this.finishMoment = Date.now();
	}
 
	saveTimeInterval = () => {
		const now = Date.now();
		this.time[this.currentQuestion] += now - this.lastSwitch;
		this.lastSwitch = now;
	}

	getTotalPenalty = () => {
		let penalty = 0;
		for (let i = 0; i < this.answers.length; i++) {
			if (this.answers[i] != this.questions[i].answer)
				penalty += this.questions[i].penalty;
		}
		return penalty;
	}

	getTotalTime = () => {
		return this.finishMoment - this.startMoment;
	}

	getTimeElapsed = () => {
		return Date.now() - this.startMoment;
	}

	showScore = () => {
		const time = this.getTimeElapsed();
		const penalty = this.getTotalPenalty();
		const score = time + 1000 * penalty;
		Scoring.textContent = `Time: ${timeToDisplay(time)}\n` +
			`Penalty: ${penalty}\n` +
			`Score: ${timeToDisplay(score)}\n`;
	}

	refreshTimer = () => {
		Timer.textContent = timeToDisplay(this.getTimeElapsed());
	}

	showQuestion = () => {
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
		console.log('nextQuestion()')
		this.saveTimeInterval();
		this.currentQuestion++;
		this.showQuestion();
	}

	previousQuestion = () => {
		console.log('previousQuestion()')
		this.saveTimeInterval();
		this.currentQuestion--;
		this.showQuestion();
	}

	checkCompleted = () => {
		console.log('checkCompleted()');
		for (let i = 0; i < this.questions.length; i++) {
			if (!this.answers[i].length) {
				disableButton(FinishButton);
				return;
			}
		}
		enableButton(FinishButton);
	}
	
	saveAnswer = () => {
		console.log('saveAnswer()');
		this.answers[this.currentQuestion] = Answer.value;
		this.checkCompleted();
	}

	saveToLocalStorage = (result: QuizResult) => {
		const key = 'results';
		if (localStorage.getItem(key) === null) {
			let value = new Array(result);
			localStorage.setItem(key, JSON.stringify(value));
		} else {
			let value: QuizResult[] = JSON.parse(localStorage.getItem(key));
			value.push(result);
			localStorage.setItem(key, JSON.stringify(value));
		}
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