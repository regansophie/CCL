// ==================================================
// BASIC SETUP
// ==================================================
const jsPsych = initJsPsych();


// ==================================================
// EXPERIMENT VERSION FLAGS
// ==================================================
const CLOUD_VERSION = "cloud";
// options: "cloud", "no_cloud"

const CRITICAL_AUDIO_VERSION = "alternate";
// options: "unsure", "confident", "alternate"

const JOB_VERSION = "forest_ranger_astronomer";
// options: "forest_ranger_astronomer"

const DISTRACTOR_VERSION = "alien";
// options: "earth", "alien"

const LABEL_VERSION  = "fruit";
// options: "food", "fruit"

const ASK_ARE_YOU_SURE = false; 
// options: true, false


// ==================================================
// DERIVED EXPERIMENT CONFIG
// ==================================================
const EXP_CONFIG = {
  useCloud: CLOUD_VERSION === "cloud",
  criticalAudioSuffix: CRITICAL_AUDIO_VERSION,
  distractorVersion: DISTRACTOR_VERSION === "alien" ? "alien" : "earth"
};


// ==================================================
// PARTICIPANT + DATAPIPE SETUP
// ==================================================
function getTimestampID() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}${month}${day}_${hours}${minutes}${seconds}`;
}

const participantID = `${getTimestampID()}_${jsPsych.randomization.randomID(4)}`;

const DATAPIPE_EXPERIMENT_ID = "mCu9AWhCj2Bh";

const ex_version =
  `cloud_${CLOUD_VERSION}__audio_${CRITICAL_AUDIO_VERSION}__job_${JOB_VERSION}__distractors_${DISTRACTOR_VERSION}`;

jsPsych.data.addProperties({
  participant_id: participantID,
  ex_version: ex_version,
  cloud_version: CLOUD_VERSION,
  critical_audio_version: CRITICAL_AUDIO_VERSION,
  job_version: JOB_VERSION,
  distractor_version: DISTRACTOR_VERSION
});


// ==================================================
// COUNTERBALANCE JAR SIDES
// ==================================================
const jarCondition = jsPsych.randomization.sampleWithoutReplacement(
  ["orange_left", "purple_left"],
  1
)[0];

jsPsych.data.addProperties({
  jar_condition: jarCondition
});

function getJarSources() {
  if (jarCondition === "orange_left") {
    return {
      left: "stimuli/jars/orange_jar.png",
      right: "stimuli/jars/purple_jar.png"
    };
  } else {
    return {
      left: "stimuli/jars/purple_jar.png",
      right: "stimuli/jars/orange_jar.png"
    };
  }
}


// ==================================================
// SPEAKER CONDITIONS
// ==================================================
const speakerCondition = jsPsych.randomization.sampleWithoutReplacement(
  ["same_speaker", "new_same_group", "new_different_group"],
  1
)[0];

console.log("Speaker condition:", speakerCondition);

jsPsych.data.addProperties({
  speaker_condition: speakerCondition
});


// ==================================================
// ALIEN DEFINITIONS
// ==================================================
const ALIENS = {
  borp: {
    id: "borp",
    name: "Borp",
    color: "green",
    number: 1
  },

  lumi: {
    id: "lumi",
    name: "Lumi",
    color: "green",
    number: 2
  },

  zaza: {
    id: "zaza",
    name: "Zaza",
    color: "yellow",
    number: 1
  }
};

function getConditionAliens() {
  if (speakerCondition === "same_speaker") {
    return {
      introAlien: ALIENS.borp,
      taskAlien: ALIENS.borp,
      needsSwitchSlide: false
    };
  }

  if (speakerCondition === "new_same_group") {
    return {
      introAlien: ALIENS.borp,
      taskAlien: ALIENS.lumi,
      needsSwitchSlide: true
    };
  }

  if (speakerCondition === "new_different_group") {
    return {
      introAlien: ALIENS.borp,
      taskAlien: ALIENS.zaza,
      needsSwitchSlide: true
    };
  }

  throw new Error(`Unknown speaker condition: ${speakerCondition}`);
}

const CONDITION_ALIENS = getConditionAliens();

const PLANET_NAME = "Zorali";
const GUIDE_ALIEN = CONDITION_ALIENS.introAlien;
const TASK_ALIEN = CONDITION_ALIENS.taskAlien;
const ALIEN_HEIGHT = "24vh";

const NEW_INTRO_AUDIO_DIR = "stimuli/audio/intro";

const INTRO_SCRIPT = {
  intro_1: `Welcome to the planet Zorali. This is a planet in outer space, and I am going to tell you a little bit about it. A lot of aliens live here. I am going to tell you about two special groups of aliens.`,
  intro_astronomers: `First, I will tell you about the astronomer aliens. You can tell if an alien is an astronomer alien because they are all yellow. The astronomer aliens love to look at stars and planets through telescopes. Sometimes, they discover new planets or stars. Being an astronomer is a hard job, and you need to go to astronomer school for a long time to do it.`,
  intro_forest_rangers: `Now, I'll tell you about another group of special aliens. These aliens are forest rangers, and their main job is to take care of all sorts of animals. You can tell if an alien is a forest ranger because they are all green. The forest ranger aliens love to take care of all sorts of different animals. Sometimes, they discover new animals. Being a forest ranger is a hard job, and you need to go to forest ranger school for a long time to do it.`,
  intro_2: `Here is a green alien named Borp. Borp is going to tell you about some of the interesting animals the forest rangers take care of on this planet.`,
  intro_star_poofle: `Hi there, I'm glad you are interested in learning more about some of the animals that live on this planet. First, I'll tell you about the star poofle. Star poofles are very interesting animals. They live in the forest on our planet. They like to run around very quickly, and they can also fly. Can you say star poofle?`,
  intro_star_berry: `Next, I'll tell you about what star poofles love to eat. This is a star berry. Star poofles love to eat star berries. Star berries are sweet fruits that grow on bushes in the forest on our planet. Can you say star berry?`,
  intro_additional: `Additional item introduction screen.`,
  intro_astro_tweeter: `Here is another animal. This is an astro tweeter. Astro tweeters are also interesting animals, and they live in the forest on our planet too. They live in nests that they build in trees, and they like to fly around. Can you say astro tweeter?`,
  intro_astro_leaf: `Next, I'll tell you about what astro tweeters love to eat. This is astro leaf. Astro tweeters love to eat astro leaf. Astro leaf is a crunchy vegetable that grows in the ground in the forest on our planet. Can you say astro leaf?`,
  intro_reminder: `Reminder screen after all items are introduced.`,
  intro_jars_same: `Now, you are going to help Borp sort some jars.`,
  intro_jars_new: `Now, let's meet a new alien. You are going to help this alien sort some jars.`,
  intro_jar_again: `Jar game reminder before the second jar block.`
};


// ==================================================
// EXPERIMENT COUNTS
// ==================================================
const N_PRACTICE_NORMAL = 2;
const N_FILLER_BLOCK1 = 3;
const N_FILLER_BLOCK2 = 2;
const N_CRITICAL_BLOCK1 = 1;
const N_CRITICAL_BLOCK2 = 1;

const TOTAL_NONREPEATING_FILLER_TRIALS =
  N_PRACTICE_NORMAL + N_FILLER_BLOCK1 + N_FILLER_BLOCK2;
const REQUIRED_FILLER_OBJECTS = TOTAL_NONREPEATING_FILLER_TRIALS * 2;


// ==================================================
// STIMULUS LISTS
// ==================================================
const FILLER_OBJECTS = [
  "bear",
  "bird",
  "bus",
  "car",
  "cookie",
  "dog",
  "duck",
  "fish",
  "hat",
  "shoe",
  "spoon",
  "strawberry",
  "train",
  "tree"
];

const TARGET_OBJECTS = [
  "star_berry",
  "star_poofle",
  "astro_tweeter",
  "astro_leaf"
];

const DISTRACTOR_OBJECTS =
  EXP_CONFIG.distractorVersion === "alien"
    ? ["cake", "elephant"]
    : ["banana", "cat"];

if (FILLER_OBJECTS.length < REQUIRED_FILLER_OBJECTS) {
  throw new Error(
    `You need at least ${REQUIRED_FILLER_OBJECTS} filler objects to avoid repeats across ${TOTAL_NONREPEATING_FILLER_TRIALS} practice+filler trials, but only provided ${FILLER_OBJECTS.length}.`
  );
}


// ==================================================
// HELPERS
// ==================================================
function getAlienSrc(color, number) {
  return `images/aliens/alien_${color}_${number}.png`;
}

function getObjectSrc(objectType, objectName) {
  if (!objectName) return null;

  if (objectName.includes("/")) {
    return objectName;
  }

  return `stimuli/objects/${objectType}/${objectName}.png`;
}

function getJarColorFromSide(side) {
  if (!side) return null;
  const jars = getJarSources();
  const src = side === "left" ? jars.left : jars.right;
  return src.includes("orange") ? "orange" : "purple";
}

function getSideForJarColor(color) {
  const jars = getJarSources();
  if (jars.left.includes(color)) return "left";
  if (jars.right.includes(color)) return "right";
  return null;
}

function getOtherSide(side) {
  return side === "left" ? "right" : "left";
}

function getRandomSide() {
  return Math.random() < 0.5 ? "left" : "right";
}

function getNewIntroAudioPath(introName) {
  return `${NEW_INTRO_AUDIO_DIR}/${introName}.mp3`;
}


// ==================================================
// AUDIO PATH HELPERS
// ==================================================
function getConditionAudioAlienFolder() {
  if (speakerCondition === "same_speaker") {
    return "alien_1";
  }

  if (speakerCondition === "new_same_group") {
    return "alien_2";
  }

  if (speakerCondition === "new_different_group") {
    return "alien_3";
  }

  throw new Error(`Unknown speaker condition: ${speakerCondition}`);
}

function getConditionCloudAudio() {
  if (speakerCondition === "same_speaker") {
    return "stimuli/audio/intro/cloud_1.mp3";
  }

  if (speakerCondition === "new_same_group") {
    return "stimuli/audio/intro/cloud_2.mp3";
  }

  if (speakerCondition === "new_different_group") {
    return "stimuli/audio/intro/cloud_3.mp3";
  }

  throw new Error(`Unknown speaker condition: ${speakerCondition}`);
}

function getFillerAudioSrc(objectName) {
  if (!objectName) return null;
  const alienFolder = getConditionAudioAlienFolder();
  return `stimuli/audio/${alienFolder}/filler/${objectName.toLowerCase()}.mp3`;
}

function getCriticalAudio(targetObject) {
  const alienFolder = getConditionAudioAlienFolder();

  if (targetObject === "star_berry") {
    return `stimuli/audio/${alienFolder}/target/${LABEL_VERSION}_${EXP_CONFIG.criticalAudioSuffix}.mp3`;
  }

  if (targetObject === "star_poofle") {
    return `stimuli/audio/${alienFolder}/target/animal_${EXP_CONFIG.criticalAudioSuffix}.mp3`;
  }

  if (targetObject === "astro_tweeter") {
    return `stimuli/audio/${alienFolder}/target/bird_${EXP_CONFIG.criticalAudioSuffix}.mp3`;
  }

  if (targetObject === "astro_leaf") {
    return `stimuli/audio/${alienFolder}/target/vegetable_${EXP_CONFIG.criticalAudioSuffix}.mp3`;
  }

  return null;
}

