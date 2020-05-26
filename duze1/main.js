var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var jsonString = '[{"statement":"2+2","answer":"4","penalty":10},' +
    '{"statement":"1<<16","answer":"65536","penalty":3},' +
    '{"statement":"8 xor 4","answer":"12","penalty":6},' +
    '{"statement":"5-12","answer":"-7","penalty":7},' +
    '{"statement":"14*19","answer":"266","penalty":2},' +
    '{"statement":"11*11","answer":"121","penalty":5}]';
var StartScreen = document.querySelector('#start_screen');
var MainScreen = document.querySelector('#main_screen');
var EndScreen = document.querySelector('#end_screen');
var StartButton = document.querySelector('input[value="Start quiz"]');
var NextButton = document.querySelector('input[value="Next"]');
var PreviousButton = document.querySelector('input[value="Previous"]');
var FinishButton = document.querySelector('input[value="Finish"]');
var CancelButton = document.querySelector('input[value="Cancel"]');
var ReturnButton = document.querySelector('input[value="Return"]');
var Statement = document.querySelector('#statement');
var Answer = document.querySelector('input[type=text]');
var Timer = document.querySelector('#timer');
var Scoring = document.querySelector('#scoring');
var SaveScoreButton = document.querySelector('input[value="Save score"]');
var SaveWithStatsButton = document.querySelector('input[value="Save with stats"]');
var ScoresButton = document.querySelector('input[value="Best scores"]');
var ScoresScreen = document.querySelector('#scores_screen');
var ScoresTable = document.querySelector('#scores_table');
var Quiz = /** @class */ (function () {
    function Quiz(jsonString) {
        var _this = this;
        this.getTimeArray = function () {
            return __spreadArrays(_this.time);
        };
        this.getQuestions = function () {
            return __spreadArrays(_this.questions);
        };
        this.getAnswers = function () {
            return __spreadArrays(_this.answers);
        };
        this.finish = function () {
            _this.saveTimeInterval();
            _this.finishMoment = Date.now();
        };
        this.saveTimeInterval = function () {
            var now = Date.now();
            _this.time[_this.currentQuestion] += now - _this.lastSwitch;
            _this.lastSwitch = now;
        };
        this.getTotalPenalty = function () {
            var penalty = 0;
            for (var i = 0; i < _this.answers.length; i++) {
                if (_this.answers[i] != _this.questions[i].answer)
                    penalty += _this.questions[i].penalty;
            }
            return penalty;
        };
        this.getTotalTime = function () {
            return _this.finishMoment - _this.startMoment;
        };
        this.getTimeElapsed = function () {
            return Date.now() - _this.startMoment;
        };
        this.showScore = function () {
            var time = _this.getTimeElapsed();
            var penalty = _this.getTotalPenalty();
            var score = time + 1000 * penalty;
            Scoring.textContent = "Time: " + timeToDisplay(time) + "\n" +
                ("Penalty: " + penalty + "\n") +
                ("Score: " + timeToDisplay(score) + "\n");
        };
        this.refreshTimer = function () {
            Timer.textContent = timeToDisplay(_this.getTimeElapsed());
        };
        this.showQuestion = function () {
            Statement.textContent = _this.questions[_this.currentQuestion].statement;
            Answer.value = _this.answers[_this.currentQuestion];
            if (_this.currentQuestion === 0)
                disableButton(PreviousButton);
            else
                enableButton(PreviousButton);
            if (_this.currentQuestion == _this.questions.length - 1)
                disableButton(NextButton);
            else
                enableButton(NextButton);
        };
        this.nextQuestion = function () {
            _this.saveTimeInterval();
            _this.currentQuestion++;
            _this.showQuestion();
        };
        this.previousQuestion = function () {
            _this.saveTimeInterval();
            _this.currentQuestion--;
            _this.showQuestion();
        };
        this.checkCompleted = function () {
            for (var i = 0; i < _this.questions.length; i++) {
                if (!_this.answers[i].length) {
                    disableButton(FinishButton);
                    return;
                }
            }
            enableButton(FinishButton);
        };
        this.saveAnswer = function () {
            _this.answers[_this.currentQuestion] = Answer.value;
            _this.checkCompleted();
        };
        this.saveToLocalStorage = function (result) {
            var randomKey = -1;
            do {
                randomKey = Math.floor(Math.random() * 1e9);
            } while (localStorage.getItem(randomKey.toString()) != null);
            localStorage.setItem(("quiz result" + randomKey.toString()), JSON.stringify(result));
        };
        this.saveScore = function () {
            _this.saveToLocalStorage(new QuizResult(_this, false));
            reloadPage();
        };
        this.saveWithStats = function () {
            _this.saveToLocalStorage(new QuizResult(_this, true));
            reloadPage();
        };
        this.questions = JSON.parse(jsonString);
        this.answers = new Array(this.questions.length);
        this.time = new Array(this.questions.length);
        for (var i = 0; i < this.answers.length; i++) {
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
    return Quiz;
}());
var QuizStatistics = /** @class */ (function () {
    function QuizStatistics(quiz) {
        this.questions = quiz.getQuestions();
        this.answers = quiz.getAnswers();
        this.time = quiz.getTimeArray();
    }
    return QuizStatistics;
}());
var QuizResult = /** @class */ (function () {
    function QuizResult(quiz, withStats) {
        if (withStats)
            this.stats = new QuizStatistics(quiz);
        else
            this.stats = null;
        this.time = quiz.getTotalTime();
        this.penalty = quiz.getTotalPenalty();
        this.score = this.time + 1000 * this.penalty;
    }
    return QuizResult;
}());
function timeToDisplay(ms) {
    var sec = Math.floor(ms / 1000);
    var tensOfSec = Math.floor(ms / 100 - 10 * sec);
    return sec + '.' + tensOfSec;
}
function printScores() {
    var results = new Array();
    for (var i = 0; i < localStorage.length; i++) {
        var key = localStorage.key(i);
        if (key != null && key.startsWith("quiz result")) {
            var value = localStorage.getItem(key);
            results.push(JSON.parse(value));
        }
    }
    results.sort(function (q1, q2) { return q1.score - q2.score; });
    while (results.length > 10)
        results.pop();
    for (var i = 0; i < results.length; i++) {
        var row = ScoresTable.insertRow(-1);
        var scoreCell = row.insertCell(-1);
        scoreCell.textContent = timeToDisplay(results[i].score);
        var timeCell = row.insertCell(-1);
        timeCell.textContent = timeToDisplay(results[i].time);
        var penaltyCell = row.insertCell(-1);
        penaltyCell.textContent = results[i].penalty.toString();
    }
}
var currentQuiz = null;
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
