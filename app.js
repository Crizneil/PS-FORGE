const STORAGE_KEY = "forge-system-state-v1";
const WORKOUT_ORDER = ["A", "B", "C"];
const EXERCISE_IMAGE_BASE = "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";
const exercisePhotos = {
  squat: "Barbell_Full_Squat",
  "leg-press": "Leg_Press",
  "leg-curl": "Lying_Leg_Curls",
  "incline-press": "Barbell_Incline_Bench_Press_-_Medium_Grip",
  "chest-press": "Leverage_Chest_Press",
  "lat-pulldown": "Wide-Grip_Lat_Pulldown",
  "transverse-row": "Seated_Cable_Rows",
  "single-arm-lat": "One_Arm_Lat_Pulldown",
  "straight-arm-pulldown": "Rope_Straight-Arm_Pulldown",
  "dumbbell-lateral": "Side_Lateral_Raise",
  "cable-lateral": "Cable_Seated_Lateral_Raise",
  "shoulder-press": "Dumbbell_Shoulder_Press",
  "rear-delt-fly": "Cable_Rear_Delt_Fly",
  "preacher-curl": "Preacher_Curl",
  pushdown: "Triceps_Pushdown",
  "ab-crunch": "Cable_Crunch",
};

const catalog = [
  {
    id: "squat",
    name: "Squat",
    target: "Legs — thighs and glutes",
    category: "Legs",
    sets: 2,
    min: 8,
    max: 12,
    rest: 150,
    visual: "squat",
    start: "Stand with feet about shoulder-width apart; brace gently and keep your whole foot on the floor.",
    movement: "Bend your knees and hips to a comfortable depth, then stand by pushing the floor away.",
    tips: ["Keep your knees pointing in the same direction as your toes.", "Use a depth you can control without pain."],
    mistake: "Letting your heels lift or knees collapse inward.",
    alternatives: ["Leg Press", "Goblet Squat"],
  },
  {
    id: "leg-press",
    name: "Leg Press",
    target: "Legs — thighs and glutes",
    category: "Legs",
    sets: 2,
    min: 8,
    max: 12,
    rest: 150,
    visual: "squat",
    start: "Sit against the pad with feet shoulder-width on the platform.",
    movement: "Lower the platform with control, then press through your feet without locking your knees.",
    tips: ["Keep your lower back against the seat.", "Use a comfortable, pain-free range."],
    mistake: "Letting your hips curl off the seat or knees snap straight.",
    alternatives: ["Squat", "Goblet Squat"],
  },
  {
    id: "leg-curl",
    name: "Leg Curl",
    target: "Back of thighs — hamstrings",
    category: "Legs",
    sets: 2,
    min: 10,
    max: 15,
    rest: 105,
    visual: "curl",
    start: "Set the machine pad just above your heels and brace against the bench.",
    movement: "Bend your knees to bring the pad toward you, then lower it slowly.",
    tips: ["Keep your hips against the pad.", "Pause briefly when your hamstrings tighten."],
    mistake: "Swinging the weight or lifting your hips.",
    alternatives: ["Seated Leg Curl", "Stability-Ball Leg Curl"],
  },
  {
    id: "incline-press",
    name: "Incline Chest Press",
    target: "Upper chest",
    category: "Chest",
    sets: 2,
    min: 8,
    max: 12,
    rest: 150,
    visual: "press",
    start: "Set the bench to a low incline. Sit back with your feet planted and handles near your upper chest.",
    movement: "Press up and slightly inward, then lower the handles slowly to the start.",
    tips: ["Keep your shoulder blades gently against the bench.", "Keep wrists stacked over elbows."],
    mistake: "Bouncing the weight or arching your back excessively.",
    alternatives: ["Incline Dumbbell Press", "Incline Push-up"],
  },
  {
    id: "chest-press",
    name: "Chest Press",
    target: "Chest",
    category: "Chest",
    sets: 3,
    min: 8,
    max: 15,
    rest: 120,
    visual: "press",
    start: "Sit with your back supported and handles level with the middle of your chest.",
    movement: "Press forward smoothly, then return until you feel a gentle chest stretch.",
    tips: ["Keep your feet planted.", "Move in a range that feels comfortable for your shoulders."],
    mistake: "Shrugging your shoulders or letting the handles slam back.",
    alternatives: ["Dumbbell Bench Press", "Pec Deck"],
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    target: "Lats — the broad muscles at the sides of your back",
    category: "Back",
    sets: 2,
    min: 8,
    max: 12,
    rest: 120,
    visual: "pulldown",
    start: "Sit tall, secure your thighs under the pad, and hold the bar a little wider than your shoulders.",
    movement: "Bring your elbows down toward your sides; guide the bar to your upper chest, then reach up slowly.",
    tips: ["Keep a small, steady lean rather than rocking.", "Think about moving your elbows, not your hands."],
    mistake: "Pulling the bar behind your neck or swinging your body.",
    alternatives: ["Assisted Pull-up", "Neutral-Grip Pulldown", "Single-Arm Lat Pulldown"],
  },
  {
    id: "transverse-row",
    name: "Seated Cable Row",
    target: "Mid-back and lats",
    category: "Back",
    sets: 2,
    min: 8,
    max: 12,
    rest: 120,
    visual: "row",
    start: "Sit tall with knees softly bent and hold the handle with arms reaching forward.",
    movement: "Pull the handle toward your lower ribs, then extend your arms slowly.",
    tips: ["Keep your chest comfortably lifted.", "Let your shoulder blades move naturally."],
    mistake: "Rocking far back to move a weight that is too heavy.",
    alternatives: ["Chest-Supported Row", "One-Arm Dumbbell Row"],
  },
  {
    id: "single-arm-lat",
    name: "Single-Arm Lat Pulldown",
    target: "Lats — the broad muscles at the sides of your back",
    category: "Back",
    sets: 3,
    min: 10,
    max: 15,
    rest: 105,
    visual: "pulldown",
    start: "Sit or kneel beside a high cable and reach overhead to hold one handle.",
    movement: "Draw your elbow down toward your hip, then return overhead with control.",
    tips: ["Keep your ribs stacked over your hips.", "Use the same range on both sides."],
    mistake: "Twisting your body to pull the handle down.",
    alternatives: ["Single-Arm Cable Row", "Assisted One-Arm Pulldown"],
  },
  {
    id: "straight-arm-pulldown",
    name: "Straight-Arm Pulldown",
    target: "Lats — the broad muscles at the sides of your back",
    category: "Back",
    sets: 2,
    min: 12,
    max: 15,
    rest: 90,
    visual: "straight-pull",
    start: "Face a high cable, hold the bar, and lean forward slightly with soft elbows.",
    movement: "Sweep your mostly straight arms down toward your thighs, then return slowly.",
    tips: ["Keep your elbows softly bent throughout.", "Choose a light weight you can control."],
    mistake: "Turning it into a triceps pushdown by bending your elbows.",
    alternatives: ["Resistance-Band Straight-Arm Pulldown", "Dumbbell Pullover"],
  },
  {
    id: "dumbbell-lateral",
    name: "Dumbbell Lateral Raise",
    target: "Side delts — the shoulder muscles that add width",
    category: "Shoulders",
    sets: 4,
    min: 12,
    max: 20,
    rest: 75,
    visual: "raise",
    start: "Stand with light dumbbells beside your thighs and a small bend in your elbows.",
    movement: "Raise your arms out to the sides to about shoulder height, then lower slowly.",
    tips: ["Keep your shoulders down and neck relaxed.", "Lead with your elbows and use a light weight."],
    mistake: "Swinging your body or shrugging the weights up.",
    alternatives: ["Cable Lateral Raise", "Lateral-Raise Machine"],
  },
  {
    id: "cable-lateral",
    name: "Cable Lateral Raise",
    target: "Side delts — the shoulder muscles that add width",
    category: "Shoulders",
    sets: 2,
    min: 15,
    max: 20,
    rest: 75,
    visual: "raise",
    start: "Stand beside a low cable and hold the handle in the hand farthest from the machine.",
    movement: "Lift your arm out to the side to shoulder height, then lower it slowly across your body.",
    tips: ["Keep a soft elbow and relaxed neck.", "Use a small, controlled range."],
    mistake: "Leaning away or letting the cable pull your arm down quickly.",
    alternatives: ["Dumbbell Lateral Raise", "Lateral-Raise Machine"],
  },
  {
    id: "shoulder-press",
    name: "Shoulder Press",
    target: "Shoulders — mainly the front and side",
    category: "Shoulders",
    sets: 3,
    min: 8,
    max: 12,
    rest: 120,
    visual: "overhead-press",
    start: "Sit with your back supported and handles beside your shoulders.",
    movement: "Press overhead without snapping your elbows straight, then lower with control.",
    tips: ["Keep your ribs down and feet planted.", "Use a comfortable shoulder range."],
    mistake: "Arching your lower back or forcing a painful range.",
    alternatives: ["Dumbbell Shoulder Press", "Landmine Press"],
  },
  {
    id: "rear-delt-fly",
    name: "Rear Delt Fly",
    target: "Rear delts — the back of your shoulders",
    category: "Shoulders",
    sets: 3,
    min: 12,
    max: 20,
    rest: 75,
    visual: "rear-fly",
    start: "Use a reverse pec deck or hinge slightly with light dumbbells hanging below your shoulders.",
    movement: "Move your arms out wide, then bring them back together slowly.",
    tips: ["Keep a soft bend in your elbows.", "Use a light load and steady pace."],
    mistake: "Shrugging or using momentum to swing the weights.",
    alternatives: ["Reverse Pec Deck", "Cable Rear-Delt Fly"],
  },
  {
    id: "preacher-curl",
    name: "Preacher Curl",
    target: "Biceps — front of upper arms",
    category: "Arms",
    sets: 2,
    min: 10,
    max: 15,
    rest: 90,
    visual: "curl",
    start: "Rest your upper arms on the pad and hold the bar or handles with palms up.",
    movement: "Curl the weight toward your shoulders, then lower until your arms are nearly straight.",
    tips: ["Keep your upper arms on the pad.", "Lower more slowly than you lift."],
    mistake: "Bouncing out of the bottom or letting your elbows leave the pad.",
    alternatives: ["Dumbbell Curl", "Cable Curl"],
  },
  {
    id: "pushdown",
    name: "Triceps Pushdown",
    target: "Triceps — back of upper arms",
    category: "Arms",
    sets: 2,
    min: 10,
    max: 15,
    rest: 90,
    visual: "pushdown",
    start: "Stand at a high cable, hold the handle, and keep your elbows near your sides.",
    movement: "Straighten your arms toward your thighs, then return the handle slowly.",
    tips: ["Keep your shoulders relaxed.", "Move your forearms while your upper arms stay still."],
    mistake: "Leaning your body weight onto the handle.",
    alternatives: ["Rope Pushdown", "Overhead Cable Triceps Extension"],
  },
  {
    id: "ab-crunch",
    name: "Ab Crunch",
    target: "Core — stomach muscles",
    category: "Core",
    sets: 2,
    min: 10,
    max: 20,
    rest: 75,
    visual: "crunch",
    start: "Settle into the crunch machine or lie on a mat with knees bent.",
    movement: "Bring your ribs gently toward your hips, then return slowly without pulling your neck.",
    tips: ["Breathe out as you curl.", "Keep the movement small and controlled."],
    mistake: "Pulling on your head or using momentum.",
    alternatives: ["Floor Crunch", "Dead Bug"],
  },
];

