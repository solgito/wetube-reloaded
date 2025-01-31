import mongoose from "mongoose";
import argon2, { argon2id } from "argon2";

const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	socialOnly: { type: Boolean, default: false },
	avatarUrl: { type: String, default: "" },
	username: { type: String, required: true, unique: true },
	password: { type: String },
	email: { type: String, required: true },
	name: { type: String, required: true },
	location: String,
	videos :[{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
	comments :[{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
});

userSchema.pre("save", async function () {
	if (this.isModified("password")) {
		this.password = await argon2.hash(this.password, {
			timeCost: 5,
			type: argon2id,
		});
	}
});

const User = mongoose.model("User", userSchema);
export default User;