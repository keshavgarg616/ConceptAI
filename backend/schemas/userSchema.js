import dotenv from "dotenv";
import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

dotenv.config();

const SALT_WORK_FACTOR = parseInt(process.env.SALT_WORK_FACTOR || "10");
const EMAIL_HASH_SECRET = process.env.EMAIL_HASH_SECRET || "default";

// Helper to hash emails with HMAC SHA256
function hashEmail(email) {
	return crypto
		.createHmac("sha256", EMAIL_HASH_SECRET)
		.update(email)
		.digest("hex");
}

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true, // ensures hashed email is unique
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
	},
});

// Pre-save hook for password + email hashing
userSchema.pre("save", async function (next) {
	try {
		// Hash email only if it's new or modified
		if (this.isModified("email") && isEmail(this.email)) {
			const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
			this.password = await bcrypt.hash(this.password, salt);
			this.email = hashEmail(this.email);
		}
		next();
	} catch (err) {
		next(err);
	}
});

const User = mongoose.model("User", userSchema);
export default User;
