const createSample = (sample, sampleCollections) => {
  let id = sampleCollections.children.length;
  const sampleElement = document.createElement("div");
  sampleElement.setAttribute("id", "sample" + id++);
  sampleElement.setAttribute("draggable", true);
  sampleElement.innerText = sample.name;
  sampleElement.src = sample.src;
  sampleCollections.appendChild(sampleElement);

  sampleElement.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
  });
};

const createTrack = (tracksDiv, tracks) => {
  const cloneCounts = {};
  const index = tracksDiv.children.length / 2;

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
  trackDivHeader.innerText = "Track " + (index + 1);

  trackSetupDiv.appendChild(trackDivHeader);
  trackSetupDiv.appendChild(trackVolumeSlider);
  tracksDiv.appendChild(trackSetupDiv);
  tracksDiv.appendChild(trackDiv);

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

    if (!tracks[trackIndex]) {
      tracks[trackIndex] = [];
    }

    tracks[trackIndex].push({
      src: originalSample.src,
      volume: instrumentVolSlider.value,
    });

    instrumentVolSlider.addEventListener("input", () => {
      tracks[trackIndex][clonedSampleIndex].volume = instrumentVolSlider.value;
      console.log(tracks);
    });

    clonedSample.setAttribute("draggable", false);
    console.log(clonedId);
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

  audio.addEventListener(
    "ended",
    () => {
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
