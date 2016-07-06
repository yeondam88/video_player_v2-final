//Set Variables

var video = document.getElementById('video');
var controlsContainer = document.getElementById('controls-container');
var controlsButtons = document.getElementById('controls-buttons');
var buffer = document.getElementById('buffer');
var timeDrag = false;
var progress = document.getElementById('progress');
var progressBar = document.getElementById('progress-bar');
var playpause = document.getElementById('playpause');
var timer = document.getElementById('timer');
var endTime = document.getElementById('end-time');
var speedLabel = document.getElementById('speed-label');
var speedControl = document.getElementById('speedControl');
var cc = document.getElementById('cc');
var volume = document.getElementById('volume');
var volumnControlBar = document.getElementById('volumnControlBar');
var fullscreen = document.getElementById('fullscreen');
var caption = document.getElementsByClassName('caption');


// *** PROGRESS BAR ***

function progressCreate() {
	var videoTime = ((video.currentTime / video.duration) * 100);
	progressBar.style.width = videoTime + '%';
}

video.addEventListener('timeupdate', progressCreate);


// *** BUFFER BAR ***

function bufferCreate() {
	var currentBuffer = ((video.buffered.end(0) / video.duration) * 100);
	buffer.value = currentBuffer;
	console.log(currentBuffer);
}

video.addEventListener('progress', bufferCreate);

// *** PROGRESS BAR DRAG AND CLICK NAVIGATION ***

function dragDown(e) {
	timeDrag = true;
	updateBar(e.pageX);
}

function dragUp(e) {
	if(timeDrag) {
		timeDrag = false;
		updateBar(e.pageX);
	}
}

function dragOver(e) {
	if(timeDrag) {
		updateBar(e.pageX);
	}
}

function clickNav(e) {
	updateBar(e.pageX);
}

function updateBar(x) {
	//variable for where user put mouse
	var position = x - progress.offsetLeft;
	//convert to percentage 
	var percentage = 100 * position / progress.offsetWidth;

	//don't allow navigation beyond the end or before the start of video
	if(percentage > 100) {
		percentage = 100;
	}
	if(percentage < 0) {
		percentage = 0;
	}

	progress.value = percentage;
	video.currentTime = video.duration * percentage / 100;
}

progress.addEventListener('mousedown', dragDown);
progress.addEventListener('mouseup', dragUp);
progress.addEventListener('mousemove', dragOver);

progress.addEventListener('click', clickNav);


// *** PLAYPAUSE BUTTON ***

//styles playpause button to pause state
function pauseIcon() {
	playpause.style.width = "18px";
	playpause.style.height = "24px";
	playpause.style.background = "url('./icons/pause-icon.png')";
}

//styles playpause button to play state
function playIcon() {
	playpause.style.width = "22px";
	playpause.style.height = "26px";
	playpause.style.background = "url('./icons/play-icon.png')";
}

//playpause button functionality
function playPause() {
	if (video.paused) {
		video.play();
		pauseIcon();
	} else {
		video.pause();
		playIcon();
	}
}

playpause.addEventListener("click", playPause);


// *** TIMER ***

//function on 200 ms interval, calculate mins and secs
//and display in html element as MM:SS

function counter(e, i) {
	setInterval(e, i);
}

function showTimer() {
	var playedMinutes = parseInt(video.currentTime / 60, 10);
	var playedSeconds = parseInt(video.currentTime % 60);
	//tests to add leading 0 to short times
	if (playedMinutes < 10) {
		playedMinutes = "0" + playedMinutes;
	}
	if (playedSeconds < 10) {
		playedSeconds = "0" + playedSeconds;
	}
	timer.innerHTML = playedMinutes + ":" + playedSeconds;
}

video.addEventListener('canplay', counter(showTimer, 1000));



// *** VIDEO LENGTH DISPLAY *** //

function showLength() {
	var totalMinutes = parseInt(video.duration / 60, 10);
	var totalSeconds = parseInt(video.duration % 60);
	//tests to add leading 0 to short times
	if (totalMinutes < 10) {
		totalMinutes = "0" + totalMinutes;
	}
	if (totalSeconds < 10) {
		totalSeconds = "0" + totalSeconds;
	}
	endTime.innerHTML = "\/ " + totalMinutes + ":" + totalSeconds;
}

