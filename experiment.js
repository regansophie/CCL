// ==================================================
// BASIC SETUP
// ==================================================
const jsPsych = initJsPsych({
  on_finish: function() {
    jsPsych.data.displayData();
  }
});


// ==================================================
// PARTICIPANT + DATAPIPE SETUP
// ==================================================
const participantID = jsPsych.randomization.randomID(10);
const DATAPIPE_EXPERIMENT_ID = "g5V2itw0QPv9";

jsPsych.data.addProperties({
  participant_id: participantID
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
  // ["same_speaker", "new_same_group", "new_different_group"],
  ["same_speaker"],
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
  "starberry",
  "rainbow_poofle"
];

const DISTRACTOR_OBJECTS = [
  "banana",
  "cat"
];

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
  if (!objectType || !objectName) return null;
  return `stimuli/objects/${objectType}/${objectName}.png`;
}

function getJarColorFromSide(side) {
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

function getFillerAudioSrc(objectName) {
  if (!objectName) return null;
  return `stimuli/audio/filler/${objectName.toLowerCase()}.mp3`;
}

function getCriticalAudio(targetObject) {
  if (targetObject === "starberry") {
    return "stimuli/audio/target/fruit.mp3";
  }

  if (targetObject === "rainbow_poofle") {
    return "stimuli/audio/target/animal.mp3";
  }

  return null;
}

function getJarsIntroAudio() {
  if (speakerCondition === "same_speaker") {
    return "stimuli/audio/intro/intro_jars_1.mp3";
  }

  if (speakerCondition === "new_same_group") {
    return "stimuli/audio/intro/intro_jars_2.mp3";
  }

  if (speakerCondition === "new_different_group") {
    return "stimuli/audio/intro/intro_jars_3.mp3";
  }

  return null;
}


// ==================================================
// FIXED CLOUD SIDE FOR WHOLE CLOUD PHASE
// ==================================================
const fixedCloudCoveredSide = getRandomSide();

jsPsych.data.addProperties({
  fixed_cloud_covered_side: fixedCloudCoveredSide,
  fixed_cloud_covered_jar: getJarColorFromSide(fixedCloudCoveredSide)
});

console.log("Fixed cloud covered side:", fixedCloudCoveredSide);


// ==================================================
// PRELOAD
// ==================================================
const IMAGE_PRELOAD = [
  "images/background.png",
  "images/cloud.png",

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

  ...FILLER_OBJECTS.map(obj => `stimuli/objects/filler/${obj}.png`),
  ...TARGET_OBJECTS.map(obj => `stimuli/objects/target/${obj}.png`),
  ...DISTRACTOR_OBJECTS.map(obj => `stimuli/objects/distractor/${obj}.png`)
];

const AUDIO_PRELOAD = [
  ...FILLER_OBJECTS.map(obj => getFillerAudioSrc(obj)),

  "stimuli/audio/target/fruit.mp3",
  "stimuli/audio/target/animal.mp3",

  "stimuli/audio/intro/intro_1.mp3",
  "stimuli/audio/intro/intro_2.mp3",
  "stimuli/audio/intro/intro_starberry.mp3",
  "stimuli/audio/intro/intro_rainbow_poofle.mp3",
  "stimuli/audio/intro/intro_new_alien.mp3",
  "stimuli/audio/intro/intro_jars_1.mp3",
  "stimuli/audio/intro/intro_jars_2.mp3",
  "stimuli/audio/intro/intro_jars_3.mp3",

  "stimuli/audio/intro/cloud.mp3"
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
  showNextButton = true
} = {}) {
  const alienImages = [
    "images/aliens/alien_green_1.png",
    "images/aliens/alien_green_2.png",
    "images/aliens/alien_green_3.png",
    "images/aliens/alien_yellow_1.png",
    "images/aliens/alien_yellow_2.png",
    "images/aliens/alien_yellow_3.png"
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

      <div style="
        position:absolute;
        bottom:18%;
        left:50%;
        transform:translateX(-50%);
        display:flex;
        gap:3vw;
        align-items:flex-end;
        z-index:10;
      ">
        ${alienImages.map(src => `
          <img
            src="${src}"
            style="
              height:${ALIEN_HEIGHT};
              object-fit:contain;
              display:block;
            "
          >
        `).join("")}
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
        top:50%;
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
        left:8%;
        bottom:14%;
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

  const leftObjectSrc = getObjectSrc(leftObjectType, leftObject);
  const rightObjectSrc = getObjectSrc(rightObjectType, rightObject);

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

            ${cloudCoveredSide === "left" ? `
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

            ${cloudCoveredSide === "right" ? `
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

      <div style="
        position:absolute;
        left:6%;
        bottom:14%;
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
    fixed_cloud_covered_jar: getJarColorFromSide(fixedCloudCoveredSide)
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
    const cloudCoveredSide = fixedCloudCoveredSide;

    return {
      phase: "cloud_filler",
      headerText: "Choose a jar.",
      alienId: TASK_ALIEN.id,
      alienName: TASK_ALIEN.name,
      alienColor: TASK_ALIEN.color,
      alienNumber: TASK_ALIEN.number,
      targetObject,
      audio: getFillerAudioSrc(targetObject),
      cloudCoveredSide,
      cloudCoveredJar: getJarColorFromSide(cloudCoveredSide),
      ...pair
    };
  });

  const fillerConfigsBlock2 = fillerBlock2Pairs.map((pair) => {
    const targetObject = Math.random() < 0.5 ? pair.leftObject : pair.rightObject;
    const cloudCoveredSide = fixedCloudCoveredSide;

    return {
      phase: "cloud_filler",
      headerText: "Choose a jar.",
      alienId: TASK_ALIEN.id,
      alienName: TASK_ALIEN.name,
      alienColor: TASK_ALIEN.color,
      alienNumber: TASK_ALIEN.number,
      targetObject,
      audio: getFillerAudioSrc(targetObject),
      cloudCoveredSide,
      cloudCoveredJar: getJarColorFromSide(cloudCoveredSide),
      ...pair
    };
  });

  return {
    practiceConfigs,
    fillerConfigsBlock1,
    fillerConfigsBlock2
  };
}

