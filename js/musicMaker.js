const createSample = (sample, sampleCollections) => {
  let id = sampleCollections.children.length;
  const sampleElement = document.createElement("div");
  sampleElement.setAttribute("id", "sample" + id++);
  sampleElement.setAttribute("draggable", true);
  sampleElement.innerText = sample.name;
  sampleCollections.appendChild(sampleElement);

  sampleElement.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", e.target.id);
  });
};

const createTrack = (tracksDiv) => {
  const cloneCounts = {};
  const index = tracksDiv.children.length / 2;

  const trackDiv = document.createElement("div");
  const trackSetupDiv = document.createElement("div");

  trackDiv.setAttribute("id", "trackDiv" + index);
  trackSetupDiv.setAttribute("id", "trackSetupDiv" + index);

  const trackDivHeader = document.createElement("h3");
  trackDivHeader.innerText = "Track " + (index + 1);

  trackSetupDiv.appendChild(trackDivHeader);
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

const addInitialTracks = () => {
  const tracks = [];

  tracks.push([]);
  tracks.push([]);
  tracks.push([]);
  tracks.push([]);

  const tracksDiv = document.getElementById("tracks");
  const cloneCounts = {};

  for (let i = 0; i < tracks.length; i++) {
    createTrack(tracksDiv, cloneCounts);
  }
};

addInitialSamples();
addInitialTracks();
