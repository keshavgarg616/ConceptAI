import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";

@Component({
	selector: "app-root",
	imports: [RouterOutlet],
	templateUrl: "./app.html",
	styleUrl: "./app.css",
})
export class App {
	protected title = "frontend";
}
