const videos = [
	{
		title: "First video",
		rating: 3,
		comments: 2,
		createdAt: "2 minutes ago",
		views: 59,
		id: 0
	},
	{
		title: "Second video",
		rating: 4,
		comments: 2,
		createdAt: "2 minutes ago",
		views: 59,
		id: 1
	},{
		title: "Third video",
		rating: 3.5,
		comments: 2,
		createdAt: "2 minutes ago",
		views: 59,
		id: 2
	}
];

export const trending = (req, res) => {
	res.render("home",{pageTitle: "Home", videos});
}
export const watch = (req, res) => {
	const { id } = req.params;
	const video = videos[id];
	return res.render("watch", {pageTitle: `Watching: ${video.title}`, video});
};

export const getEdit = (req, res) => {
	const { id } = req.params;
	const video = videos[id];
	return res.render("edit", {pageTitle: `Editing ${video.title}`, video});
};

export const postEdit = (req, res) => {
};
