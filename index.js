//let audio = document.querySelector('.audio');
let next = document.querySelector('.next');
let pre = document.querySelector('.pre');
let playpause = document.querySelector('.playandpause');
let loop = document.querySelector('.loop');
let shuffle = document.querySelector('.shuffle');
/* let demo = document.querySelector('#demo'); */

let playRange = document.querySelector('form input[name="playRange"]');
let playStart = document.querySelector('.playStart');
let playEnd = document.querySelector('.playEnd');

let volumeRange = document.querySelector('form input[name="volumeRange"]');
let volumeDown = document.querySelector('.volumeDonw');
let volumeUp = document.querySelector('.volumeUp');

// set play
let isPlaying = false;
let audioID = 0;
let loopID = 0;
let playTime = 0;
let shuffleOn = false;
let shuffleArray = [];

// set loop config
let loopTrack = {
    0: false, //no loop
    1: true, // one song loop
    2: true // all song loop
}

// create audio element
let audio = document.createElement('audio');
audio.setAttribute('controls', false)
    /* demo.appendChild(audio); */
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
    },
    3: {
        path: './data/mikeposner-itookapillinlbiza.mp3'
    },
    4: {
        path: './data/avicii-thenights.mp3'
    },
    5: {
        path: './data/avicii-waitingforlove.mp3'
    }
};

function randomBgColor() {
    // create random color
    let red = Math.floor(Math.random() * 256);
    let green = Math.floor(Math.random() * 256);
    let blue = Math.floor(Math.random() * 256);
    document.querySelector('body').style.backgroundColor = `rgb(${red},${green},${blue})`;
}
// set first song with random color
audio.src = audioTrack[audioID]['path'];
randomBgColor();
audio.volume = volumeRange.value / 100;

// event
playpause.addEventListener('click', playTrack);
next.addEventListener('click', nextAudio);
pre.addEventListener('click', prevAudio);
loop.addEventListener('click', loopAudio);
shuffle.addEventListener('click', doShuffle);
playRange.addEventListener('click', rangeChangeUpdate);
volumeRange.addEventListener('click', volumeChangeUpdate);

// set src for playTrack
function setAudioSrc(id) {
    audio.load();
    audio.src = audioTrack[id]['path'];
    playRange.value = 0;
    console.log(id, audio.src)
}

// play and pause audio
function playTrack() {
    if (!isPlaying) playAudio();
    else pauseAudio();
}

function playAudio() {
    randomBgColor();
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

    // shuffle play
    if (shuffleOn) {
        setAudioSrc(shuffleArray[audioID]);
    } else {
        setAudioSrc(audioID);
    }
    playAudio();
}
// prev song
function prevAudio() {
    audioID--;
    if (audioID < 0) {
        audioID = Object.keys(audioTrack).length - 1;
    };

    // shuffle play
    if (shuffleOn) {
        setAudioSrc(shuffleArray[audioID]);
    } else {
        setAudioSrc(audioID);
    }
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

// shuffle song
function doShuffle() {
    if (!shuffleOn) {
        shuffle.textContent = 'Shuffle On';
        shuffleOn = true;
    } else {
        shuffle.textContent = 'Shuffle Off';
        shuffleOn = false;
    }
    playShuffleAudio();
};

function shuffleAudio() {
    shuffleArray = [];
    let copyArray = [...Object.keys(audioTrack)];
    for (let i = copyArray.length; i > 0; i--) {
        let shuffleId = Math.floor(Math.random() * copyArray.length);
        shuffleArray.push(copyArray[shuffleId]);
        copyArray.splice(shuffleId, 1);
    }
    console.log(shuffleArray);
    return shuffleArray;
}

function playShuffleAudio() {
    shuffleAudio();
    audio.addEventListener('ended', nextAudio);
}

// update current time
let currentTimeUpdate = setInterval(() => {
    // for duration time
    let durationMinute = Math.floor(audio.duration / 60);
    let durationSecond = Math.floor(audio.duration % 60);
    if (durationSecond < 10) {
        durationSecond = '0' + durationSecond;
    }
    if (durationMinute < 10) {
        durationMinute = '0' + durationMinute;
    }

    // for current time
    let currentSecond = Math.floor(audio.currentTime);
    let currentMinute = 0;
    if (currentSecond < 10) {
        currentSecond = '0' + currentSecond;
    }
    if (currentMinute < 10) {
        currentMinute = '0' + currentMinute;
    }
    if (currentSecond >= 60) {
        currentSecond = Math.floor(audio.currentTime % 60);
        if (currentSecond < 10) {
            currentSecond = '0' + currentSecond;
        }
        currentMinute = Math.floor(audio.currentTime / 60);
        if (currentMinute < 10) {
            currentMinute = '0' + currentMinute;
        }
    }
    // display time
    playStart.textContent = currentMinute + ':' + currentSecond;
    playEnd.textContent = durationMinute + ':' + durationSecond;
}, 100)

// range change update
function rangeChangeUpdate() {
    let rangeValue = playRange.value;
    audio.currentTime = audio.duration * (rangeValue / 100);
}

// update range
let updateRange = setInterval(() => {
    i = 100 * (audio.currentTime / audio.duration)
    playRange.value = i;
}, 1000);

// change volume range
function volumeChangeUpdate() {
    let volumeValue = volumeRange.value;
    calculateVolume = 1 * (volumeValue / 100)
    audio.volume = calculateVolume;
}