const workouts = {
  A: {
    title: "Shoulder Focus",
    focus: "Shoulders",
    subtitle: "Full Body + Shoulder Width",
    exerciseIds: ["squat", "leg-curl", "incline-press", "lat-pulldown", "dumbbell-lateral", "shoulder-press", "rear-delt-fly", "cable-lateral", "preacher-curl", "pushdown", "ab-crunch"],
    setCounts: { "lat-pulldown": 2, "dumbbell-lateral": 4 },
  },
  B: {
    title: "Back / Lat Focus",
    focus: "Back / Lats",
    subtitle: "Full Body + Back Width",
    exerciseIds: ["squat", "leg-curl", "incline-press", "lat-pulldown", "transverse-row", "single-arm-lat", "straight-arm-pulldown", "rear-delt-fly", "dumbbell-lateral", "preacher-curl", "pushdown", "ab-crunch"],
    setCounts: { "lat-pulldown": 3, "transverse-row": 3, "rear-delt-fly": 2, "dumbbell-lateral": 3 },
  },
  C: {
    title: "Chest / Upper Body Focus",
    focus: "Chest + Upper Body",
    subtitle: "Full Body + Upper-Chest Emphasis",
    exerciseIds: ["squat", "leg-curl", "incline-press", "chest-press", "lat-pulldown", "transverse-row", "dumbbell-lateral", "rear-delt-fly", "preacher-curl", "pushdown", "ab-crunch"],
    setCounts: { "incline-press": 3, "lat-pulldown": 3, "transverse-row": 2, "rear-delt-fly": 2, "dumbbell-lateral": 3 },
  },
};

const initialState = {
  setupComplete: false,
  profile: { name: "", age: "", height: "", bodyWeight: "", unit: "kg" },
  settings: { sound: true, vibration: true, xpEnabled: true, animations: true, beginnerMode: true },
  schedule: { 1: true, 2: false, 3: true, 4: false, 5: true, 6: false, 0: false },
  exercises: catalog,
  history: [],
  xp: 0,
  level: 1,
  records: [],
  route: "home",
  currentWorkout: "A",
  lastWorkout: null,
  activeWorkout: null,
  rest: null,
  libraryFilter: "All",
  librarySearch: "",
};

