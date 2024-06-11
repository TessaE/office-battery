// Constants
const batteryDrainer = document.querySelector('.battery-drainer');
const animation = batteryDrainer.getAnimations()[0];

const playPauseToggle = document.querySelector('.play-pause-toggle');
const playButton = document.querySelector('.play-button');
const pauseButton = document.querySelector('.pause-button');
const resetButton = document.querySelector('.reset-button');
const coffeeButton = document.querySelector('.coffee-button');

const bugButton = document.querySelector('.bug-button');
const solvedBugButton = document.querySelector('.solved-bug-button');

const noiseLowerButton = document.querySelector('.noise-settings .minus-button');
const noiseHigherButton = document.querySelector('.noise-settings .plus-button');

let noiseLevel = 0;

const playbackRateElement = document.querySelector(".playback-rate-value");
const timeLeftElement = document.querySelector(".time-left-value");
const noiseLevelElement = document.querySelector(".noise-level");

const dialog = document.querySelector('dialog');
const okButton = dialog.querySelector('button');

const fifteenMinutes = 900000;
let intervalId;

// Event listeners
playButton.addEventListener('click', () => {
  playPauseToggle.toggleAttribute('data-animation-playing');
  animation.play()
  intervalId = setInterval(setTimeLeft, 1000);
  document.title = "Draining...";
});
pauseButton.addEventListener('click', () => {
  playPauseToggle.toggleAttribute('data-animation-playing');
  animation.pause();
  clearInterval(intervalId);
  document.title = "Office Battery";
});
resetButton.addEventListener('click', () => {
  reset();
  clearInterval(intervalId);
});

coffeeButton.addEventListener('click', () => {
  // TODO: zelf instellen totale tijd mogelijk maken + veranderwaarde daaraan verbinden
  setCurrentTime(animation.currentTime - fifteenMinutes * animation.playbackRate);
  setTimeLeft();
});

bugButton.addEventListener('click', () => {
  setCurrentTime(animation.currentTime + fifteenMinutes * animation.playbackRate);
  setTimeLeft();
});
solvedBugButton.addEventListener('click', () => {
  setCurrentTime(animation.currentTime - fifteenMinutes * animation.playbackRate);
  setTimeLeft();
  confetti({
    particleCount: 100,
    angle: 90,
    spread: 40,
    origin: { y: 0.7 },
    colors: ['FFE400', 'FFBD00', 'E89400', 'FFCA6C', 'FDFFB8'],
    scalar: 0.7,
    startVelocity: 35,
  });
});

noiseLowerButton.addEventListener('click', () => {
  setPlaybackRate(animation.playbackRate - 0.1);
  setNoiseLevel(noiseLevel - 1);
  toggleNoiseButtons();
  setTimeLeft();
});

noiseHigherButton.addEventListener('click', () => {
  setPlaybackRate(animation.playbackRate + 0.1);
  setNoiseLevel(noiseLevel + 1);
  toggleNoiseButtons();
  setTimeLeft();
});

animation.oncancel = () => playPauseToggle.toggleAttribute('data-animation-playing', false);
animation.onfinish = () => {
  document.title = "Go home!!";
  dialog.showModal();
}

okButton.addEventListener('click', () => {
  reset();
  dialog.close();
});

// Functions
const setCurrentTime = (time) => {
  if (time < 0) {
    animation.currentTime = 0;
  } else if (time > animation.effect.getComputedTiming().duration) {
    animation.currentTime = animation.effect.getComputedTiming().duration;
    animation.finish();
  } else {
    animation.currentTime = time;
  }
}
const setPlaybackRate = (rate) => {
  if (rate < 1 || rate > 2.1) return;
  animation.playbackRate = rate;
  playbackRateElement.textContent = rate.toFixed(1);
}

const setNoiseLevel = (level) => {
  if (level < 0 || level > 10) return;
  noiseLevel = level;
  noiseLevelElement.textContent = noiseLevel;
}

const msToTime = (ms) => {
  let seconds = Math.floor((ms / 1000) % 60);
  let minutes = Math.floor((ms / (1000 * 60)) % 60);
  let hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
}

const setTimeLeft = () => {
  const timeLeft = animation.effect.getComputedTiming().duration - animation.currentTime
  const timeLeftComputedValue = timeLeft / animation.playbackRate;
  timeLeftElement.textContent = msToTime(timeLeftComputedValue);
}

const toggleNoiseButtons = (button, disabled) => {
  noiseLowerButton.toggleAttribute("disabled", animation.playbackRate <= 1);
  noiseHigherButton.toggleAttribute("disabled", animation.playbackRate >= 2);
}

const reset = () => {
  animation.cancel()
  setPlaybackRate(1);
  setNoiseLevel(0);
  toggleNoiseButtons();
  setTimeLeft();
  clearInterval(intervalId);
  document.title = "Office Battery";
}

setPlaybackRate(animation.playbackRate);
setTimeLeft();
setNoiseLevel(0);
