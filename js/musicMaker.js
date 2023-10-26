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

  const loopCheckbox = document.createElement("input");
  loopCheckbox.setAttribute("type", "checkbox");
  loopCheckbox.setAttribute("id", "loopCheckbox" + index);

  const loopLabel = document.createElement("label");
  loopLabel.innerText = "Loop";
  const loopControlDiv = document.createElement("div");

  trackDiv.classList.add("trackDiv");
  trackSetupDiv.classList.add("setUpDiv");
  loopLabel.classList.add("checkboxLabel");

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

  loopControlDiv.appendChild(loopLabel);
  loopControlDiv.appendChild(loopCheckbox);
  trackSetupDiv.appendChild(loopControlDiv);

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

    const audio = new Audio();
    audio.src = originalSample.src;

    const downloadButton = document.getElementById("download");
    downloadButton.style.visibility = "visible";
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

    console.log("tracks", tracks);

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

      clonedSampleCount--;
      console.log(clonedSampleCount);

      const noClonedSamplesLeft = tracks.every((track) =>
        track.every((sample) => Object.keys(sample).length === 0)
      );
      console.log(noClonedSamplesLeft);

      if (noClonedSamplesLeft) {
        downloadButton.style.visibility = "hidden";
        tracks.forEach((track) => {
          track.length = 0;
        });
      }

      console.log(tracks);
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

  const downloadButton = document.getElementById("download");

  const loopCheckbox = document.getElementById("loopCheckbox" + index);

  console.log("mo", loopCheckbox);
  // Tarkistetaan onko checkbox valittu
  const shouldLoop = loopCheckbox.checked;
  console.log(shouldLoop);

  let i = 0;
  let isPaused = false;

  let checkTrackInterval;

  const playNextTrack = () => {
    let emptyTrack = true;

    while (true) {
      i = ++i < track.length ? i : 0;

      if (i == 0 && !shouldLoop) {
        console.log("moi");
        audio.remove();
        initialIsPaused = true;
        clearInterval(checkTrackInterval);
        playButton.style.visibility = "hidden";
        pauseButton.style.visibility = "hidden";
        downloadButton.style.visibility = "hidden";
        reset.addEventListener("click", () => {
          location.reload();
        });
        return;
      }

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
        downloadButton.style.visibility = "hidden";
        reset.addEventListener("click", () => {
          location.reload();
        });
        return;
      }

      console.log("loop", i);
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

  audio.addEventListener("ended", playNextTrack, shouldLoop);

  const volume = volumeTrack.value / 100 + track[i].volume / 100;
  audio.volume = volume > 1 ? 1 : volume;
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

const createAudioBuffer = async (src, audioContext) => {
  const response = await fetch(src);

  const arrayBuffer = await response.arrayBuffer();
  console.log(arrayBuffer);
  return await audioContext.decodeAudioData(arrayBuffer);
};

const combineTracks = async (audioContext) => {
  const trackBuffers = [];

  for (const track of tracks) {
    let trackBuffer = audioContext.createBuffer(2, 1, audioContext.sampleRate);

    for (const instrument of track) {
      if (instrument.src) {
        const instrumentBuffer = await createAudioBuffer(
          instrument.src,
          audioContext
        );

        if (instrumentBuffer.length > trackBuffer.length) {
          const newBuffer = audioContext.createBuffer(
            2,
            instrumentBuffer.length,
            audioContext.sampleRate
          );
          newBuffer.copyToChannel(trackBuffer.getChannelData(0), 0);
          newBuffer.copyToChannel(trackBuffer.getChannelData(1), 1);
          trackBuffer = newBuffer;
        }

        const leftInstrumentData = instrumentBuffer.getChannelData(0);
        const rightInstrumentData = instrumentBuffer.getChannelData(1);
        const leftTrackData = trackBuffer.getChannelData(0);
        const rightTrackData = trackBuffer.getChannelData(1);

        for (let i = 0; i < instrumentBuffer.length; i++) {
          leftTrackData[i] += leftInstrumentData[i];
          rightTrackData[i] += rightInstrumentData[i];
        }
      }
    }
    trackBuffers.push(trackBuffer);
  }

  const maxLength = Math.max(...trackBuffers.map((buffer) => buffer.length));
  const combinedBuffer = audioContext.createBuffer(
    2,
    maxLength,
    audioContext.sampleRate
  );

  for (let i = 0; i < trackBuffers.length; i++) {
    const trackBuffer = trackBuffers[i];
    const leftTrackData = trackBuffer.getChannelData(0);
    const rightTrackData = trackBuffer.getChannelData(1);
    const combinedLeftData = combinedBuffer.getChannelData(0);
    const combinedRightData = combinedBuffer.getChannelData(1);

    for (let j = 0; j < maxLength; j++) {
      combinedLeftData[j] =
        (combinedLeftData[j] || 0) + (leftTrackData[j] || 0);
      combinedRightData[j] =
        (combinedRightData[j] || 0) + (rightTrackData[j] || 0);
    }
  }

  return combinedBuffer;
};

const downloadButton = document.getElementById("download");

downloadButton.addEventListener("click", async () => {
  const audioContext = new AudioContext();

  const combinedBuffer = await combineTracks(audioContext);
  const leftAudioData = combinedBuffer.getChannelData(0);
  const rightAudioData = combinedBuffer.getChannelData(1);
  const mp3DataLeft = new Int16Array(leftAudioData.length);
  const mp3DataRight = new Int16Array(rightAudioData.length);

  for (let i = 0; i < leftAudioData.length; i++) {
    mp3DataLeft[i] = leftAudioData[i] * 32767;
  }

  for (let i = 0; i < rightAudioData.length; i++) {
    mp3DataRight[i] = rightAudioData[i] * 32767;
  }

  const mp3encoder = new lamejs.Mp3Encoder(2, combinedBuffer.sampleRate, 128);
  const mp3Buffer = [];

  for (let i = 0; i < mp3DataLeft.length; i += 1152) {
    const mp3block = mp3encoder.encodeBuffer(
      mp3DataLeft.subarray(i, i + 1152),
      mp3DataRight.subarray(i, i + 1152)
    );
    if (mp3block.length > 0) {
      mp3Buffer.push(mp3block);
    }
  }

  const mp3DataBlob = new Blob(mp3Buffer, { type: "audio/mp3" });

  const downloadLink = document.createElement("a");
  downloadLink.href = URL.createObjectURL(mp3DataBlob);
  downloadLink.download = "song.mp3";
  downloadLink.innerHTML = "song.mp3";

  const downloadedFiles = document.getElementById("downloadedFiles");
  downloadedFiles.appendChild(downloadLink);

  downloadLink.addEventListener("click", () => {
    downloadLink.click();
  });
});
