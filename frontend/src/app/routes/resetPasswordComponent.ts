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
import {
	createPasswordMatchValidator,
	createPasswordValidator,
} from "./passwordStrengthValidator";

@Component({
	selector: "email-verification-route",
	standalone: true,
	templateUrl: "./resetPasswordComponent.html",
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		MatFormFieldModule,
		MatButtonModule,
		MatInputModule,
	],
})
export class resetPasswordComponent {
	authCode: string = "";
	router: Router;
	invalidInfo: Array<string> = [];
	resetPasswordForm: FormGroup;
	passwordResetSuccessfully: boolean = false;

	constructor(private apiService: ApiService) {
		const searchParams = new URLSearchParams(window.location.search);
		this.authCode = searchParams.get("code") ?? "";
		this.router = inject(Router);
		if (this.authCode === "") {
			console.error("No authentication code provided in the URL.");
			this.router.navigate(["/login"]);
		}
		this.resetPasswordForm = new FormGroup(
			{
				pswd: new FormControl("", {
					validators: [
						Validators.required,
						createPasswordValidator(),
					],
					updateOn: "change",
				}),
				confirmPswd: new FormControl("", [Validators.required]),
			},
			{ validators: createPasswordMatchValidator(), updateOn: "change" }
		);
	}

	onSubmit() {
		this.apiService
			.resetPassword(this.authCode, this.resetPasswordForm.value.pswd)
			.subscribe({
				next: (response) => {
					this.passwordResetSuccessfully = true;
					this.invalidInfo = [];
					new Promise((r) => setTimeout(r, 1500)).then(() => {
						this.router.navigate(["/login"]);
					});
				},
				error: (error) => {
					console.error("Error resetting password:", error);
					this.invalidInfo = [
						"Failed to reset password. Please request password reset link again.",
					];
					new Promise((r) => setTimeout(r, 1500)).then(() => {
						this.router.navigate(["/forgot-password"]);
					});
				},
			});
	}
}
