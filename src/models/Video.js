import mongoose from "mongoose";

const videoSchema = mongoose.Schema({
	title: {type: String, required: true, tirm: true, maxLength: 80 },
	fileUrl: { type: String, required: true },
	description: {type: String, required: true, tirm: true, minLength: 20 },
	createdAt: {type: Date, required: true, default: Date.now },
	hashtags: [{ type: String, tirm: true }],
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