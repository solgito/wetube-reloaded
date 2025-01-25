import User from "../models/User";
import Video from "../models/Video";
import Comment from "../models/Comment";
import { async } from "regenerator-runtime";

export const home = async (req, res) => {
	try {
		const videos = await Video.find({})
		.sort({ createdAt: "desc" })
		.populate("owner");
		return res.render("home", { pageTitle: "Home", videos });
	} catch (error) {
		console.log(error._message);
		return res.render("server-error", {error});
	}
}

export const watch = async (req, res) => {
	const { id } = req.params;
	const video = await Video.findById(id).populate("owner").populate("comments");
	if (!video) {
		return res.status(400).render("404", { pageTitle: "Video not found." });
	}
	return res.render("watch", {pageTitle: video.title, video });
};

export const getEdit = async (req, res) => {
	const { id } = req.params;
	const {
		user: { _id },
	} = req.session;
	const video = await Video.findById(id);
	if (!video) {
		return res.status(400).render("404", { pageTitle: "Video not found." });
	}
	if (String(video.owner) !== String(_id)) {
		req.flash("error", "Not authorized");
		return res.status(403).redirect("/");
	}
	return res.render("edit", {pageTitle: `Edit ${video.title}`, video });
};

export const postEdit = async (req, res) => {
	const { id } = req.params;
	const {
		user: { _id },
	} = req.session;
	const video = await Video.findById(id);
	if (!video) {
		return res.render("404", { pageTitle: "Video not found." });
	}
	if (String(video.owner) !== String(_id)) {
		console.log(String(video.owner));
		console.log(String(_id));
		req.flash("error", "Not authorized");
		return res.status(403).redirect("/");
	}
	const { title, description, hashtags } = req.body;
	await Video.findByIdAndUpdate(id, {
		title,
		description,
		hashtags: Video.formatHashtags(hashtags),
	});
	req.flash("success", "Changes saved.");
	return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
	return res.render("upload", { pageTitle: "Upload Video" });
};

export const postUpload = async (req, res) => {
	const {
		user: { _id }
	} = req.session;
	const { video, thumb } = req.files;
	const { title, description, hashtags } = req.body;

	try {
		const newVideo = await Video.create({
			title,
			fileUrl: video[0].location,
			thumbUrl: thumb[0].location,
			description,
			hashtags: Video.formatHashtags(hashtags),
			owner: _id,
		});
		const user = await User.findById(_id);
		user.videos.push(newVideo);
		user.save();
		return res.redirect("/");
	} catch (error) {
		console.log(error);
		return res.render("upload", { pageTitle: "Upload Video", errorMessage: error._message, });
	}
};

export const deleteVideo = async (req, res) => {
	const { id } = req.params;
	const {
		user: { _id },
	  } = req.session;
	  const video = await Video.findById(id);
	  if (!video) {
		return res.status(404).render("404", { pageTitle: "Video not found." });
	  }
	  if (String(video.owner) !== String(_id)) {
		return res.status(403).redirect("/");
	  }
	await Video.findByIdAndDelete(id);
	res.redirect("/");
};

export const search = async (req, res) => {
	const { keyword } = req.query;
	let videos = [];
	if (keyword) {
		videos = await Video.find({
			title: {
				$regex: new RegExp(keyword, "i"),
			}
		}).populate("owner");
	}
	return res.render("search", { pageTitle: "Search", videos });
};

export const registerView = async (req, res) => {
	const { id } = req.params;
	const video = await Video.findById(id);
	if (!video) {
		return res.sendStatus(404);
	}
	video.meta.views = video.meta.views + 1;
	await video.save();
	return res.sendStatus(200);
};

export const createComment = async (req, res) => {
	const {
		session: { user },
		body: { text },
		params: { id },
	} = req;
	const video = await Video.findById(id);
	if (!video) {
		return res.sendStatus(404);
	}
	const userFromDB = await User.findById(user._id);
	if (!userFromDB) {
		return res.sendStatus(404);
	}
	const comment = await Comment.create({
		text,
		owner: user._id,
		video: id,
	});
	video.comments.push(comment._id);
	video.save();
	userFromDB.comments.push(comment._id);
	userFromDB.save();

	return res.status(201).json({ newCommentId: comment._id });
};

export const deleteComment = async (req, res) => {
	const {
		session: { user },
		params: { id }
	} = req;

	const loggedInUser = await User.findById(user._id);
	if (!loggedInUser) {
		return res.sendStatus(404);
	}
	const comment = await Comment.findById(id);
	if (!comment) {
		return res.sendStatus(404);
	}
	if (String(comment.owner) !== String(loggedInUser._id)) {
		return res.status(403).redirect("/");
	}

	await Comment.findByIdAndDelete(id);
	await User.updateMany({ comments: id }, { $pull: { comments: id }});
	await Video.updateMany({ comments: id }, { $pull: { comments: id }});
	res.sendStatus(204);
};

export const getNoRecorder = (req, res) => {
	req.flash("error", "Cannot record video. Maybe Not found camera.");
	return res.redirect("/videos/upload");
};