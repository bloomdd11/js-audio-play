//let audio = document.querySelector('.audio');
let next = document.querySelector('.next');
let pre = document.querySelector('.pre');
let playpause = document.querySelector('.playandpause');
let loop = document.querySelector('.loop');
let demo = document.querySelector('#demo');

// set play
let isPlaying = false;
let audioID = 0;
let loopID = 0;


// set loop config
let loopTrack = {
    0: false, //no loop
    1: true, // one song loop
    2: true // all song loop
}

// set list of audio
let audioTrack = {
    0: {
        path: './data/Clean Bandit - Rockabye (Lyrics) feat. Sean Paul _ Anne-Marie(MP3_128K).mp3'
    },
    1: {
        path: './data/Crave U(MP3_128K).mp3'
    },
    2: {
        path: './data/y2meta.com - KALEO - Way Down We Go (Official Music Video) (128 kbps).mp3'
    }
};

// create audio element
let audio = document.createElement('audio');
audio.setAttribute('controls', false)
demo.appendChild(audio);

playpause.addEventListener('click', playTrack);
next.addEventListener('click', nextAudio);
pre.addEventListener('click', prevAudio);
loop.addEventListener('click', loopAudio);

// play audio
function playTrack() {
    audio.src = audioTrack[audioID]['path'];
    if (!isPlaying) playAudio();
    else pauseAudio();
}

function playAudio() {
    audio.play();
    isPlaying = true;
    playpause.textContent = 'Play';
};

function pauseAudio() {
    audio.pause();
    isPlaying = false;
    playpause.textContent = 'Pause';
}

// next song
function nextAudio() {
    audioID++;
    if (audioID >= Object.keys(audioTrack).length) {
        audioID = 0;
    }
    audio.src = audioTrack[audioID]['path'];
    playAudio();
}
// prev song
function prevAudio() {
    audioID--;
    if (audioID < 0) {
        audioID = Object.keys(audioTrack).length - 1;
    };
    audio.src = audioTrack[audioID]['path'];
    playAudio();
}

// loop song
function loopAudio() {
    loopID++;
    if (loopID >= Object.keys(loopTrack).length) {
        loopID = 0;
    }
    switch (loopID) {
        case 0:
            loop.textContent = 'No loop';
            break;
        case 1:
            loop.textContent = 'loop 1';
            audio.addEventListener('ended', loopOne);
            break;
        case 2:
            loop.textContent = 'loop all';
            loopAll();
            break;
    }
}

// loop one
function loopOne() {
    audio.currentTime = 0;
    playAudio();
}

// loop all
function loopAll() {
    audio.addEventListener('ended', nextAudio)
}