// =====================================
// SCREEN NAVIGATION
// =====================================

const screens = document.querySelectorAll(".screen");

const enterButton = document.getElementById("enterButton");
const restartJourney = document.getElementById("restartJourney");

let currentScreen = 0;

function showScreen(index) {
    if (index < 0 || index >= screens.length) return;

    // Remove the active class from the current screen.
    screens[currentScreen].classList.remove("active");

    currentScreen = index;

    // Show the selected screen.
    screens[currentScreen].classList.add("active");

    // Return the screen's internal content to the top.
    const scrollableContent =
        screens[currentScreen].querySelector(".content-card, .music-card");

    if (scrollableContent) {
        scrollableContent.scrollTop = 0;
    }
}

// Enter the experience.
enterButton.addEventListener("click", () => {
    showScreen(1);
});

// Continue buttons.
document.querySelectorAll(".next-button").forEach(button => {
    button.addEventListener("click", () => {
        showScreen(currentScreen + 1);
    });
});

// Back buttons.
document.querySelectorAll(".back-button").forEach(button => {
    button.addEventListener("click", () => {
        showScreen(currentScreen - 1);
    });
});

// Return to the beginning.
restartJourney.addEventListener("click", () => {
    loveSong.pause();
    loveSong.currentTime = 0;

    showScreen(0);
    updatePlayer();
});


// =====================================
// MUSIC PLAYER
// =====================================

const loveSong = document.getElementById("loveSong");

const playButton = document.getElementById("playButton");
const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");

const progressBar = document.getElementById("progressBar");
const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");

const visualizer = document.getElementById("visualizer");
const playerMessage = document.getElementById("playerMessage");


// Convert seconds into minutes and seconds.
function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
}


// Update the progress bar and timestamps.
function updatePlayer() {
    const current = loveSong.currentTime || 0;
    const duration = loveSong.duration || 0;

    currentTimeDisplay.textContent = formatTime(current);
    durationDisplay.textContent = formatTime(duration);

    if (duration > 0) {
        progressBar.value = (current / duration) * 100;
    } else {
        progressBar.value = 0;
    }
}


// Update the player's visual appearance.
function updatePlayState() {
    if (loveSong.paused) {
        visualizer.classList.remove("playing");
        playButton.textContent = "▶";
        playButton.setAttribute("aria-label", "Play song");
    } else {
        visualizer.classList.add("playing");
        playButton.textContent = "♫";
        playButton.setAttribute("aria-label", "Song is playing");
    }
}


// Play the recording.
playButton.addEventListener("click", async () => {
    try {
        await loveSong.play();

        playerMessage.textContent =
            "This one is especially for you, my love. ❤️";
    } catch (error) {
        playerMessage.textContent =
            "I couldn't play the recording. Please check that the audio file is in the correct folder.";
        console.error("Audio playback error:", error);
    }
});


// Pause the recording.
pauseButton.addEventListener("click", () => {
    loveSong.pause();
});


// Restart the recording from the beginning.
restartButton.addEventListener("click", async () => {
    loveSong.currentTime = 0;

    try {
        await loveSong.play();

        playerMessage.textContent =
            "Let's listen to it again, my love. ❤️";
    } catch (error) {
        console.error("Audio playback error:", error);
    }
});


// Update the timeline while the song plays.
loveSong.addEventListener("timeupdate", updatePlayer);


// Load the song's total duration.
loveSong.addEventListener("loadedmetadata", updatePlayer);


// Update the play/pause appearance.
loveSong.addEventListener("play", updatePlayState);
loveSong.addEventListener("pause", updatePlayState);


// Allow the listener to move through the recording.
progressBar.addEventListener("input", () => {
    if (Number.isFinite(loveSong.duration) && loveSong.duration > 0) {
        const percentage = Number(progressBar.value) / 100;

        loveSong.currentTime = percentage * loveSong.duration;
    }
});


// When the song finishes.
loveSong.addEventListener("ended", () => {
    loveSong.currentTime = 0;

    updatePlayer();
    updatePlayState();

    playerMessage.textContent =
        "I hope you enjoyed my little serenade, Wifeyyy. ❤️";
});


// Initial player state.
updatePlayer();
updatePlayState();