const clone = (value) => JSON.parse(JSON.stringify(value));
const app = document.querySelector("#app");
let state = loadState();
let timerHandle = null;

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    const result = { ...clone(initialState), ...saved };
    result.profile = { ...initialState.profile, ...saved.profile };
    result.settings = { ...initialState.settings, ...saved.settings };
    result.currentWorkout = WORKOUT_ORDER.includes(saved.currentWorkout) ? saved.currentWorkout : "A";
    result.history = Array.isArray(saved.history) ? saved.history : [];
    result.records = Array.isArray(saved.records) ? saved.records : [];
    result.exercises = catalog;
    if (result.activeWorkout && !WORKOUT_ORDER.includes(result.activeWorkout.key)) result.activeWorkout.key = result.currentWorkout;
    if (result.activeWorkout?.complete) result.activeWorkout = null;
    result.route = "home";
    return result;
  } catch (error) {
    console.error("Unable to load saved workout data.", error);
    return clone(initialState);
  }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Unable to save workout data.", error);
    showToast("Could not save. Check device storage.");
  }
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat(undefined, { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

function xpForLevel(level) {
  return 100 + (level - 1) * 100;
}

function currentLevel() {
  let level = 1;
  let remaining = state.xp;
  while (remaining >= xpForLevel(level)) remaining -= xpForLevel(level++);
  return { level, current: remaining, next: xpForLevel(level) };
}

function totalStats() {
  const sets = state.history.flatMap((workout) => workout.sets || []);
  return {
    workouts: state.history.length,
    sets: sets.length,
    reps: sets.reduce((sum, set) => sum + Number(set.reps || 0), 0),
    volume: sets.reduce((sum, set) => sum + Number(set.reps || 0) * Number(set.weight || 0), 0),
  };
}

function lastForExercise(id) {
  for (const workout of [...state.history].reverse()) {
    const sets = (workout.sets || []).filter((set) => set.exerciseId === id);
    if (sets.length) return sets;
  }
  return [];
}

function previousText(id) {
  const sets = lastForExercise(id);
  return sets.length ? sets.map((set) => `${set.weight} ${state.profile.unit} × ${set.reps}`).join(" · ") : "No previous performance yet";
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

function button(text, action, className = "ghost-btn", extra = "") {
  return `<button type="button" class="${className}" data-action="${action}" ${extra}>${text}</button>`;
}

function changeRoute(route) {
  state.route = route;
  saveState();
  render();
  if (state.rest) startTimer();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function nextKey(key) {
  return WORKOUT_ORDER[(WORKOUT_ORDER.indexOf(key) + 1) % WORKOUT_ORDER.length];
}

function workoutLabel(key) {
  return `${key} — ${workouts[key].title}`;
}

function exerciseArt(exercise) {
  const poses = {
    squat: ["M45 45 L31 54 L68 55 L83 45", "M45 45 L34 59 L70 66 L84 49"],
    curl: ["M45 45 L34 67 L50 66 L83 46", "M45 45 L36 58 L58 52 L83 46"],
    press: ["M45 45 L30 39 L30 24 L83 24 L83 39 L69 45", "M45 45 L30 28 L30 14 L83 14 L83 28 L69 45"],
    pulldown: ["M45 45 L32 20 L32 9 L83 9 L83 20 L69 45", "M45 45 L34 36 L34 9 L83 9 L83 36 L69 45"],
    row: ["M45 45 L25 59 L38 64 L70 47", "M45 45 L42 55 L56 59 L70 47"],
    raise: ["M45 45 L32 55 L34 75 L69 75 L71 55 L83 45", "M45 45 L24 38 L27 58 L76 58 L90 38 L83 45"],
    "overhead-press": ["M45 45 L34 54 L38 72 L69 72 L73 54 L83 45", "M45 45 L37 28 L37 12 L69 12 L69 28 L83 45"],
    "rear-fly": ["M45 45 L30 64 L39 69 L70 48", "M45 45 L20 48 L25 61 L76 61 L88 48 L70 48"],
    "straight-pull": ["M45 45 L29 18 L29 8 L83 8 L83 18 L69 45", "M45 45 L29 53 L41 67 L70 45"],
    pushdown: ["M45 45 L31 34 L36 48 L69 48 L79 34 L83 45", "M45 45 L39 60 L42 74 L69 74 L72 60 L83 45"],
    crunch: ["M45 48 L30 62 L48 67 L71 52", "M45 48 L38 59 L57 57 L71 52"],
  };
  const [startArms, moveArms] = poses[exercise.visual] || poses.row;
  const renderFigure = (arms, offset, isMovement) => {
    if (exercise.visual === "crunch") {
      const head = isMovement ? [48, 79] : [32, 108];
      const torso = isMovement
        ? "M56 86 Q70 80 84 104 L96 119 L81 124 L58 109"
        : "M42 103 L69 99 L91 116 L82 126 L58 116 L42 113";
      const crunchArms = isMovement
        ? "M57 88 L48 73 L39 73 M62 90 L70 75 L78 78"
        : "M44 104 L42 92 L34 91 M48 103 L53 91 L62 94";
      return `<g transform="translate(${offset} 0)">
        <circle cx="${head[0]}" cy="${head[1]}" r="9" class="art-skin"/>
        <path d="${torso}" class="art-body"/>
        <path d="${crunchArms} M84 119 L105 117 L124 133 M89 122 L111 121 L132 134" class="art-limbs"/>
        <path d="M65 102 L71 111 M74 101 L79 111" class="art-muscle"/>
        <path d="M19 140 H140" class="art-equipment"/>
      </g>`;
    }
    const legPose = exercise.visual === "squat" && isMovement
      ? "M50 78 L39 92 L47 113 M64 78 L77 92 L70 113"
      : exercise.id === "leg-curl" && isMovement
        ? "M50 78 L48 101 L58 108 L68 96 L74 134"
        : "M50 78 L48 110 L41 134 M64 78 L67 110 L74 134";
    const highlight = exercise.category === "Legs"
      ? `<path d="M47 88 L44 109 M68 88 L70 108" class="art-muscle"/>`
      : exercise.category === "Back"
        ? `<path d="M48 46 Q44 55 49 65 M66 46 Q71 55 65 65" class="art-muscle"/>`
        : exercise.category === "Chest"
          ? `<path d="M49 48 Q57 44 65 48" class="art-muscle"/>`
          : exercise.category === "Arms"
            ? `<path d="M43 52 L37 63 M70 52 L77 63" class="art-muscle"/>`
            : exercise.category === "Core"
              ? `<path d="M54 52 L54 68 M60 52 L60 68" class="art-muscle"/>`
              : `<path d="M42 48 Q47 43 52 48 M64 48 Q70 43 75 48" class="art-muscle"/>`;
    return `<g transform="translate(${offset} 0)">
    <circle cx="57" cy="28" r="10" class="art-skin"/>
    <path d="M50 39 Q57 35 64 39 L70 62 L65 79 L49 79 L44 62Z" class="art-body"/>
    <path d="${arms}" class="art-limbs"/>
    <path d="${legPose}" class="art-limbs"/>
    ${highlight}
    <path d="M33 140 H49 M66 140 H82" class="art-equipment"/>
  </g>`;
  };
  return `<svg class="movement-art" viewBox="0 0 320 178" role="img" aria-label="Offline illustration of ${escapeHtml(exercise.name)}: starting position and movement">
    <rect x="1" y="1" width="318" height="176" rx="14" class="art-background"/>
    <text x="80" y="21" text-anchor="middle" class="art-label">START</text>
    <text x="240" y="21" text-anchor="middle" class="art-label">MOVE</text>
    ${renderFigure(startArms, 18, false)}
    <path d="M140 80 H174 M168 74 L174 80 L168 86" class="art-arrow"/>
    ${renderFigure(moveArms, 178, true)}
    <path d="M18 151 H138 M182 151 H302" class="art-floor"/>
  </svg>`;
}

function renderExerciseGuide(exercise) {
  const photoPath = exercisePhotos[exercise.id];
  const photos = photoPath
    ? [0, 1].map((frame) => `${EXERCISE_IMAGE_BASE}${photoPath}/${frame}.jpg`)
    : [];
  const videoSearch = new URL("https://www.youtube.com/results");
  videoSearch.searchParams.set("search_query", `${exercise.name} correct form exercise shorts`);
  return `<div class="exercise-visual">
    <div class="photo-pair">${photos.map((url, frame) => `<img class="exercise-photo" src="${url}" alt="${escapeHtml(exercise.name)} ${frame ? "movement" : "starting position"} photo" loading="lazy" decoding="async">`).join("")}</div>
    <div class="visual-caption"><span>1 · STARTING POSITION</span><span>2 · MOVEMENT</span></div>
    <div class="visual-fallback" hidden>${exerciseArt(exercise)}</div>
    <div class="media-links"><a href="https://github.com/yuhonas/free-exercise-db" target="_blank" rel="noopener noreferrer">Public-domain exercise photos</a><a class="video-link" href="${videoSearch.href}" target="_blank" rel="noopener noreferrer">▶ Find a short video demo</a></div>
  </div>
    <div class="guide-copy"><p><strong>Start:</strong> ${escapeHtml(exercise.start)}</p><p><strong>Move:</strong> ${escapeHtml(exercise.movement)}</p>
    ${state.settings.beginnerMode ? '<p class="beginner-reminder"><strong>Beginner mode:</strong> Start light, move smoothly, and stop if you feel sharp pain.</p>' : ""}
    <div class="form-note"><strong>FORM TIPS</strong><ul>${exercise.tips.map((tip) => `<li>${escapeHtml(tip)}</li>`).join("")}</ul></div>
    <p class="mistake-note"><strong>AVOID:</strong> ${escapeHtml(exercise.mistake)}</p>
    <details class="alternatives"><summary>See alternatives</summary><div>${exercise.alternatives.map((alternative) => `<button type="button" data-action="set-alternative" data-id="${exercise.id}" data-value="${escapeHtml(alternative)}">${escapeHtml(alternative)}</button>`).join("")}</div></details></div>`;
}

function render() {
  document.querySelectorAll(".nav-item").forEach((item) => item.classList.toggle("active", item.dataset.route === state.route));
  document.querySelector("#soundToggle").textContent = state.settings.sound ? "VOL" : "MUTE";
  app.classList.toggle("beginner-mode", state.settings.beginnerMode);
  app.innerHTML = state.route === "home"
    ? renderHome()
    : state.route === "workout"
      ? renderWorkout()
      : state.route === "library"
        ? renderLibrary()
        : state.route === "progress"
          ? renderProgress()
          : renderSettings();
  if (state.route === "progress") requestAnimationFrame(drawChart);
  if (!state.setupComplete) renderSetupModal();
}

function renderHome() {
  const key = state.activeWorkout?.key || state.currentWorkout;
  const workout = workouts[key];
  const recent = state.history.at(-1);
  const record = state.records.at(-1);
  const stats = totalStats();
  const level = currentLevel();
  const last = state.lastWorkout;
  return `<section class="page">
    <div class="page-heading"><div><p class="eyebrow">YOUR BLOOD HOUNDS TRAINING SYSTEM</p><h1>BLOOD HOUNDS<br>V-TAPER GUIDE</h1></div><span class="accent tiny">${formatDate()}</span></div>
    <div class="today-card"><div class="today-kicker">TODAY'S WORKOUT</div><div class="today-title"><span class="workout-letter">${key}</span><div><h2>WORKOUT ${key}</h2><p>${escapeHtml(workout.title.toUpperCase())}</p></div></div>
      <p class="today-subtitle">${escapeHtml(workout.subtitle)}</p>
      <div class="focus-banner"><span>🔥 MAIN FOCUS</span><strong>${escapeHtml(workout.focus.toUpperCase())}</strong><small>Full body training, with extra attention here.</small></div>
      <div class="home-progress"><div><strong>${state.activeWorkout?.key === key ? completedCount(state.activeWorkout, workout) : 0} / ${workout.exerciseIds.length}</strong><span> exercises complete</span></div><div class="progress-track"><span style="width:${state.activeWorkout?.key === key ? completionPercent(state.activeWorkout, workout) : 0}%"></span></div></div>
      <button class="primary-btn wide-btn" data-action="start-workout">${state.activeWorkout?.key === key ? "CONTINUE WORKOUT" : "START WORKOUT " + key}</button>
    </div>
    <div class="rotation-grid"><div class="panel rotation-card"><small>LAST WORKOUT</small><strong>${last ? `Workout ${escapeHtml(last.key)}` : "Not yet started"}</strong><span>${last ? escapeHtml(workouts[last.key]?.focus || "") : "Your first session is ready"}</span></div><div class="panel rotation-card"><small>NEXT GYM SESSION</small><strong>Workout ${key}</strong><span>${escapeHtml(workout.title)}</span></div></div>
    <div class="rest-reminder"><strong>REST DAY?</strong><span>Rest between sessions. Your workout rotation waits for you—no calendar schedule needed.</span></div>
    <p class="section-label">YOUR TRAINING</p><div class="grid-2"><div class="stat-card"><small>WORKOUTS</small><strong>${stats.workouts}</strong></div><div class="stat-card violet"><small>LEVEL</small><strong>${level.level}</strong></div><div class="stat-card lime"><small>SETS LOGGED</small><strong>${stats.sets}</strong></div><div class="stat-card"><small>TOTAL VOLUME</small><strong>${Math.round(stats.volume).toLocaleString()} <em>${state.profile.unit}</em></strong></div></div>
    <div class="panel xp-summary"><div><strong>LEVEL ${level.level}</strong><span>${state.xp} XP total</span></div><div class="xp-bar"><span style="width:${Math.min(100, (level.current / level.next) * 100)}%"></span></div></div>
    <p class="section-label">RECENT SESSION</p><div class="panel recent-panel">${recent ? `<strong>Workout ${escapeHtml(recent.key || "?")} · ${escapeHtml(workouts[recent.key]?.title || "Full Body")}</strong><p>${formatDate(recent.date)} · ${recent.sets.length} sets logged</p>` : '<p class="muted">No completed workouts yet. Your A → B → C rotation starts here.</p>'}</div>
    ${record ? `<div class="personal-best"><small>LATEST PERSONAL BEST</small><strong>${escapeHtml(record.name)} · ${record.weight} ${state.profile.unit} × ${record.reps}</strong></div>` : ""}
  </section>`;
}

function completedCount(active, workout) {
  const key = Object.keys(workouts).find((candidate) => workouts[candidate] === workout) || active.key;
  return workout.exerciseIds.filter((id) => (active.sets || []).filter((set) => set.exerciseId === id).length >= workoutSets(id, key)).length;
}

function completionPercent(active, workout) {
  return Math.round((completedCount(active, workout) / workout.exerciseIds.length) * 100);
}

function getExercise(id) {
  return catalog.find((exercise) => exercise.id === id);
}

function workoutSets(id, key) {
  return workouts[key]?.setCounts?.[id] || getExercise(id).sets;
}

function activeExerciseIds() {
  return workouts[state.activeWorkout?.key || state.currentWorkout].exerciseIds;
}

function renderWorkout() {
  if (state.activeWorkout?.complete) return renderComplete();
  const key = state.activeWorkout?.key || state.currentWorkout;
  const workout = workouts[key];
  const active = state.activeWorkout;
  const done = active ? completedCount(active, workout) : 0;
  return `<section class="page"><div class="page-heading workout-heading"><div><p class="eyebrow">TODAY'S WORKOUT · A → REST → B → REST → C</p><h1>WORKOUT ${key}</h1><p>${escapeHtml(workout.title)} · Full body</p></div>${active ? `<span class="timer-pill" id="session-time">${formatTimer(Math.max(0, Math.floor((Date.now() - active.startedAt) / 1000)))}</span>` : ""}</div>
    <div class="focus-banner workout-focus"><span>🔥 MAIN FOCUS</span><strong>${escapeHtml(workout.focus.toUpperCase())}</strong><small>${escapeHtml(workout.subtitle)}</small></div>
    <div class="warmup-strip"><strong>WARM UP</strong><span>5–10 min easy cardio · shoulder mobility · a few light warm-up sets before your first working set.</span></div>
    <div class="progress-summary"><div><strong>${done} / ${workout.exerciseIds.length} exercises</strong><span>${completionPercent(active || { sets: [] }, workout)}% complete</span></div><div class="progress-track"><span style="width:${completionPercent(active || { sets: [] }, workout)}%"></span></div></div>
    <div class="workout-actions">${button("GYM MODE", "gym-mode", "ghost-btn")}${active ? button("FINISH WORKOUT", "end-workout", "ghost-btn") : ""}</div>
    <div class="exercise-list">${workout.exerciseIds.map((id, index) => renderExerciseCard(getExercise(id), index, active, false, key)).join("")}</div>
    ${active && state.rest ? renderRestFor(state.rest.exerciseId) : ""}</section>`;
}

function renderExerciseCard(exercise, index, active, library = false, workoutKey = state.currentWorkout) {
  const targetSets = library ? exercise.sets : workoutSets(exercise.id, active?.key || workoutKey);
  const loggedSets = (active?.sets || []).filter((set) => set.exerciseId === exercise.id);
  const complete = loggedSets.length >= targetSets;
  const selectedAlternative = active?.exerciseOptions?.[exercise.id] || exercise.name;
  const last = lastForExercise(exercise.id);
  const current = loggedSets.length ? `${loggedSets.at(-1).weight} ${state.profile.unit} × ${loggedSets.at(-1).reps}` : "No sets logged yet";
  return `<article class="exercise-card ${complete ? "exercise-done" : ""} ${active?.focusedExercise === exercise.id ? "exercise-focused" : ""}" id="exercise-${exercise.id}">
    <div class="exercise-top"><div class="exercise-number">${String(index + 1).padStart(2, "0")}</div><div class="exercise-title-wrap"><h2>${escapeHtml(selectedAlternative)}</h2><p class="target">${escapeHtml(exercise.target)}</p></div>${complete ? '<span class="done-badge">✓ DONE</span>' : ""}</div>
    ${renderExerciseGuide(exercise)}
    <div class="prescription"><strong>${targetSets} sets × ${exercise.min}–${exercise.max} reps</strong><span>${escapeHtml(exercise.category)} · Rest ${Math.round(exercise.rest / 60)} min</span></div>
    <div class="performance-grid"><div><small>LAST TIME</small><p>${last.length ? `${last.at(-1).weight} ${state.profile.unit} × ${last.at(-1).reps}` : "First time — record a baseline"}</p></div><div><small>CURRENT</small><p>${escapeHtml(current)}</p></div></div>
    ${library ? "" : `<div class="set-log">${loggedSets.map((set, setIndex) => `<div class="logged-set"><span>Set ${setIndex + 1}</span><strong>${set.weight} ${state.profile.unit} × ${set.reps} reps</strong><span>✓</span></div>`).join("")}</div>
    ${complete ? '<div class="exercise-complete-note">Exercise complete. Move on when you are ready.</div>' : `<div class="set-controls"><label class="input-label">WEIGHT (${state.profile.unit})<input class="number-input weight-input" type="number" min="0" step="0.5" value="${loggedSets.at(-1)?.weight ?? last.at(-1)?.weight ?? ""}" placeholder="0"></label><label class="input-label">REPS<input class="number-input reps-input" type="number" min="${exercise.min}" max="${exercise.max}" value="${loggedSets.at(-1)?.reps ?? exercise.min}" inputmode="numeric"></label></div>
    <button class="complete-btn" data-action="${active ? "complete-set" : "start-exercise"}" data-id="${exercise.id}">${active ? `☑  RECORD SET ${loggedSets.length + 1} OF ${targetSets}` : "START EXERCISE"}</button>`}`}</article>`;
}

function renderRestFor() {
  if (!state.rest) return "";
  const remaining = Math.max(0, Math.ceil((state.rest.endsAt - Date.now()) / 1000));
  return `<div class="panel rest-panel"><div class="system-label">REST BETWEEN SETS</div><div class="countdown" data-countdown>${formatTimer(remaining)}</div><p>Take a breather. Continue when you feel ready.</p><div class="timer-actions">${button("+30 SEC", "add-time:30")}${button("SKIP REST", "skip-rest", "ghost-btn")}</div></div>`;
}

function renderComplete() {
  const workout = state.activeWorkout;
  const key = workout.key;
  const next = workout.nextWorkout || nextKey(key);
  const definition = workouts[key];
  const count = completedCount(workout, definition);
  return `<section class="page"><div class="page-heading"><div><p class="eyebrow">SESSION SAVED</p><h1>WORKOUT COMPLETE 🎉</h1></div></div>
    <div class="today-card completion-card"><div class="focus-banner"><span>MAIN FOCUS</span><strong>${escapeHtml(definition.focus.toUpperCase())}</strong></div>
      <div class="summary-line"><span>Workout</span><strong>${escapeHtml(workoutLabel(key))}</strong></div>
      <div class="summary-line"><span>Exercises</span><strong>${definition.exerciseIds.length}</strong></div>
      <div class="summary-line"><span>Completed</span><strong>${count} / ${definition.exerciseIds.length}</strong></div>
      <div class="summary-line"><span>Sets logged</span><strong>${workout.sets.length}</strong></div>
      <div class="next-session"><small>NEXT GYM SESSION</small><strong>WORKOUT ${next} — ${escapeHtml(workouts[next].title.toUpperCase())}</strong></div>
      <div class="rest-reminder"><strong>REST TODAY</strong><span>Take at least one rest day. Your next gym session stays Workout ${next}—whenever you are ready.</span></div>
      <p class="completion-message">Good work showing up. Pick up the rotation next time.</p>
      <button class="primary-btn wide-btn" data-action="finish-workout">DONE</button>
    </div></section>`;
}

function renderLibrary() {
  const filter = state.libraryFilter || "All";
  const search = state.librarySearch || "";
  const filtered = catalog.filter((exercise) => (filter === "All" || exercise.category === filter) && `${exercise.name} ${exercise.target} ${exercise.category}`.toLowerCase().includes(search.toLowerCase()));
  const filters = ["All", "Shoulders", "Back", "Chest", "Legs", "Arms", "Core"];
  return `<section class="page"><div class="page-heading"><div><p class="eyebrow">OFFLINE EXERCISE GUIDES</p><h1>EXERCISE<br>LIBRARY</h1></div><span class="accent tiny">${catalog.length} GUIDES</span></div>
    <label class="library-search"><span>SEARCH EXERCISES</span><input id="library-search" class="number-input" type="search" placeholder="Try shoulder, back, chest…" value="${escapeHtml(search)}"></label>
    <div class="filter-row library-filters">${filters.map((category) => button(category, `filter:${category}`, `choice-btn ${filter === category ? "active" : ""}`)).join("")}</div>
    <div class="exercise-list">${filtered.map((exercise, index) => renderExerciseCard(exercise, index, null, true)).join("") || '<p class="muted">No exercises match that search. Try a different muscle or exercise name.</p>'}</div>
  </section>`;
}

function renderProgress() {
  const stats = totalStats();
  const level = currentLevel();
  const priorities = [["Shoulder Width", 5], ["Back Width", 5], ["Rear Delts", 4], ["Upper Chest", 4], ["Arms", 3], ["Legs", 3], ["Core", 3]];
  const choices = catalog.slice(0, 8);
  return `<section class="page"><div class="page-heading"><div><p class="eyebrow">YOUR TRAINING DASHBOARD</p><h1>PROGRESS</h1></div><span class="accent tiny">LEVEL ${level.level}</span></div>
    <p class="section-label">V-TAPER PRIORITIES</p><div class="panel priorities-panel">${priorities.map(([label, score]) => `<div class="priority-row"><strong>${label}</strong><span class="stars" aria-label="${score} out of 5 stars">${"★".repeat(score)}<span>${"☆".repeat(5 - score)}</span></span></div>`).join("")}<p class="muted priority-explainer">The V-taper comes mainly from developing wider shoulders and lats while keeping the waist relatively lean. Your individual results and timeline will vary.</p></div>
    <div class="effort-panel"><strong>EFFORT GUIDE · RIR</strong><p><b>RIR</b> means “reps in reserve.” Most sets, stop when you feel you could still do about <b>1–3 good reps</b>. You do not need to take every set to failure.</p></div>
    <div class="effort-panel"><strong>PROGRESSIVE OVERLOAD</strong><p>Gradually add a rep or a little weight over time while keeping good form. Compare your “Last time” and “Current” exercise notes.</p></div>
    <div class="grid-2 progress-stats"><div class="stat-card"><small>WORKOUTS</small><strong>${stats.workouts}</strong></div><div class="stat-card violet"><small>SETS LOGGED</small><strong>${stats.sets}</strong></div><div class="stat-card lime"><small>TOTAL REPS</small><strong>${stats.reps}</strong></div><div class="stat-card"><small>WORKING VOLUME</small><strong>${Math.round(stats.volume).toLocaleString()} <em>${state.profile.unit}</em></strong></div></div>
    <p class="section-label">EXERCISE PROGRESSION</p><div class="panel"><div class="filter-row">${choices.map((exercise, index) => button(exercise.name, `chart-exercise:${exercise.id}`, `choice-btn ${index === 0 ? "active" : ""}`)).join("")}</div><div class="chart-wrap"><canvas id="progress-chart" aria-label="Exercise weight progress chart"></canvas></div></div>
    <p class="section-label">WORKOUT HISTORY</p><div class="panel">${state.history.length ? [...state.history].reverse().map((workout, index) => `<button type="button" class="history-item" data-action="view-workout" data-index="${state.history.length - index - 1}"><span><strong>Workout ${escapeHtml(workout.key || "?")} · ${escapeHtml(workouts[workout.key]?.title || "Full Body")}</strong><small>${formatDate(workout.date)} · ${workout.sets.length} sets · ${workout.duration || 0} min</small></span><b>+${workout.xp || 0} XP</b></button>`).join("") : '<p class="muted">Your workout history will appear here.</p>'}</div>
  </section>`;
}

function renderSettings() {
  return `<section class="page"><div class="page-heading"><div><p class="eyebrow">PERSONAL WORKOUT SYSTEM</p><h1>SETTINGS</h1></div></div>
    <p class="section-label">ROTATION</p><div class="panel settings-rotation"><div><small>NEXT SESSION</small><strong>WORKOUT ${state.currentWorkout} — ${escapeHtml(workouts[state.currentWorkout].title)}</strong></div>${button("RESET ROTATION", "reset-rotation", "danger-btn")}</div>
    <p class="section-label">PREFERENCES</p><div class="panel settings-list">${settingToggle("BEGINNER MODE", "Show clear cues, explanations, and form reminders", "beginnerMode")}${settingToggle("XP SYSTEM", "Optional workout levels and rewards", "xpEnabled")}${settingToggle("VIBRATION", "Rest timer alert when supported", "vibration")}${settingToggle("ANIMATIONS", "Subtle interface motion", "animations")}
      <div class="setting-row"><div><label>WEIGHT UNIT</label><small>Display preference for workout records</small></div><select id="unit-select" class="number-input" style="width:90px"><option ${state.profile.unit === "kg" ? "selected" : ""}>kg</option><option ${state.profile.unit === "lb" ? "selected" : ""}>lb</option></select></div></div>
    <p class="section-label">YOUR PROFILE & DATA</p><div class="panel"><div class="action-row">${button("EDIT PROFILE", "edit-profile", "ghost-btn")}${button("EXPORT DATA", "export-data", "primary-btn")}${button("IMPORT DATA", "import-data", "ghost-btn")}</div><div class="action-row" style="margin-top:10px">${button("RESET ALL DATA", "reset-data", "danger-btn")}</div></div>
    <p class="offline-note">Your workouts, exercise illustrations, and saved progress are stored on this device. The app shell is available offline after the first visit.</p>
    <input type="file" id="import-file" accept="application/json" hidden>
  </section>`;
}

function settingToggle(label, hint, key) {
  return `<div class="setting-row"><div><label>${label}</label><small>${hint}</small></div><button type="button" class="toggle ${state.settings[key] ? "on" : ""}" data-action="toggle-setting" data-key="${key}" aria-label="Toggle ${label}" aria-pressed="${state.settings[key]}"></button></div>`;
}

function formatTimer(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function startWorkout() {
  if (state.activeWorkout?.complete) {
    changeRoute("workout");
    return;
  }
  if (!state.activeWorkout) {
    state.activeWorkout = { key: state.currentWorkout, startedAt: Date.now(), sets: [], exerciseOptions: {}, focusedExercise: null, complete: false };
    state.rest = null;
    saveState();
  }
  changeRoute("workout");
  if (!state.activeWorkout.warmupSeen) renderWarmupModal();
}

function renderWarmupModal() {
  const key = state.activeWorkout.key;
  const focusTip = key === "A" ? "Add a few shoulder circles and gentle arm raises." : "Add a few easy, controlled warm-up sets for your first lifts.";
  document.querySelector("#modal-root").innerHTML = `<div class="modal-backdrop"><div class="modal"><p class="eyebrow">BEFORE YOU BEGIN</p><h2>QUICK WARM-UP</h2><p>5–10 minutes of light cardio, a little mobility, then light warm-up sets before your working sets. ${focusTip}</p><p>Warm-ups should feel easy. Stop if something hurts.</p><div class="action-row"><button type="button" class="primary-btn" data-action="begin-workout">START WORKOUT</button></div></div></div>`;
}

function beginWorkout() {
  state.activeWorkout.warmupSeen = true;
  saveState();
  document.querySelector("#modal-root").innerHTML = "";
  render();
}

function startExercise(id, target) {
  if (!state.activeWorkout) {
    state.activeWorkout = { key: state.currentWorkout, startedAt: Date.now(), sets: [], exerciseOptions: {}, focusedExercise: id, complete: false, warmupSeen: true };
  }
  state.activeWorkout.focusedExercise = id;
  state.activeWorkout.exerciseOptions ||= {};
  const option = target.closest(".exercise-card");
  const weight = option.querySelector(".weight-input").value;
  const reps = option.querySelector(".reps-input").value;
  saveState();
  render();
  scrollToExercise(id);
  const card = document.querySelector(`#exercise-${id}`);
  if (weight) card.querySelector(".weight-input").value = weight;
  if (reps) card.querySelector(".reps-input").value = reps;
}

function scrollToExercise(id) {
  requestAnimationFrame(() => document.querySelector(`#exercise-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
}

function completeSet(target) {
  const card = target.closest(".exercise-card");
  const id = target.dataset.id;
  const exercise = getExercise(id);
  const weight = Number(card.querySelector(".weight-input").value || 0);
  const reps = Number(card.querySelector(".reps-input").value || 0);
  if (!Number.isFinite(weight) || weight < 0) return showToast("Enter a valid weight.");
  if (!Number.isInteger(reps) || reps < exercise.min || reps > exercise.max) return showToast(`Enter ${exercise.min}–${exercise.max} reps.`);
  const loggedSets = state.activeWorkout.sets.filter((set) => set.exerciseId === id);
  const targetSets = workoutSets(id, state.activeWorkout.key);
  if (loggedSets.length >= targetSets) return showToast("This exercise is already complete.");
  const set = {
    exerciseId: id,
    name: state.activeWorkout.exerciseOptions?.[id] || exercise.name,
    weight,
    reps,
    timestamp: Date.now(),
  };
  state.activeWorkout.sets.push(set);
  const previousBest = Math.max(0, ...state.history.flatMap((workout) => (workout.sets || []).filter((item) => item.exerciseId === id).map((item) => item.weight * item.reps)));
  const isPersonalBest = weight * reps > previousBest && weight > 0;
  if (isPersonalBest) {
    state.records.push({ name: set.name, weight, reps, date: Date.now() });
    awardXP(50);
  } else {
    awardXP(5);
  }
  const exerciseDone = loggedSets.length + 1 >= targetSets;
  const definition = workouts[state.activeWorkout.key];
  const nextExercise = definition.exerciseIds.find((exerciseId) => {
    const candidate = getExercise(exerciseId);
    const count = state.activeWorkout.sets.filter((logged) => logged.exerciseId === exerciseId).length;
    return count < workoutSets(exerciseId, state.activeWorkout.key);
  });
  if (exerciseDone) state.activeWorkout.focusedExercise = nextExercise || null;
  state.rest = { exerciseId: id, endsAt: Date.now() + exercise.rest * 1000 };
  saveState();
  render();
  startTimer();
  showToast(isPersonalBest ? "NEW PERSONAL BEST · SET SAVED" : exerciseDone ? "EXERCISE COMPLETE · NEXT UP" : "SET SAVED · REST STARTED");
  if (exerciseDone && nextExercise) scrollToExercise(nextExercise);
}

function setAlternative(id, alternative) {
  if (state.activeWorkout) {
    state.activeWorkout.exerciseOptions ||= {};
    state.activeWorkout.exerciseOptions[id] = alternative;
    saveState();
    document.querySelector(`#exercise-${id} .exercise-title-wrap h2`).textContent = alternative;
    showToast(`${alternative} selected.`);
    return;
  }
  showToast(`${alternative} is an option for your next workout.`);
}

function awardXP(amount) {
  if (!state.settings.xpEnabled) return;
  state.xp += amount;
  state.level = currentLevel().level;
}

function startTimer() {
  clearInterval(timerHandle);
  timerHandle = setInterval(() => {
    if (!state.rest) return clearInterval(timerHandle);
    const remaining = Math.max(0, Math.ceil((state.rest.endsAt - Date.now()) / 1000));
    const countdown = document.querySelector("[data-countdown]");
    if (countdown) countdown.textContent = formatTimer(remaining);
    if (!remaining) {
      clearInterval(timerHandle);
      state.rest = null;
      saveState();
      if (state.settings.vibration && navigator.vibrate) navigator.vibrate([200, 100, 200]);
      showToast("REST COMPLETE · CONTINUE WHEN READY");
      render();
    }
  }, 500);
}

function skipRest() {
  state.rest = null;
  clearInterval(timerHandle);
  saveState();
  render();
}

function addTime(seconds) {
  if (!state.rest) return;
  state.rest.endsAt += seconds * 1000;
  saveState();
  render();
  startTimer();
}

function endWorkout() {
  if (!state.activeWorkout?.sets.length) return showToast("Log at least one set before finishing.");
  const workout = state.activeWorkout;
  workout.complete = true;
  workout.duration = Math.max(1, Math.round((Date.now() - workout.startedAt) / 60000));
  workout.date = Date.now();
  workout.nextWorkout = workout.resetRotationAfter ? "A" : nextKey(workout.key);
  workout.xp = workout.sets.length * 20 + 100;
  awardXP(workout.xp);
  state.history.push(workout);
  state.lastWorkout = { key: workout.key, date: workout.date };
  state.currentWorkout = workout.nextWorkout;
  state.rest = null;
  clearInterval(timerHandle);
  saveState();
  render();
}

function finishWorkout() {
  state.activeWorkout = null;
  state.rest = null;
  saveState();
  changeRoute("home");
}

function renderWorkoutDetails(workout) {
  if (!workout) return;
  document.querySelector("#modal-root").innerHTML = `<div class="modal-backdrop"><div class="modal"><p class="eyebrow">SAVED WORKOUT</p><h2>WORKOUT ${escapeHtml(workout.key || "?")}</h2><p>${formatDate(workout.date)} · ${workout.sets.length} working sets</p>${workout.sets.map((set) => `<div class="recent-row"><div><h3>${escapeHtml(set.name)}</h3><p>${set.weight} ${state.profile.unit} × ${set.reps} reps</p></div></div>`).join("")}<div class="action-row" style="margin-top:16px">${button("CLOSE", "close-modal", "primary-btn")}</div></div></div>`;
}

function renderSetupModal() {
  document.querySelector("#modal-root").innerHTML = `<div class="modal-backdrop"><div class="modal"><p class="eyebrow">WELCOME TO YOUR WORKOUT GUIDE</p><h2>LET'S SET UP</h2><p>Your A → B → C workout rotation and exercise guides are ready. Add a name or preferred weight unit if you like.</p><form id="setup-form" class="form-grid"><label>NICKNAME (OPTIONAL)<input name="name" placeholder="Your name"></label><label>WEIGHT UNIT<select name="unit"><option>kg</option><option>lb</option></select></label><button class="primary-btn" type="submit">OPEN MY WORKOUT</button></form></div></div>`;
}

function editProfile() {
  document.querySelector("#modal-root").innerHTML = `<div class="modal-backdrop"><div class="modal"><p class="eyebrow">YOUR PROFILE</p><h2>EDIT DETAILS</h2><form id="profile-form" class="form-grid"><label>NICKNAME<input name="name" value="${escapeHtml(state.profile.name)}"></label><label>AGE<input name="age" type="number" value="${escapeHtml(state.profile.age)}"></label><label>HEIGHT<input name="height" type="number" value="${escapeHtml(state.profile.height)}"></label><label>BODY WEIGHT<input name="bodyWeight" type="number" value="${escapeHtml(state.profile.bodyWeight)}"></label><button class="primary-btn" type="submit">SAVE PROFILE</button></form></div></div>`;
}

function drawChart() {
  const canvas = document.querySelector("#progress-chart");
  if (!canvas) return;
  const context = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  canvas.width = canvas.clientWidth * ratio;
  canvas.height = canvas.clientHeight * ratio;
  context.scale(ratio, ratio);
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  context.clearRect(0, 0, width, height);
  const id = document.querySelector("[data-action^='chart-exercise:'].active")?.dataset.id || catalog[0].id;
  const values = state.history.flatMap((workout) => (workout.sets || []).filter((set) => set.exerciseId === id)).map((set) => Number(set.weight)).filter(Number.isFinite);
  if (!values.length) {
    context.fillStyle = "#9baec0";
    context.font = "13px sans-serif";
    context.fillText("Log an exercise to see your progress here.", 8, 30);
    return;
  }
  const max = Math.max(...values, 1);
  context.strokeStyle = "rgba(110,226,255,.18)";
  for (let index = 1; index < 5; index++) {
    const y = height - (index * height) / 5;
    context.beginPath(); context.moveTo(0, y); context.lineTo(width, y); context.stroke();
  }
  context.strokeStyle = "#f02f43";
  context.lineWidth = 3;
  context.beginPath();
  values.forEach((value, index) => {
    const x = values.length === 1 ? width / 2 : (index * width) / (values.length - 1);
    const y = height - (value / max) * (height - 20) - 10;
    index ? context.lineTo(x, y) : context.moveTo(x, y);
  });
  context.stroke();
  values.forEach((value, index) => {
    const x = values.length === 1 ? width / 2 : (index * width) / (values.length - 1);
    const y = height - (value / max) * (height - 20) - 10;
    context.fillStyle = "#07101b"; context.beginPath(); context.arc(x, y, 5, 0, Math.PI * 2); context.fill();
    context.strokeStyle = "#f02f43"; context.stroke();
  });
}

function exportData() {
  const file = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "v-taper-workout-data.json";
  link.click();
  URL.revokeObjectURL(url);
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "start-workout") return startWorkout();
  if (action === "start-exercise") return startExercise(target.dataset.id, target);
  if (action === "begin-workout") return beginWorkout();
  if (action === "complete-set") return completeSet(target);
  if (action === "end-workout") return endWorkout();
  if (action === "finish-workout") return finishWorkout();
  if (action === "skip-rest") return skipRest();
  if (action.startsWith("add-time:")) return addTime(Number(action.split(":")[1]));
  if (action === "gym-mode") {
    document.body.classList.toggle("gym-mode");
    target.textContent = document.body.classList.contains("gym-mode") ? "EXIT GYM MODE" : "GYM MODE";
    return;
  }
  if (action === "toggle-setting") {
    state.settings[target.dataset.key] = !state.settings[target.dataset.key];
    saveState(); render(); return;
  }
  if (action === "reset-rotation") {
    document.querySelector("#modal-root").innerHTML = `<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true" aria-labelledby="reset-rotation-title"><p class="eyebrow">ROTATION SETTINGS</p><h2 id="reset-rotation-title">RESET TO WORKOUT A?</h2><p>Your next gym session will be Workout A. Saved workout history and progress stay on this device.${state.activeWorkout && !state.activeWorkout.complete ? " Your current workout stays in progress." : ""}</p><div class="action-row">${button("KEEP CURRENT ROTATION", "close-modal", "ghost-btn")}${button("RESET TO A", "confirm-reset-rotation", "danger-btn")}</div></div></div>`;
    return;
  }
  if (action === "confirm-reset-rotation") {
    state.currentWorkout = "A";
    if (state.activeWorkout && !state.activeWorkout.complete) state.activeWorkout.resetRotationAfter = true;
    else {
      state.activeWorkout = null;
      state.rest = null;
    }
    document.querySelector("#modal-root").innerHTML = "";
    saveState(); render(); showToast("ROTATION RESET · WORKOUT A");
    return;
  }
  if (action === "reset-data") {
    if (!confirm("Reset all workout history, settings, and rotation on this device? This cannot be undone.")) return;
    localStorage.removeItem(STORAGE_KEY);
    state = clone(initialState); render(); return;
  }
  if (action === "edit-profile") return editProfile();
  if (action === "view-workout") return renderWorkoutDetails(state.history[Number(target.dataset.index)]);
  if (action === "export-data") return exportData();
  if (action === "import-data") return document.querySelector("#import-file").click();
  if (action === "close-modal") {
    if (state.activeWorkout) beginWorkout();
    else document.querySelector("#modal-root").innerHTML = "";
    return;
  }
  if (action === "set-alternative") return setAlternative(target.dataset.id, target.dataset.value);
  if (action.startsWith("filter:")) {
    state.libraryFilter = action.slice(7);
    render();
    return;
  }
  if (action.startsWith("chart-exercise:")) {
    document.querySelectorAll("[data-action^='chart-exercise:']").forEach((button) => button.classList.remove("active"));
    target.classList.add("active");
    drawChart();
  }
});

document.addEventListener("error", (event) => {
  const image = event.target;
  if (!(image instanceof HTMLImageElement) || !image.classList.contains("exercise-photo")) return;
  image.hidden = true;
  const visual = image.closest(".exercise-visual");
  if (!visual.querySelector(".exercise-photo:not([hidden])")) visual.querySelector(".visual-fallback").hidden = false;
}, true);

document.querySelector(".bottom-nav").addEventListener("click", (event) => {
  const item = event.target.closest("[data-route]");
  if (item) changeRoute(item.dataset.route);
});

document.querySelector("#soundToggle").addEventListener("click", () => {
  state.settings.sound = !state.settings.sound;
  saveState(); render();
  showToast(state.settings.sound ? "SOUND ON" : "SOUND OFF");
});

document.addEventListener("input", (event) => {
  if (event.target.id === "library-search") {
    state.librarySearch = event.target.value;
    const position = event.target.selectionStart;
    render();
    const search = document.querySelector("#library-search");
    search.focus();
    search.setSelectionRange(position, position);
  }
});

document.addEventListener("submit", (event) => {
  if (event.target.id === "setup-form") {
    event.preventDefault();
    const form = new FormData(event.target);
    state.profile.name = form.get("name");
    state.profile.unit = form.get("unit");
    state.setupComplete = true;
    saveState();
    document.querySelector("#modal-root").innerHTML = "";
    render();
    return;
  }
  if (event.target.id === "profile-form") {
    event.preventDefault();
    const form = new FormData(event.target);
    ["name", "age", "height", "bodyWeight"].forEach((key) => { state.profile[key] = form.get(key); });
    saveState();
    document.querySelector("#modal-root").innerHTML = "";
    render();
  }
});

document.addEventListener("change", (event) => {
  if (event.target.id === "unit-select") {
    state.profile.unit = event.target.value;
    saveState(); render(); return;
  }
  if (event.target.id === "import-file") {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(reader.result);
        state = { ...clone(initialState), ...imported, profile: { ...initialState.profile, ...imported.profile }, settings: { ...initialState.settings, ...imported.settings }, exercises: catalog };
        state.currentWorkout = WORKOUT_ORDER.includes(state.currentWorkout) ? state.currentWorkout : "A";
        if (state.activeWorkout && !WORKOUT_ORDER.includes(state.activeWorkout.key)) state.activeWorkout.key = state.currentWorkout;
        saveState(); render(); showToast("DATA IMPORTED");
      } catch (error) {
        console.error("Unable to import workout data.", error);
        showToast("Import failed. Choose a valid workout data file.");
      }
    };
    reader.readAsText(file);
  }
});

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch((error) => console.error("Offline app setup failed.", error)));
}

render();
