(function () {
  const SERVER_URL = "http://127.0.0.1:3000";
  
  let tracks = [];
  let currentTrackIndex = -1;
  const audio = new Audio();
  let isPlaying = false;
  let isShuffle = false;
  let isRepeat = false;

  let tracksContainer;
  let playPauseBtn, playPauseIconUse;
  let prevBtn, nextBtn;
  let shuffleBtn, repeatBtn;
  let progressBar, currentTimeEl, totalDurationEl;
  let volumeSlider;
  let playerName, playerArtist, playerAlbumArt;

  const BLANK_ALBUM_ART = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

 window.addEventListener("load", () => {
  tracksContainer = document.getElementById("tracks");
  playPauseBtn = document.getElementById("play-pause-btn");
  playPauseIconUse = playPauseBtn.querySelector("use");
  prevBtn = document.getElementById("prev-btn");
  nextBtn = document.getElementById("next-btn");
    shuffleBtn = document.getElementById("shuffle-btn");
    repeatBtn = document.getElementById("repeat-btn");
    progressBar = document.getElementById("progress-bar");
    currentTimeEl = document.getElementById("current-time");
    totalDurationEl = document.getElementById("total-duration");
    volumeSlider = document.getElementById("volume-slider");
    playerName = document.getElementById("player-track-name");
    playerArtist = document.getElementById("player-track-artist");
    playerAlbumArt = document.getElementById("player-album-art");
    
    playerAlbumArt.src = BLANK_ALBUM_ART;
  playPauseBtn.addEventListener("click", togglePlayPause);
  nextBtn.addEventListener("click", playNext);
  prevBtn.addEventListener("click", playPrev);
  shuffleBtn.addEventListener("click", toggleShuffle);
  repeatBtn.addEventListener("click", toggleRepeat);
  
  volumeSlider.addEventListener("input", (e) => {
   audio.volume = e.target.value / 100;
  });
  progressBar.addEventListener("input", (e) => {
   if (audio.duration) {
    audio.currentTime = (e.target.value / 100) * audio.duration;
   }
  });
  audio.addEventListener("timeupdate", updateProgress);
    audio.addEventListener("ended", onTrackEnd);
    audio.addEventListener("play", () => {
      isPlaying = true;
      playPauseIconUse.setAttribute("href", "#icon-pause");
    });
    audio.addEventListener("pause", () => {
      isPlaying = false;
      playPauseIconUse.setAttribute("href", "#icon-play");
    });
    audio.addEventListener("loadedmetadata", () => {
      totalDurationEl.textContent = formatTime(audio.duration);
    });

   loadMusicList();
 });
 async function loadMusicList() {
  try {
   const res = await fetch(`${SERVER_URL}/music-list`);
   if (!res.ok) throw new Error(`Server error: ${res.status}`);
   const data = await res.json();
   if (!data.tracks || data.tracks.length === 0) {
    tracksContainer.innerHTML = '<p class="error">No songs found on server.</p>';
    return;
   }
   tracks = data.tracks;
   renderTrackList();
  } catch (err) {
   console.error("Error loading music:", err);
   tracksContainer.innerHTML = `<p class="error">Error connecting to server. Is it running?</p>`;
  }
 }
 function renderTrackList() {
  tracksContainer.innerHTML = ""; // Clear loader
  tracks.forEach((track, index) => {
   const card = document.createElement("div");
   card.className = "track-card";
   card.dataset.index = index; 
   card.innerHTML = `
    <div class="track-info">
     <span class="track-name">${track.name}</span>
     <span class="track-artist">${track.artist}</span>
    </div>
    <span class="track-duration">${track.duration}</span>
   `;
   card.addEventListener("click", () => {
     playTrack(index);
   });
   tracksContainer.appendChild(card);
  });
 }
 function playTrack(index) {
  if (index < 0 || index >= tracks.length) return;
  
  currentTrackIndex = index;
  const track = tracks[index];
  audio.src = `${SERVER_URL}${track.file}`;
  audio.play();
  
  // Update player bar
  playerName.textContent = track.name;
  playerArtist.textContent = track.artist;
   
   // Set album art if available, otherwise use blank
   playerAlbumArt.src = track.cover || BLANK_ALBUM_ART;
  // Highlight active track
  document.querySelectorAll(".track-card").forEach((card, i) => {
   card.classList.toggle("active", i === index);
  });
 }
 function togglePlayPause() {
  if (currentTrackIndex === -1 && tracks.length > 0) {
   playTrack(0); // Play first track if none selected
   return;
  }
  if (isPlaying) {
   audio.pause();
  } else {
   audio.play();
  }
 }
  function onTrackEnd() {
    if (isRepeat) {
      playTrack(currentTrackIndex);
    } else {
      playNext();
    }
  }

 function playNext() {
  if (tracks.length === 0) return;

    if (isShuffle) {
      playTrack(Math.floor(Math.random() * tracks.length));
      return;
    }
    
  let newIndex = currentTrackIndex + 1;
  if (newIndex >= tracks.length) {
   newIndex = 0; // Wrap around to the start
  }
  playTrack(newIndex);
 }

 function playPrev() {
 if (tracks.length === 0) return;

    if (isShuffle) {
      playTrack(Math.floor(Math.random() * tracks.length));
      return;
    }

 let newIndex = currentTrackIndex - 1;
  if (newIndex < 0) {
   newIndex = tracks.length - 1; // Wrap around to the end
  }
  playTrack(newIndex);
 }

  function toggleShuffle() {
    isShuffle = !isShuffle;
    shuffleBtn.classList.toggle("active", isShuffle);
  }

  function toggleRepeat() {
    isRepeat = !isRepeat;
    repeatBtn.classList.toggle("active", isRepeat);
    
  }
  function onTrackEnd() {
    let isLastTrack = currentTrackIndex === tracks.length - 1;

    if (isRepeat) {
      playNext(); // playNext() handles wrap-around, so it repeats all
    } else if (isShuffle) {
      playNext(); // Shuffled lists should continue
    } else if (!isLastTrack) {
      playNext(); // Not last track, play next
    } else {
      // Last track, no repeat, no shuffle: Stop.
      isPlaying = false;
      playPauseIconUse.setAttribute("href", "#icon-play");
      playerAlbumArt.src = BLANK_ALBUM_ART;
      playerName.textContent = "Select a song";
      playerArtist.textContent = "";
      progressBar.value = 0;
      currentTimeEl.textContent = "0:00";
    }
 }
 function updateProgress() {
  if (audio.duration) {
   progressBar.value = (audio.currentTime / audio.duration) * 100;
   currentTimeEl.textContent = formatTime(audio.currentTime);
  }
 }
 
 function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
 }
})();