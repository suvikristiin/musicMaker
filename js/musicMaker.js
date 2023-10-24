const createSample = (sample, sampleCollections) => {
  let id = sampleCollections.children.length;
  const sampleElement = document.createElement("div");
  const removeSampleButton = document.createElement("button");
  sampleElement.setAttribute("id", "sample" + id++);
  sampleElement.setAttribute("draggable", true);

  removeSampleButton.innerText = "X";
  removeSampleButton.classList.add("removeSample");

  sampleElement.innerText = sample.name;
  sampleElement.src = sample.src;
  sampleCollections.appendChild(sampleElement);
  sampleElement.appendChild(removeSampleButton);

  removeSampleButton.addEventListener("click", () => {
    sampleCollections.removeChild(sampleElement);
  });

  sampleElement.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
  });
};

const createTrackAudioElement = (index) => {
  const audio = new Audio();
  trackAudioElements[index] = audio;
  console.log("tracksAudios", trackAudioElements);
};

const createTrack = (tracksDiv, tracks) => {
  console.log(tracks);

  const cloneCounts = {};
  const index = tracksDiv.children.length / 3;
  createTrackAudioElement(index);

  const trackDiv = document.createElement("div");
  const trackSetupDiv = document.createElement("div");
  const trackVolumeSlider = document.createElement("input");
  trackDiv.setAttribute("id", "trackDiv" + index);
  trackSetupDiv.setAttribute("id", "trackSetupDiv" + index);

  trackVolumeSlider.setAttribute("type", "range");
  trackVolumeSlider.setAttribute("min", "0");
  trackVolumeSlider.setAttribute("max", "100");
  trackVolumeSlider.setAttribute("step", "5");
  trackVolumeSlider.setAttribute("class", "slider");
  trackVolumeSlider.setAttribute("id", "trackVol" + index);

  trackDiv.classList.add("trackDiv");
  trackSetupDiv.classList.add("setUpDiv");

  const trackDivHeader = document.createElement("h3");

  const updateTrackHeaderText = (tracksDiv) => {
    const trackSetupDivs = Array.from(
      tracksDiv.getElementsByClassName("setUpDiv")
    );

    trackSetupDivs.forEach((trackSetupDiv, index) => {
      const trackDivHeader = trackSetupDiv.querySelector("h3");
      trackDivHeader.innerText = "Track " + (index + 1);
    });
  };

  trackSetupDiv.appendChild(trackDivHeader);
  trackSetupDiv.appendChild(trackVolumeSlider);
  tracksDiv.appendChild(trackSetupDiv);
  tracksDiv.appendChild(trackDiv);
  updateTrackHeaderText(tracksDiv);

  const removeTrackButton = document.createElement("button");
  removeTrackButton.innerText = "X";
  removeTrackButton.classList.add("removeTrack");

  removeTrackButton.addEventListener("click", () => {
    tracksDiv.removeChild(trackDiv);
    tracksDiv.removeChild(trackSetupDiv);
    tracksDiv.removeChild(removeTrackButton);
    tracks.splice(index, 1);
    console.log(tracks);
    updateTrackHeaderText(tracksDiv);
  });

  tracksDiv.appendChild(removeTrackButton);

  trackDiv.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  let clonedSampleCount = 0;

  trackDiv.addEventListener("drop", (e) => {
    e.preventDefault();
    const sampleId = e.dataTransfer.getData("text");
    const originalSample = document.getElementById(sampleId);
    const clonedSample = originalSample.cloneNode(true);

    sampleAudioElements.push([]);
    const audio = new Audio();
    audio.src = originalSample.src;
    sampleAudioElements[index].push(audio);

    clonedSampleCount++;

    cloneCounts[sampleId] = (cloneCounts[sampleId] || 0) + 1;
    const trackIndex = parseInt(trackDiv.getAttribute("id").slice(8));
    if (!tracks[trackIndex]) {
      tracks[trackIndex] = [];
    }

    const clonedId = `cloned${sampleId}${index}${tracks[trackIndex].length}`;

    const instrumentVolSlider = document.createElement("input");
    instrumentVolSlider.setAttribute("type", "range");
    instrumentVolSlider.setAttribute("min", "0");
    instrumentVolSlider.setAttribute("max", "100");
    instrumentVolSlider.setAttribute("step", "5");
    instrumentVolSlider.setAttribute("class", "sliderInstrument");
    instrumentVolSlider.setAttribute("id", "instrumentVol" + clonedId);

    clonedSample.setAttribute("id", clonedId);
    clonedSample.classList.add("dropped");

    getSampleDuration(originalSample.src).then((duration) => {
      clonedSample.style.width = (50 + duration * 15).toString() + "px";
    });

    clonedSample.appendChild(instrumentVolSlider);
    trackDiv.appendChild(clonedSample);

    let clonedSampleIndex = tracks[trackIndex].length;
    clonedSample.setAttribute("data-cloned-sample-index", clonedSampleIndex);

    tracks[trackIndex].push({
      src: originalSample.src,
      volume: instrumentVolSlider.value,
    });

    instrumentVolSlider.addEventListener("input", () => {
      tracks[trackIndex][clonedSampleIndex].volume = instrumentVolSlider.value;
      console.log(tracks);
    });

    clonedSample.setAttribute("draggable", false);
    console.log("clonedId", clonedId);

    const removeClonedSampleButton =
      clonedSample.querySelector(".removeSample");

    removeClonedSampleButton.addEventListener("click", () => {
      const removeSampleIndex = clonedSample.getAttribute(
        "data-cloned-sample-index"
      );
      console.log(clonedSampleIndex);
      console.log(clonedSample);
      trackDiv.removeChild(clonedSample);
      tracks[trackIndex][clonedSampleIndex] = {};

      const clonedSamples = trackDiv.querySelectorAll(".dropped");

      clonedSamples.forEach((clonedSample, i) => {
        const currentDataIndex = parseInt(
          clonedSample.getAttribute("data-cloned-sample-index")
        );

        console.log(currentDataIndex);

        if (currentDataIndex >= removeSampleIndex) {
          clonedSample.setAttribute(
            "data-cloned-sample-index",
            currentDataIndex - 1
          );
        }
      });
    });
  });
};

