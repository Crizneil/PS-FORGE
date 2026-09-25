const STORAGE_KEY = "forge-system-state-v1";
const defaultExercises = [
  { id: "leg-press", name: "Leg Press", sets: 2, min: 8, max: 12, rest: 150 },
  {
    id: "leg-curl",
    name: "Leg Curl",
    sets: 1,
    maxSets: 2,
    min: 8,
    max: 12,
    rest: 105,
  },
  {
    id: "incline-press",
    name: "Incline Press",
    sets: 2,
    min: 8,
    max: 12,
    rest: 150,
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    sets: 2,
    min: 8,
    max: 12,
    rest: 120,
  },
  {
    id: "transverse-row",
    name: "Transverse Row",
    sets: 2,
    min: 8,
    max: 12,
    rest: 120,
  },
  {
    id: "lateral-raise",
    name: "Lateral Raise",
    sets: 2,
    min: 10,
    max: 15,
    rest: 75,
  },
  {
    id: "preacher-curl",
    name: "Preacher Curl",
    sets: 1,
    maxSets: 2,
    min: 8,
    max: 12,
    rest: 90,
  },
  {
    id: "pushdown",
    name: "Pushdown",
    sets: 1,
    maxSets: 2,
    min: 8,
    max: 12,
    rest: 90,
  },
  { id: "ab-crunch", name: "Ab Crunch", sets: 2, min: 10, max: 15, rest: 75 },
];
const initialState = {
  setupComplete: false,
  profile: { name: "", age: "", height: "", bodyWeight: "", unit: "kg" },
  settings: { sound: true, vibration: true, xpEnabled: true, animations: true },
  schedule: {
    1: true,
    2: false,
    3: true,
    4: false,
    5: true,
    6: false,
    0: false,
  },
  exercises: defaultExercises,
  history: [],
  xp: 0,
  level: 1,
  records: [],
  route: "home",
  activeWorkout: null,
  rest: null,
};
let state = loadState();
let timerHandle = null;
const app = document.querySelector("#app");