function getJarsIntroAudio() {
  if (speakerCondition === "same_speaker") {
    return getNewIntroAudioPath("intro_jars_same");
  }

  if (speakerCondition === "new_same_group" || speakerCondition === "new_different_group") {
    return getNewIntroAudioPath("intro_jars_new");
  }

  return null;
}


// ==================================================
// FIXED CLOUD SIDE FOR WHOLE CLOUD PHASE
// ==================================================
const fixedCloudCoveredSide = EXP_CONFIG.useCloud ? getRandomSide() : null;

jsPsych.data.addProperties({
  fixed_cloud_covered_side: fixedCloudCoveredSide,
  fixed_cloud_covered_jar: fixedCloudCoveredSide ? getJarColorFromSide(fixedCloudCoveredSide) : null
});

console.log("Fixed cloud covered side:", fixedCloudCoveredSide);


// ==================================================
// PRELOAD
// ==================================================
const IMAGE_PRELOAD = [
  "images/background.png",

  ...(EXP_CONFIG.useCloud ? ["images/cloud.png"] : []),

  "images/aliens/alien_green_1.png",
  "images/aliens/alien_green_2.png",
  "images/aliens/alien_green_3.png",
  "images/aliens/alien_green_4.png",
  "images/aliens/alien_yellow_1.png",
  "images/aliens/alien_yellow_2.png",
  "images/aliens/alien_yellow_3.png",
  "images/aliens/alien_yellow_4.png",

  "stimuli/jars/orange_jar.png",
  "stimuli/jars/purple_jar.png",

  "images/astronomer.png",
  "images/forest_ranger.png",

  ...FILLER_OBJECTS.map(obj => `stimuli/objects/filler/${obj}.png`),
  ...TARGET_OBJECTS.map(obj => `stimuli/objects/target/${obj}.png`),
  ...DISTRACTOR_OBJECTS.map(obj => `stimuli/objects/distractor/${obj}.png`)
];

const AUDIO_PRELOAD = [
  ...FILLER_OBJECTS.map(obj => getFillerAudioSrc(obj)),

  getCriticalAudio("star_berry"),
  getCriticalAudio("star_poofle"),
  getCriticalAudio("astro_tweeter"),
  getCriticalAudio("astro_leaf"),

  getNewIntroAudioPath("intro_1"),
  getNewIntroAudioPath("intro_astronomers"),
  getNewIntroAudioPath("intro_forest_rangers"),
  getNewIntroAudioPath("intro_2"),
  getNewIntroAudioPath("intro_star_poofle"),
  getNewIntroAudioPath("intro_star_berry"),
  getNewIntroAudioPath("intro_additional"),
  getNewIntroAudioPath("intro_astro_tweeter"),
  getNewIntroAudioPath("intro_astro_leaf"),
  getNewIntroAudioPath("intro_reminder"),
  getNewIntroAudioPath("intro_jars_same"),
  getNewIntroAudioPath("intro_jars_new"),
  getNewIntroAudioPath("intro_jar_again"),

  ...(EXP_CONFIG.useCloud ? [getConditionCloudAudio()] : [])
];

function makePreloadTrial() {
  return {
    type: jsPsychPreload,
    images: IMAGE_PRELOAD,
    audio: AUDIO_PRELOAD,
    show_progress_bar: true,
    message: "Loading..."
  };
}


// ==================================================
// AUDIO HELPERS
// ==================================================
function playTrialAudio(audioFile, onEnded = null) {
  if (!audioFile) return null;

  const audio = new Audio(audioFile);

  if (onEnded) {
    audio.addEventListener("ended", onEnded);
  }

  audio.play().catch(err => {
    console.warn("Audio failed or was blocked:", err);
    if (onEnded) onEnded();
  });

  return audio;
}

function stopTrialAudio(audioObj) {
  if (audioObj) {
    audioObj.pause();
    audioObj.currentTime = 0;
  }
}

function setupIntroAudioAndNext(audio) {
  const nextBtn = document.getElementById("introNextButton");

  function enableNext() {
    if (!nextBtn) return;
    nextBtn.disabled = false;
    nextBtn.style.opacity = "1";
    nextBtn.style.cursor = "pointer";
  }

  function disableNext() {
    if (!nextBtn) return;
    nextBtn.disabled = true;
    nextBtn.style.opacity = "0.5";
    nextBtn.style.cursor = "not-allowed";
  }

  if (nextBtn) {
    nextBtn.onclick = () => {
      if (!nextBtn.disabled) {
        jsPsych.finishTrial();
      }
    };
  }

  // DEBUG VERSION: never lock the Next button
  if (DEBUG_BYPASS_AUDIO_LOCK) {
    enableNext();

    if (audio) {
      window.currentIntroAudio = new Audio(audio);
      window.currentIntroAudio.play().catch(err => {
        console.warn("Intro audio failed or was blocked:", err);
      });
    }
    return;
  }

  if (audio) {
    disableNext();

    window.currentIntroAudio = new Audio(audio);
    window.currentIntroAudio.addEventListener("ended", enableNext);

    window.currentIntroAudio.play().catch(err => {
      console.warn("Intro audio failed or was blocked:", err);
      enableNext();
    });
  } else {
    enableNext();
  }
}

function cleanupIntroAudio() {
  if (window.currentIntroAudio) {
    window.currentIntroAudio.pause();
    window.currentIntroAudio.currentTime = 0;
    window.currentIntroAudio = null;
  }
}


// ==================================================
// CERTAINTY BUTTONS
// ==================================================
function renderCertaintyControls() {
  return `
    <div id="certaintyContainer" style="
      position:absolute;
      top:29%;
      left:50%;
      transform:translateX(-50%);
      display:flex;
      gap:2vw;
      z-index:100;
      pointer-events:auto;
    ">
      <button
        id="notSureBtn"
        style="
          font-size:24px;
          padding:12px 24px;
          border-radius:12px;
          cursor:pointer;
          pointer-events:auto;
        "
      >
        Not sure
      </button>

      <button
        id="sureBtn"
        style="
          font-size:24px;
          padding:12px 24px;
          border-radius:12px;
          cursor:pointer;
          pointer-events:auto;
        "
      >
        Sure
      </button>
    </div>
  `;
}


// ==================================================
// INTRO RENDERERS
// ==================================================
function renderAllAliensIntroScreen({
  text = "",
  alienGroup = "both",
  illustrationSrc = null,
  showNextButton = true
} = {}) {
  const leftAliens = [
    "images/aliens/alien_green_1.png",
    "images/aliens/alien_green_2.png",
    "images/aliens/alien_green_3.png",
    "images/aliens/alien_green_4.png"
  ];

  const rightAliens = [
    "images/aliens/alien_yellow_1.png",
    "images/aliens/alien_yellow_2.png",
    "images/aliens/alien_yellow_3.png",
    "images/aliens/alien_yellow_4.png"
  ];

  return `
    <div style="position:fixed; inset:0; overflow:hidden;">
      <img
        src="images/background.png"
        style="
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          object-fit:cover;
        "
      >

      <div style="
        position:absolute;
        top:15%;
        left:50%;
        transform:translateX(-50%);
        width:70%;
        text-align:center;
        font-size:3vw;
        line-height:1.6;
        color:white;
        text-shadow:3px 3px 6px rgba(0,0,0,0.7);
        z-index:10;
      ">
        ${text}
      </div>

      ${illustrationSrc ? `
        <div style="
          position:absolute;
          left:50%;
          top:55%;
          transform:translate(-50%, -50%);
          z-index:10;
        ">
          <img
            src="${illustrationSrc}"
            style="
              height:42vh;
              max-width:44vw;
              object-fit:contain;
              display:block;
            "
          >
        </div>
      ` : `<div style="
        position:absolute;
        bottom:18%;
        left:50%;
        transform:translateX(-50%);
        width:88%;
        display:flex;
        justify-content:${alienGroup === "both" ? "space-between" : "center"};
        align-items:flex-end;
        z-index:10;
      ">
        ${alienGroup !== "yellow" ? `<div style="
          display:flex;
          gap:1.5vw;
          align-items:flex-end;
        ">
          ${leftAliens.map(src => `
            <img
              src="${src}"
              style="
                height:${ALIEN_HEIGHT};
                object-fit:contain;
                display:block;
              "
            >
          `).join("")}
        </div>` : ""}

        ${alienGroup !== "green" ? `<div style="
          display:flex;
          gap:1.5vw;
          align-items:flex-end;
        ">
          ${rightAliens.map(src => `
            <img
              src="${src}"
              style="
                height:${ALIEN_HEIGHT};
                object-fit:contain;
                display:block;
              "
            >
          `).join("")}
        </div>` : ""}
      </div>`}

      ${showNextButton ? `
        <div style="
          position:absolute;
          bottom:6%;
          left:50%;
          transform:translateX(-50%);
          z-index:20;
        ">
          <button
            id="introNextButton"
            style="
              font-size:24px;
              padding:12px 28px;
              border-radius:12px;
              cursor:pointer;
            "
          >
            Next →
          </button>
        </div>
      ` : ""}
    </div>
  `;
}

function renderSingleAlienIntroScreen({
  text = "",
  alienColor = "green",
  alienNumber = 1,
  showNextButton = true
} = {}) {
  const alienSrc = getAlienSrc(alienColor, alienNumber);

  return `
    <div style="position:fixed; inset:0; overflow:hidden;">
      <img
        src="images/background.png"
        style="
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          object-fit:cover;
        "
      >

      <div style="
        position:absolute;
        top:15%;
        left:50%;
        transform:translateX(-50%);
        width:70%;
        text-align:center;
        font-size:3vw;
        line-height:1.6;
        color:white;
        text-shadow:3px 3px 6px rgba(0,0,0,0.7);
        z-index:10;
      ">
        ${text}
      </div>

      <div style="
        position:absolute;
        bottom:16%;
        left:50%;
        transform:translateX(-50%);
        z-index:10;
      ">
        <img
          src="${alienSrc}"
          style="
            height:${ALIEN_HEIGHT};
            object-fit:contain;
            display:block;
          "
        >
      </div>

      ${showNextButton ? `
        <div style="
          position:absolute;
          bottom:6%;
          left:50%;
          transform:translateX(-50%);
          z-index:20;
        ">
          <button
            id="introNextButton"
            style="
              font-size:24px;
              padding:12px 28px;
              border-radius:12px;
              cursor:pointer;
            "
          >
            Next →
          </button>
        </div>
      ` : ""}
    </div>
  `;
}

