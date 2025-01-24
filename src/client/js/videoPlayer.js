const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");
const video = document.querySelector("video");

const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");

const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");

const volumeRange = document.getElementById("volume");

const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");

const fullScreenBtn = document.getElementById("fullScreen");
const fullScreenIcon = fullScreenBtn.querySelector("i");

let controlsTimeout = null;
let controlsMovementTimeout = null;

let volumeValue = 0.5;
video.volume = volumeValue;

const playOrPause = () => {
	if (video.paused) {
		video.play();
	  } else {
		video.pause();
	  }
	  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";	
};

const handlePlayClick = (e) => {
  playOrPause();
};

const handleMuteClick = (e) => {
	if (video.muted) {
	  video.muted = false;
	} else {
	  video.muted = true;
	}
	muteBtnIcon.classList = video.muted ? "fas fa-volume-mute" : "fas fa-volume-up";
	volumeRange.value = video.muted ? 0 : volumeValue;
};

const handleVolumeChange = (event) => {
	const {
		target: { value },
	} = event;
	if (video.muted) {
		video.muted = false;
		muteBtn.innerText = "Mute";
	}
	volumeValue = value;
	video.volume = value;
};

const formatTime = (seconds) => {
	return new Date(seconds * 1000).toISOString().substring(14, 19);
};

const handleLoadedMetaData = () => {
	totalTime.innerText = formatTime(Math.floor(video.duration));
	timeline.max = Math.floor(video.duration);
};

const handleTimeUpdate = () => {
	currentTime.innerText = formatTime(Math.floor(video.currentTime));
	timeline.value = Math.floor(video.currentTime);
};

const handleTimelineChange = (e) => {
	const {
		target: { value }
	} = e;

	video.currentTime = value;
};

const handleFullScreenClick = () => {
	const fullScreen = document.fullscreenElement;
	if (fullScreen) {
		document.exitFullscreen();
		fullScreenIcon.classList = "fas fa-expand";
	} else {
		videoContainer.requestFullscreen();
		fullScreenIcon.classList = "fas fa-compress";
	}
};

const handleFullScreenEvent = () => {
	const fullScreen = document.fullscreenElement;
	if (!fullScreen) {
		fullScreenIcon.classList = "fas fa-expand";
	}
};

const hideControls = () => videoControls.classList.remove("showing");

const handleMouseMove = () => {
	if (controlsTimeout) {
		clearTimeout(controlsTimeout);
		controlsTimeout = null;
	}
	if (controlsMovementTimeout) {
		clearTimeout(controlsMovementTimeout);
		controlsMovementTimeout = null;
	}
	videoControls.classList.add("showing");
	controlsMovementTimeout = setTimeout(hideControls, 3000);
};

const handleMouseMoveForControls = () => {
	if (controlsTimeout) {
		clearTimeout(controlsTimeout);
		controlsTimeout = null;
	}
	if (controlsMovementTimeout) {
		clearTimeout(controlsMovementTimeout);
		controlsMovementTimeout = null;
	}
	videoControls.classList.add("showing");
};

const handleMouseLeave = () => {
	controlsTimeout = setTimeout(hideControls, 3000);
};

const handleMouseLeaveForControls = () => {
	controlsTimeout = setTimeout(hideControls, 3000);
};

const handleSpaceKey = (e) => {
	if (e.code === "Space") {
		e.preventDefault();
		playOrPause();
	}
};

const handleScreenClick = () => {
	playOrPause();
};

const handleEnded = () => {
	const { id } = videoContainer.dataset;
	fetch(`/api/videos/${id}/view`, {
		method: "POST",
	});
};

playBtn.addEventListener("click", handlePlayClick);
document.addEventListener("keyup", handleSpaceKey);
video.addEventListener("click", handleScreenClick);

muteBtn.addEventListener("click", handleMuteClick);
volumeRange.addEventListener("input", handleVolumeChange);

video.addEventListener("loadeddata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);

video.addEventListener("mousemove", handleMouseMove);
video.addEventListener("mouseleave", handleMouseLeave);

timeline.addEventListener("input", handleTimelineChange);
videoControls.addEventListener("mousemove", handleMouseMoveForControls);
videoControls.addEventListener("mouseleave", handleMouseLeaveForControls);

fullScreenBtn.addEventListener("click", handleFullScreenClick);
document.addEventListener("fullscreenchange", handleFullScreenEvent);