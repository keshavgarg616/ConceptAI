// api.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
	providedIn: "root",
})
export class ApiService {
	private apiUrl = "http://localhost:3000";

	constructor(private http: HttpClient) {}

	private getAuthHeaders() {
		const token = localStorage.getItem("token");
		return {
			headers: new HttpHeaders({
				Authorization: `${token}`,
			}),
		};
	}

	sendMessage(
		message: string,
		history: { role: string; parts: { text: string }[] }[],
		languageName: string,
		conceptName: string
	): Observable<any> {
		return this.http.post(
			`${this.apiUrl}/chat`,
			{ message, history, languageName, conceptName },
			this.getAuthHeaders()
		);
	}

	signup(name: string, email: string, password: string): Observable<any> {
		return this.http.post(`${this.apiUrl}/signup`, {
			name,
			email,
			password,
		});
	}

	login(email: string, password: string): Observable<any> {
		return this.http.post(`${this.apiUrl}/login`, { email, password });
	}

	updateHistory(
		languageName: string,
		conceptName: string,
		history: { role: string; parts: { text: string }[] }[]
	): Observable<any> {
		return this.http.post(
			`${this.apiUrl}/update-history`,
			{ languageName, conceptName, history },
			this.getAuthHeaders()
		);
	}

	getHistory(languageName: string, conceptName: string): Observable<any> {
		return this.http.post(
			`${this.apiUrl}/get-history`,
			{ languageName, conceptName },
			this.getAuthHeaders()
		);
	}

	getLanguages(): Observable<any> {
		return this.http.post(
			`${this.apiUrl}/get-languages`,
			{},
			this.getAuthHeaders()
		);
	}

	updateLanguages(languages: {
		foreign_id: string;
		languages: {
			languageName: string;
			concepts: {
				conceptName: string;
			}[];
		}[];
	}): Observable<any> {
		return this.http.post(
			`${this.apiUrl}/update-language`,
			{ languages },
			this.getAuthHeaders()
		);
	}
}

// Routes available at /chat, /signup, /login, /update-language, /get-languages, /update-history, /get-history
// /chat (message, history) -> { reply: "response text" } --
// /signup (name, email, password) -> { success: true, message: "User created successfully" } --
// /login (email, password) -> { success: true, message: "Login successful", user: { name, email, history } } --
// /update-language (languages) -> { success: true, message: "Languages updated successfully" }
// /get-languages () -> { languages: [{ languageName, concepts: [{ conceptName, history }] }] }
// /update-history (languageName, conceptName, history) -> { success: true, message: "History updated successfully" }
// /get-history (languageName, conceptName) -> { history: [{ role, parts }] }
