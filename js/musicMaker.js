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

  trackDiv.addEventListener("drop", (e) => {
    e.preventDefault();
    const sampleId = e.dataTransfer.getData("text");
    const originalSample = document.getElementById(sampleId);
    const clonedSample = originalSample.cloneNode(true);

    cloneCounts[sampleId] = (cloneCounts[sampleId] || 0) + 1;

    const clonedId = `cloned${sampleId}${cloneCounts[sampleId]}`;
    clonedSample.setAttribute("id", clonedId);
    clonedSample.classList.add("dropped");

    trackDiv.appendChild(clonedSample);

    const trackIndex = parseInt(trackDiv.getAttribute("id").slice(8));

    if (!tracks[trackIndex]) {
      tracks[trackIndex] = [];
    }

    tracks[trackIndex].push({ src: originalSample.src });
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
    if (track.length > 0) {
      playTrack(track, i);
    }
    i++;
  });
};

const playTrack = (track, index) => {
  let audio = new Audio();

  const volume = document.getElementById("trackVol" + index);

  let i = 0;
  audio.addEventListener(
    "ended",
    () => {
      i = ++i < track.length ? i : 0;
      audio.src = track[i].src;
      audio.play();
    },
    true
  );

  audio.volume = volume.value / 100;
  audio.loop = false;
  audio.src = track[0].src;
  audio.play();

  volume.addEventListener("input", () => {
    audio.volume = volume.value / 100;
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
});
