import mongoose from "mongoose";

const languagesSchema = new mongoose.Schema({
	foreign_id: {
		type: String,
		required: true,
		unique: true,
	},
	languages: {
		type: [
			{
				languageName: { type: String, required: true },
				concepts: {
					type: [
						{
							conceptName: { type: String, required: true },
							history: {
								type: [
									{
										role: { type: String, required: true },
										parts: [
											{
												text: {
													type: String,
													required: true,
												},
											},
										],
									},
								],
								required: false,
							},
						},
					],
					required: true,
				},
			},
		],
		required: true,
	},
});

const Languages = mongoose.model("Languages", languagesSchema);
export default Languages;
