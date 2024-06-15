export const trending = (req, res) => res.send("Now trending videos");
export const see = (req, res) => {
	console.log(req.params);
	return res.send("Watch a video");
};
export const search = (req, res) => res.send("Search a video");
export const edit = (req, res) => res.send("Edit a video");
export const deleteVideo = (req, res) => res.send("Delete a video");
export const upload = (req, res) => res.send("Upload a video");