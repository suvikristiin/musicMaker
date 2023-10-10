// Array for mp3 samples, items are object having file source and name

const addInitialSamples = () => {
  const samples = [];

  samples.push({ src: "audio/bass.mp3", name: "Bass" });
  samples.push({ src: "audio/drum.mp3", name: "Drum" });
  samples.push({ src: "audio/piano.mp3", name: "Piano" });
  samples.push({ src: "audio/silence.mp3", name: "Silence" });
  samples.push({ src: "audio/strange-beat.mp3", name: "Strange Beat" });
  samples.push({ src: "audio/violin.mp3", name: "Violin" });

  let id = 0;
  samples.forEach((sample) => {
    console.log(sample.name);
    const sampleButton = document.createElement("button");
    sampleButton.setAttribute("data-id", "sample" + id++);
    sampleButton.innerText = sample.name;
    addButtons.appendChild(sampleButton);
  });
};

const addInitialTracks = () => {
  const tracks = [];

  tracks.push([]);
  tracks.push([]);
  tracks.push([]);
  tracks.push([]);

  const tracksDiv = document.getElementById("tracks");

  for (let i = 0; i < tracks.length; i++) {
    const trackDiv = document.createElement("div");
    const trackSetupDiv = document.createElement("div");
    trackDiv.setAttribute("id", "trackDiv" + i);
    trackSetupDiv.setAttribute("id", "trackSetupDiv" + i);
    const trackDivHeader = document.createElement("h3");
    trackDivHeader.innerText = "Track " + (i + 1);
    trackSetupDiv.appendChild(trackDivHeader);
    tracksDiv.appendChild(trackSetupDiv);
    tracksDiv.appendChild(trackDiv);
  }
};

addInitialSamples();
addInitialTracks();