function loadState() {
  try {
    return {
      ...initialState,
      ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"),
    };
  } catch {
    return structuredClone(initialState);
  }
}
function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
function dayName(day) {
  return [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ][day];
}
function scheduledDays() {
  return Object.keys(state.schedule)
    .filter((day) => state.schedule[day])
    .map(Number);
}
function xpForLevel(level) {
  return 100 + (level - 1) * 100;
}
function currentLevel() {
  let level = 1;
  let remaining = state.xp;
  while (remaining >= xpForLevel(level)) {
    remaining -= xpForLevel(level);
    level++;
  }
  return { level, current: remaining, next: xpForLevel(level) };
}
function totalStats() {
  const workouts = state.history;
  const sets = workouts.flatMap((workout) => workout.sets || []);
  return {
    workouts: workouts.length,
    sets: sets.length,
    reps: sets.reduce((sum, set) => sum + Number(set.reps || 0), 0),
    volume: sets.reduce(
      (sum, set) => sum + Number(set.reps || 0) * Number(set.weight || 0),
      0,
    ),
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
  return sets.length
    ? sets
        .map((set) => `${set.weight} ${state.profile.unit} x ${set.reps}`)
        .join("  /  ")
    : "No previous record";
}
function nextWorkoutDay() {
  const today = new Date().getDay();
  for (let offset = 0; offset <= 7; offset++) {
    const day = (today + offset) % 7;
    if (state.schedule[day]) return { day, offset };
  }
  return { day: 1, offset: 1 };
}
function streak() {
  let count = 0;
  let cursor = new Date();
  const dates = new Set(
    state.history.map((workout) => new Date(workout.date).toDateString()),
  );
  while (dates.has(cursor.toDateString())) {
    count++;
    cursor.setDate(cursor.getDate() - 1);
  }
  return count;
}
function showToast(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2400);
}
function changeRoute(route) {
  state.route = route;
  saveState();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function button(text, action, className = "ghost-btn") {
  return `<button class="${className}" data-action="${action}">${text}</button>`;
}

const exerciseGuides = {
  "leg-press": {
    type: "press",
    target: "QUADS + GLUTES",
    image: "Leg_Press/0.jpg",
    cue: "Drive through your mid-foot; keep your knees tracking over your toes.",
  },
  "leg-curl": {
    type: "curl",
    target: "HAMSTRINGS",
    image: "Lying_Leg_Curls/0.jpg",
    cue: "Curl smoothly and squeeze your hamstrings without lifting your hips.",
  },
  "incline-press": {
    type: "press",
    target: "UPPER CHEST",
    image: "Barbell_Incline_Bench_Press_-_Medium_Grip/0.jpg",
    cue: "Lower with control and press up while keeping your shoulder blades set.",
  },
  "lat-pulldown": {
    type: "pull",
    target: "LATS",
    image: "Wide-Grip_Lat_Pulldown/0.jpg",
    cue: "Pull your elbows down toward your ribs; avoid swinging your torso.",
  },
  "transverse-row": {
    type: "row",
    target: "MID-BACK",
    image: "Seated_Cable_Rows/0.jpg",
    cue: "Brace your core and pull your elbows back, squeezing between your shoulder blades.",
  },
  "lateral-raise": {
    type: "raise",
    target: "SIDE DELTS",
    image: "Side_Lateral_Raise/0.jpg",
    cue: "Lift with soft elbows until your hands reach shoulder height.",
  },
  "preacher-curl": {
    type: "curl",
    target: "BICEPS",
    image: "Preacher_Curl/0.jpg",
    cue: "Keep your upper arms on the pad and lower the weight slowly.",
  },
  pushdown: {
    type: "pushdown",
    target: "TRICEPS",
    image: "Triceps_Pushdown/0.jpg",
    cue: "Pin your elbows to your sides and press the handle down to full extension.",
  },
  "ab-crunch": {
    type: "crunch",
    target: "ABS",
    image: "Cable_Crunch/0.jpg",
    cue: "Curl your ribs toward your pelvis; do not pull on your neck.",
  },
};

function renderExerciseGuide(exercise) {
  const guide = exerciseGuides[exercise.id] || {
    type: "press",
    target: "FULL BODY",
    image: "Leg_Press/0.jpg",
    cue: "Move with control and keep the working muscles engaged.",
  };
  const drawings = {
    press: `<circle cx="53" cy="21" r="6" class="skin"/><path d="M53 28c-8 5-9 16-5 25l5 8 5-8c4-9 3-20-5-25Z" class="skin"/><path d="M48 38 31 31m27 7 17-7M49 60 39 84m19-24 10 24" class="skin"/><path d="M45 40c3 4 5 7 8 8 3-1 5-4 8-8" class="muscle"/><path d="M25 29h56M31 25v8m44-8v8M38 29 53 17m29 12L67 17" class="equipment"/><path d="M38 29h30" class="equipment"/>`,
    curl: `<circle cx="53" cy="20" r="6" class="skin"/><path d="M53 27c-8 5-9 17-5 26l5 8 5-8c4-9 3-21-5-26Z" class="skin"/><path d="M49 38 37 51l-8 1m24-14 12 13 8 1M49 61 39 85m19-24 10 24" class="skin"/><path d="M35 48c4 2 6 5 8 8m26-8c-4 2-6 5-8 8" class="muscle"/><path d="M25 58h56" class="equipment"/><circle cx="20" cy="58" r="5" class="weight"/><circle cx="86" cy="58" r="5" class="weight"/><path d="M30 56h46" class="equipment"/>`,
    pull: `<circle cx="53" cy="37" r="6" class="skin"/><path d="M53 44c-8 5-9 15-5 24l5 7 5-7c4-9 3-19-5-24Z" class="skin"/><path d="M48 51 31 35m27 16 17-16M50 74 39 90m17-16 10 16" class="skin"/><path d="M43 49c3 5 6 8 10 9 4-1 7-4 10-9" class="muscle"/><path d="M20 14h66M31 14v12m44-12v12M31 14l22 31m22-31L53 45" class="equipment"/><path d="M39 24h28" class="equipment"/>`,
    row: `<circle cx="60" cy="20" r="6" class="skin"/><path d="M58 27 41 51l14 8 20-17" class="skin"/><path d="M48 55 31 82m15-23 19 21" class="skin"/><path d="M51 35c4 6 10 8 16 7" class="muscle"/><path d="M75 42 49 56m28-12 12-8" class="equipment"/><circle cx="91" cy="34" r="5" class="weight"/><path d="M27 84h61" class="equipment"/>`,
    raise: `<circle cx="53" cy="21" r="6" class="skin"/><path d="M53 28c-8 5-9 16-5 25l5 8 5-8c4-9 3-20-5-25Z" class="skin"/><path d="M49 38 25 48m32-10 24 10M49 61 39 85m19-24 10 24" class="skin"/><path d="M44 39c4 3 5 5 9 5 4 0 5-2 9-5" class="muscle"/><path d="M25 48h-9m65 0h9" class="equipment"/><circle cx="11" cy="48" r="5" class="weight"/><circle cx="97" cy="48" r="5" class="weight"/>`,
    pushdown: `<circle cx="53" cy="36" r="6" class="skin"/><path d="M53 43c-8 5-9 15-5 24l5 7 5-7c4-9 3-19-5-24Z" class="skin"/><path d="M48 51 36 65m24-14 12 14M50 74 39 90m17-16 10 16" class="skin"/><path d="M43 49c3 5 6 8 10 9 4-1 7-4 10-9" class="muscle"/><path d="M23 14h60M35 14v11m36-11v11M35 25l18 33m18-33L53 58M41 58h24" class="equipment"/>`,
    crunch: `<circle cx="73" cy="35" r="6" class="skin"/><path d="M68 42 43 56l13 11 23-15" class="skin"/><path d="M47 63 28 80m14-19 19 18" class="skin"/><path d="M52 53c5 2 10 4 15 1m-12 8c4 2 7 3 11 1" class="muscle"/><path d="M22 82h66M53 62l17 17" class="equipment"/>`,
  };
  const imageUrl = `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${guide.image}`;
  return `<div class="exercise-guide"><div class="guide-art"><img src="${imageUrl}" alt="${exercise.name} exercise photo" loading="lazy" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><svg class="guide-fallback" viewBox="0 0 108 102" role="img" aria-label="${exercise.name} anatomy illustration" hidden><g>${drawings[guide.type]}</g></svg></div><div><small class="guide-label">TARGET MUSCLES // ${guide.target}</small><p>${guide.cue}</p><small class="guide-source">PHOTO: FREE EXERCISE DB</small></div></div>`;
}

function render() {
  document
    .querySelectorAll(".nav-item")
    .forEach((item) =>
      item.classList.toggle("active", item.dataset.route === state.route),
    );
  app.innerHTML =
    state.route === "home"
      ? renderHome()
      : state.route === "workout"
        ? renderWorkout()
        : state.route === "history"
          ? renderHistory()
          : state.route === "stats"
            ? renderStats()
            : renderSettings();
  if (state.route === "stats") requestAnimationFrame(drawChart);
  if (!state.setupComplete) renderSetupModal();
}
function renderHome() {
  const level = currentLevel();
  const stats = totalStats();
  const next = nextWorkoutDay();
  const recent = state.history.at(-1);
  const record = state.records.at(-1);
  return `<section class="page"><div class="page-heading"><div><p class="eyebrow">SYSTEM ONLINE</p><h1>${state.profile.name ? `WELCOME, ${state.profile.name.toUpperCase()}` : "WELCOME, HUNTER"}</h1></div><span class="accent tiny">${formatDate()}</span></div>
    <div class="panel hero-panel"><div class="system-label">CURRENT STATUS // ${streak()} DAY STREAK</div><div><div class="level-line"><strong>LEVEL ${level.level}</strong><span>${state.settings.xpEnabled ? "XP ACTIVE" : "XP OFF"}</span></div><div class="xp-bar"><span style="width:${Math.min(100, (level.current / level.next) * 100)}%"></span></div><div class="xp-meta"><span>XP ${level.current} / ${level.next}</span><span>${state.xp} TOTAL</span></div></div></div>
    <div class="grid-2"><div class="stat-card"><small>STREAK</small><strong>${streak()} <em>DAYS</em></strong></div><div class="stat-card violet"><small>WORKOUTS</small><strong>${stats.workouts}</strong></div><div class="stat-card lime"><small>TOTAL SETS</small><strong>${stats.sets}</strong></div><div class="stat-card"><small>VOLUME</small><strong>${Math.round(stats.volume).toLocaleString()} <em>${state.profile.unit}</em></strong></div></div>
    <p class="section-label">NEXT QUEST</p><div class="panel quest-card"><div><div class="system-label">DAILY QUEST</div><h2>FULL BODY</h2><p>${dayName(next.day).toUpperCase()} // ${next.offset === 0 ? "TODAY" : `IN ${next.offset} DAY${next.offset > 1 ? "S" : ""}`}</p></div><div class="quest-icon">+</div></div><div class="action-row" style="margin-top:12px">${button("START WORKOUT", "start-workout", "primary-btn")}</div>
    <p class="section-label">SYSTEM LOG</p><div class="panel">${recent ? `<div class="recent-row"><div><h3>Last workout</h3><p>${formatDate(recent.date)} // ${recent.sets.length} sets</p></div><strong class="accent">+${recent.xp || 0} XP</strong></div>` : '<p class="muted tiny">No completed workouts yet. Your first quest is waiting.</p>'}${record ? `<div class="recent-row"><div><h3>NEW RECORD</h3><p>${record.name} // ${record.weight} ${state.profile.unit} x ${record.reps}</p></div><strong class="accent">PR</strong></div>` : ""}</div>
  </section>`;
}
function renderWorkout() {
  if (state.activeWorkout && state.activeWorkout.complete)
    return renderComplete();
  const active = state.activeWorkout || {
    startedAt: Date.now(),
    sets: [],
    started: true,
  };
  const exercises = state.exercises.map((exercise) => {
    const sets = active.sets.filter((set) => set.exerciseId === exercise.id);
    return `<article class="exercise-card ${sets.length ? "active" : ""}" data-exercise="${exercise.id}"><div class="exercise-top"><div><h2>${exercise.name.toUpperCase()}</h2><p class="target">TARGET: ${exercise.sets}${exercise.maxSets ? `-${exercise.maxSets}` : ""} SETS x ${exercise.min}-${exercise.max}</p></div><span class="accent tiny">${sets.length}/${exercise.sets}</span></div>${renderExerciseGuide(exercise)}<div class="previous"><small>PREVIOUS RESULT</small><p>${previousText(exercise.id)}</p></div><div class="set-controls"><label class="input-label">WEIGHT (${state.profile.unit})<input class="number-input weight-input" type="number" min="0" step="0.5" value="${sets.length ? sets.at(-1).weight : lastForExercise(exercise.id)[0]?.weight || ""}" placeholder="0"></label><label class="input-label">REPS<input class="number-input reps-input" type="number" min="0" value="${sets.length ? sets.at(-1).reps : exercise.min}" placeholder="${exercise.min}"></label></div>${sets.length ? `<div class="sets-row">${sets.map((set, index) => `<span class="set-chip done">${index + 1}</span>`).join("")}</div>` : ""}<button class="complete-btn ${sets.length >= exercise.sets ? "done" : ""}" data-action="complete-set" data-id="${exercise.id}">${sets.length >= exercise.sets ? "SET COMPLETE - ADD SET" : "COMPLETE SET"}</button>${renderRestFor(exercise.id)}</article>`;
  });
  return `<section class="page"><div class="workout-head page-heading"><div><p class="eyebrow">ACTIVE QUEST</p><h1>FULL BODY</h1><p>${formatDate(active.startedAt)} // ${active.sets.length} WORKING SETS</p></div>${active.started ? '<span class="timer-pill" id="session-time">00:00</span>' : ""}</div><div class="panel" style="margin-bottom:14px"><div class="action-row">${button("GYM MODE", "gym-mode", "primary-btn")}${button("END WORKOUT", "end-workout", "ghost-btn")}</div></div><div class="exercise-list">${exercises.join("")}</div></section>`;
}
function renderRestFor(exerciseId) {
  if (!state.rest || state.rest.exerciseId !== exerciseId) return "";
  const remaining = Math.max(
    0,
    Math.ceil((state.rest.endsAt - Date.now()) / 1000),
  );
  return `<div class="panel rest-panel"><div class="system-label">SYSTEM REST // NEXT SET</div><div class="countdown" data-countdown="${exerciseId}">${formatTimer(remaining)}</div><div class="timer-actions">${button("+15 SEC", "add-time:15")}${button("+30 SEC", "add-time:30")}${button("+60 SEC", "add-time:60")}${button("SKIP", "skip-rest", "ghost-btn")}</div><button class="next-btn primary-btn" data-action="skip-rest">NEXT SET</button></div>`;
}
function renderComplete() {
  const workout = state.activeWorkout;
  return `<section class="page"><div class="panel hero-panel"><div class="system-label">WORKOUT COMPLETE</div><div><div class="level-line"><strong>QUEST CLEAR</strong></div><p class="muted">${workout.sets.length} working sets logged // ${Math.round(workout.sets.reduce((sum, set) => sum + set.weight * set.reps, 0))} ${state.profile.unit} volume</p></div><div class="action-row">${button("RETURN HOME", "finish-workout", "primary-btn")}${button("VIEW HISTORY", "history", "ghost-btn")}</div></div></section>`;
}
function renderHistory() {
  return `<section class="page"><div class="page-heading"><div><p class="eyebrow">ARCHIVE</p><h1>HISTORY</h1></div><span class="accent tiny">${state.history.length} QUESTS</span></div><div class="panel">${
    state.history.length
      ? [...state.history]
          .reverse()
          .map(
            (workout, index) =>
              `<div class="history-item" data-action="view-workout" data-index="${state.history.length - index - 1}"><div><h3>${formatDate(workout.date)}</h3><p>${workout.duration || 0} min // ${workout.sets.length} sets // ${Math.round(workout.sets.reduce((sum, set) => sum + set.weight * set.reps, 0))} ${state.profile.unit}</p></div><div class="history-score">+${workout.xp || 0}<small> XP</small></div></div>`,
          )
          .join("")
      : '<p class="muted tiny">Your completed quests will appear here.</p>'
  }</div></section>`;
}
function renderStats() {
  const stats = totalStats();
  const level = currentLevel();
  return `<section class="page"><div class="page-heading"><div><p class="eyebrow">SYSTEM ANALYTICS</p><h1>STATS</h1></div><span class="accent tiny">LEVEL ${level.level}</span></div><div class="grid-2"><div class="stat-card"><small>TOTAL XP</small><strong>${state.xp}</strong></div><div class="stat-card violet"><small>LONGEST STREAK</small><strong>${Math.max(streak(), state.history.length ? 1 : 0)} <em>D</em></strong></div><div class="stat-card lime"><small>REPS</small><strong>${stats.reps}</strong></div><div class="stat-card"><small>CONSISTENCY</small><strong>${state.schedule ? Math.min(100, Math.round((stats.workouts / Math.max(1, Math.ceil((Date.now() - (state.history[0]?.date || Date.now())) / 604800000)) / 3) * 100)) : 0}<em>%</em></strong></div></div><p class="section-label">PROGRESSION</p><div class="panel"><div class="filter-row">${state.exercises
    .slice(0, 5)
    .map(
      (exercise, index) =>
        `<button class="choice-btn ${index === 0 ? "active" : ""}" data-action="chart-exercise" data-id="${exercise.id}">${exercise.name}</button>`,
    )
    .join(
      "",
    )}</div><div class="chart-wrap"><canvas id="progress-chart" aria-label="Exercise progression chart"></canvas></div></div><p class="section-label">ATTRIBUTES</p><div class="grid-2"><div class="stat-card"><small>STR // STRENGTH</small><strong>${Math.min(99, 10 + Math.floor(stats.volume / 100))}</strong></div><div class="stat-card violet"><small>VIT // CONSISTENCY</small><strong>${Math.min(99, 10 + stats.workouts * 3)}</strong></div><div class="stat-card lime"><small>END // COMPLETION</small><strong>${Math.min(99, 10 + stats.sets)}</strong></div><div class="stat-card"><small>AGI // EFFICIENCY</small><strong>${Math.min(99, 10 + Math.floor(stats.reps / 10))}</strong></div></div><p class="section-label">PERSONAL RECORDS</p><div class="panel">${
    state.records.length
      ? [...state.records]
          .reverse()
          .slice(0, 6)
          .map(
            (record) =>
              `<div class="record"><strong>NEW RECORD</strong><span>${record.name} - ${record.weight} ${state.profile.unit} x ${record.reps}</span></div>`,
          )
          .join("")
      : '<p class="muted tiny">Complete a set to start building records.</p>'
  }</div></section>`;
}
function renderSettings() {
  return `<section class="page"><div class="page-heading"><div><p class="eyebrow">SYSTEM CONFIG</p><h1>SETTINGS</h1></div></div><p class="section-label">PREFERENCES</p><div class="panel settings-list">${settingToggle("XP SYSTEM", "Motivational levels and quest rewards", "xpEnabled")}${settingToggle("VIBRATION", "Rest timer alerts when supported", "vibration")}${settingToggle("ANIMATIONS", "Subtle interface motion", "animations")}<div class="setting-row"><div><label>UNIT</label><small>Weight display preference</small></div><select id="unit-select" class="number-input" style="width:90px"><option ${state.profile.unit === "kg" ? "selected" : ""}>kg</option><option ${state.profile.unit === "lb" ? "selected" : ""}>lb</option></select></div></div><p class="section-label">DATA CONTROL</p><div class="panel"><div class="action-row">${button("EXPORT DATA", "export-data", "primary-btn")}${button("IMPORT DATA", "import-data", "ghost-btn")}</div><div class="action-row" style="margin-top:10px">${button("EDIT PROFILE", "edit-profile", "ghost-btn")}${button("RESET DATA", "reset-data", "danger-btn")}</div></div><p class="section-label">WORKOUT SCHEDULE</p><div class="panel"><div class="grid-2">${[1, 2, 3, 4, 5, 6, 0].map((day) => `<button class="choice-btn ${state.schedule[day] ? "active" : ""}" data-action="toggle-day" data-day="${day}">${dayName(day).slice(0, 3).toUpperCase()}</button>`).join("")}</div><p class="muted tiny" style="margin-bottom:0">Active days: ${scheduledDays().map(dayName).join(", ")}</p></div><input type="file" id="import-file" accept="application/json" hidden></section>`;
}
function settingToggle(label, hint, key) {
  return `<div class="setting-row"><div><label>${label}</label><small>${hint}</small></div><button class="toggle ${state.settings[key] ? "on" : ""}" data-action="toggle-setting" data-key="${key}" aria-label="Toggle ${label}"></button></div>`;
}
function formatTimer(seconds) {
  return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
}

function startWorkout() {
  state.activeWorkout = { startedAt: Date.now(), sets: [], complete: false };
  state.rest = null;
  saveState();
  changeRoute("workout");
  renderWarmupModal();
}
function renderWarmupModal() {
  const warmups = [
    {
      phase: "01 // RAISE TEMPERATURE",
      title: "EASY CARDIO",
      detail: "5-7 minutes // brisk walk or bike",
      image: "Walking_Treadmill/0.jpg",
    },
    {
      phase: "02 // MOBILITY",
      title: "ARM CIRCLES",
      detail: "10 forward + 10 backward",
      image: "Arm_Circles/0.jpg",
    },
    {
      phase: "03 // DYNAMIC LOWER BODY",
      title: "BODYWEIGHT SQUAT",
      detail: "2 sets // 10 controlled reps",
      image: "Bodyweight_Squat/0.jpg",
    },
    {
      phase: "03 // DYNAMIC LOWER BODY",
      title: "WALKING LUNGE",
      detail: "1 set // 8 reps each leg",
      image: "Bodyweight_Walking_Lunge/0.jpg",
    },
    {
      phase: "04 // CORE ACTIVATION",
      title: "PLANK",
      detail: "2 sets // 20-30 seconds",
      image: "Plank/0.jpg",
    },
    {
      phase: "05 // SPECIFIC RAMP-UP",
      title: "LEG PRESS",
      detail: "1 light set // 10-12 reps",
      image: "Leg_Press/0.jpg",
    },
    {
      phase: "05 // SPECIFIC RAMP-UP",
      title: "INCLINE PRESS",
      detail: "1 light set // 10-12 reps",
      image: "Barbell_Incline_Bench_Press_-_Medium_Grip/0.jpg",
    },
    {
      phase: "05 // SPECIFIC RAMP-UP",
      title: "LAT PULLDOWN",
      detail: "1 light set // 10-12 reps",
      image: "Wide-Grip_Lat_Pulldown/0.jpg",
    },
  ];
  document.querySelector("#modal-root").innerHTML =
    `<div class="modal-backdrop"><div class="modal"><p class="eyebrow">PRE-QUEST PROTOCOL</p><h2>FULL BODY WARM-UP</h2><p>Complete this sequence in order. Use easy effort, controlled movement, and stop if you feel sharp pain. Warm-up work is not included in volume.</p><div class="warmup-list">${warmups
      .map(
        (warmup) =>
          `<label class="warmup-item"><img src="https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/${warmup.image}" alt="${warmup.title} warm-up" loading="lazy"><span><small class="warmup-phase">${warmup.phase}</small><strong>${warmup.title}</strong><small>${warmup.detail}</small></span><input type="checkbox"></label>`,
      )
      .join("")}</div><div class="action-row" style="margin-top:16px">${button("SKIP WARM-UP", "close-modal", "ghost-btn")}<button class="primary-btn" type="button" data-action="close-modal">BEGIN QUEST</button></div></div></div>`;
}
function completeSet(button) {
  if (!state.activeWorkout) startWorkout();
  const card = button.closest(".exercise-card");
  const id = card.dataset.exercise;
  const exercise = state.exercises.find((item) => item.id === id);
  const weight = Number(card.querySelector(".weight-input").value || 0);
  const reps = Number(card.querySelector(".reps-input").value || 0);
  if (!reps) return showToast("Enter reps before completing the set.");
  const set = {
    exerciseId: id,
    name: exercise.name,
    weight,
    reps,
    timestamp: Date.now(),
  };
  state.activeWorkout.sets.push(set);
  const previousBest = Math.max(
    0,
    ...state.history.flatMap((workout) =>
      (workout.sets || [])
        .filter((item) => item.exerciseId === id)
        .map((item) => item.weight * item.reps),
    ),
  );
  if (weight * reps > previousBest && weight > 0) {
    state.records.push({ name: exercise.name, weight, reps, date: Date.now() });
    awardXP(50);
    showToast("NEW RECORD // +50 XP");
  } else {
    awardXP(5);
    showToast("SET SAVED // REST STARTED");
  }
  state.rest = { exerciseId: id, endsAt: Date.now() + exercise.rest * 1000 };
  saveState();
  render();
  startTimer();
}
function awardXP(amount) {
  if (state.settings.xpEnabled) {
    state.xp += amount;
    state.level = currentLevel().level;
  }
}
function startTimer() {
  clearInterval(timerHandle);
  timerHandle = setInterval(() => {
    if (!state.rest) return clearInterval(timerHandle);
    const remaining = Math.max(
      0,
      Math.ceil((state.rest.endsAt - Date.now()) / 1000),
    );
    const countdown = document.querySelector(
      `[data-countdown="${state.rest.exerciseId}"]`,
    );
    if (countdown) countdown.textContent = formatTimer(remaining);
    if (!remaining) {
      clearInterval(timerHandle);
      if (state.settings.vibration && navigator.vibrate)
        navigator.vibrate([200, 100, 200]);
      showToast("REST TIMER COMPLETE");
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
  if (state.rest) {
    state.rest.endsAt += seconds * 1000;
    saveState();
    render();
    startTimer();
  }
}
function endWorkout() {
  if (!state.activeWorkout?.sets.length)
    return showToast("Complete at least one set first.");
  state.activeWorkout.complete = true;
  state.activeWorkout.duration = Math.max(
    1,
    Math.round((Date.now() - state.activeWorkout.startedAt) / 60000),
  );
  const workout = state.activeWorkout;
  workout.xp = workout.sets.length * 20 + 100;
  awardXP(workout.xp);
  state.history.push(workout);
  state.activeWorkout = workout;
  state.rest = null;
  saveState();
  render();
}
function finishWorkout() {
  state.activeWorkout = null;
  saveState();
  changeRoute("home");
}
function renderCompleteModal(workout) {
  document.querySelector("#modal-root").innerHTML =
    `<div class="modal-backdrop"><div class="modal"><p class="eyebrow">SYSTEM MESSAGE</p><h2>WORKOUT DETAILS</h2><p>${formatDate(workout.date)} // ${workout.sets.length} sets</p>${workout.sets.map((set) => `<div class="recent-row"><div><h3>${set.name}</h3><p>${set.weight} ${state.profile.unit} x ${set.reps}</p></div><span class="accent">${set.reps >= (state.exercises.find((ex) => ex.id === set.exerciseId)?.max || 99) ? "TOP RANGE" : ""}</span></div>`).join("")}<div class="action-row" style="margin-top:16px">${button("CLOSE", "close-modal", "primary-btn")}</div></div></div>`;
}
function renderSetupModal() {
  document.querySelector("#modal-root").innerHTML =
    `<div class="modal-backdrop"><div class="modal"><p class="eyebrow">FIRST LAUNCH // SYSTEM INIT</p><h2>WELCOME, HUNTER.</h2><p>Your personal workout system is ready. Set up only what you want; everything can be changed later.</p><form id="setup-form" class="form-grid"><label>NICKNAME<input name="name" placeholder="Optional"></label><label>BODY WEIGHT<input name="bodyWeight" type="number" placeholder="Optional"></label><label>PREFERRED UNIT<select name="unit"><option>kg</option><option>lb</option></select></label><label class="setting-row"><span>ENABLE XP SYSTEM</span><input name="xpEnabled" type="checkbox" checked></label><button class="primary-btn" type="submit">INITIALIZE SYSTEM</button></form></div></div>`;
}
function editProfile() {
  document.querySelector("#modal-root").innerHTML =
    `<div class="modal-backdrop"><div class="modal"><p class="eyebrow">PROFILE CONFIG</p><h2>HUNTER PROFILE</h2><form id="profile-form" class="form-grid"><label>NICKNAME<input name="name" value="${state.profile.name}"></label><label>AGE<input name="age" type="number" value="${state.profile.age}"></label><label>HEIGHT<input name="height" type="number" value="${state.profile.height}"></label><label>BODY WEIGHT<input name="bodyWeight" type="number" value="${state.profile.bodyWeight}"></label><button class="primary-btn" type="submit">SAVE PROFILE</button></form></div></div>`;
}
function drawChart() {
  const canvas = document.querySelector("#progress-chart");
  if (!canvas) return;
  const context = canvas.getContext("2d");
  const ratio = window.devicePixelRatio || 1;
  const width = canvas.clientWidth * ratio;
  const height = canvas.clientHeight * ratio;
  canvas.width = width;
  canvas.height = height;
  context.scale(ratio, ratio);
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  context.clearRect(0, 0, w, h);
  const id =
    document.querySelector(".choice-btn.active")?.dataset.id ||
    state.exercises[0].id;
  const points = state.history
    .flatMap((workout) =>
      (workout.sets || []).filter((set) => set.exerciseId === id),
    )
    .map((set) => Number(set.weight))
    .filter(Boolean);
  const values = points.length ? points : [0, 0];
  const max = Math.max(...values, 1);
  context.strokeStyle = "rgba(110,226,255,.12)";
  context.lineWidth = 1;
  for (let i = 1; i < 5; i++) {
    const y = h - (i * h) / 5;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(w, y);
    context.stroke();
  }
  context.strokeStyle = "#6be7ff";
  context.lineWidth = 3;
  context.beginPath();
  values.forEach((value, index) => {
    const x = values.length === 1 ? w / 2 : (index * w) / (values.length - 1);
    const y = h - (value / max) * (h - 20) - 10;
    index ? context.lineTo(x, y) : context.moveTo(x, y);
  });
  context.stroke();
  values.forEach((value, index) => {
    const x = values.length === 1 ? w / 2 : (index * w) / (values.length - 1);
    const y = h - (value / max) * (h - 20) - 10;
    context.fillStyle = "#07101b";
    context.beginPath();
    context.arc(x, y, 5, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#6be7ff";
    context.stroke();
  });
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;
  if (action === "start-workout") return startWorkout();
  if (action === "complete-set") return completeSet(target);
  if (action === "end-workout") return endWorkout();
  if (action === "finish-workout") return finishWorkout();
  if (action === "history") return changeRoute("history");
  if (action === "skip-rest") return skipRest();
  if (action.startsWith("add-time:"))
    return addTime(Number(action.split(":")[1]));
  if (action === "gym-mode") {
    document.body.classList.toggle("gym-mode");
    target.textContent = document.body.classList.contains("gym-mode")
      ? "EXIT GYM MODE"
      : "GYM MODE";
    return;
  }
  if (action === "toggle-setting") {
    state.settings[target.dataset.key] = !state.settings[target.dataset.key];
    saveState();
    render();
    return;
  }
  if (action === "toggle-day") {
    state.schedule[target.dataset.day] = !state.schedule[target.dataset.day];
    saveState();
    render();
    return;
  }
  if (action === "export-data") return exportData();
  if (action === "import-data")
    return document.querySelector("#import-file").click();
  if (action === "reset-data") {
    if (confirm("Reset all workout data?")) {
      localStorage.removeItem(STORAGE_KEY);
      state = structuredClone(initialState);
      render();
    }
    return;
  }
  if (action === "edit-profile") return editProfile();
  if (action === "view-workout")
    return renderCompleteModal(state.history[Number(target.dataset.index)]);
  if (action === "close-modal") {
    document.querySelector("#modal-root").innerHTML = "";
    return;
  }
  if (action === "chart-exercise") {
    document
      .querySelectorAll('[data-action="chart-exercise"]')
      .forEach((button) => button.classList.remove("active"));
    target.classList.add("active");
    drawChart();
  }
});
document.querySelector(".bottom-nav").addEventListener("click", (event) => {
  const item = event.target.closest("[data-route]");
  if (item) changeRoute(item.dataset.route);
});
document.querySelector("#soundToggle").addEventListener("click", () => {
  state.settings.sound = !state.settings.sound;
  saveState();
  document.querySelector("#soundToggle").textContent = state.settings.sound
    ? "VOL"
    : "MUTE";
  showToast(state.settings.sound ? "SOUND ON" : "SOUND OFF");
});
document.addEventListener("submit", (event) => {
  if (event.target.id === "setup-form") {
    event.preventDefault();
    const form = new FormData(event.target);
    state.profile.name = form.get("name");
    state.profile.bodyWeight = form.get("bodyWeight");
    state.profile.unit = form.get("unit");
    state.settings.xpEnabled = form.get("xpEnabled") === "on";
    state.setupComplete = true;
    saveState();
    document.querySelector("#modal-root").innerHTML = "";
    render();
    showToast("SYSTEM INITIALIZED");
  }
  if (event.target.id === "profile-form") {
    event.preventDefault();
    const form = new FormData(event.target);
    ["name", "age", "height", "bodyWeight"].forEach(
      (key) => (state.profile[key] = form.get(key)),
    );
    saveState();
    document.querySelector("#modal-root").innerHTML = "";
    render();
    showToast("PROFILE SAVED");
  }
});
document.addEventListener("change", (event) => {
  if (event.target.id === "unit-select") {
    state.profile.unit = event.target.value;
    saveState();
    render();
  }
  if (event.target.id === "import-file") {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        state = { ...initialState, ...JSON.parse(reader.result) };
        saveState();
        render();
        showToast("DATA IMPORTED");
      } catch {
        showToast("IMPORT FAILED");
      }
    };
    reader.readAsText(file);
  }
});
if ("serviceWorker" in navigator)
  window.addEventListener("load", () =>
    navigator.serviceWorker.register("sw.js"),
  );
render();