function renderAlienObjectIntroScreen({
  text = "",
  alienColor = "green",
  alienNumber = 1,
  objectType = null,
  objectName = null,
  showNextButton = true
} = {}) {
  const alienSrc = getAlienSrc(alienColor, alienNumber);
  const objectSrc = getObjectSrc(objectType, objectName);

  return `
    <div style="position:fixed; inset:0; overflow:hidden;">
      <img
        src="images/background.png"
        style="
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          object-fit:cover;
        "
      >

      <div style="
        position:absolute;
        top:12%;
        left:50%;
        transform:translateX(-50%);
        width:70%;
        text-align:center;
        font-size:3vw;
        line-height:1.6;
        color:white;
        text-shadow:3px 3px 6px rgba(0,0,0,0.7);
        z-index:10;
      ">
        ${text}
      </div>

      <div style="
        position:absolute;
        left:50%;
        top:48%;
        transform:translate(-50%, -50%);
        z-index:10;
      ">
        ${objectSrc ? `
          <img
            src="${objectSrc}"
            style="
              height:28vh;
              max-width:24vw;
              object-fit:contain;
              display:block;
            "
          >
        ` : ""}
      </div>

      <div style="
        position:absolute;
        left:50%;
        bottom:5%;
        transform:translateX(-50%);
        width:86%;
        max-width:1300px;
        display:flex;
        justify-content:flex-start;
        align-items:flex-end;
        z-index:10;
      ">
        <div style="
          width:18vw;
          max-width:220px;
          display:flex;
          justify-content:center;
          align-items:flex-end;
        ">
          <img
            src="${alienSrc}"
            style="
              height:${ALIEN_HEIGHT};
              object-fit:contain;
              display:block;
            "
          >
        </div>
      </div>

      ${showNextButton ? `
        <div style="
          position:absolute;
          bottom:6%;
          left:50%;
          transform:translateX(-50%);
          z-index:20;
        ">
          <button
            id="introNextButton"
            style="
              font-size:24px;
              padding:12px 28px;
              border-radius:12px;
              cursor:pointer;
            "
          >
            Next →
          </button>
        </div>
      ` : ""}
    </div>
  `;
}

function renderTwoAlienIntroScreen({
  text = "",
  leftAlienColor = "green",
  leftAlienNumber = 1,
  rightAlienColor = "green",
  rightAlienNumber = 2,
  showNextButton = true
} = {}) {
  const leftAlienSrc = getAlienSrc(leftAlienColor, leftAlienNumber);
  const rightAlienSrc = getAlienSrc(rightAlienColor, rightAlienNumber);

  return `
    <div style="position:fixed; inset:0; overflow:hidden;">
      <img
        src="images/background.png"
        style="
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          object-fit:cover;
        "
      >

      <div style="
        position:absolute;
        top:12%;
        left:50%;
        transform:translateX(-50%);
        width:70%;
        text-align:center;
        font-size:3vw;
        line-height:1.6;
        color:white;
        text-shadow:3px 3px 6px rgba(0,0,0,0.7);
        z-index:10;
      ">
        ${text}
      </div>

      <div style="
        position:absolute;
        bottom:16%;
        left:50%;
        transform:translateX(-50%);
        display:flex;
        gap:8vw;
        align-items:flex-end;
        z-index:10;
      ">
        <img
          src="${leftAlienSrc}"
          style="
            height:${ALIEN_HEIGHT};
            object-fit:contain;
            display:block;
          "
        >

        <img
          src="${rightAlienSrc}"
          style="
            height:${ALIEN_HEIGHT};
            object-fit:contain;
            display:block;
          "
        >
      </div>

      ${showNextButton ? `
        <div style="
          position:absolute;
          bottom:6%;
          left:50%;
          transform:translateX(-50%);
          z-index:20;
        ">
          <button
            id="introNextButton"
            style="
              font-size:24px;
              padding:12px 28px;
              border-radius:12px;
              cursor:pointer;
            "
          >
            Next →
          </button>
        </div>
      ` : ""}
    </div>
  `;
}

function renderGameIntroWithJarsScreen({
  text = "",
  alienColor = "green",
  alienNumber = 1,
  showNextButton = true
} = {}) {
  const alienSrc = getAlienSrc(alienColor, alienNumber);
  const jars = getJarSources();

  return `
    <div style="position:fixed; inset:0; overflow:hidden;">
      <img
        src="images/background.png"
        style="
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          object-fit:cover;
        "
      >

      <div style="
        position:absolute;
        top:10%;
        left:50%;
        transform:translateX(-50%);
        width:72%;
        text-align:center;
        font-size:3vw;
        line-height:1.6;
        color:white;
        text-shadow:3px 3px 6px rgba(0,0,0,0.7);
        z-index:20;
      ">
        ${text}
      </div>

      <div style="
        position:absolute;
        left:50%;
        bottom:8%;
        transform:translateX(-50%);
        width:86%;
        max-width:1300px;
        display:flex;
        align-items:flex-end;
        justify-content:center;
        gap:14vw;
        z-index:10;
      ">
        <div style="
          width:22vw;
          max-width:260px;
          display:flex;
          justify-content:center;
          align-items:flex-end;
          height:42vh;
        ">
          <img
            src="${jars.left}"
            style="
              height:42vh;
              max-height:420px;
              object-fit:contain;
              display:block;
            "
          >
        </div>

        <div style="
          width:18vw;
          max-width:220px;
          display:flex;
          justify-content:center;
          align-items:flex-end;
        ">
          <img
            src="${alienSrc}"
            style="
              height:${ALIEN_HEIGHT};
              object-fit:contain;
              display:block;
            "
          >
        </div>

        <div style="
          width:22vw;
          max-width:260px;
          display:flex;
          justify-content:center;
          align-items:flex-end;
          height:42vh;
        ">
          <img
            src="${jars.right}"
            style="
              height:42vh;
              max-height:420px;
              object-fit:contain;
              display:block;
            "
          >
        </div>
      </div>

      ${showNextButton ? `
        <div style="
          position:absolute;
          bottom:4%;
          left:50%;
          transform:translateX(-50%);
          z-index:20;
        ">
          <button
            id="introNextButton"
            style="
              font-size:24px;
              padding:12px 28px;
              border-radius:12px;
              cursor:pointer;
            "
          >
            Next →
          </button>
        </div>
      ` : ""}
    </div>
  `;
}

function renderCloudIntroScreen({
  text = "",
  alienColor = "green",
  alienNumber = 1,
  showNextButton = true
} = {}) {
  const alienSrc = getAlienSrc(alienColor, alienNumber);
  const jars = getJarSources();

  return `
    <div style="position:fixed; inset:0; overflow:hidden;">
      <img
        src="images/background.png"
        style="
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          object-fit:cover;
        "
      >

      <div style="
        position:absolute;
        top:6%;
        left:50%;
        transform:translateX(-50%);
        width:72%;
        text-align:center;
        font-size:3vw;
        line-height:1.6;
        color:white;
        text-shadow:3px 3px 6px rgba(0,0,0,0.7);
        z-index:20;
      ">
        ${text}
      </div>

      <div style="
        position:absolute;
        left:50%;
        bottom:5%;
        transform:translateX(-50%);
        width:86%;
        max-width:1300px;
        display:flex;
        align-items:flex-end;
        justify-content:center;
        gap:14vw;
        z-index:10;
      ">

        <div style="
          width:22vw;
          max-width:260px;
          display:flex;
          flex-direction:column;
          align-items:center;
        ">
          <div style="
            position:relative;
            width:100%;
            height:42vh;
            max-height:420px;
            display:flex;
            justify-content:center;
            align-items:flex-end;
          ">
            <img
              src="${jars.left}"
              style="
                height:42vh;
                max-height:420px;
                object-fit:contain;
                display:block;
                position:absolute;
                bottom:0;
                left:50%;
                transform:translateX(-50%);
                z-index:12;
              "
            >

            ${fixedCloudCoveredSide === "left" ? `
              <img
                src="images/cloud.png"
                style="
                  position:absolute;
                  left:50%;
                  top:-3%;
                  transform:translateX(-50%);
                  width:155%;
                  max-width:none;
                  z-index:25;
                  opacity:0.96;
                  pointer-events:none;
                "
              >
            ` : ""}
          </div>
        </div>

        <div style="
          width:18vw;
          max-width:220px;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:flex-end;
        ">
          <img
            src="${alienSrc}"
            style="
              height:${ALIEN_HEIGHT};
              object-fit:contain;
              display:block;
            "
          >
        </div>

        <div style="
          width:22vw;
          max-width:260px;
          display:flex;
          flex-direction:column;
          align-items:center;
        ">
          <div style="
            position:relative;
            width:100%;
            height:42vh;
            max-height:420px;
            display:flex;
            justify-content:center;
            align-items:flex-end;
          ">
            <img
              src="${jars.right}"
              style="
                height:42vh;
                max-height:420px;
                object-fit:contain;
                display:block;
                position:absolute;
                bottom:0;
                left:50%;
                transform:translateX(-50%);
                z-index:12;
              "
            >

            ${fixedCloudCoveredSide === "right" ? `
              <img
                src="images/cloud.png"
                style="
                  position:absolute;
                  left:50%;
                  top:-3%;
                  transform:translateX(-50%);
                  width:155%;
                  max-width:none;
                  z-index:25;
                  opacity:0.96;
                  pointer-events:none;
                "
              >
            ` : ""}
          </div>
        </div>
      </div>

      ${showNextButton ? `
        <div style="
          position:absolute;
          bottom:4%;
          left:50%;
          transform:translateX(-50%);
          z-index:20;
        ">
          <button
            id="introNextButton"
            style="
              font-size:24px;
              padding:12px 28px;
              border-radius:12px;
              cursor:pointer;
            "
          >
            Next →
          </button>
        </div>
      ` : ""}
    </div>
  `;
}

function renderJobReminderIntroScreen({
  showNextButton = true
} = {}) {
  return `
    <div style="position:fixed; inset:0; overflow:hidden;">
      <img
        src="images/background.png"
        style="
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          object-fit:cover;
        "
      >

      <div style="
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%, -50%);
        width:min(86vw, 1100px);
        display:flex;
        justify-content:center;
        align-items:center;
        gap:8vw;
        z-index:10;
      ">
        <img
          src="images/astronomer.png"
          style="
            height:44vh;
            max-width:40vw;
            object-fit:contain;
            display:block;
          "
        >

        <img
          src="images/forest_ranger.png"
          style="
            height:44vh;
            max-width:40vw;
            object-fit:contain;
            display:block;
          "
        >
      </div>

      ${showNextButton ? `
        <div style="
          position:absolute;
          bottom:6%;
          left:50%;
          transform:translateX(-50%);
          z-index:20;
        ">
          <button
            id="introNextButton"
            style="
              font-size:24px;
              padding:12px 28px;
              border-radius:12px;
              cursor:pointer;
            "
          >
            Next →
          </button>
        </div>
      ` : ""}
    </div>
  `;
}


