import { async } from "regenerator-runtime";

const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const commentList = document.querySelectorAll(".video__comment");

const addComment = (text, id) => {
	const videoComments = document.querySelector(".video__comments ul");

	const newComment = document.createElement("li");
	newComment.className = "video__comment";
	newComment.dataset.id = id;

	const icon = document.createElement("i");
	icon.className = "fas fa-comment";

	const span = document.createElement("span");
	span.innerText = ` ${text}`;
	const spanForDelete = document.createElement("span");
	spanForDelete.innerText = " ❌";
	spanForDelete.style.cursor = "pointer";

	newComment.appendChild(icon);
	newComment.appendChild(span);
	newComment.appendChild(spanForDelete);
	videoComments.prepend(newComment);
};

const handleSubmit = async (e) => {
	e.preventDefault();
	const textarea = form.querySelector("textarea");
	const text = textarea.value;
	const videoId = videoContainer.dataset.id;

	if (text === "") {
		return;
	}
	const response = await fetch(`/api/videos/${videoId}/comment`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({ text }),
	});
	if (response.status === 201) {
		textarea.value = "";
		const { newCommentId } = await response.json();
		addComment(text, newCommentId);
	}
};

const handleDelete = async (comment) => {
	const { status } = await fetch(`/api/comments/${comment.dataset.id}`, {
		method: "DELETE",
	});
	console.log(status);
	if (status === 204) {
		comment.remove();
	}
};


if (form) {
	form.addEventListener("submit", handleSubmit);
}

if (commentList) {
	commentList.forEach(comment => {
		const deleteBtn = comment.querySelector(".comment__delete");
		if (deleteBtn) {
			deleteBtn.addEventListener("click", function() {
				handleDelete(comment);
			});
		}
	});
}
