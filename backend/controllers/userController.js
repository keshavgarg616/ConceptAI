import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import User from "../schemas/userSchema.js";
import Languages from "../schemas/languagesSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import crypto from "crypto";

dotenv.config();
const genAI = new GoogleGenAI({ apiKey: process.env.GENAI_API_KEY });

export const chat = async (req, res) => {
	const { message, history, languageName, conceptName } = req.body;
	const chat = genAI.chats.create({
		model: "gemini-2.0-flash",
		config: {
			systemInstruction: `You are a chatbot that helps users with their ${conceptName} in the programming language ${languageName} to make them academically strong students. 
		Answer whatever the user asks you thoroughly, but do not use asterisks or bold characters.
        Please use 2 break lines instead of 1 wherever necessary to improve readability. `,
		},
		history: history,
	});

	try {
		const response = await chat.sendMessage({ message });
		res.json({ reply: response.text });
	} catch (error) {
		console.error("Chat error:", error);
		res.status(500).json({ reply: "Error occurred" });
	}
};

export const signUp = async (req, res) => {
	const { name, email, password } = req.body;

	try {
		const existingUser = await findByEmail(email);
		if (existingUser) {
			return res.status(409).json({ error: "User already exists" });
		}

		const newUser = new User({ name, email, password });
		const userLanguages = new Languages({
			foreign_id: newUser._id,
			languages: [],
		});
		await userLanguages.save();
		await newUser.save();

		res.status(201).json({
			success: true,
			message: "User created successfully",
		});
	} catch (error) {
		console.error("Signup error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		const user = await findByEmail(email);
		if (user) {
			const isPasswordValid = bcrypt.compare(password, user.password);
			if (isPasswordValid) {
				const token = jwt.sign(
					{ userId: user._id },
					process.env.JWT_SECRET,
					{
						expiresIn: "1h",
					}
				);
				res.status(200).json({ token });
			} else {
				return res.status(401).json({ error: "Invalid password" });
			}
		} else {
			return res.status(404).json({ error: "User not found" });
		}
	} catch (error) {
		console.error("Login error:", error);
		res.status(500).json({ error: "Internal server error" });
	}
};

async function findByEmail(plainEmail) {
	const hashedEmail = crypto
		.createHmac("sha256", process.env.EMAIL_HASH_SECRET)
		.update(plainEmail)
		.digest("hex");
	return User.findOne({ email: hashedEmail });
}