// ==================================================
// MAIN SCENE RENDERER
// ==================================================
function renderAlienJarScene({
  headerText = "",
  alienColor = "green",
  alienNumber = 1,

  leftObjectType = null,
  leftObject = null,
  rightObjectType = null,
  rightObject = null,

  showChoiceButtons = true,
  showCertaintyButtons = false,
  feedbackText = "",

  cloudCoveredSide = null
} = {}) {
  const alienSrc = getAlienSrc(alienColor, alienNumber);
  const jars = getJarSources();

  const shouldHideLeftObject = EXP_CONFIG.useCloud && cloudCoveredSide === "left";
  const shouldHideRightObject = EXP_CONFIG.useCloud && cloudCoveredSide === "right";

  const leftObjectSrc = shouldHideLeftObject ? null : getObjectSrc(leftObjectType, leftObject);
  const rightObjectSrc = shouldHideRightObject ? null : getObjectSrc(rightObjectType, rightObject);

  const leftLabel = jars.left.includes("orange") ? "The orange jar" : "The purple jar";
  const rightLabel = jars.right.includes("orange") ? "The orange jar" : "The purple jar";

  return `
    <div id="sceneRoot" style="position:fixed; inset:0; overflow:hidden;">

      <style>
        .feedback-correct {
          animation: pulseCorrect 0.6s ease-in-out 2;
        }

        .feedback-wrong {
          animation: shakeWrong 0.5s ease-in-out 2;
        }

        @keyframes pulseCorrect {
          0% { transform: scale(1); }
          50% { transform: scale(1.12); }
          100% { transform: scale(1); }
        }

        @keyframes shakeWrong {
          0% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
          100% { transform: translateX(0); }
        }
      </style>

      <img
        src="images/background.png"
        style="
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          object-fit:cover;
        "
      >

      <div id="headerText" style="
        position:absolute;
        top:6%;
        left:50%;
        transform:translateX(-50%);
        width:72%;
        text-align:center;
        font-size:3vw;
        line-height:1.6;
        color:white;
        text-shadow:3px 3px 6px rgba(0,0,0,0.7);
        z-index:20;
      ">
        ${headerText}
      </div>

      ${showCertaintyButtons ? renderCertaintyControls() : ""}

      <div id="feedbackText" style="
        position:absolute;
        top:${showCertaintyButtons ? "39%" : "24%"};
        left:50%;
        transform:translateX(-50%);
        width:70%;
        text-align:center;
        font-size:2vw;
        line-height:1.5;
        color:white;
        text-shadow:3px 3px 6px rgba(0,0,0,0.7);
        z-index:30;
        min-height:2em;
      ">
        ${feedbackText}
      </div>

      <div style="
        position:absolute;
        left:50%;
        bottom:5%;
        transform:translateX(-50%);
        width:86%;
        max-width:1300px;
        display:flex;
        align-items:flex-end;
        justify-content:center;
        gap:14vw;
        z-index:10;
      ">

        <div style="
          width:22vw;
          max-width:260px;
          display:flex;
          flex-direction:column;
          align-items:center;
        ">
          <div style="
            position:relative;
            width:100%;
            height:42vh;
            max-height:420px;
            display:flex;
            justify-content:center;
            align-items:flex-end;
          ">
            <img
              id="leftJar"
              src="${jars.left}"
              style="
                height:42vh;
                max-height:420px;
                object-fit:contain;
                display:block;
                position:absolute;
                bottom:0;
                left:50%;
                transform:translateX(-50%);
                z-index:12;
              "
            >

            ${leftObjectSrc ? `
              <img
                id="leftObject"
                src="${leftObjectSrc}"
                style="
                  position:absolute;
                  left:50%;
                  bottom:10%;
                  transform:translateX(-50%);
                  height:14vh;
                  max-height:130px;
                  max-width:70%;
                  object-fit:contain;
                  z-index:13;
                  pointer-events:none;
                "
              >
            ` : ""}

            ${EXP_CONFIG.useCloud && cloudCoveredSide === "left" ? `
              <img
                src="images/cloud.png"
                style="
                  position:absolute;
                  left:50%;
                  top:-3%;
                  transform:translateX(-50%);
                  width:155%;
                  max-width:none;
                  z-index:25;
                  opacity:0.96;
                  pointer-events:none;
                "
              >
            ` : ""}
          </div>

          ${showChoiceButtons ? `
            <button
              id="leftChoice"
              style="
                margin-top:12px;
                font-size:22px;
                padding:10px 20px;
                border-radius:12px;
                cursor:pointer;
                z-index:40;
              "
            >
              ${leftLabel}
            </button>
          ` : ""}
        </div>

        <div style="
          width:18vw;
          max-width:220px;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:flex-end;
        ">
          <img
            src="${alienSrc}"
            style="
              height:${ALIEN_HEIGHT};
              object-fit:contain;
              display:block;
            "
          >
        </div>

        <div style="
          width:22vw;
          max-width:260px;
          display:flex;
          flex-direction:column;
          align-items:center;
        ">
          <div style="
            position:relative;
            width:100%;
            height:42vh;
            max-height:420px;
            display:flex;
            justify-content:center;
            align-items:flex-end;
          ">
            <img
              id="rightJar"
              src="${jars.right}"
              style="
                height:42vh;
                max-height:420px;
                object-fit:contain;
                display:block;
                position:absolute;
                bottom:0;
                left:50%;
                transform:translateX(-50%);
                z-index:12;
              "
            >

            ${rightObjectSrc ? `
              <img
                id="rightObject"
                src="${rightObjectSrc}"
                style="
                  position:absolute;
                  left:50%;
                  bottom:10%;
                  transform:translateX(-50%);
                  height:14vh;
                  max-height:130px;
                  max-width:70%;
                  object-fit:contain;
                  z-index:13;
                  pointer-events:none;
                "
              >
            ` : ""}

            ${EXP_CONFIG.useCloud && cloudCoveredSide === "right" ? `
              <img
                src="images/cloud.png"
                style="
                  position:absolute;
                  left:50%;
                  top:-3%;
                  transform:translateX(-50%);
                  width:155%;
                  max-width:none;
                  z-index:25;
                  opacity:0.96;
                  pointer-events:none;
                "
              >
            ` : ""}
          </div>

          ${showChoiceButtons ? `
            <button
              id="rightChoice"
              style="
                margin-top:12px;
                font-size:22px;
                padding:10px 20px;
                border-radius:12px;
                cursor:pointer;
                z-index:40;
              "
            >
              ${rightLabel}
            </button>
          ` : ""}
        </div>
      </div>
    </div>
  `;
}


// ==================================================
// LABEL TEST RENDERER
// ==================================================
function renderObjectNamingScreen({
  headerText = "Do you remember the name of this object?",
  alienColor = "green",
  alienNumber = 1,
  objectType = null,
  objectName = null
} = {}) {
  const objectSrc = getObjectSrc(objectType, objectName);

  return `
    <div style="position:fixed; inset:0; overflow:hidden;">
      <img
        src="images/background.png"
        style="
          position:absolute;
          inset:0;
          width:100%;
          height:100%;
          object-fit:cover;
        "
      >

      <div style="
        position:absolute;
        top:10%;
        left:50%;
        transform:translateX(-50%);
        width:70%;
        text-align:center;
        font-size:3vw;
        line-height:1.6;
        color:white;
        text-shadow:3px 3px 6px rgba(0,0,0,0.7);
        z-index:10;
      ">
        ${headerText}
      </div>

      <div style="
        position:absolute;
        left:50%;
        top:45%;
        transform:translate(-50%, -50%);
        z-index:10;
      ">
        ${objectSrc ? `
          <img
            src="${objectSrc}"
            style="
              height:28vh;
              max-width:24vw;
              object-fit:contain;
              display:block;
            "
          >
        ` : ""}
      </div>

      <div style="
        position:absolute;
        left:50%;
        top:68%;
        transform:translateX(-50%);
        width:70%;
        text-align:center;
        z-index:20;
      ">
        <input
          id="objectNameInput"
          type="text"
          autocomplete="off"
          style="
            width:60%;
            max-width:500px;
            font-size:24px;
            padding:12px 16px;
            border-radius:12px;
            border:2px solid #ccc;
            box-sizing:border-box;
          "
        >
      </div>

      <div style="
        position:absolute;
        bottom:8%;
        left:50%;
        transform:translateX(-50%);
        z-index:20;
      ">
        <button
          id="objectNameNextButton"
          style="
            font-size:24px;
            padding:12px 28px;
            border-radius:12px;
            cursor:pointer;
          "
        >
          Next →
        </button>
      </div>

    </div>
  `;
}


// ==================================================
// SHARED DATA HELPER
// ==================================================
function getTrialDataBase() {
  const jars = getJarSources();

  return {
    jar_condition: jarCondition,
    speaker_condition: speakerCondition,
    left_jar: jars.left,
    right_jar: jars.right,
    fixed_cloud_covered_side: fixedCloudCoveredSide,
    fixed_cloud_covered_jar: fixedCloudCoveredSide ? getJarColorFromSide(fixedCloudCoveredSide) : null
  };
}


// ==================================================
// NON-REPEATING FILLER PAIR GENERATOR
// ==================================================
function generateNonRepeatingFillerPairs(objects, nTrials) {
  if (objects.length < nTrials * 2) {
    throw new Error(
      `Need ${nTrials * 2} filler objects for ${nTrials} non-repeating trials, but only got ${objects.length}.`
    );
  }

  const shuffled = jsPsych.randomization.shuffle([...objects]);
  const pairs = [];

  for (let i = 0; i < nTrials; i++) {
    const obj1 = shuffled[i * 2];
    const obj2 = shuffled[i * 2 + 1];
    const swap = Math.random() < 0.5;

    pairs.push({
      leftObjectType: "filler",
      leftObject: swap ? obj2 : obj1,
      rightObjectType: "filler",
      rightObject: swap ? obj1 : obj2
    });
  }

  return pairs;
}


// ==================================================
// CONFIG BUILDERS
// ==================================================
function buildPracticeAndFillerConfigs(fillerObjects) {
  const allPairs = generateNonRepeatingFillerPairs(
    fillerObjects,
    TOTAL_NONREPEATING_FILLER_TRIALS
  );

  const practicePairs = allPairs.slice(0, N_PRACTICE_NORMAL);
  const fillerBlock1Pairs = allPairs.slice(
    N_PRACTICE_NORMAL,
    N_PRACTICE_NORMAL + N_FILLER_BLOCK1
  );
  const fillerBlock2Pairs = allPairs.slice(
    N_PRACTICE_NORMAL + N_FILLER_BLOCK1,
    N_PRACTICE_NORMAL + N_FILLER_BLOCK1 + N_FILLER_BLOCK2
  );

  const practiceConfigs = practicePairs.map((pair, i) => {
    const correctJarColor = Math.random() < 0.5 ? "orange" : "purple";
    const correctSide = getSideForJarColor(correctJarColor);
    const targetObject = correctSide === "left" ? pair.leftObject : pair.rightObject;

    return {
      phase: "practice_normal",
      headerText: i === 0 ? "Which jar should you pick?" : "Try another one.",
      alienId: TASK_ALIEN.id,
      alienName: TASK_ALIEN.name,
      alienColor: TASK_ALIEN.color,
      alienNumber: TASK_ALIEN.number,
      correctJarColor,
      correctSide,
      targetObject,
      audio: getFillerAudioSrc(targetObject),
      cloudCoveredSide: null,
      cloudCoveredJar: null,
      ...pair
    };
  });

  const fillerConfigsBlock1 = fillerBlock1Pairs.map((pair) => {
    const targetObject = Math.random() < 0.5 ? pair.leftObject : pair.rightObject;
    const cloudCoveredSide = EXP_CONFIG.useCloud ? fixedCloudCoveredSide : null;

    return {
      phase: EXP_CONFIG.useCloud ? "cloud_filler" : "filler",
      headerText: "Choose a jar.",
      alienId: TASK_ALIEN.id,
      alienName: TASK_ALIEN.name,
      alienColor: TASK_ALIEN.color,
      alienNumber: TASK_ALIEN.number,
      targetObject,
      audio: getFillerAudioSrc(targetObject),
      cloudCoveredSide,
      cloudCoveredJar: cloudCoveredSide ? getJarColorFromSide(cloudCoveredSide) : null,
      ...pair
    };
  });

  const fillerConfigsBlock2 = fillerBlock2Pairs.map((pair) => {
    const targetObject = Math.random() < 0.5 ? pair.leftObject : pair.rightObject;
    const cloudCoveredSide = EXP_CONFIG.useCloud ? fixedCloudCoveredSide : null;

    return {
      phase: EXP_CONFIG.useCloud ? "cloud_filler" : "filler",
      headerText: "Choose a jar.",
      alienId: TASK_ALIEN.id,
      alienName: TASK_ALIEN.name,
      alienColor: TASK_ALIEN.color,
      alienNumber: TASK_ALIEN.number,
      targetObject,
      audio: getFillerAudioSrc(targetObject),
      cloudCoveredSide,
      cloudCoveredJar: cloudCoveredSide ? getJarColorFromSide(cloudCoveredSide) : null,
      ...pair
    };
  });

  return {
    practiceConfigs,
    fillerConfigsBlock1,
    fillerConfigsBlock2
  };
}

