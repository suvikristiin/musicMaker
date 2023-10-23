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

const createTrack = (tracksDiv, tracks) => {
  console.log(tracks);

  const cloneCounts = {};
  const index = tracksDiv.children.length / 3;

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

    clonedSampleCount++;

    cloneCounts[sampleId] = (cloneCounts[sampleId] || 0) + 1;
    const trackIndex = parseInt(trackDiv.getAttribute("id").slice(8));
    if (!tracks[trackIndex]) {
      tracks[trackIndex] = [];
    }
    console.log(sampleId);
    console.log(index);
    console.log(tracks[trackIndex].length);
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

    clonedSample.appendChild(instrumentVolSlider);
    trackDiv.appendChild(clonedSample);

    const clonedSampleIndex = tracks[trackIndex].length;

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
    console.log(removeClonedSampleButton);
    removeClonedSampleButton.addEventListener("click", () => {
      trackDiv.removeChild(clonedSample);
      tracks[trackIndex].splice(clonedSampleIndex, 1);
      console.log(tracks);
    });
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
    console.log("track", track);
    if (track.length > 0) {
      playTrack(track, i);
    }
    i++;
  });
};

const playTrack = (track, index) => {
  let audio = new Audio();

  const volumeTrack = document.getElementById("trackVol" + index);
  let i = 0;
  track[i];
  audio.addEventListener(
    "ended",
    () => {
      if (!track[i] || !track[i].volume) {
        console.log(track[i]);
        return;
      }
      i = ++i < track.length ? i : 0;

      const volume = volumeTrack.value / 100 + track[i].volume / 100;
      audio.volume = volume > 1 ? 1 : volume;
      audio.src = track[i].src;
      audio.play();
    },
    true
  );

  const volume = volumeTrack.value / 100 + track[i].volume / 100;
  audio.volume = volume > 1 ? 1 : volume;
  audio.loop = false;
  audio.src = track[i].src;
  audio.play();

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

    volumePerInstrument[0].addEventListener("input", () => {
      track[instrumentIndex].volume = volumePerInstrument[0].value;
      const updateVolume =
        volumeTrack.value / 100 + track[instrumentIndex].volume / 100;
      audio.volume = updateVolume > 1 ? 1 : updateVolume;
    });
  }

  const pauseButton = document.getElementById("pause");
  pauseButton.addEventListener("click", () => {
    audio.pause();
    audio.dataset.currentTime = audio.currentTime;
  });

  const playButton = document.getElementById("play");
  playButton.addEventListener("click", () => {
    if (audio.dataset.currentTime) {
      audio.currentTime = parseFloat(audio.dataset.currentTime);
      audio.dataset.currentTime = null;
    }
    audio.play();
  });
};

document.addEventListener("DOMContentLoaded", () => {
  const tracks = [];
  tracks.push([]);
  tracks.push([]);

  addInitialSamples();
  addInitialTracks(tracks);

  const playButton = document.getElementById("play");
  playButton.addEventListener("click", () => {
    playSong(tracks);
  });

  const addNewTrackButton = document.getElementById("addTrack");
  addNewTrackButton.addEventListener("click", () => {
    const tracksDiv = document.getElementById("allTracks");
    tracks.push([]);
    createTrack(document.getElementById("allTracks"), tracks);
  });
});
