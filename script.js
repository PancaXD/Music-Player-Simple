let now_playing    = document.querySelector('.now-playing');
let recent_volume  = document.querySelector('#volume');
let volume_show    = document.querySelector('#volume_show');
const wrapper        = document.querySelector(".wrapper");
const repeatBtn      = wrapper.querySelector("#repeat-plist");
const musicName      = wrapper.querySelector(".song-details .name");
const musicArtist    = wrapper.querySelector(".song-details .artist");
const playPauseBtn   = wrapper.querySelector(".play-pause");
const prevBtn        = wrapper.querySelector("#prev");
const nextBtn        = wrapper.querySelector("#next");
const mainAudio      = wrapper.querySelector("#main-audio");
const progressArea   = wrapper.querySelector(".progress-area");
const progressBar    = progressArea.querySelector(".progress-bar");
const musicList      = wrapper.querySelector(".music-list");
const moreMusicBtn   = wrapper.querySelector("#more-music");
const closemoreMusic = musicList.querySelector("#close");

mainAudio.volume = recent_volume.value / 100;

let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);
isMusicPaused = true;

window.addEventListener("load", () => {
  loadMusic(musicIndex);
  playingSong(); 
});

function loadMusic(indexNumb) {
  musicName.innerText = allMusic[indexNumb - 1];
  musicArtist.innerText = allArtist[indexNumb - 1];
  mainAudio.src = `songs/${allMusic[indexNumb - 1]}`;
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
  playingSong(); 
}

function nextMusic() {
  musicIndex++;
  // if musicIndex > array length musicIndex will be 1 so the first music play
  musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
  loadMusic(musicIndex);
  playMusic();
  playingSong(); 
}

function togglePlay() {
  const isMusicPlay = wrapper.classList.contains("paused");
  isMusicPlay ? pauseMusic() : playMusic();
  playingSong();
}

function updateProgressBar() {
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

    // if < 10 add 0 before it
    if (totalSec < 10) totalSec = `0${totalSec}`;

    musicDuartion.innerText = `${totalMin}:${totalSec}`;
  });

  // update playing song current time
  let currentMin = Math.floor(currentTime / 60);
  let currentSec = Math.floor(currentTime % 60);

  // if < 10 add 0 before it
  if(currentSec < 10) currentSec = `0${currentSec}`;

  musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
}

function updatePlayTime() {
  let progressWidth = progressArea.clientWidth;
  let clickedOffsetX = e.offsetX;
  let songDuration = mainAudio.duration;
  mainAudio.currentTime = (clickedOffsetX / progressWidth) * songDuration;
  playingSong();
}

function toggleLoopRepeatShuffle() {
  let getText = repeatBtn.innerText;
  switch(getText) {
    case "repeat":
      repeatBtn.innerText = "repeat_one";
      repeatBtn.setAttribute("title", "Song looped");
      break;
    case "repeat_one":
      repeatBtn.innerText = "shuffle";
      repeatBtn.setAttribute("title", "Playback shuffled");
      break;
    case "shuffle":
      repeatBtn.innerText = "repeat";
      repeatBtn.setAttribute("title", "Playlist looped");
      break;
  }
}

function decideActionOnSongEnd() {
  // we'll do according to the icon means if user has set icon to
  // loop song then we'll repeat the current song and will do accordingly
  let getText = repeatBtn.innerText; //getting this tag innerText
  switch(getText) {
    case "repeat":
      nextMusic(); //calling nextMusic function
      break;
    case "repeat_one":
      mainAudio.currentTime = 0; //setting audio current time to 0
      loadMusic(musicIndex); //calling loadMusic function with argument, in the argument there is a index of current song
      playMusic(); //calling playMusic function
      break;
    case "shuffle":
      let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //genereting random index/numb with max range of array length
      do{
        randIndex = Math.floor((Math.random() * allMusic.length) + 1);
      }while(musicIndex == randIndex); //this loop run until the next random number won't be the same of current musicIndex
      musicIndex = randIndex; //passing randomIndex to musicIndex
      loadMusic(musicIndex);
      playMusic();
      playingSong();
      break;
  }
}

const toggleMusicList = () => musicList.classList.toggle("show");

// events
playPauseBtn.addEventListener("click", () => togglePlay());
prevBtn.addEventListener("click", () => prevMusic());
nextBtn.addEventListener("click", () => nextMusic());
mainAudio.addEventListener("timeupdate", (e) => updateProgressBar());
progressArea.addEventListener("click", (e) => updatePlayTime());
repeatBtn.addEventListener("click", () => toggleLoopRepeatShuffle());
mainAudio.addEventListener("ended", () => decideActionOnSongEnd());
moreMusicBtn.addEventListener("click", () => toggleMusicList());
closemoreMusic.addEventListener("click", () => toggleMusicList());

const ulTag = wrapper.querySelector("ul");
// let create li tags according to array length for list

for (let i = 0; i < allMusic.length; i++) {
  let musicNameShort = allMusic[i].replace(".mp3", "");

  //let's pass the song name, artist from the array
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i]}</span>
                </div>
                <span id="${musicNameShort}" class="audio-duration">3:40</span>
                <audio class="${musicNameShort}" src="songs/${allMusic[i]}"></audio>
              </li>`;

  ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag

  let liAudioDuartionTag = ulTag.querySelector(`#${musicNameShort}`);
  let liAudioTag = ulTag.querySelector(`.${musicNameShort}`);

  liAudioTag.addEventListener("loadeddata", () => {
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if (totalSec < 10) { //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
  });
}

//play particular song from the list onclick of li tag
function playingSong() {
  const allLiTag = ulTag.querySelectorAll("li");
  
  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");
    
    if(allLiTag[j].classList.contains("playing")) {
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      audioTag.innerText = adDuration;
    }

    //if the li tag index is equal to the musicIndex then add playing class in it
    if(allLiTag[j].getAttribute("li-index") == musicIndex) {
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }

    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}

//particular li clicked function
function clicked(element) {
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; //updating current song index with clicked li index
  loadMusic(musicIndex);
  playMusic();
  playingSong();
  moreMusicBtn.click();
}

//mute sound function
function mute_sound() {
	mainAudio.volume = 0;
	volume.value = 0;
	volume_show.innerHTML = 0;
}

// change volume
function volume_change() {
	volume_show.innerHTML = recent_volume.value;
	mainAudio.volume = recent_volume.value / 100;
}