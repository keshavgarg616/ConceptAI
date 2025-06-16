import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";

@Component({
	selector: "login-route",
	standalone: true,
	templateUrl: "./loginComponent.html",
	imports: [
		CommonModule,
		FormsModule,
		MatFormFieldModule,
		MatButtonModule,
		MatInputModule,
	],
})
export class LoginComponent {
	email: string = "";
	password: string = "";
	router: Router;
	invalidInfo: Array<string> = [];

	constructor(private apiService: ApiService) {
		this.router = inject(Router);
		if (localStorage.getItem("token")) {
			this.router.navigate(["/languages"]);
		}
	}

	onSubmit(form: any) {
		this.invalidInfo = [];
		if (form.valid) {
			this.apiService.login(this.email, this.password).subscribe({
				next: (response) => {
					if (!response.error) {
						localStorage.setItem("token", response.token);
						this.router.navigate(["/languages"]);
					}
				},
				error: (error) => {
					if (error.error.error.includes("User not found")) {
						this.invalidInfo.push("User not found");
					} else if (error.error.error.includes("Invalid password")) {
						this.invalidInfo.push("Invalid password");
					}
				},
			});
		} else {
			console.log("Form Invalid");
		}
	}
}