function buildCriticalConfig(targetName, distractorName, blockLabel, trialIndex) {
  let targetSide;
  let distractorSide;
  let cloudCoveredSide = null;
  let cloudCoveredJar = null;

  if (EXP_CONFIG.useCloud) {
    cloudCoveredSide = fixedCloudCoveredSide;
    cloudCoveredJar = getJarColorFromSide(cloudCoveredSide);
    targetSide = getOtherSide(cloudCoveredSide);
    distractorSide = cloudCoveredSide;
  } else {
    targetSide = getRandomSide();
    distractorSide = getOtherSide(targetSide);
  }

  return {
    headerText: blockLabel,
    alienId: TASK_ALIEN.id,
    alienName: TASK_ALIEN.name,
    alienColor: TASK_ALIEN.color,
    alienNumber: TASK_ALIEN.number,

    leftObjectType: targetSide === "left" ? "target" : "distractor",
    leftObject: targetSide === "left" ? targetName : distractorName,

    rightObjectType: targetSide === "right" ? "target" : "distractor",
    rightObject: targetSide === "right" ? targetName : distractorName,

    targetObject: targetName,
    distractorObject: distractorName,
    targetSide: targetSide,
    distractorSide: distractorSide,

    audio: getCriticalAudio(targetName),

    phase: "critical",
    blockLabel: blockLabel,
    trialIndex: trialIndex,

    cloudCoveredSide: cloudCoveredSide,
    cloudCoveredJar: cloudCoveredJar
  };
}


// ==================================================
// NORMAL PRACTICE TRIALS
// ==================================================
function makePracticeTrials(configList) {
  return {
    timeline: [
      {
        type: jsPsychHtmlKeyboardResponse,
        choices: "NO_KEYS",

        data: function() {
          return {
            trial_type: "practice",
            trialKind: "practice",
            phase: jsPsych.timelineVariable("phase"),
            ...getTrialDataBase(),
            headerText: jsPsych.timelineVariable("headerText"),
            alienId: jsPsych.timelineVariable("alienId"),
            alienName: jsPsych.timelineVariable("alienName"),
            alienColor: jsPsych.timelineVariable("alienColor"),
            alienNumber: jsPsych.timelineVariable("alienNumber"),
            leftObjectType: jsPsych.timelineVariable("leftObjectType"),
            leftObject: jsPsych.timelineVariable("leftObject"),
            rightObjectType: jsPsych.timelineVariable("rightObjectType"),
            rightObject: jsPsych.timelineVariable("rightObject"),
            correctJarColor: jsPsych.timelineVariable("correctJarColor"),
            correctSide: jsPsych.timelineVariable("correctSide"),
            targetObject: jsPsych.timelineVariable("targetObject"),
            audio: jsPsych.timelineVariable("audio"),
            cloudCoveredSide: jsPsych.timelineVariable("cloudCoveredSide"),
            cloudCoveredJar: jsPsych.timelineVariable("cloudCoveredJar")
          };
        },

        stimulus: function() {
          return renderAlienJarScene({
            headerText: jsPsych.timelineVariable("headerText") || "",
            alienColor: jsPsych.timelineVariable("alienColor") || "green",
            alienNumber: jsPsych.timelineVariable("alienNumber") || 1,
            leftObjectType: jsPsych.timelineVariable("leftObjectType") || null,
            leftObject: jsPsych.timelineVariable("leftObject") || null,
            rightObjectType: jsPsych.timelineVariable("rightObjectType") || null,
            rightObject: jsPsych.timelineVariable("rightObject") || null,
            showChoiceButtons: true,
            showCertaintyButtons: false,
            feedbackText: "",
            cloudCoveredSide: jsPsych.timelineVariable("cloudCoveredSide") || null
          });
        },

        on_load: function() {
          const leftBtn = document.getElementById("leftChoice");
          const rightBtn = document.getElementById("rightChoice");
          const feedbackEl = document.getElementById("feedbackText");
          const correctJarColor = jsPsych.timelineVariable("correctJarColor");
          const audioFile = jsPsych.timelineVariable("audio");

          let currentAudio = playTrialAudio(audioFile);
          let nAttempts = 0;

          function disableButtons() {
            if (leftBtn) leftBtn.disabled = true;
            if (rightBtn) rightBtn.disabled = true;
          }

          function enableButtons() {
            if (leftBtn) leftBtn.disabled = false;
            if (rightBtn) rightBtn.disabled = false;
          }

          function clearFeedbackClasses() {
            if (leftBtn) leftBtn.classList.remove("feedback-correct", "feedback-wrong");
            if (rightBtn) rightBtn.classList.remove("feedback-correct", "feedback-wrong");
          }

          function handleChoice(choiceSide, btnEl) {
            const choiceJar = getJarColorFromSide(choiceSide);
            const correct = choiceJar === correctJarColor;

            nAttempts += 1;
            disableButtons();
            stopTrialAudio(currentAudio);
            clearFeedbackClasses();

            if (correct) {
              btnEl.classList.add("feedback-correct");
              if (feedbackEl) feedbackEl.textContent = "That's right!";

              setTimeout(() => {
                jsPsych.finishTrial({
                  choice_side: choiceSide,
                  choice_jar: choiceJar,
                  correct: true,
                  n_attempts: nAttempts
                });
              }, 1200);

            } else {
              btnEl.classList.add("feedback-wrong");
              if (feedbackEl) feedbackEl.textContent = "Not quite. Try again.";

              setTimeout(() => {
                clearFeedbackClasses();
                if (feedbackEl) feedbackEl.textContent = "";
                enableButtons();
                currentAudio = playTrialAudio(audioFile);
              }, 1200);
            }
          }

          if (leftBtn) leftBtn.onclick = () => handleChoice("left", leftBtn);
          if (rightBtn) rightBtn.onclick = () => handleChoice("right", rightBtn);
        }
      }
    ],
    timeline_variables: configList
  };
}


// ==================================================
// FILLER TRIALS
// ==================================================
function makeFillerTrials(configList) {
  return {
    timeline: [
      {
        type: jsPsychHtmlKeyboardResponse,
        choices: "NO_KEYS",

        data: function() {
          return {
            trial_type: "filler",
            trialKind: "filler",
            phase: jsPsych.timelineVariable("phase"),
            ...getTrialDataBase(),
            headerText: jsPsych.timelineVariable("headerText"),
            alienId: jsPsych.timelineVariable("alienId"),
            alienName: jsPsych.timelineVariable("alienName"),
            alienColor: jsPsych.timelineVariable("alienColor"),
            alienNumber: jsPsych.timelineVariable("alienNumber"),
            leftObjectType: jsPsych.timelineVariable("leftObjectType"),
            leftObject: jsPsych.timelineVariable("leftObject"),
            rightObjectType: jsPsych.timelineVariable("rightObjectType"),
            rightObject: jsPsych.timelineVariable("rightObject"),
            targetObject: jsPsych.timelineVariable("targetObject"),
            audio: jsPsych.timelineVariable("audio"),
            cloudCoveredSide: jsPsych.timelineVariable("cloudCoveredSide"),
            cloudCoveredJar: jsPsych.timelineVariable("cloudCoveredJar"),
            fillerTargetCovered: jsPsych.timelineVariable("fillerTargetCovered")
          };
        },

        stimulus: function() {
          return renderAlienJarScene({
            headerText: jsPsych.timelineVariable("headerText") || "",
            alienColor: jsPsych.timelineVariable("alienColor") || "green",
            alienNumber: jsPsych.timelineVariable("alienNumber") || 1,
            leftObjectType: jsPsych.timelineVariable("leftObjectType") || null,
            leftObject: jsPsych.timelineVariable("leftObject") || null,
            rightObjectType: jsPsych.timelineVariable("rightObjectType") || null,
            rightObject: jsPsych.timelineVariable("rightObject") || null,
            showChoiceButtons: true,
            showCertaintyButtons: false,
            cloudCoveredSide: jsPsych.timelineVariable("cloudCoveredSide") || null
          });
        },

        on_load: function() {
          const leftBtn = document.getElementById("leftChoice");
          const rightBtn = document.getElementById("rightChoice");
          const audioFile = jsPsych.timelineVariable("audio");

          let currentAudio = playTrialAudio(audioFile);

          if (leftBtn) {
            leftBtn.onclick = () => {
              stopTrialAudio(currentAudio);
              jsPsych.finishTrial({
                choice_side: "left",
                choice_jar: getJarColorFromSide("left")
              });
            };
          }

          if (rightBtn) {
            rightBtn.onclick = () => {
              stopTrialAudio(currentAudio);
              jsPsych.finishTrial({
                choice_side: "right",
                choice_jar: getJarColorFromSide("right")
              });
            };
          }
        }
      }
    ],
    timeline_variables: configList
  };
}


