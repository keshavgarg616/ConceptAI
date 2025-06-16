import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import userRouter from "./routes/userRouter.js";
import languagesRouter from "./routes/languagesRouter.js";

// Routes available at /chat, /signup, /login, /update-language, /get-languages, /update-history, /get-history
// /chat (message, history) -> { reply: "response text" }
// /signup (name, email, password) -> { success: true, message: "User created successfully" }
// /login (email, password) -> { success: true, message: "Login successful", user: { name, email, history } }
// /update-language (languageName) -> { success: true, message: "Language added successfully" }
// /get-languages () -> { languages: [{ languageName, concepts: [{ conceptName, history }] }] }
// /update-history (languageName, conceptName, history) -> { success: true, message: "History updated successfully" }
// /get-history (languageName, conceptName) -> { history: [{ role, parts }] }

dotenv.config();

const app = express();
const port = 3000;
const mongoURL = `mongodb+srv://${process.env.MongoDBUsername}:${process.env.MongoDBPswd}@${process.env.MongoDBClusterString}.mongodb.net/course-helper?retryWrites=true&w=majority&appName=Cluster0`;

app.use(cors({ origin: "http://localhost:4200" }));
app.use(express.json());
mongoose
	.connect(mongoURL)
	.then(() => console.log("Connected to MongoDB successfully"))
	.catch((err) => console.error("Error connecting to MongoDB:", err));

app.use("/", userRouter);
app.use("/", languagesRouter);

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
