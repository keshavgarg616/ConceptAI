import { CommonModule } from "@angular/common";
import { Component, ElementRef, inject, ViewChild } from "@angular/core";
import {
	FormControl,
	FormGroup,
	FormsModule,
	Validators,
	ReactiveFormsModule,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { NewLineHTMLPipe } from "../pipes/new-line-html-pipe";

@Component({
	selector: "chat-route",
	standalone: true,
	templateUrl: "./chatComponent.html",
	styleUrls: ["./chatComponent.css"],
	imports: [
		CommonModule,
		FormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatLabel,
		MatButtonModule,
		ReactiveFormsModule,
		NewLineHTMLPipe,
	],
})
export class ChatComponent {
	@ViewChild("scrollMe") private scrollMe!: ElementRef;
	router: Router;
	history: { role: string; parts: { text: string }[] }[] = [];
	historyDeleted: boolean = false;
	loadingResponse: boolean = false;
	languageName: string = "";
	conceptName: string = "";
	queryText: string = "";
	chatForm = new FormGroup({
		query: new FormControl("", Validators.required),
	});

	constructor(private apiService: ApiService) {
		this.router = inject(Router);
		const nav = this.router.getCurrentNavigation();
		const state = nav?.extras?.state as {
			languageName: string;
			conceptName: string;
		};
		if (state === null || state === undefined) {
			this.router.navigate(["/languages"]);
			return;
		}
		this.languageName = state.languageName ?? "";
		this.conceptName = state.conceptName ?? "";
		if (!this.languageName || !this.conceptName) {
			this.router.navigate(["/languages"]);
			return;
		}

		this.apiService
			.getHistory(this.languageName, this.conceptName)
			.subscribe({
				next: (response) => {
					if (response.error) {
						console.error("Error fetching history");
					} else {
						this.history = response.history || [];
						new Promise((r) => setTimeout(r, 500)).then(() => {
							this.scrollMe?.nativeElement.scrollIntoView({
								behavior: "smooth",
							});
						});
					}
				},
			});
	}

	handleSubmit() {
		let message = this.chatForm.value.query || "";
		this.history.push({
			role: "user",
			parts: [{ text: message }],
		});
		this.chatForm.get("query")?.setValue("");
		this.loadingResponse = true;
		this.apiService
			.sendMessage(
				message,
				this.history,
				this.languageName,
				this.conceptName
			)
			.subscribe({
				next: (response) => {
					this.history.push({
						role: "model",
						parts: [{ text: response.reply }],
					});
					this.loadingResponse = false;
					this.apiService
						.updateHistory(
							this.languageName,
							this.conceptName,
							this.history
						)
						.subscribe({
							next: (updateResponse) => {},
						});
					new Promise((r) => setTimeout(r, 250)).then(() => {
						this.scrollMe?.nativeElement.scrollIntoView({
							behavior: "smooth",
						});
					});
					console.log(this.history[this.history.length - 1]);
				},
			});
	}

	deleteHistory() {
		this.history = [];
		this.historyDeleted = true;
		this.apiService
			.updateHistory(this.languageName, this.conceptName, [])
			.subscribe({
				next: (response) => {
					if (response.error) {
						console.error("Error deleting history");
					}
				},
			});
		new Promise((r) => setTimeout(r, 1500)).then(() => {
			this.historyDeleted = false;
		});
	}
}