const getSampleDuration = async (src) => {
  return new Promise((resolve) => {
    const audioSample = new Audio();
    audioSample.addEventListener("loadedmetadata", () => {
      resolve(audioSample.duration);
    });
    audioSample.src = src;
    audioSample.remove();
  });
};

const addInitialSamples = () => {
  const samples = [];

  samples.push({ src: "audio/bass.mp3", name: "Bass" });
  samples.push({ src: "audio/drum.mp3", name: "Drum" });
  samples.push({ src: "audio/piano.mp3", name: "Piano" });
  samples.push({ src: "audio/silence.mp3", name: "Silence" });
  samples.push({ src: "audio/strange-beat.mp3", name: "Strange Beat" });
  samples.push({ src: "audio/violin.mp3", name: "Violin" });

  const uploadSampleButton = document.getElementById("uploadSample");
  uploadSampleButton.addEventListener("click", () => {
    const file = document.getElementById("input-sample").files[0];
    let audioSrc = "";
    if (!file) return;
    audioSrc = URL.createObjectURL(file);
    let sampleName = file.name;
    if (sampleName.length > 15) {
      sampleName = sampleName.substring(0, 15);
    }
    let sample = { src: audioSrc, name: sampleName };
    samples.push(sample);
    createSample(sample, sampleCollections);
  });

  const sampleCollections = document.getElementById("sampleCollections");
  let id = 0;

  samples.forEach((sample) => {
    createSample(sample, sampleCollections);
  });
};

const addInitialTracks = (tracks) => {
  const tracksDiv = document.getElementById("allTracks");

  for (let i = 0; i < tracks.length; i++) {
    createTrack(tracksDiv, tracks);
  }
};

const playSong = (tracks) => {
  tracks.forEach((track, i) => {
    console.log("track play", track);
    if (track.length > 0) {
      playTrack(track, i);
    }
    i++;
  });
};

