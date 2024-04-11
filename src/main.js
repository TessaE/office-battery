const batteryDrainer = document.querySelector('.battery-drainer');
const animation = batteryDrainer.getAnimations()[0];

const playPauseToggle = document.querySelector('.play-pause-toggle');
const playButton = document.querySelector('.play-button');
const pauseButton = document.querySelector('.pause-button');
const resetButton = document.querySelector('.reset-button');
const coffeeButton = document.querySelector('.coffee-button');

const dialog = document.querySelector('dialog');
const okButton = dialog.querySelector('button');

playButton.addEventListener('click', () => {
  playPauseToggle.toggleAttribute('data-animation-playing');
  animation.play()
});
pauseButton.addEventListener('click', () => {
  playPauseToggle.toggleAttribute('data-animation-playing');
  animation.pause();
  console.log(animation.currentTime);
});
resetButton.addEventListener('click', () => {
  animation.cancel()
});

coffeeButton.addEventListener('click', () => {
  // TODO: decide on a value that makes sense on a 28.800-second scale (3600 seconds per hour)
  // Bv 900.000 ms = 15min?
  animation.currentTime -= 1000;
});

// TODO: add noise buttons that affects (& shows) playbackRate

animation.oncancel = () => playPauseToggle.toggleAttribute('data-animation-playing', false);
animation.onfinish = () => dialog.showModal();
okButton.addEventListener('click', () => {
  animation.cancel();
  dialog.close();
});

