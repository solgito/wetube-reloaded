import mongoose from "mongoose";

const videoSchema = mongoose.Schema({
	title: {type: String, required: true, tirm: true, maxLength: 80 },
	fileUrl: { type: String, required: true },
	thumbUrl: { type: String, required: true },
	description: {type: String, required: true, tirm: true, minLength: 2 },
	createdAt: {type: Date, required: true, default: Date.now },
	hashtags: [{ type: String, tirm: true }],
	owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
	comments :[{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
	meta: {
		views: { type: Number, default: 0, required: true },
		rating: { type: Number, default: 0, required: true },
	},
});

videoSchema.static("formatHashtags", function(hashtags) {
	return hashtags.split(',').map(word => (word.startsWith('#') ? word : `#${word}`));
});

const Video = mongoose.model("Video", videoSchema);
export default Video;