const playTrack = (track, index) => {
  const audio = trackAudioElements[index];

  const volumeTrack = document.getElementById("trackVol" + index);

  let i = 0;
  let isPaused = false;

  let checkTrackInterval;

  const playNextTrack = () => {
    let emptyTrack = true;

    while (true) {
      i = ++i < track.length ? i : 0;

      if (track[i] && track[i].src) {
        emptyTrack = false;
        break;
      }

      if (i == 0 && emptyTrack) {
        console.log("Kaikki kappaleet soitettu");
        audio.remove();
        initialIsPaused = true;
        clearInterval(checkTrackInterval);
        playButton.style.visibility = "hidden";
        pauseButton.style.visibility = "hidden";
        reset.addEventListener("click", () => {
          location.reload();
        });
        return;
      }
      console.log("loop", i);
      console.log(emptyTrack);
    }

    console.log(i);

    console.log(track.length);

    const volume = volumeTrack.value / 100 + track[i].volume / 100;
    audio.volume = volume > 1 ? 1 : volume;

    audio.src = track[i].src;

    audio.addEventListener("loadedmetadata", () => {
      audio.play();
    });
  };

  audio.addEventListener("ended", playNextTrack, true);

  const volume = volumeTrack.value / 100 + track[i].volume / 100;
  audio.volume = volume > 1 ? 1 : volume;
  audio.loop = false;
  audio.src = track[i].src;

  audio.addEventListener("loadedmetadata", () => {
    audio.play();
  });

  checkTrackInterval = setInterval(() => {
    if (!track[i] || !track[i].src) {
      if (audio) {
        audio.pause();
      }
      console.log("next");
      playNextTrack();
    }
  }, 100);

  volumeTrack.addEventListener("input", () => {
    const updateVolume = volumeTrack.value / 100 + track[i].volume / 100;
    audio.volume = updateVolume > 1 ? 1 : updateVolume;
  });

  for (
    let instrumentIndex = 0;
    instrumentIndex < track.length;
    instrumentIndex++
  ) {
    const volumePerInstrument = document.querySelectorAll(
      "[id^='instrumentVol'][id$='" + index + instrumentIndex + "']"
    );
    console.log(volumePerInstrument);

    if (volumePerInstrument.length > 0) {
      volumePerInstrument[0].addEventListener("input", () => {
        track[instrumentIndex].volume = volumePerInstrument[0].value;
        const updateVolume =
          volumeTrack.value / 100 + track[instrumentIndex].volume / 100;
        audio.volume = updateVolume > 1 ? 1 : updateVolume;
      });
    }
  }

  const playButton = document.getElementById("play");

  playButton.addEventListener("click", () => {
    if (isPaused) {
      if (audio.dataset.currentTime !== 0) {
        audio.currentTime = parseFloat(audio.dataset.currentTime);
        console.log(audio.currentTime);
      }
      audio.play();
      playButton.removeEventListener("click", null);
    }
  });

  const playButtonClickHandler = () => {
    if (isPaused) {
      if (audio.dataset.currentTime !== 0) {
        audio.currentTime = parseFloat(audio.dataset.currentTime);
        console.log(audio.currentTime);
        isPaused = false;
      }
      audio.play();
      playButton.removeEventListener("click", playButtonClickHandler);
    }
  };

  playButton.addEventListener("click", playButtonClickHandler);

  const pauseButton = document.getElementById("pause");
  pauseButton.addEventListener("click", () => {
    audio.pause();
    isPaused = true;
    audio.dataset.currentTime = audio.currentTime;
    console.log(audio.currentTime);

    playButton.addEventListener("click", playButtonClickHandler);
  });
};

const tracks = [];
tracks.push([]);
tracks.push([]);
let trackAudioElements = [];
const removeClonedSampleButtons = [];
const sampleAudioElements = [];

let initialIsPaused = true;

addInitialSamples();
addInitialTracks(tracks);

const playButton = document.getElementById("play");

if (initialIsPaused) {
  playButtonClickHandler = () => {
    playSong(tracks);
    initialIsPaused = false;
    playButton.removeEventListener("click", playButtonClickHandler);
  };

  playButton.addEventListener("click", playButtonClickHandler);
}

const addNewTrackButton = document.getElementById("addTrack");
addNewTrackButton.addEventListener("click", () => {
  const tracksDiv = document.getElementById("allTracks");
  tracks.push([]);
  createTrack(document.getElementById("allTracks"), tracks);
});

const reset = document.getElementById("reset");
reset.addEventListener("click", () => {
  location.reload();
});
