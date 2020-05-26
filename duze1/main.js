let jsonString = '[{"statement":"2+2","answer":"4","penalty":10},' +
    '{"statement":"1<<16","answer":"65536","penalty":3},' +
    '{"statement":"8 xor 4","answer":"12","penalty":6},' +
    '{"statement":"5-12","answer":"-7","penalty":7},' +
    '{"statement":"14*19","answer":"266","penalty":2},' +
    '{"statement":"11*11","answer":"121","penalty":5}]';
let StartScreen = document.querySelector('#start_screen');
let MainScreen = document.querySelector('#main_screen');
let EndScreen = document.querySelector('#end_screen');
let StartButton = document.querySelector('input[value="Start quiz"]');
let NextButton = document.querySelector('input[value="Next"]');
let PreviousButton = document.querySelector('input[value="Previous"]');
let FinishButton = document.querySelector('input[value="Finish"]');
let CancelButton = document.querySelector('input[value="Cancel"]');
let ReturnButton = document.querySelector('input[value="Return"]');
let Statement = document.querySelector('#statement');
let Answer = document.querySelector('input[type=text]');
let Timer = document.querySelector('#timer');
let Scoring = document.querySelector('#scoring');
let SaveScoreButton = document.querySelector('input[value="Save score"]');
let SaveWithStatsButton = document.querySelector('input[value="Save with stats"]');
let ScoresButton = document.querySelector('input[value="Best scores"]');
let ScoresScreen = document.querySelector('#scores_screen');
let ScoresTable = document.querySelector('#scores_table');
class Quiz {
    constructor(jsonString) {
        this.refreshTimer = () => {
            Timer.textContent = timeToDisplay(this.getTimeElapsed());
        };
        this.nextQuestion = () => {
            this.saveTimeInterval();
            this.currentQuestion++;
            this.showQuestion();
        };
        this.previousQuestion = () => {
            this.saveTimeInterval();
            this.currentQuestion--;
            this.showQuestion();
        };
        this.saveAnswer = () => {
            this.answers[this.currentQuestion] = Answer.value;
            this.checkCompleted();
        };
        this.saveToLocalStorage = (result) => {
            let randomKey = -1;
            do {
                randomKey = Math.floor(Math.random() * 1e9);
            } while (localStorage.getItem(randomKey.toString()) != null);
            localStorage.setItem(("quiz result" + randomKey.toString()), JSON.stringify(result));
        };
        this.saveScore = () => {
            this.saveToLocalStorage(new QuizResult(this, false));
            reloadPage();
        };
        this.saveWithStats = () => {
            this.saveToLocalStorage(new QuizResult(this, true));
            reloadPage();
        };
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
    getTimeArray() {
        return [...this.time];
    }
    getQuestions() {
        return [...this.questions];
    }
    getAnswers() {
        return [...this.answers];
    }
    finish() {
        this.saveTimeInterval();
        this.finishMoment = Date.now();
    }
    saveTimeInterval() {
        const now = Date.now();
        this.time[this.currentQuestion] += now - this.lastSwitch;
        this.lastSwitch = now;
    }
    getTotalPenalty() {
        let penalty = 0;
        for (let i = 0; i < this.answers.length; i++) {
            if (this.answers[i] != this.questions[i].answer)
                penalty += this.questions[i].penalty;
        }
        return penalty;
    }
    getTotalTime() {
        return this.finishMoment - this.startMoment;
    }
    getTimeElapsed() {
        return Date.now() - this.startMoment;
    }
    showScore() {
        const time = this.getTimeElapsed();
        const penalty = this.getTotalPenalty();
        const score = time + 1000 * penalty;
        Scoring.textContent = `Time: ${timeToDisplay(time)}\n` +
            `Penalty: ${penalty}\n` +
            `Score: ${timeToDisplay(score)}\n`;
    }
    showQuestion() {
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
    checkCompleted() {
        for (let i = 0; i < this.questions.length; i++) {
            if (!this.answers[i].length) {
                disableButton(FinishButton);
                return;
            }
        }
        enableButton(FinishButton);
    }
}
class QuizStatistics {
    constructor(quiz) {
        this.questions = quiz.getQuestions();
        this.answers = quiz.getAnswers();
        this.time = quiz.getTimeArray();
    }
}
class QuizResult {
    constructor(quiz, withStats) {
        if (withStats)
            this.stats = new QuizStatistics(quiz);
        else
            this.stats = null;
        this.time = quiz.getTotalTime();
        this.penalty = quiz.getTotalPenalty();
        this.score = this.time + 1000 * this.penalty;
    }
}
function timeToDisplay(ms) {
    const sec = Math.floor(ms / 1000);
    const tensOfSec = Math.floor(ms / 100 - 10 * sec);
    return sec + '.' + tensOfSec;
}
function printScores() {
    let results = new Array();
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
        let row = ScoresTable.insertRow(-1);
        let scoreCell = row.insertCell(-1);
        scoreCell.textContent = timeToDisplay(results[i].score);
        let timeCell = row.insertCell(-1);
        timeCell.textContent = timeToDisplay(results[i].time);
        let penaltyCell = row.insertCell(-1);
        penaltyCell.textContent = results[i].penalty.toString();
    }
}
let currentQuiz = null;
function showScreen(screen) {
    screen.style.display = 'flex';
}
function hideScreen(screen) {
    screen.style.display = 'none';
}
function disableButton(button) {
    button.disabled = true;
}
function enableButton(button) {
    button.disabled = false;
}
function hideAllScreens() {
    hideScreen(MainScreen);
    hideScreen(StartScreen);
    hideScreen(EndScreen);
    hideScreen(ScoresScreen);
}
function reloadPage() {
    window.location.reload();
}
function finishQuiz() {
    hideScreen(MainScreen);
    showScreen(EndScreen);
    currentQuiz.finish();
    currentQuiz.showScore();
}
function startQuiz() {
    currentQuiz = new Quiz(jsonString);
    NextButton.addEventListener('click', currentQuiz.nextQuestion);
    PreviousButton.addEventListener('click', currentQuiz.previousQuestion);
    FinishButton.addEventListener('click', finishQuiz);
    CancelButton.addEventListener('click', reloadPage);
    Answer.addEventListener('input', currentQuiz.saveAnswer);
    SaveScoreButton.addEventListener('click', currentQuiz.saveScore);
    SaveWithStatsButton.addEventListener('click', currentQuiz.saveWithStats);
}
function showScores() {
    hideScreen(StartScreen);
    showScreen(ScoresScreen);
    printScores();
}
function addStartEvent() {
    StartButton.addEventListener('click', startQuiz);
}
function addScoresEvent() {
    ScoresButton.addEventListener('click', showScores);
    ReturnButton.addEventListener('click', reloadPage);
}
function main() {
    hideAllScreens();
    showScreen(StartScreen);
    addStartEvent();
    addScoresEvent();
}
main();
