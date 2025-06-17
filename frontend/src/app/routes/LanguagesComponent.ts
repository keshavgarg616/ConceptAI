import { Component, inject } from "@angular/core";
import {
	FormBuilder,
	FormArray,
	FormsModule,
	ReactiveFormsModule,
	Validators,
	FormGroup,
	AbstractControl,
	FormControl,
} from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { CommonModule, NgIf } from "@angular/common";
import { MatIconModule } from "@angular/material/icon";
import { MatOptionModule } from "@angular/material/core";
import { ApiService } from "../api.service";
import { Router } from "@angular/router";
import { debounceTime } from "rxjs";

@Component({
	selector: "languages-route",
	standalone: true,
	imports: [
		ReactiveFormsModule,
		FormsModule,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		MatIconModule,
		CommonModule,
		MatOptionModule,
	],
	templateUrl: "languagesComponent.html",
})
export class LanguagesComponent {
	languagesForm: FormGroup;
	router: Router;
	changesSaved: boolean = false;
	languagesFetched: boolean = false;

	constructor(private fb: FormBuilder, private apiService: ApiService) {
		this.router = inject(Router);
		this.languagesForm = this.fb.group({
			languages: this.fb.array([], Validators.required),
		});
		this.apiService.getLanguages().subscribe({
			next: (response) => {
				if (!response.error) {
					const languagesArray = response.languages;
					const languagesFormArray = this.getLanguages();

					languagesArray.forEach((lang: any) => {
						const languageGroup = this.newLanguage(lang); // see below
						languagesFormArray.push(languageGroup);
					});
				}
			},
			error: (error) => {
				console.error("Error fetching languages:", error);
			},
		});
		this.languagesForm.valueChanges
			.pipe(debounceTime(1500))
			.subscribe(() => {
				if (this.languagesFetched) {
					this.onSubmit();
				} else {
					this.languagesFetched = true;
				}
			});
	}

	newLanguage(languageData?: any): FormGroup {
		return this.fb.group({
			languageName: new FormControl(
				languageData?.languageName || "",
				Validators.required
			),
			concepts: this.fb.array(
				(languageData?.concepts || []).map((concept: any) =>
					this.newConcept(concept)
				)
			),
		});
	}

	newConcept(conceptData?: any): FormGroup {
		return this.fb.group({
			conceptName: new FormControl(
				conceptData?.conceptName || "",
				Validators.required
			),
			history: new FormControl(conceptData?.history || []), // preserve it!
		});
	}

	getLanguages(): FormArray {
		return this.languagesForm.get("languages") as FormArray;
	}

	getConcepts(language: AbstractControl): FormArray {
		return (language as FormGroup).get("concepts") as FormArray;
	}

	addLanguage() {
		this.getLanguages().push(this.newLanguage());
	}

	addConcept(language: AbstractControl) {
		this.getConcepts(language).push(this.newConcept());
	}

	removeLanguage(index: number) {
		this.getLanguages().removeAt(index);
	}

	removeConcept(language: AbstractControl, index: number) {
		this.getConcepts(language).removeAt(index);
	}

	onSubmit() {
		if (this.languagesForm.valid) {
			this.apiService
				.updateLanguages(this.languagesForm.value)
				.subscribe({
					next: (response) => {
						if (!response.error) {
							console.log("Languages updated successfully");
						} else {
							console.error(
								"Error updating languages:",
								response.error
							);
						}
					},
					error: (error) => {
						console.error("Error updating languages:", error);
					},
				});
			this.changesSaved = true;
			new Promise((r) => setTimeout(r, 1500)).then(() => {
				this.changesSaved = false;
			});
		}
	}

	onConceptClicked(langIndex: number, conceptIndex: number): void {
		const langGroup = this.getLanguages().at(langIndex);
		const languageName = langGroup.get("languageName")?.value;
		const concept = this.getConcepts(langGroup).at(conceptIndex);
		const conceptName = concept.get("conceptName")?.value;

		this.router.navigate(["/chat"], {
			state: {
				languageName: languageName,
				conceptName: conceptName,
			},
		});
	}
}
