import { Routes } from "@angular/router";
import { LoginComponent } from "./routes/loginComponent";
import { ChatComponent } from "./routes/chatComponent";
import { LogoutComponent } from "./routes/logoutComponent";
import { SignUpComponent } from "./routes/signUpComponent";
import { emailVerificationComponent } from "./routes/emailVerificationComponent";
import { authGuard } from "./auth-guard";
import { LanguagesComponent } from "./routes/LanguagesComponent";
import { forgotPasswordComponent } from "./routes/forgotPasswordComponent";
import { resetPasswordComponent } from "./routes/resetPasswordComponent";

export const routes: Routes = [
	{ path: "", redirectTo: "login", pathMatch: "full" },
	{ path: "login", component: LoginComponent },
	{ path: "chat", component: ChatComponent, canActivate: [authGuard] },
	{ path: "signup", component: SignUpComponent },
	{ path: "logout", component: LogoutComponent },
	{
		path: "languages",
		component: LanguagesComponent,
		canActivate: [authGuard],
	},
	{ path: "verify-email", component: emailVerificationComponent },
	{ path: "forgot-password", component: forgotPasswordComponent },
	{ path: "reset-password", component: resetPasswordComponent },
	{ path: "**", redirectTo: "login" },
];
