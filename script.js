document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const audio = document.getElementById('audio');
    const playBtn = document.getElementById('play');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const progressBar = document.querySelector('.progress-bar');
    const progressContainer = document.querySelector('.progress-container');
    const songTitle = document.querySelector('.song-title');
    const artist = document.querySelector('.artist');
    const albumArt = document.querySelector('.album-art');
    const currentTimeEl = document.querySelector('.current-time');
    const durationEl = document.querySelector('.duration');
    const volumeControl = document.getElementById('volume');
    const playlistEl = document.querySelector('.playlist');
    const autoplayCheckbox = document.getElementById('autoplay');

    // Song data
    const songs = [
        {
            title: 'Brain Implant',
            artist: 'Cyberpunk',
            src: 'image-and-music/brain-implant-cyberpunk-sci-fi-trailer-action-intro-330416.mp3',
            cover: 'image-and-music/play-music.png'
        },
        {
            title: 'Chill Strings',
            artist: 'beat',
            src: 'image-and-music/chill-strings-beat-effect-372973.mp3',
            cover: 'image-and-music/play-music.png'
        },
        {
            title: 'Dark Mystery',
            artist: 'Trailer',
            src: 'image-and-music/dark-mystery-trailer-taking-our-time-131566.mp3',
            cover: 'image-and-music/play-music.png'
        },
        {
            title: 'Relaxing Guitar',
            artist: 'Loop',
            src: 'image-and-music/relaxing-guitar-loop-v5-245859.mp3',
            cover: 'image-and-music/play-music.png'
        },
        {
            title: 'Vlog Music',
            artist: 'Beat',
            src: 'image-and-music/vlog-music-beat-trailer-showreel-promo-background-intro-theme-274290.mp3',
            cover: 'image-and-music/play-music.png'
        }
    ];

    // Current song index
    let currentSongIndex = 0;
    let isPlaying = false;

    // Initialize the player
    function init() {
        loadSong(currentSongIndex);
        renderPlaylist();
        updatePlaylistSelection();
        
        // Event listeners
        playBtn.addEventListener('click', togglePlay);
        prevBtn.addEventListener('click', prevSong);
        nextBtn.addEventListener('click', nextSong);
        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('ended', handleSongEnd);
        progressContainer.addEventListener('click', setProgress);
        volumeControl.addEventListener('input', setVolume);
        playlistEl.addEventListener('click', playSelectedSong);
        
        // Set initial volume
        audio.volume = volumeControl.value;
    }

    // Load song
    function loadSong(index) {
        const song = songs[index];
        songTitle.textContent = song.title;
        artist.textContent = song.artist;
        albumArt.src = song.cover;
        audio.src = song.src;
    }

    // Play song
    function playSong() {
        isPlaying = true;
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        document.querySelector('.music-player').classList.add('playing');
        audio.play();
        updatePlaylistSelection();
    }

    // Pause song
    function pauseSong() {
        isPlaying = false;
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        document.querySelector('.music-player').classList.remove('playing');
        audio.pause();
    }

    // Toggle play/pause
    function togglePlay() {
        isPlaying ? pauseSong() : playSong();
    }

    // Previous song
    function prevSong() {
        currentSongIndex--;
        if (currentSongIndex < 0) {
            currentSongIndex = songs.length - 1;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }

    // Next song
    function nextSong() {
        currentSongIndex++;
        if (currentSongIndex > songs.length - 1) {
            currentSongIndex = 0;
        }
        loadSong(currentSongIndex);
        if (isPlaying) {
            playSong();
        }
    }

    // Update progress bar
    function updateProgress(e) {
        const { duration, currentTime } = e.srcElement;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;
        
        // Update time display
        currentTimeEl.textContent = formatTime(currentTime);
        
        // Update duration display (only when song is loaded)
        if (duration) {
            durationEl.textContent = formatTime(duration);
        }
    }

    // Format time in mm:ss
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Set progress bar when clicked
    function setProgress(e) {
        const width = this.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    }

    // Set volume
    function setVolume() {
        audio.volume = this.value;
    }

    // Handle song end
    function handleSongEnd() {
        if (autoplayCheckbox.checked) {
            nextSong();
        } else {
            pauseSong();
            audio.currentTime = 0;
        }
    }

    // Render playlist
    function renderPlaylist() {
        playlistEl.innerHTML = '';
        songs.forEach((song, index) => {
            const li = document.createElement('li');
            li.dataset.index = index;
            li.innerHTML = `
                <span class="playlist-song-title">${song.title}</span>
                <span class="playlist-song-artist">${song.artist}</span>
            `;
            playlistEl.appendChild(li);
        });
    }

    // Play selected song from playlist
    function playSelectedSong(e) {
        const li = e.target.closest('li');
        if (li) {
            currentSongIndex = parseInt(li.dataset.index);
            loadSong(currentSongIndex);
            playSong();
        }
    }

    // Update playlist selection highlight
    function updatePlaylistSelection() {
        const playlistItems = playlistEl.querySelectorAll('li');
        playlistItems.forEach(item => {
            item.classList.remove('playing');
            if (parseInt(item.dataset.index) === currentSongIndex) {
                item.classList.add('playing');
                // Scroll to the selected item
                item.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

    // Initialize the player
    init();
});