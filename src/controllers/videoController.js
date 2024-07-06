import Video from "../models/Video";

const handleSearch = (error, videos) => {
	console.log("errors", error);
	console.log("videos", videos);
};

export const home = async (req, res) => {
	try {
		const videos = await Video.find({});
		return res.render("home", { pageTitle: "Home", videos });
	} catch (error) {
		return res.render("server-error", {error});
	}
}

export const watch = (req, res) => {
	const { id } = req.params;
	return res.render("watch", {pageTitle: `Watching: `});
};

export const getEdit = (req, res) => {
	const { id } = req.params;
	return res.render("edit", {pageTitle: `Editing `});
};

export const postEdit = (req, res) => {
	const { id } = req.params;
	const { title } = req.body;
	return res.redirect(`/videos/${id}`);
};
