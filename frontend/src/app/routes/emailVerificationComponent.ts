import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";

@Component({
	selector: "email-verification-route",
	standalone: true,
	templateUrl: "./emailVerificationComponent.html",
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatButtonModule,
		MatInputModule,
	],
})
export class emailVerificationComponent {
	authCode: string;
	router: Router;
	invalidInfo: Array<string> = [];
	emailVerified: boolean = false;
	constructor(private apiService: ApiService) {
		const searchParams = new URLSearchParams(window.location.search);
		this.authCode = searchParams.get("code") ?? "";
		this.router = inject(Router);
		if (this.authCode === "") {
			console.error("No authentication code provided in the URL.");
			this.router.navigate(["/login"]);
		}
	}

	emailForm = new FormGroup({
		email: new FormControl("", Validators.required),
	});

	verify() {
		if (this.emailForm.valid) {
			this.invalidInfo = [];
			const email = this.emailForm.value.email;
			this.apiService
				.verifyEmail(email ?? "", this.authCode ?? "")
				.subscribe({
					next: (response) => {
						console.log("Email verification successful", response);
						this.emailVerified = true;
						new Promise((r) => setTimeout(r, 1500)).then(() => {
							this.router.navigate(["/login"]);
						});
					},
					error: (error) => {
						if (
							error.error.error.includes("Email already verified")
						) {
							console.error("Email has already been verified.");
							this.invalidInfo.push(
								"Email has already been verified. Please log in."
							);
							new Promise((r) => setTimeout(r, 1500)).then(() => {
								this.router.navigate(["/login"]);
							});
						}
						console.log(error.error.error);
						if (error.error.error.includes("User not found")) {
							console.error(
								"Email not found. Please enter a valid email."
							);
							this.invalidInfo.push(
								"Email not found. Please enter a valid email."
							);
						}
						if (error.error.error.includes("Invalid auth code")) {
							console.error("Invalid authentication code.");
							this.invalidInfo.push(
								"Invalid authentication code."
							);
						}
					},
				});
		} else {
			console.error("Email form is invalid");
		}
	}
}
