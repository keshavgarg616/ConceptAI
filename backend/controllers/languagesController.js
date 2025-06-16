import Languages from "../schemas/languagesSchema.js";

export const updateLanguages = async (req, res) => {
	try {
		const languages = req.body.languages.languages || [];
		const userLanguages = await findByUserId(req.userId);
		userLanguages.languages = languages;
		await userLanguages.save();
		res.status(201).json({ message: "Language added" });
	} catch (error) {
		console.error("Add language error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getLanguages = async (req, res) => {
	try {
		const userLanguages = await findByUserId(req.userId);
		if (!userLanguages) {
			return res.status(401).json({ error: "No languages found" });
		}
		res.json({ languages: userLanguages.languages });
	} catch (error) {
		console.error("Get languages error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const updateConceptHistory = async (req, res) => {
	const { languageName, conceptName, history } = req.body;
	try {
		const userLanguages = await findByUserId(req.userId);
		if (!userLanguages) {
			return res.status(401).json({ error: "No languages found" });
		}

		const existingLanguage = userLanguages.languages.find(
			(lang) => lang.languageName === languageName
		);

		if (!existingLanguage) {
			return res.status(401).json({ error: "Language not found" });
		}

		const concept = existingLanguage.concepts.find(
			(concept) => concept.conceptName === conceptName
		);

		if (!concept) {
			return res.status(401).json({ error: "Concept not found" });
		}

		concept.history = history;
		await userLanguages.save();
		res.json({ message: "Concept history updated" });
	} catch (error) {
		console.error("Update concept history error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const getConceptHistory = async (req, res) => {
	const { languageName, conceptName } = req.body;
	try {
		const userLanguages = await findByUserId(req.userId);
		if (!userLanguages) {
			return res.status(401).json({ error: "No languages found" });
		}

		const existingLanguage = userLanguages.languages.find(
			(lang) => lang.languageName === languageName
		);

		if (!existingLanguage) {
			return res.status(401).json({ error: "Language not found" });
		}

		const concept = existingLanguage.concepts.find(
			(concept) => concept.conceptName === conceptName
		);

		if (!concept) {
			return res.status(401).json({ error: "Concept not found" });
		}

		res.json({ history: concept.history });
	} catch (error) {
		console.error("Get concept history error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

async function findByUserId(userId) {
	return Languages.findOne({ foreign_id: userId });
}