// ==================================================
// CRITICAL TRIALS
// ==================================================
function makeCriticalTrials(configList) {
  const singleConfig = configList.length === 1 ? configList[0] : null;

  return {
    timeline: [
      {
        type: jsPsychHtmlKeyboardResponse,
        choices: "NO_KEYS",

        data: function() {
          return {
            trial_type: "critical",
            trialKind: "critical",
            phase: jsPsych.timelineVariable("phase"),
            ...getTrialDataBase(),
            headerText: jsPsych.timelineVariable("headerText"),
            alienId: jsPsych.timelineVariable("alienId"),
            alienName: jsPsych.timelineVariable("alienName"),
            alienColor: jsPsych.timelineVariable("alienColor"),
            alienNumber: jsPsych.timelineVariable("alienNumber"),
            leftObjectType: jsPsych.timelineVariable("leftObjectType"),
            leftObject: jsPsych.timelineVariable("leftObject"),
            rightObjectType: jsPsych.timelineVariable("rightObjectType"),
            rightObject: jsPsych.timelineVariable("rightObject"),
            targetObject: jsPsych.timelineVariable("targetObject"),
            distractorObject: jsPsych.timelineVariable("distractorObject"),
            targetSide: jsPsych.timelineVariable("targetSide"),
            distractorSide: jsPsych.timelineVariable("distractorSide"),
            audio: jsPsych.timelineVariable("audio"),
            cloudCoveredSide: jsPsych.timelineVariable("cloudCoveredSide"),
            cloudCoveredJar: jsPsych.timelineVariable("cloudCoveredJar")
          };
        },

        stimulus: function() {
          return renderAlienJarScene({
            headerText: jsPsych.timelineVariable("headerText") || "",
            alienColor: jsPsych.timelineVariable("alienColor") || "green",
            alienNumber: jsPsych.timelineVariable("alienNumber") || 1,
            leftObjectType: jsPsych.timelineVariable("leftObjectType") || null,
            leftObject: jsPsych.timelineVariable("leftObject") || null,
            rightObjectType: jsPsych.timelineVariable("rightObjectType") || null,
            rightObject: jsPsych.timelineVariable("rightObject") || null,
            showChoiceButtons: true,
            showCertaintyButtons: false,
            cloudCoveredSide: jsPsych.timelineVariable("cloudCoveredSide") || null
          });
        },

        on_load: function() {
          const leftBtn = document.getElementById("leftChoice");
          const rightBtn = document.getElementById("rightChoice");
          const audioFile = singleConfig ? singleConfig.audio : jsPsych.timelineVariable("audio");

          let currentAudio = playTrialAudio(audioFile);
          let jarChoiceSide = null;
          let jarChoiceColor = null;

          function disableJarButtons() {
            if (leftBtn) leftBtn.disabled = true;
            if (rightBtn) rightBtn.disabled = true;
          }

          function finishCriticalTrial(certaintyDirection, certaintyStrength) {
            const currentTrial = jsPsych.getCurrentTrial ? jsPsych.getCurrentTrial() : {};
            const currentTrialData = currentTrial.data || {};
            const resolvedTrialData = singleConfig || currentTrialData;
            const targetSide = resolvedTrialData.targetSide || jsPsych.timelineVariable("targetSide");

            const chosenObject =
              jarChoiceSide === "left"
                ? resolvedTrialData.leftObject || jsPsych.timelineVariable("leftObject")
                : resolvedTrialData.rightObject || jsPsych.timelineVariable("rightObject");

            const isTargetChoice = jarChoiceSide === targetSide;

            stopTrialAudio(currentAudio);

            jsPsych.finishTrial({
              choice_side: jarChoiceSide,
              choice_jar: jarChoiceColor,
              chosen_object: chosenObject,
              target_side: targetSide,
              is_target_choice: isTargetChoice,
              certainty_direction: certaintyDirection,
              certainty_strength: certaintyStrength
            });
          }

          function showCertaintyButtons() {
            if (document.getElementById("certaintyContainer")) return;

            const scene = document.getElementById("sceneRoot");
            if (!scene) return;

            const headerEl = document.getElementById("headerText");
            if (headerEl) {
              headerEl.textContent = "How sure are you that you chose the right answer?";
            }

            scene.insertAdjacentHTML("beforeend", renderCertaintyControls());

            const sureBtn = document.getElementById("sureBtn");
            const notSureBtn = document.getElementById("notSureBtn");
            const certaintyContainer = document.getElementById("certaintyContainer");

            if (notSureBtn) {
              notSureBtn.onclick = () => {
                certaintyContainer.innerHTML = `
                  <button
                    id="veryNotSureBtn"
                    style="
                      font-size:24px;
                      padding:12px 24px;
                      border-radius:12px;
                      cursor:pointer;
                    "
                  >
                    Very not sure
                  </button>

                  <button
                    id="littleNotSureBtn"
                    style="
                      font-size:24px;
                      padding:12px 24px;
                      border-radius:12px;
                      cursor:pointer;
                    "
                  >
                    A little not sure
                  </button>
                `;

                document.getElementById("veryNotSureBtn").onclick = () => {
                  finishCriticalTrial("not_sure", "very");
                };

                document.getElementById("littleNotSureBtn").onclick = () => {
                  finishCriticalTrial("not_sure", "little");
                };
              };
            }

            if (sureBtn) {
              sureBtn.onclick = () => {
                certaintyContainer.innerHTML = `
                  <button
                    id="littleSureBtn"
                    style="
                      font-size:24px;
                      padding:12px 24px;
                      border-radius:12px;
                      cursor:pointer;
                    "
                  >
                    A little sure
                  </button>

                  <button
                    id="verySureBtn"
                    style="
                      font-size:24px;
                      padding:12px 24px;
                      border-radius:12px;
                      cursor:pointer;
                    "
                  >
                    Very sure
                  </button>
                `;

                document.getElementById("littleSureBtn").onclick = () => {
                  finishCriticalTrial("sure", "little");
                };

                document.getElementById("verySureBtn").onclick = () => {
                  finishCriticalTrial("sure", "very");
                };
              };
            }
          }
          if (leftBtn) {
            leftBtn.onclick = () => {
              jarChoiceSide = "left";
              jarChoiceColor = getJarColorFromSide("left");
              disableJarButtons();

              if (ASK_ARE_YOU_SURE) {
                showCertaintyButtons();
              } else {
                finishCriticalTrial(null, null);
              }
            };
          }

          if (rightBtn) {
            rightBtn.onclick = () => {
              jarChoiceSide = "right";
              jarChoiceColor = getJarColorFromSide("right");
              disableJarButtons();

              if (ASK_ARE_YOU_SURE) {
                showCertaintyButtons();
              } else {
                finishCriticalTrial(null, null);
              }
            };
          }
        }
      }
    ],
    timeline_variables: configList
  };
}


// ==================================================
// INTRO TRIALS
// ==================================================
function makeAllAliensIntroTrial(
  text,
  audio = null,
  scriptText = text,
  alienGroup = "both",
  illustrationSrc = null
) {
  return {
    type: jsPsychHtmlKeyboardResponse,
    choices: "NO_KEYS",
    stimulus: renderAllAliensIntroScreen({
      text,
      alienGroup,
      illustrationSrc,
      showNextButton: true
    }),
    data: {
      trial_type: "intro_all_aliens",
      speaker_condition: speakerCondition,
      intro_text: scriptText,
      audio: audio
    },
    on_load: function() {
      setupIntroAudioAndNext(audio);
    },
    on_finish: function() {
      cleanupIntroAudio();
    }
  };
}

function makeSingleAlienIntroTrial(text, alienColor, alienNumber, alienName, audio = null, scriptText = text) {
  return {
    type: jsPsychHtmlKeyboardResponse,
    choices: "NO_KEYS",
    stimulus: renderSingleAlienIntroScreen({
      text,
      alienColor,
      alienNumber,
      showNextButton: true
    }),
    data: {
      trial_type: "intro_single_alien",
      speaker_condition: speakerCondition,
      intro_text: scriptText,
      alien_name: alienName,
      alien_color: alienColor,
      alien_number: alienNumber,
      audio: audio
    },
    on_load: function() {
      setupIntroAudioAndNext(audio);
    },
    on_finish: function() {
      cleanupIntroAudio();
    }
  };
}

function makeObjectIntroTrial({
  text,
  alienColor = "green",
  alienNumber = 1,
  objectType = null,
  objectName = null,
  audio = null,
  scriptText = text
}) {
  return {
    type: jsPsychHtmlKeyboardResponse,
    choices: "NO_KEYS",
    stimulus: renderAlienObjectIntroScreen({
      text,
      alienColor,
      alienNumber,
      objectType,
      objectName,
      showNextButton: true
    }),
    data: {
      trial_type: "intro_object",
      speaker_condition: speakerCondition,
      intro_text: scriptText,
      alien_color: alienColor,
      alien_number: alienNumber,
      object_type: objectType,
      object_name: objectName,
      audio: audio
    },
    on_load: function() {
      setupIntroAudioAndNext(audio);
    },
    on_finish: function() {
      cleanupIntroAudio();
    }
  };
}

function makeTwoAlienIntroTrial({
  text,
  leftAlienName,
  leftAlienColor,
  leftAlienNumber,
  rightAlienName,
  rightAlienColor,
  rightAlienNumber,
  audio = null,
  scriptText = text
}) {
  return {
    type: jsPsychHtmlKeyboardResponse,
    choices: "NO_KEYS",
    stimulus: renderTwoAlienIntroScreen({
      text,
      leftAlienColor,
      leftAlienNumber,
      rightAlienColor,
      rightAlienNumber,
      showNextButton: true
    }),
    data: {
      trial_type: "intro_two_aliens",
      speaker_condition: speakerCondition,
      intro_text: scriptText,
      left_alien_name: leftAlienName,
      left_alien_color: leftAlienColor,
      left_alien_number: leftAlienNumber,
      right_alien_name: rightAlienName,
      right_alien_color: rightAlienColor,
      right_alien_number: rightAlienNumber,
      audio: audio
    },
    on_load: function() {
      setupIntroAudioAndNext(audio);
    },
    on_finish: function() {
      cleanupIntroAudio();
    }
  };
}

function makeGameIntroTrial({
  text,
  alienName,
  alienColor,
  alienNumber,
  audio = null,
  scriptText = text
}) {
  return {
    type: jsPsychHtmlKeyboardResponse,
    choices: "NO_KEYS",
    stimulus: renderGameIntroWithJarsScreen({
      text,
      alienColor,
      alienNumber,
      showNextButton: true
    }),
    data: {
      trial_type: "intro_game",
      speaker_condition: speakerCondition,
      intro_text: scriptText,
      alien_name: alienName,
      alien_color: alienColor,
      alien_number: alienNumber,
      audio: audio
    },
    on_load: function() {
      setupIntroAudioAndNext(audio);
    },
    on_finish: function() {
      cleanupIntroAudio();
    }
  };
}

function makeCloudIntroTrial({
  text,
  alienColor,
  alienNumber,
  audio = null,
  scriptText = text
}) {
  return {
    type: jsPsychHtmlKeyboardResponse,
    choices: "NO_KEYS",
    stimulus: renderCloudIntroScreen({
      text,
      alienColor,
      alienNumber,
      showNextButton: true
    }),
    data: {
      trial_type: "intro_cloud",
      speaker_condition: speakerCondition,
      intro_text: scriptText,
      alien_color: alienColor,
      alien_number: alienNumber,
      audio: audio
    },
    on_load: function() {
      setupIntroAudioAndNext(audio);
    },
    on_finish: function() {
      cleanupIntroAudio();
    }
  };
}

function makeJobReminderIntroTrial({
  audio = null,
  scriptText = INTRO_SCRIPT.intro_reminder
} = {}) {
  return {
    type: jsPsychHtmlKeyboardResponse,
    choices: "NO_KEYS",
    stimulus: renderJobReminderIntroScreen({
      showNextButton: true
    }),
    data: {
      trial_type: "intro_reminder",
      speaker_condition: speakerCondition,
      intro_text: scriptText,
      audio: audio
    },
    on_load: function() {
      setupIntroAudioAndNext(audio);
    },
    on_finish: function() {
      cleanupIntroAudio();
    }
  };
}

function makeAdditionalItemsIntroTrial({
  audio = null,
  scriptText = INTRO_SCRIPT.intro_additional
} = {}) {
  return {
    type: jsPsychHtmlKeyboardResponse,
    choices: "NO_KEYS",
    stimulus: renderSingleAlienIntroScreen({
      text: "",
      alienColor: GUIDE_ALIEN.color,
      alienNumber: GUIDE_ALIEN.number,
      showNextButton: true
    }),
    data: {
      trial_type: "intro_additional_items",
      speaker_condition: speakerCondition,
      intro_text: scriptText,
      alien_name: GUIDE_ALIEN.name,
      alien_color: GUIDE_ALIEN.color,
      alien_number: GUIDE_ALIEN.number,
      audio: audio
    },
    on_load: function() {
      setupIntroAudioAndNext(audio);
    },
    on_finish: function() {
      cleanupIntroAudio();
    }
  };
}


