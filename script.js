let allMusic = [];
let musicIndex = 0;
let now_playing   = document.querySelector('.now-playing');
let recent_volume = document.querySelector('#volume');

const wrapper        = document.querySelector(".wrapper");
const input          = wrapper.querySelector("#chooseFolder");
const musicName      = wrapper.querySelector(".song-details .name");
const playPauseBtn   = wrapper.querySelector(".play-pause");
const prevBtn        = wrapper.querySelector("#prev");
const nextBtn        = wrapper.querySelector("#next");
const mainAudio      = wrapper.querySelector("#main-audio");
const progressArea   = wrapper.querySelector(".progress-area");
const progressBar    = progressArea.querySelector(".progress-bar");

const getRandomIndex = () => Math.floor((Math.random() * allMusic.length) + 1);

mainAudio.volume = recent_volume.value / 100;

window.addEventListener("load", () => {
  let storedSongs = localStorage.getItem("storedSongs");
  if (storedSongs == null) return;
  allMusic = storedSongs.split(",");
  musicIndex = getRandomIndex();
  loadMusic(musicIndex);
});


function loadFiles() {
  allMusic = [...chooseFolder.files].map( file => file.name );
  localStorage.setItem("storedSongs", allMusic.toString());
  musicIndex = getRandomIndex();
  loadMusic(musicIndex);
}

function loadMusic(index) {
  musicName.innerText = allMusic[index - 1];
  mainAudio.src = `songs/${allMusic[index - 1]}`;
}

function playMusic() {
  wrapper.classList.add("paused");
  playPauseBtn.querySelector("i").innerText = "pause";
  mainAudio.play();
}

function pauseMusic() {
  wrapper.classList.remove("paused");
  playPauseBtn.querySelector("i").innerText = "play_arrow";
  mainAudio.pause();
}

function prevMusic() {
  musicIndex--;
  // if musicIndex < 1 musicIndex will be the array length so the last music play
  musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
}

function nextMusic() {
  musicIndex++;
  // if musicIndex > array length musicIndex will be 1 so the first music play
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
}

function togglePlay() {
  const isMusicPlay = wrapper.classList.contains("paused");
  isMusicPlay ? pauseMusic() : playMusic();
}

function updateProgressBar(e) {
  const currentTime = e.target.currentTime;
  const duration = e.target.duration;
  let progressWidth = (currentTime / duration) * 100;
  progressBar.style.width = `${progressWidth}%`;

  let musicCurrentTime = wrapper.querySelector(".current-time"),
  musicDuartion = wrapper.querySelector(".max-duration");

  // update song total duration
  mainAudio.addEventListener("loadeddata", () => {
    let mainAdDuration = mainAudio.duration;
    let totalMin = Math.floor(mainAdDuration / 60);
    let totalSec = Math.floor(mainAdDuration % 60);
    if (totalSec < 10) totalSec = `0${totalSec}`;
    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });

  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);
  if (currentSec < 10) currentSec = `0${currentSec}`;
  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
}

function updatePlayTime(e) {
  let progressWidth = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration;
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
}

const shuffle = () => {
  let randIndex = getRandomIndex();
  while(musicIndex == randIndex) randIndex = getRandomIndex();
  musicIndex = randIndex;
  loadMusic(musicIndex);
  playMusic();
}

// events
input.addEventListener("change", () => loadFiles());
playPauseBtn.addEventListener("click", () => togglePlay());
prevBtn.addEventListener("click", () => prevMusic());
nextBtn.addEventListener("click", () => nextMusic());
mainAudio.addEventListener("timeupdate", (e) => updateProgressBar(e));
progressArea.addEventListener("click", (e) => updatePlayTime(e));
mainAudio.addEventListener("ended", () => shuffle());

function clickedSong(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  moreMusicBtn.click();
}

// Referenced from index.html
function volume_change() {
	mainAudio.volume = recent_volume.value / 100;
}