function buildCriticalConfig(targetName, distractorName, headerText) {
  const cloudCoveredSide = fixedCloudCoveredSide;
  const targetSide = getOtherSide(cloudCoveredSide);
  const distractorSide = cloudCoveredSide;
  const audio = getCriticalAudio(targetName);

  return {
    phase: "cloud_critical",
    headerText,
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
    targetSide,
    distractorSide,
    cloudCoveredSide,
    cloudCoveredJar: getJarColorFromSide(cloudCoveredSide),
    audio
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
// FILLER TRIALS (CLOUD PHASE)
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
// CRITICAL TRIALS (CLOUD PHASE)
// ==================================================
function makeCriticalTrials(configList) {
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
          const audioFile = jsPsych.timelineVariable("audio");

          let currentAudio = playTrialAudio(audioFile);
          let jarChoiceSide = null;
          let jarChoiceColor = null;

          function disableJarButtons() {
            if (leftBtn) leftBtn.disabled = true;
            if (rightBtn) rightBtn.disabled = true;
          }

          function finishCriticalTrial(certaintyDirection, certaintyStrength) {
            const chosenObject =
              jarChoiceSide === "left"
                ? jsPsych.timelineVariable("leftObject")
                : jsPsych.timelineVariable("rightObject");

            const isTargetChoice =
              chosenObject === jsPsych.timelineVariable("targetObject");

            stopTrialAudio(currentAudio);

            jsPsych.finishTrial({
              choice_side: jarChoiceSide,
              choice_jar: jarChoiceColor,
              chosen_object: chosenObject,
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
              showCertaintyButtons();
            };
          }

          if (rightBtn) {
            rightBtn.onclick = () => {
              jarChoiceSide = "right";
              jarChoiceColor = getJarColorFromSide("right");
              disableJarButtons();
              showCertaintyButtons();
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
function makeAllAliensIntroTrial(text, audio = null) {
  return {
    type: jsPsychHtmlKeyboardResponse,
    choices: "NO_KEYS",
    stimulus: renderAllAliensIntroScreen({
      text,
      showNextButton: true
    }),
    data: {
      trial_type: "intro_all_aliens",
      speaker_condition: speakerCondition,
      intro_text: text,
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

function makeSingleAlienIntroTrial(text, alienColor, alienNumber, alienName, audio = null) {
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
      intro_text: text,
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
  audio = null
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
      intro_text: text,
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
  audio = null
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
      intro_text: text,
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
  audio = null
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
      intro_text: text,
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
  audio = null
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
      intro_text: text,
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


// ==================================================
// BUILD CONFIGS
// ==================================================
const {
  practiceConfigs,
  fillerConfigsBlock1,
  fillerConfigsBlock2
} = buildPracticeAndFillerConfigs(FILLER_OBJECTS);

const criticalConfigsBlock1 = [
  buildCriticalConfig(
    "starberry",
    "banana",
    "Choose a jar."
  )
];

const criticalConfigsBlock2 = [
  buildCriticalConfig(
    "rainbow_poofle",
    "cat",
    "Choose a jar."
  )
];

const objectNamingConfigs = jsPsych.randomization.shuffle([
  {
    alienId: TASK_ALIEN.id,
    alienName: TASK_ALIEN.name,
    alienColor: TASK_ALIEN.color,
    alienNumber: TASK_ALIEN.number,
    objectType: "target",
    objectName: "starberry"
  },
  {
    alienId: TASK_ALIEN.id,
    alienName: TASK_ALIEN.name,
    alienColor: TASK_ALIEN.color,
    alienNumber: TASK_ALIEN.number,
    objectType: "target",
    objectName: "rainbow_poofle"
  }
]);


// ==================================================
// RPP Instructions
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

var opening_instructions = {
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


// ==================================================
// SAVE DATA TO OSF VIA DATAPIPE
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


// ==================================================
// TIMELINE
// ==================================================
const timeline = [];

timeline.push(makePreloadTrial());


timeline.push(opening_instructions);
timeline.push(consent_block);

// Intro sequence
timeline.push(
  makeAllAliensIntroTrial(
    `This is a planet in outer space called ${PLANET_NAME}.`,
    null
  )
);

timeline.push(
  makeAllAliensIntroTrial(
    "Here are some of the aliens who live here.",
    null
  )
);

timeline.push(
  makeSingleAlienIntroTrial(
    `Let's meet ${GUIDE_ALIEN.name}. He is going to tell us more about the planet.`,
    GUIDE_ALIEN.color,
    GUIDE_ALIEN.number,
    GUIDE_ALIEN.name,
    "stimuli/audio/intro/intro_1.mp3"
  )
);

timeline.push(
  makeObjectIntroTrial({
    text: "",
    alienColor: GUIDE_ALIEN.color,
    alienNumber: GUIDE_ALIEN.number,
    objectType: null,
    objectName: null,
    audio: "stimuli/audio/intro/intro_2.mp3"
  })
);

timeline.push(
  makeObjectIntroTrial({
    text: "This is a starberry.",
    alienColor: GUIDE_ALIEN.color,
    alienNumber: GUIDE_ALIEN.number,
    objectType: "target",
    objectName: "starberry",
    audio: "stimuli/audio/intro/intro_starberry.mp3"
  })
);

timeline.push(
  makeObjectIntroTrial({
    text: "This is a rainbow poofle.",
    alienColor: GUIDE_ALIEN.color,
    alienNumber: GUIDE_ALIEN.number,
    objectType: "target",
    objectName: "rainbow_poofle",
    audio: "stimuli/audio/intro/intro_rainbow_poofle.mp3"
  })
);


// Game intro depends on condition
if (speakerCondition === "same_speaker") {
  timeline.push(
    makeGameIntroTrial({
      text: "",
      alienName: GUIDE_ALIEN.name,
      alienColor: GUIDE_ALIEN.color,
      alienNumber: GUIDE_ALIEN.number,
      audio: getJarsIntroAudio()
    })
  );
} else {
  timeline.push(
    makeTwoAlienIntroTrial({
      text: `${GUIDE_ALIEN.name} says: This is ${TASK_ALIEN.name}. ${TASK_ALIEN.name} is going to show you the jar game.`,
      leftAlienName: GUIDE_ALIEN.name,
      leftAlienColor: GUIDE_ALIEN.color,
      leftAlienNumber: GUIDE_ALIEN.number,
      rightAlienName: TASK_ALIEN.name,
      rightAlienColor: TASK_ALIEN.color,
      rightAlienNumber: TASK_ALIEN.number,
      audio: "stimuli/audio/intro/intro_new_alien.mp3"
    })
  );

  timeline.push(
    makeGameIntroTrial({
      text: `Hi! I'm ${TASK_ALIEN.name}. Let's play the jar game.`,
      alienName: TASK_ALIEN.name,
      alienColor: TASK_ALIEN.color,
      alienNumber: TASK_ALIEN.number,
      audio: getJarsIntroAudio()
    })
  );
}

// 2 normal practice trials
timeline.push(makePracticeTrials(practiceConfigs));

// Cloud intro
timeline.push(
  makeCloudIntroTrial({
    text: "Now a cloud is covering one of the jars.",
    alienColor: TASK_ALIEN.color,
    alienNumber: TASK_ALIEN.number,
    audio: "stimuli/audio/intro/cloud.mp3"
  })
);

// Cloud phase with fixed cloud side
timeline.push(makeFillerTrials(fillerConfigsBlock1));
timeline.push(makeCriticalTrials(criticalConfigsBlock1));
timeline.push(makeFillerTrials(fillerConfigsBlock2));
timeline.push(makeCriticalTrials(criticalConfigsBlock2));

// Naming test
timeline.push(makeObjectNamingTrials(objectNamingConfigs));

// Save to OSF
timeline.push(save_data_trial);

// Uncomment for RPP
timeline.push(credit_instructions);

jsPsych.run(timeline);