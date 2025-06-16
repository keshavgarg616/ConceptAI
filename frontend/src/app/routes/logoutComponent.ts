import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";

@Component({
	selector: "logout-route",
	standalone: true,
	template: `Logging out...`,
	imports: [CommonModule, FormsModule],
})
export class LogoutComponent {
	constructor() {
		localStorage.removeItem("token");
		window.location.href = "/login";
	}
}