// ==================================================
// OBJECT NAMING TRIALS
// ==================================================
function makeObjectNamingTrials(configList) {
  return {
    timeline: [
      {
        type: jsPsychHtmlKeyboardResponse,
        choices: "NO_KEYS",

        data: function() {
          return {
            trial_type: "object_naming",
            trialKind: "object_naming",
            ...getTrialDataBase(),
            alienId: jsPsych.timelineVariable("alienId"),
            alienName: jsPsych.timelineVariable("alienName"),
            alienColor: jsPsych.timelineVariable("alienColor"),
            alienNumber: jsPsych.timelineVariable("alienNumber"),
            objectType: jsPsych.timelineVariable("objectType"),
            objectName: jsPsych.timelineVariable("objectName"),
            prompt: "Do you remember the name of this object?"
          };
        },

        stimulus: function() {
          return renderObjectNamingScreen({
            headerText: "Do you remember the name of this object?",
            alienColor: jsPsych.timelineVariable("alienColor") || "green",
            alienNumber: jsPsych.timelineVariable("alienNumber") || 1,
            objectType: jsPsych.timelineVariable("objectType") || null,
            objectName: jsPsych.timelineVariable("objectName") || null
          });
        },

        on_load: function() {
          const input = document.getElementById("objectNameInput");
          const nextBtn = document.getElementById("objectNameNextButton");

          if (input) {
            input.focus();
            input.addEventListener("keydown", function(e) {
              if (e.key === "Enter") {
                e.preventDefault();
                if (nextBtn) nextBtn.click();
              }
            });
          }

          if (nextBtn) {
            nextBtn.onclick = () => {
              const typedResponse = input ? input.value.trim() : "";

              jsPsych.finishTrial({
                typed_label: typedResponse
              });
            };
          }
        }
      }
    ],
    timeline_variables: configList
  };
}

function makeAlienJobFreeResponseTrial({
  alienColor = "green",
  promptText = "Do you remember the job of these aliens?"
} = {}) {
  const alienNums = [1, 2, 3, 4];
  const alienImgs = alienNums.map(
    n => `<img
            src="${getAlienSrc(alienColor, n)}"
            style="
              height:18vh;
              object-fit:contain;
              display:block;
            "
          >`
  ).join("");

  return {
    type: jsPsychHtmlKeyboardResponse,
    choices: "NO_KEYS",
    stimulus: `
      <div style="position:fixed; inset:0; overflow:hidden;">
        <img
          src="images/background.png"
          style="
            position:absolute;
            inset:0;
            width:100%;
            height:100%;
            object-fit:cover;
          "
        >

        <div style="
          position:absolute;
          top:10%;
          left:50%;
          transform:translateX(-50%);
          width:70%;
          text-align:center;
          font-size:3vw;
          line-height:1.6;
          color:white;
          text-shadow:3px 3px 6px rgba(0,0,0,0.7);
          z-index:10;
        ">
          ${promptText}
        </div>

        <div style="
          position:absolute;
          left:50%;
          top:45%;
          transform:translate(-50%, -50%);
          display:flex;
          gap:2vw;
          align-items:flex-end;
          justify-content:center;
          z-index:10;
        ">
          ${alienImgs}
        </div>

        <div style="
          position:absolute;
          left:50%;
          top:68%;
          transform:translateX(-50%);
          width:70%;
          text-align:center;
          z-index:20;
        ">
          <input
            id="jobNameInput"
            type="text"
            autocomplete="off"
            placeholder="Type your answer here"
            style="
              width:60%;
              max-width:500px;
              font-size:24px;
              padding:12px 16px;
              border-radius:12px;
              border:2px solid #ccc;
              box-sizing:border-box;
            "
          >
        </div>

        <div style="
          position:absolute;
          bottom:8%;
          left:50%;
          transform:translateX(-50%);
          z-index:20;
        ">
          <button
            id="jobNameNextButton"
            style="
              font-size:24px;
              padding:12px 28px;
              border-radius:12px;
              cursor:pointer;
            "
          >
            Next →
          </button>
        </div>
      </div>
    `,
    data: {
      trial_type: "alien_job_free_response",
      alien_color_question: alienColor
    },
    on_load: function() {
      const input = document.getElementById("jobNameInput");
      const nextBtn = document.getElementById("jobNameNextButton");

      if (input) {
        input.focus();
        input.addEventListener("keydown", function(e) {
          if (e.key === "Enter") {
            e.preventDefault();
            if (nextBtn) nextBtn.click();
          }
        });
      }

      if (nextBtn) {
        nextBtn.onclick = () => {
          const jobResponse = input ? input.value.trim() : "";

          jsPsych.finishTrial({
            job_response: jobResponse
          });
        };
      }
    }
  };
}

const green_job_free_response_trial = makeAlienJobFreeResponseTrial({
  alienColor: "green",
  promptText: "Do you remember the job of the green aliens?"
});

const yellow_job_free_response_trial = makeAlienJobFreeResponseTrial({
  alienColor: "yellow",
  promptText: "Do you remember the job of the yellow aliens?"
});


// ==================================================
// BUILD CONFIGS
// ==================================================
const {
  practiceConfigs,
  fillerConfigsBlock1,
  fillerConfigsBlock2
} = buildPracticeAndFillerConfigs(FILLER_OBJECTS);

const [criticalDistractor1, criticalDistractor2] = DISTRACTOR_OBJECTS;


const STAR_TEST_TRIAL_SPECS = [
  { target: "star_poofle", distractor: criticalDistractor2 },
  { target: "star_berry", distractor: criticalDistractor1 }
];

const ASTRO_TEST_TRIAL_SPECS = [
  { target: "astro_tweeter", distractor: criticalDistractor1 },
  { target: "astro_leaf", distractor: criticalDistractor2 }
];

const MINI_JAR_BLOCK_SPECS = [
  ...STAR_TEST_TRIAL_SPECS,
  ...ASTRO_TEST_TRIAL_SPECS
];

const miniJarBaseFillerConfigs = [
  ...fillerConfigsBlock1,
  ...fillerConfigsBlock2
];

const MINI_JAR_FILLER_CONFIGS = MINI_JAR_BLOCK_SPECS.map((spec, index) => {
  const coveredBaseConfig =
    miniJarBaseFillerConfigs[(index * 2) % miniJarBaseFillerConfigs.length];
  const uncoveredBaseConfig =
    miniJarBaseFillerConfigs[(index * 2 + 1) % miniJarBaseFillerConfigs.length];

  return [
    buildFillerConfigWithTargetCoverage(coveredBaseConfig, true),
    buildFillerConfigWithTargetCoverage(uncoveredBaseConfig, false)
  ];
});

const miniJarBlocks = MINI_JAR_BLOCK_SPECS.map((spec, index) => {
  return {
    objectName: spec.target,
    fillerConfigs: MINI_JAR_FILLER_CONFIGS[index],
    criticalConfig: buildCriticalConfig(
      spec.target,
      spec.distractor,
      "Choose a jar.",
      index + 1
    ),
    objectNamingConfig: buildObjectNamingConfig(spec.target)
  };
});

function buildFillerConfigWithTargetCoverage(baseConfig, targetCovered) {
  const coveredSide = baseConfig.cloudCoveredSide || fixedCloudCoveredSide;
  const targetSide = targetCovered ? coveredSide : getOtherSide(coveredSide);
  const targetObject =
    targetSide === "left" ? baseConfig.leftObject : baseConfig.rightObject;

  return {
    ...baseConfig,
    targetObject,
    audio: getFillerAudioSrc(targetObject),
    fillerTargetCovered: targetCovered
  };
}

function buildObjectNamingConfig(objectName) {
  return {
    alienId: TASK_ALIEN.id,
    alienName: TASK_ALIEN.name,
    alienColor: TASK_ALIEN.color,
    alienNumber: TASK_ALIEN.number,
    objectType: "target",
    objectName
  };
}


// ==================================================
// RPP / PROLIFIC PAGES
// ==================================================
var consent_block = {
  timeline: [
    { type: jsPsychImageButtonResponse, stimulus: "consent form/consentFormPt1.jpg", choices: ["Next"] },
    { type: jsPsychImageButtonResponse, stimulus: "consent form/consentFormPt2.jpg", choices: ["Next"] },
    { type: jsPsychImageButtonResponse, stimulus: "consent form/consentFormPt3.jpg", choices: ["Next"] },
    { type: jsPsychImageButtonResponse, stimulus: "consent form/consentFormPt4.jpg", choices: ["Next"] },
    {
      type: jsPsychImageButtonResponse,
      stimulus: "consent form/consentFormPt5.jpg",
      choices: ["I consent", "I do not consent"],
      prompt: "<p>Do you consent to participating in this experiment?</p>"
    }
  ]
};

var opening_instructions_RPP = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="
      font-size: 24px;
      line-height: 1.4;
      color: black;
      max-width: 800px;
      margin: 0 auto;
      padding-top: 10%;
      text-align: center;
    ">
      <p>
        This study will probably take you less than ten minutes.
        Please do not rush. Your answers are very important research data.
      </p>
      <p style="margin-top: 20px;">
        To receive credit, you will be given a link to a Google Form
        <strong>at the END of this experiment</strong>.
      </p>
      <p style="margin-top: 20px;">
        After this page, you will see a consent form. Once you give consent, the experiment will begin.
      </p>
      <p style="margin-top: 20px;">Click Next to begin.</p>
    </div>
  `,
  choices: ["Next →"],
  button_html: `
    <button class="jspsych-btn" style="
      font-size: 22px;
      padding: 12px 24px;
      margin-top: 30px;
      border-radius: 10px;
      cursor: pointer;
    ">%choice%</button>`
};

var opening_instructions_prolific = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="
      font-size: 24px;
      line-height: 1.4;
      color: black;
      max-width: 800px;
      margin: 0 auto;
      padding-top: 10%;
      text-align: center;
    ">
      <p style="margin-top: 20px;">
        After this page, you will see a consent form. Once you give consent, the experiment will begin.
      </p>
      <p style="margin-top: 20px;">Click Next to begin.</p>
    </div>
  `,
  choices: ["Next →"],
  button_html: `
    <button class="jspsych-btn" style="
      font-size: 22px;
      padding: 12px 24px;
      margin-top: 30px;
      border-radius: 10px;
      cursor: pointer;
    ">%choice%</button>`
};

var prolific_id_page = {
  type: jsPsychSurveyText,
  questions: [{
    prompt: `
      <div style="font-size:22px; text-align:center; margin-bottom:20px;">
        Please enter your Prolific ID.
      </div>
    `,
    placeholder: "Enter your Prolific ID here",
    required: true,
    name: "prolific_id"
  }],
  button_label: "Submit",
  on_finish: function(data) {
    jsPsych.data.addProperties({
      prolific_id: data.response.prolific_id
    });
  }
};

var prolific_completion_page = {
  type: jsPsychHtmlKeyboardResponse,
  choices: "NO_KEYS",
  stimulus: `
    <div style="
      font-size: 24px;
      line-height: 1.5;
      color: black;
      max-width: 800px;
      margin: 0 auto;
      padding-top: 10%;
      text-align: center;
    ">
      <p>Thank you for participating!</p>
      <p style="margin-top: 20px;">Your Prolific completion code is:</p>
      <p style="margin-top: 10px; font-size: 32px; font-weight: bold;">
        <code>C13L0HGM</code>
      </p>
      <p style="margin-top: 30px;">
        You can now return to Prolific and enter this code.<br>
        When you are done, you may close this window.
      </p>
    </div>
  `
};

