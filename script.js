let now_playing   = document.querySelector('.now-playing');
let recent_volume = document.querySelector('#volume');
let volume_show   = document.querySelector('#volume_show');

const wrapper        = document.querySelector(".wrapper");
const input          = wrapper.querySelector("#chooseFolder");
const jsmediatags    = window.jsmediatags;
const repeatBtn      = wrapper.querySelector("#repeat-plist");
const musicName      = wrapper.querySelector(".song-details .name");
//const musicArtist    = wrapper.querySelector(".song-details .artist");
const playPauseBtn   = wrapper.querySelector(".play-pause");
const prevBtn        = wrapper.querySelector("#prev");
const nextBtn        = wrapper.querySelector("#next");
const mainAudio      = wrapper.querySelector("#main-audio");
const progressArea   = wrapper.querySelector(".progress-area");
const progressBar    = progressArea.querySelector(".progress-bar");
const musicList      = wrapper.querySelector(".music-list");
const moreMusicBtn   = wrapper.querySelector("#more-music");
const closemoreMusic = musicList.querySelector("#close");

let allMusic = [ ];

const loadFiles = () => {
  allMusic = [...chooseFolder.files].map( file => file.name );
  loadMusic(musicIndex);
  playSongFromList(); 
}

mainAudio.volume = recent_volume.value / 100;

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

function loadMusic(index) {
  musicName.innerText = allMusic[index - 1];
  //musicArtist.innerText = allArtist[index - 1];
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
  playSongFromList(); 
}

function nextMusic() {
  musicIndex++;
  // if musicIndex > array length musicIndex will be 1 so the first music play
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playSongFromList(); 
}

function togglePlay() {
  const isMusicPlay = wrapper.classList.contains("paused");
  isMusicPlay ? pauseMusic() : playMusic();
  playSongFromList();
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
  playSongFromList();
}

function toggleLoopRepeatShuffle() {
  let action = repeatBtn.innerText;
  if (action == "repeat") {
    repeatBtn.innerText = "repeat_one";
    repeatBtn.setAttribute("title", "Song looped");
  }
  else if (action == "repeatOne") {
    repeatBtn.innerText = "shuffle";
    repeatBtn.setAttribute("title", "Playback shuffled");
  }
  else if (action == "shuffle") {
    repeatBtn.innerText = "repeat";
    repeatBtn.setAttribute("title", "Playlist looped");
  }
}

const getRandomIndex = () => Math.floor((Math.random() * allMusic.length) + 1);
const repeat = () => nextMusic();
const repeatOne = () => {
  mainAudio.currentTime = 0;
  loadMusic(musicIndex);
  playMusic();
}
const shuffle = () => {
  let randIndex = getRandomIndex();
  while(musicIndex == randIndex) randIndex = getRandomIndex();
  musicIndex = randIndex;
  loadMusic(musicIndex);
  playMusic();
  playSongFromList();
}

function decideActionOnSongEnd() {
  let action = repeatBtn.innerText;
  if (action == "repeat") repeat();
  else if (action == "repeat_one") repeatOne();
  else if (action == "shuffle") shuffle();
}
const toggleMusicList = () => musicList.classList.toggle("show");

// events
input.addEventListener("change", () => loadFiles());
playPauseBtn.addEventListener("click", () => togglePlay());
prevBtn.addEventListener("click", () => prevMusic());
nextBtn.addEventListener("click", () => nextMusic());
mainAudio.addEventListener("timeupdate", (e) => updateProgressBar(e));
progressArea.addEventListener("click", (e) => updatePlayTime(e));
repeatBtn.addEventListener("click", () => toggleLoopRepeatShuffle());
mainAudio.addEventListener("ended", () => decideActionOnSongEnd());
moreMusicBtn.addEventListener("click", () => toggleMusicList());
closemoreMusic.addEventListener("click", () => toggleMusicList());

const ulTag = wrapper.querySelector("ul");

// let create li tags according to array length for list
for (let i = 0; i < allMusic.length; i++) {
  const songName      = allMusic[i]
  const songNameShort = songName.replace(".mp3", "");

  //let's pass the song name, artist from the array
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${songName}</span>
                </div>
                <span id="${songNameShort}" class="audio-duration">3:40</span>
                <audio class="${songNameShort}" src="songs/${songName}"></audio>
              </li>`;

  //inserting the li inside ul tag
  ulTag.insertAdjacentHTML("beforeend", liTag);

  const liAudioTag         = ulTag.querySelector(`.${songNameShort}`);
  const liAudioDuartionTag = ulTag.querySelector(`#${songNameShort}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) totalSec = `0${totalSec}`;
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`;
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`);
  });
}

//play particular song from the list onclick of li tag
function playSongFromList() {
  const allLiTag = ulTag.querySelectorAll("li");
  
  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");
    
    if(allLiTag[j].classList.contains("playing")) {
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    // if the li tag index is equal to the musicIndex then add playing class in it
    if(allLiTag[j].getAttribute("li-index") == musicIndex) {
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clickedSong(this)");
  }
}

function clickedSong(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex;
  loadMusic(musicIndex);
  playMusic();
  playSongFromList();
  moreMusicBtn.click();
}

// Referenced from index.html
function mute_sound() {
	mainAudio.volume = 0;
	volume.value = 0;
	volume_show.innerHTML = 0;
}
function volume_change() {
	volume_show.innerHTML = recent_volume.value;
	mainAudio.volume = recent_volume.value / 100;
}