video.addEventListener('canplay', showLength);
//backup event listeners for video length display
video.addEventListener('loadeddata', showLength);
video.addEventListener('canplaythrough', showLength);

// *** PLAYSPEED CONTROL ***

function setSpeed() {
	video.playbackRate = speedControl.value;
}

function showLabel() {
	speedLabel.innerHTML = speedLabel.getAttribute("data-arrows");
}

function hideLabel() {
	speedLabel.innerHTML= "";
}

speedControl.addEventListener('change', setSpeed);
speedControl.addEventListener('mouseenter', showLabel);
speedControl.addEventListener('mouseleave', hideLabel);


// *** CLOSED CAPTIONING BUTTON ***

function toggleCaptions() {
	if (video.textTracks[0].mode === "showing") {
		video.textTracks[0].mode = "hidden";
	} else if (video.textTracks[0].mode === "hidden") {
		video.textTracks[0].mode = "showing";
	}
}

cc.addEventListener('click', toggleCaptions);



// *** VOLUME BUTTON ***

//styles volume/mute button to on state
function onIcon() {
	volume.style.background = "url('./icons/volume-on-icon.png')";
}

//styles volume/mute button to mute state
function offIcon() {
	volume.style.background = "url('./icons/volume-off-icon.png')";
}

//volume/mute button functionality
function muteVideo() {
	if (!video.muted) {
		video.muted = true;
		offIcon();
	} else {
		video.muted = false;
		onIcon();
	}
}

volume.addEventListener("click", muteVideo);

// *** VOLUME SLIDER ***

function setVolume() {
	video.volume = volumnControlBar.value / 100;
}

volumnControlBar.addEventListener('click', setVolume);


// *** FULLSCREEN BUTTON ***

function fullScreen() {
	if (video.requestFullscreen) {
		video.requestFullscreen();
	} else if (video.msRequestFullscreen) {
		video.msRequestFullscreen();
	} else if (video.mozRequestFullScreen) {
		video.mozRequestFullScreen();
	} else if (video.webkitRequestFullscreen) {
		video.webkitRequestFullscreen();
	}
}

fullscreen.addEventListener("click", fullScreen);



// *** HIGHLIGHTING CAPTIONS *** 

function highlighter() {
	for (var i = 0; i < caption.length; i++) {
		//if the video is within that caption's time range and less than data-end attr value
		if (video.currentTime >= caption[i].getAttribute('data-start') && video.currentTime <= caption[i].getAttribute('data-end')) {
			//caption gets highlight class
			caption[i].classList.add("highlight");
			// or else if the video is not in that caption's time range
		} else if (video.currentTime >= caption[i].getAttribute('data-end') || video.currentTime <= caption[i].getAttribute('data-start')) {
			//caption loses highlight class
			caption[i].classList.remove("highlight");
		}
	}
}

video.addEventListener("playing", counter(highlighter, 100));



// *** CAPTION CLICK NAVIGATION ***

function captionJump() {
	var startTime = this.getAttribute('data-start');
	video.currentTime = startTime;
}

for (var i = 0; i < caption.length; i++) {
	caption[i].addEventListener("click", captionJump);
}

// *** HIDE/SHOW CONTROLS-BUTTONS MOUSE ENTER/LEAVE *** 

function showControls() {
	controlsContainer.classList.remove("lowered");
	controlsContainer.classList.add("raised");
	controlsButtons.classList.remove("hidden");
	controlsButtons.classList.add("showing");
}

function hideControls() {
	controlsButtons.classList.remove("showing");
	controlsButtons.classList.add("hidden");
	controlsContainer.classList.remove("raised");
	controlsContainer.classList.add("lowered");
}

video.addEventListener("mouseenter", showControls);
video.addEventListener("mouseleave", hideControls);

controlsContainer.addEventListener("mouseenter", showControls);
controlsContainer.addEventListener("mouseleave", hideControls);

progress.addEventListener("mouseenter", showControls);
progress.addEventListener("mouseleave", hideControls);


// *** RESTART VIDEO AFTER COMPLETE PLAYBACK ***

function videoRestart() {
	if (video.currentTime === video.duration) {
		video.currentTime = 0;
	}
}

video.addEventListener("ended", videoRestart)



