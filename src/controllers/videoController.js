export const trending = (req, res) => {
	const videos = [
		{
			title: "First video",
			rating: 3,
			comments: 2,
			createdAt: "2 minutes ago",
			view: 59,
		},
		{
			title: "Second video",
			rating: 4,
			comments: 2,
			createdAt: "2 minutes ago",
			view: 59,
		},{
			title: "Third video",
			rating: 3.5,
			comments: 2,
			createdAt: "2 minutes ago",
			view: 59,
		}
	];
	res.render("home",{pageTitle: "Home", videos});
}
export const see = (req, res) => res.render("watch", {pageTitle: "Watch"});

export const search = (req, res) => res.send("Search a video");
export const edit = (req, res) => res.send("Edit a video");
export const deleteVideo = (req, res) => res.send("Delete a video");
export const upload = (req, res) => res.send("Upload a video");