var credit_instructions = {
  type: jsPsychHtmlKeyboardResponse,
  choices: ["Enter", " "],
  stimulus: `
    <div style="
      font-size: 24px;
      line-height: 1.4;
      color: black;
      max-width: 800px;
      margin: 0 auto;
      padding-top: 10%;
      text-align: center;
    ">
      <p>Thank you for participating!</p>
      <p>To receive credit, please click the link below and enter your name.</p>
      <p style="margin-top:20px;">
        <a href="https://forms.gle/wp7LTr9WEMu5fzu5A"
           target="_blank"
           style="color:#ffd166; font-size:26px; text-decoration:underline;">
           → Click here to submit your name for RPP credit ←
        </a>
      </p>
      <p style="margin-top:30px; font-size:20px; opacity:0.9;">
        After completing the form, you are finished with the experiment.
      </p>
    </div>
  `
};

var close_window_page = {
  type: jsPsychHtmlKeyboardResponse,
  choices: "NO_KEYS",
  stimulus: `
    <div style="
      font-size: 24px;
      line-height: 1.5;
      color: black;
      max-width: 800px;
      margin: 0 auto;
      padding-top: 10%;
      text-align: center;
    ">
      <p>Thank you for participating!</p>
      <p style="margin-top: 20px;">Your responses have been saved.</p>
      <p style="margin-top: 30px;">You may now close this window.</p>
    </div>
  `
};


// ==================================================
// PARTICIPANT SOURCE SELECTION
// ==================================================
let participantSource = null;
let DEBUG_BYPASS_AUDIO_LOCK = false;

const participant_source_page = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="
      max-width: 900px;
      margin: 0 auto;
      text-align: center;
      line-height: 1.6;
      font-size: 28px;
    ">
      <p><strong>Are you completing this study on Prolific, RPP, or somewhere else?</strong></p>
      <p>Please choose the option that applies to you.</p>
    </div>
  `,
  choices: ["RPP participant", "Prolific participant", "Other"],
  on_finish: function(data) {
    if (data.response === 0) {
      participantSource = "RPP";
      DEBUG_BYPASS_AUDIO_LOCK = false;
    } else if (data.response === 1) {
      participantSource = "Prolific";
      DEBUG_BYPASS_AUDIO_LOCK = false;
    } else {
      participantSource = "Other";
      DEBUG_BYPASS_AUDIO_LOCK = true;
    }

    jsPsych.data.addProperties({
      participant_source: participantSource,
      debug_bypass_audio_lock: DEBUG_BYPASS_AUDIO_LOCK
    });

    console.log("Participant source:", participantSource);
    console.log("Debug bypass audio lock:", DEBUG_BYPASS_AUDIO_LOCK);
  }
};


// ==================================================
// CONDITIONAL INTRO BLOCKS
// ==================================================
const rpp_intro_block = {
  timeline: [opening_instructions_RPP],
  conditional_function: function() {
    return participantSource === "RPP";
  }
};

const prolific_intro_block = {
  timeline: [prolific_id_page, opening_instructions_prolific],
  conditional_function: function() {
    return participantSource === "Prolific";
  }
};


// ==================================================
// CONDITIONAL ENDING BLOCKS
// ==================================================
const prolific_ending_block = {
  timeline: [prolific_completion_page],
  conditional_function: function() {
    return participantSource === "Prolific";
  }
};

const rpp_ending_block = {
  timeline: [credit_instructions],
  conditional_function: function() {
    return participantSource === "RPP";
  }
};

const other_ending_block = {
  timeline: [close_window_page],
  conditional_function: function() {
    return participantSource === "Other";
  }
};


// ==================================================
// SAVE DATA TO DATAPIPE
// ==================================================
const save_data_trial = {
  type: jsPsychPipe,
  action: "save",
  experiment_id: DATAPIPE_EXPERIMENT_ID,
  filename: () => {
    return `alien_jars_${participantID}.csv`;
  },
  data_string: () => jsPsych.data.get().csv(),
  wait_message: "<p>Saving your answers. Please wait and do not close this page.</p>"
};


const volume_check_screen = {
  type: jsPsychHtmlButtonResponse,
  stimulus: `
    <div style="
      max-width: 900px;
      margin: 0 auto;
      text-align: center;
      font-size: 28px;
      line-height: 1.6;
    ">
      <p><strong>Please make sure your sound is turned ON.</strong></p>
      <p>You will hear audio instructions during the experiment.</p>
      <p>Turn up your volume before continuing.</p>
    </div>
  `,
  choices: ["Continue"]
};


// ==================================================
// TIMELINE
// ==================================================
const timeline = [];

timeline.push(makePreloadTrial());

timeline.push(participant_source_page);
timeline.push(rpp_intro_block);
timeline.push(prolific_intro_block);
timeline.push(consent_block);
timeline.push(volume_check_screen);


function pushObjectIntroTrial(objectName) {
  const introConfigs = {
    star_poofle: {
      text: "This is a star poofle.",
      audioName: "intro_star_poofle",
      scriptText: INTRO_SCRIPT.intro_star_poofle
    },
    star_berry: {
      text: "This is a star berry.",
      audioName: "intro_star_berry",
      scriptText: INTRO_SCRIPT.intro_star_berry
    },
    astro_tweeter: {
      text: "This is an astro tweeter.",
      audioName: "intro_astro_tweeter",
      scriptText: INTRO_SCRIPT.intro_astro_tweeter
    },
    astro_leaf: {
      text: "This is astro leaf.",
      audioName: "intro_astro_leaf",
      scriptText: INTRO_SCRIPT.intro_astro_leaf
    }
  };

  const introConfig = introConfigs[objectName];

  if (!introConfig) {
    throw new Error(`Missing object intro config for ${objectName}.`);
  }

  timeline.push(
    makeObjectIntroTrial({
      text: introConfig.text,
      alienColor: GUIDE_ALIEN.color,
      alienNumber: GUIDE_ALIEN.number,
      objectType: "target",
      objectName,
      audio: getNewIntroAudioPath(introConfig.audioName),
      scriptText: introConfig.scriptText
    })
  );
}

function pushGameIntroTrial() {
  if (speakerCondition === "same_speaker") {
    timeline.push(
      makeGameIntroTrial({
        text: `Help ${GUIDE_ALIEN.name} sort the jars.`,
        alienName: GUIDE_ALIEN.name,
        alienColor: GUIDE_ALIEN.color,
        alienNumber: GUIDE_ALIEN.number,
        audio: getJarsIntroAudio(),
        scriptText: INTRO_SCRIPT.intro_jars_same
      })
    );
  } else {
    timeline.push(
      makeGameIntroTrial({
        text: `Help ${TASK_ALIEN.name} sort the jars.`,
        alienName: TASK_ALIEN.name,
        alienColor: TASK_ALIEN.color,
        alienNumber: TASK_ALIEN.number,
        audio: getJarsIntroAudio(),
        scriptText: INTRO_SCRIPT.intro_jars_new
      })
    );
  }
}

function pushSecondJarIntroTrial() {
  timeline.push(
    makeGameIntroTrial({
      text: `Help ${TASK_ALIEN.name} sort more jars.`,
      alienName: TASK_ALIEN.name,
      alienColor: TASK_ALIEN.color,
      alienNumber: TASK_ALIEN.number,
      audio: getNewIntroAudioPath("intro_jar_again"),
      scriptText: INTRO_SCRIPT.intro_jar_again
    })
  );
}

function pushJarConfigTrials(configs) {
  configs.forEach(config => {
    if (config.phase === "critical") {
      timeline.push(makeCriticalTrials([config]));
    } else {
      timeline.push(makeFillerTrials([config]));
    }
  });
}

function pushMiniJarBlock(block, { showAdditionalIntro = true, showJarAgainIntro = true } = {}) {
  if (showAdditionalIntro) {
    pushAdditionalItemsIntroTrial();
  }

  pushObjectIntroTrial(block.objectName);
  pushJobReminderIntroTrial();

  if (showJarAgainIntro) {
    pushSecondJarIntroTrial();
  }

  timeline.push(makeFillerTrials(block.fillerConfigs));
  timeline.push(makeCriticalTrials([block.criticalConfig]));
  timeline.push(makeObjectNamingTrials([block.objectNamingConfig]));
}

function pushJobReminderIntroTrial() {
  timeline.push(
    makeJobReminderIntroTrial({
      audio: getNewIntroAudioPath("intro_reminder"),
      scriptText: INTRO_SCRIPT.intro_reminder
    })
  );
}

function pushAdditionalItemsIntroTrial() {
  timeline.push(
    makeAdditionalItemsIntroTrial({
      audio: getNewIntroAudioPath("intro_additional"),
      scriptText: INTRO_SCRIPT.intro_additional
    })
  );
}

// Intro sequence
timeline.push(
  makeAllAliensIntroTrial(
    `Welcome to the planet ${PLANET_NAME}.`,
    getNewIntroAudioPath("intro_1"),
    INTRO_SCRIPT.intro_1,
    "both"
  )
);

timeline.push(
  makeAllAliensIntroTrial(
    "These are the astronomer aliens.",
    getNewIntroAudioPath("intro_astronomers"),
    INTRO_SCRIPT.intro_astronomers,
    "yellow",
    "images/astronomer.png"
  )
);

timeline.push(
  makeAllAliensIntroTrial(
    "These are the forest ranger aliens.",
    getNewIntroAudioPath("intro_forest_rangers"),
    INTRO_SCRIPT.intro_forest_rangers,
    "green",
    "images/forest_ranger.png"
  )
);

timeline.push(
  makeSingleAlienIntroTrial(
    `This is ${GUIDE_ALIEN.name}.`,
    GUIDE_ALIEN.color,
    GUIDE_ALIEN.number,
    GUIDE_ALIEN.name,
    getNewIntroAudioPath("intro_2"),
    INTRO_SCRIPT.intro_2
  )
);

pushObjectIntroTrial(miniJarBlocks[0].objectName);
pushJobReminderIntroTrial();
pushGameIntroTrial();

timeline.push(makePracticeTrials([practiceConfigs[0]]));

if (EXP_CONFIG.useCloud) {
  timeline.push(
    makeCloudIntroTrial({
      text: "Now a cloud is covering one of the jars.",
      alienColor: TASK_ALIEN.color,
      alienNumber: TASK_ALIEN.number,
      audio: getConditionCloudAudio()
    })
  );
}

timeline.push(makeFillerTrials(miniJarBlocks[0].fillerConfigs));
timeline.push(makeCriticalTrials([miniJarBlocks[0].criticalConfig]));
timeline.push(makeObjectNamingTrials([miniJarBlocks[0].objectNamingConfig]));

pushMiniJarBlock(miniJarBlocks[1]);
pushMiniJarBlock(miniJarBlocks[2]);
pushMiniJarBlock(miniJarBlocks[3]);

timeline.push(green_job_free_response_trial);
timeline.push(yellow_job_free_response_trial);

timeline.push(save_data_trial);
timeline.push(prolific_ending_block);
timeline.push(rpp_ending_block);
timeline.push(other_ending_block);

jsPsych.run(timeline);
