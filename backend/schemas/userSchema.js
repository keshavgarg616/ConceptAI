import dotenv from "dotenv";
import mongoose from "mongoose";
import isEmail from "validator/lib/isEmail.js";
import bcrypt from "bcrypt";
import crypto from "crypto";

dotenv.config();

const SALT_WORK_FACTOR = parseInt(process.env.SALT_WORK_FACTOR);
const EMAIL_HASH_SECRET = process.env.EMAIL_HASH_SECRET;

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
	authCode: {
		type: String,
		required: true, // used for email verification
	},
	authCodeCreatedAt: {
		type: Date,
		default: Date.now, // timestamp for when the auth code was created
	},
	isVerified: {
		type: Boolean,
		default: false, // indicates if the email is verified
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
