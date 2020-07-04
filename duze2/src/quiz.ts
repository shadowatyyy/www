import * as sqlite from "sqlite3";
import {queryGet, queryRun, queryAll} from "./database";

import {Question, QuizResult} from "../public/src/main"

export class QuizStatistics {
	questions: Question[];
	answers: string[];
    time: number[];
    average: number[];
	score: number;
	totalTime: number;
    totalPenalty: number;
    login: string;

	constructor(questions : Question[], quizResult : QuizResult, totalTime : number, login : string) {
        const len : number = questions.length;
        this.questions = [...questions];
        this.answers = new Array(len);
        this.time = new Array(len);
        this.totalTime = totalTime;
        this.totalPenalty = 0;
        this.login = login;

        for (let i = 0; i < len; i++) {
            this.answers[i] = quizResult.answers[i];
            this.time[i] = totalTime * quizResult.fraction[i];

            if (this.answers[i] != questions[i].answer)
                this.totalPenalty += questions[i].penalty;
        }

        this.score = this.totalTime + this.totalPenalty;
    }
}

export async function addQuiz(db : sqlite.Database, id : number, json : string) : Promise<void> {
    await queryRun(db, "INSERT OR REPLACE INTO quiz (id, json) VALUES (?, ?);", [id, json]);
}

export async function getQuiz(db : sqlite.Database, id : number) : Promise<string> {
    const found : any = await queryGet(db, "SELECT json FROM quiz WHERE id = ?;", [id]);

    if (found == null)
        return null;

    return found.json;
}

export async function getAllStats(db : sqlite.Database, quiz_id : number, count : number) : Promise<QuizStatistics[]> {
    const found : any = await queryAll(db, "SELECT json FROM stats WHERE quiz_id = ?;", [quiz_id]);

    if (found == null)
        return null;

    let ret : QuizStatistics[] = [];

    for (let row of found) {
        console.log(row.json);
        const parsed : QuizStatistics = JSON.parse(row.json);
        ret.push(parsed);
    }

    ret.sort((q1, q2) => q1.score - q2.score);

    while (count && ret.length > count)
        ret.pop();

    return ret;
}

async function addAverageTimes(db : sqlite.Database, stats : QuizStatistics, quiz_id : number) : Promise<void> {
    let allStats : QuizStatistics[] = await getAllStats(db, quiz_id, 0);

    if (allStats == null)
        return;

    stats.average = new Array(stats.questions.length);

    for (let q = 0; q < stats.questions.length; q++) {
        let sum = 0;

        for (let s = 0; s < allStats.length; s++) {
            sum += allStats[s].time[q];
        }

        stats.average[q] = sum / allStats.length;
    }
}

export async function getMyStats(db : sqlite.Database, quiz_id : number, user_login : string) : Promise<QuizStatistics> {
    console.log("getMyStats", quiz_id, user_login);
    console.log(await queryAll(db, "SELECT * FROM stats;", []));
    const found : any = await queryGet(db, "SELECT json FROM stats WHERE quiz_id = ? AND user_login = ?;", [quiz_id, user_login]);

    if (found == null)
        return null;

    console.log("my stats", found.json);
    let ret : QuizStatistics = JSON.parse(found.json);
    await addAverageTimes(db, ret, quiz_id);
    return ret;
}


export async function addStats(db : sqlite.Database, quiz_id : number, user_login : string, result : QuizResult, time : number) : Promise<void> {
    console.log("addStats", quiz_id, result);
    const json : string = await getQuiz(db, quiz_id);

    if (json == null)
        return null;

    const questions : Question[] = JSON.parse(json);
    const stats : QuizStatistics = new QuizStatistics(questions, result, time, user_login);
    return queryRun(db, "INSERT INTO stats (quiz_id, user_login, json) VALUES (?, ?, ?);", [quiz_id, user_login, JSON.stringify(stats)]);
}

export async function getQuizList(db : sqlite.Database) : Promise<number[]> {
    const found : any = await queryAll(db, "SELECT id FROM quiz;", []);
    let ret : number[] = [];

    for (let row of found) {
        ret.push(row.id);
    }

    return ret;
}

export async function isSolved(db : sqlite.Database, quiz_id : number, user_login : string) : Promise<boolean> {
    const found : any = await queryGet(db, "SELECT * FROM stats WHERE quiz_id = ? AND user_login = ?;", [quiz_id, user_login]);
    
    console.log(found);

    if (found)
        return true;
    else
        return false;
}