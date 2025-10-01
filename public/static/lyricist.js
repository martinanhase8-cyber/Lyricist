// Utilities
const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
const uid = () => Math.random().toString(36).slice(2, 10);
const nowISO = () => new Date().toISOString();
const wordsFrom = (s) => (s || "").toLowerCase().match(/[a-zA-Z']+/g) || [];
const last = (arr) => (arr && arr.length ? arr[arr.length - 1] : undefined);

// Simple syllable estimator (heuristic, English)
function countSyllables(wordRaw) {
  if (!wordRaw) return 0;
  const word = (wordRaw + "").toLowerCase().replace(/[^a-z']/g, "");
  if (!word) return 0;
  
  const exceptions = {
    queue: 1, queued: 1, people: 2, choir: 1, fire: 1, 
    hour: 1, our: 1, you: 1, they: 1,
  };
  if (exceptions[word] != null) return exceptions[word];

  let w = word;
  if (w.length > 2 && w.endsWith("e") && !w.endsWith("le")) {
    w = w.slice(0, -1);
  }
  const groups = (w.match(/[aeiouy]+/g) || []).length;
  return Math.max(groups, 1);
}

// Derive a crude rhyme key: from last stressed vowel-ish to end
function rhymeKey(wordRaw) {
  if (!wordRaw) return "";
  const word = wordRaw.toLowerCase().replace(/[^a-z']/g, "");
  const vowels = "aeiouy";
  for (let i = word.length - 1; i >= 0; i--) {
    if (vowels.includes(word[i])) {
      const start = Math.max(0, i - 1);
      return word.slice(start);
    }
  }
  return word;
}

// Quick edit-distance for near rhymes
function editDistance(a, b) {
  a = a || ""; b = b || "";
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost
      );
    }
  }
  return dp[a.length][b.length];
}

// Local storage manager
const store = {
  get(key, fallback) {
    try { 
      const v = localStorage.getItem(key); 
      return v ? JSON.parse(v) : fallback; 
    } catch { 
      return fallback; 
    }
  },
  set(key, value) { 
    localStorage.setItem(key, JSON.stringify(value)); 
  },
};

// Project Types
const defaultProject = () => ({
  id: uid(),
  title: "Untitled Project",
  genre: "",
  lyrics: "",
  notes: "",
  bpm: 90,
  timeSig: "4/4",
  createdAt: nowISO(),
  updatedAt: nowISO(),
});

// Genre Descriptions
const GENRES = {
  "Pop": {
    summary: "Catchy hooks, verse–pre–chorus–chorus forms, polished production.",
    techniques: [
      "Strong hook within first 60 seconds",
      "Simple, universal themes",
      "Contrast between verse (narrative) and chorus (thesis)",
      "Melodic contour that lifts into the chorus",
    ],
  },
  "Rock": {
    summary: "Guitar-driven energy, riffs, dynamic builds, live feel.",
    techniques: [
      "Riff or motif to anchor sections",
      "Verse tension → explosive chorus",
      "Bridge introduces harmonic shift",
      "Lyric authenticity over polish",
    ],
  },
  "Hip-Hop": {
    summary: "Rhythm-forward, intricate rhyme schemes, flow and pocket.",
    techniques: [
      "Multi-syllable and internal rhymes",
      "Flow switches between sections",
      "Punchlines, imagery, wordplay",
      "Hook with rhythm + slogan",
    ],
  },
  "Country": {
    summary: "Storytelling, conversational tone, vivid specifics.",
    techniques: [
      "Concrete details (time, place, objects)",
      "Clear moral or turn in the bridge",
      "Chorus sums the heart of the story",
      "Strong prosody: lyric matches melody",
    ],
  },
  "Folk": {
    summary: "Lyric-first, human-scale stories, simple forms.",
    techniques: [
      "Narrative verses with evolving detail",
      "Choruses act as refrain or mantra",
      "Acoustic textures, intimate voice",
      "Metaphor tied to nature/people",
    ],
  },
  "Jazz": {
    summary: "Sophisticated harmony, phrasing freedom, scat/swing.",
    techniques: [
      "Extensions (9ths, 13ths) and modal color",
      "Lyric phrasing plays with barlines",
      "Vocalese, internal rhymes tastefully",
      "Standard forms: AABA, 32-bar",
    ],
  },
  "Electronic": {
    summary: "Beat/texture-driven, builds/drops, repetition artfully used.",
    techniques: [
      "Motif evolves via sound design",
      "Sparse verses → big chorus/drop",
      "Topline simplicity over dense beats",
      "Hook = melodic + timbral idea",
    ],
  },
  "R&B": {
    summary: "Soulful vocals, grooves, call-and-response, melisma.",
    techniques: [
      "Rhythmic lyric phrasing over pocket",
      "Pre-chorus lift into wider harmony",
      "Ad-libs interplaying with hook",
      "Intimacy + vulnerability in imagery",
    ],
  },
};

// Idea seeds
const SEEDS = {
  themes: [
    "leaving home", "second chances", "city at 3 a.m.", "winning and what it costs",
    "rain after the drought", "calling your name", "letters I never sent", "found family",
    "running out of time", "the last summer night",
  ],
  hooks: [
    "Say it like you mean it", "Stuck in the in-between", "I keep the light on",
    "We were louder than the silence", "Tell me when to let go",
  ],
  structures: [
    "Verse–Pre–Chorus–Chorus–Verse–Pre–Chorus–Chorus–Bridge–Chorus",
    "Verse–Chorus–Verse–Chorus–Bridge–Chorus",
    "Intro–Verse–Chorus–Drop–Verse–Chorus–Outro",
    "AABA (32-bar classic)",
  ],
};

// Global State
let state = {
  panelOpen: true,
  route: window.location.hash.replace('#', '') || 'home',
  dark: store.get("lyricist.theme", "dark") === "dark",
  projects: store.get("lyricist.projects", []),
  onlineRhyme: store.get("lyricist.onlineRhyme", false),
  
  // Rhyme Engine State
  rhymeQuery: "",
  rhymeResults: { perfect: [], near: [], multi: [], internal: [] },
  rhymeLoading: false,
  
  // Lyric Analyzer State
  analyzerText: "I keep the light on when I can't find home\\nYou keep the fight on till the last echo\\n— Draft",
  analyzerBpm: 90,
  analyzerBarsPerLine: 1,
  analyzerTimeSig: "4/4",
  
  // Metronome State
  metronomeBpm: 100,
  metronomeTimeSig: "4/4",
  metronomeRunning: false,
  metronomeBeat: 0,
  metronomeTapTimes: [],
  
  // Idea Generator State
  ideaGenre: "Hip-Hop",
  currentIdea: null,
  
  // Projects State
  projectFilter: "",
  activeProjectId: null
};

// Initialize
function init() {
  document.documentElement.classList.toggle("dark", state.dark);
  
  if (state.projects.length > 0) {
    state.activeProjectId = state.projects[0].id;
  }
  
  render();
  
  // Handle hash changes
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '');
    const routeMap = { 
      home:'home', tools:'rhyme', rhyme:'rhyme', analyzer:'analyzer', 
      metronome:'metronome', generator:'generator', genres:'genres', 
      learn:'learn', saved:'saved' 
    };
    setState({ route: routeMap[hash] || 'home' });
  });

  // Spacebar for metronome
  window.addEventListener('keydown', (e) => {
    if (e.code === "Space" && !e.target.matches('input, textarea, select')) {
      e.preventDefault();
      toggleMetronome();
    }
  });
}

// State management
function setState(updates) {
  state = { ...state, ...updates };
  
  // Persist to localStorage
  if ('dark' in updates) {
    document.documentElement.classList.toggle("dark", state.dark);
    store.set("lyricist.theme", state.dark ? "dark" : "light");
  }
  if ('projects' in updates) {
    store.set("lyricist.projects", state.projects);
  }
  if ('onlineRhyme' in updates) {
    store.set("lyricist.onlineRhyme", state.onlineRhyme);
  }
  
  render();
}

// Render functions
function render() {
  const app = document.getElementById('app');
  app.innerHTML = `
    ${renderHeader()}
    <div class="flex">
      ${state.panelOpen ? renderSidebar() : ''}
      <main class="flex-1 p-4 md:p-8 max-w-6xl mx-auto">
        ${renderRoute()}
      </main>
    </div>
    ${renderFooter()}
  `;
  
  // Bind event listeners after render
  bindEventListeners();
}

function renderHeader() {
  return `
    <header class="sticky top-0 z-30 backdrop-blur bg-white/70 dark:bg-zinc-900/60 border-b border-zinc-200 dark:border-zinc-800">
      <div class="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-8 py-3">
        <div class="flex items-center gap-3">
          <button class="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700" onclick="togglePanels()">☰ Panels</button>
          <a class="font-black tracking-tight text-xl" href="#home">Lyricist</a>
          <nav class="hidden md:flex gap-4 text-sm">
            <a class="opacity-80 hover:opacity-100" href="#home">Home</a>
            <a class="opacity-80 hover:opacity-100" href="#tools">Tools</a>
            <a class="opacity-80 hover:opacity-100" href="#learn">Learn</a>
            <a class="opacity-80 hover:opacity-100" href="#genres">Genres</a>
            <a class="opacity-80 hover:opacity-100" href="#saved">Saved</a>
          </nav>
        </div>
        <div class="flex items-center gap-2">
          <button onclick="toggleTheme()" class="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700">
            ${state.dark ? "🌙" : "☀️"} Toggle Theme
          </button>
        </div>
      </div>
    </header>
  `;
}

function renderSidebar() {
  const linkClass = (key) => `w-full text-left px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 ${state.route === key ? "bg-zinc-200 dark:bg-zinc-700" : ""}`;
  
  return `
    <aside class="w-64 shrink-0 border-r border-zinc-200 dark:border-zinc-800 p-4 hidden md:block">
      <div class="space-y-2">
        <div class="text-xs uppercase tracking-wide text-zinc-500">Tools</div>
        <button class="${linkClass('rhyme')}" onclick="setRoute('rhyme')">Advanced Rhyme Engine</button>
        <button class="${linkClass('analyzer')}" onclick="setRoute('analyzer')">Lyric Analyzer</button>
        <button class="${linkClass('metronome')}" onclick="setRoute('metronome')">Metronome & Beat Counter</button>
        <button class="${linkClass('generator')}" onclick="setRoute('generator')">Idea Generator</button>
        <div class="pt-4 text-xs uppercase tracking-wide text-zinc-500">Content</div>
        <button class="${linkClass('genres')}" onclick="setRoute('genres')">Genres</button>
        <button class="${linkClass('learn')}" onclick="setRoute('learn')">Learn</button>
        <button class="${linkClass('saved')}" onclick="setRoute('saved')">My Projects</button>
        <button class="${linkClass('home')}" onclick="setRoute('home')">Home</button>
      </div>
    </aside>
  `;
}

function renderRoute() {
  switch (state.route) {
    case 'home': return renderHome();
    case 'rhyme': return renderRhymeEngine();
    case 'analyzer': return renderLyricAnalyzer();
    case 'metronome': return renderMetronome();
    case 'generator': return renderIdeaGenerator();
    case 'genres': return renderGenres();
    case 'learn': return renderLearn();
    case 'saved': return renderProjects();
    default: return renderHome();
  }
}

function renderHome() {
  return `
    <div>
      <div class="mb-8">
        <h1 class="text-3xl md:text-5xl font-black leading-tight">Lyricist — Professional songwriting tools and guides that help you create music that connects, moves, and lasts.</h1>
        <p class="mt-3 text-lg opacity-80">Privacy-first. Works offline. Advanced rhyme & timing analysis, metronome, idea prompts, and a local project system.</p>
        <div class="mt-4 flex items-center gap-3">
          <a href="#tools" class="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">Open Tools</a>
          <label class="flex items-center gap-2 text-sm">
            <input type="checkbox" ${state.onlineRhyme ? 'checked' : ''} onchange="toggleOnlineRhyme()" />
            Use optional online rhyme lookup (Datamuse)
          </label>
        </div>
      </div>

      <div id="tools">
        <section class="mb-12">
          <div class="mb-3 text-xs uppercase tracking-widest text-zinc-500">Core Features</div>
          <h2 class="text-2xl md:text-3xl font-extrabold mb-3">Advanced Rhyme Engine</h2>
          <div class="prose prose-zinc dark:prose-invert max-w-none mb-4">
            <ul>
              <li>Perfect, near/slant, internal, and multi-syllable rhymes</li>
              <li>Phrase suggestions and compound endings</li>
              <li>Local algorithms + optional online lookup</li>
            </ul>
          </div>
          <a href="#rhyme" class="inline-block px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">Try Rhyme Engine →</a>
        </section>

        <section class="mb-12">
          <div class="mb-3 text-xs uppercase tracking-widest text-zinc-500">Core Features</div>
          <h2 class="text-2xl md:text-3xl font-extrabold mb-3">Lyric Analyzer</h2>
          <div class="prose prose-zinc dark:prose-invert max-w-none mb-4">
            <ul>
              <li>Syllable counting, overflow detection, BPM-based timing</li>
              <li>Bars-per-line with color-coded pacing feedback</li>
              <li>Rhyme-scheme pattern recognition by line endings</li>
            </ul>
          </div>
          <a href="#analyzer" class="inline-block px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">Try Analyzer →</a>
        </section>

        <section class="mb-12">
          <div class="mb-3 text-xs uppercase tracking-widest text-zinc-500">Core Features</div>
          <h2 class="text-2xl md:text-3xl font-extrabold mb-3">Professional Metronome</h2>
          <div class="prose prose-zinc dark:prose-invert max-w-none mb-4">
            <ul>
              <li>Adjustable BPM 40–240, time signatures 4/4, 3/4, 6/8</li>
              <li>Tap tempo & spacebar start/stop</li>
              <li>Visual beat indicator</li>
            </ul>
          </div>
          <a href="#metronome" class="inline-block px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">Try Metronome →</a>
        </section>

        <section class="mb-12">
          <div class="mb-3 text-xs uppercase tracking-widest text-zinc-500">Core Features</div>
          <h2 class="text-2xl md:text-3xl font-extrabold mb-3">Creative Idea Generator</h2>
          <div class="prose prose-zinc dark:prose-invert max-w-none mb-4">
            <ul>
              <li>Genre-specific prompts and hook concepts</li>
              <li>Song structure suggestions and theme seeds</li>
              <li>"Surprise me" for random inspiration</li>
            </ul>
          </div>
          <a href="#generator" class="inline-block px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">Try Generator →</a>
        </section>
      </div>

      <div id="learn">
        <section class="mb-12">
          <div class="mb-3 text-xs uppercase tracking-widest text-zinc-500">Learning Center</div>
          <h2 class="text-2xl md:text-3xl font-extrabold mb-3">Learn Professional Songwriting</h2>
          <div class="prose prose-zinc dark:prose-invert max-w-none mb-4">
            <ul>
              <li><b>Rhyme Techniques:</b> perfect, near, internal, multi-syllable.</li>
              <li><b>Song Structure:</b> verse–chorus dynamics, bridges, arrangement.</li>
              <li><b>Hook Crafting:</b> repetition, contrast, emotional peaks.</li>
              <li><b>Imagery & Metaphor:</b> vivid pictures through precise language.</li>
              <li><b>Lyrical Themes:</b> universal ideas with personal authenticity.</li>
            </ul>
          </div>
          <a href="#genres" class="inline-block px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">Explore Genres →</a>
        </section>
      </div>

      <section class="mb-12">
        <div class="mb-3 text-xs uppercase tracking-widest text-zinc-500">Projects</div>
        <h2 class="text-2xl md:text-3xl font-extrabold mb-3">Your Creative Workspace</h2>
        <div class="prose prose-zinc dark:prose-invert max-w-none mb-4">
          <ul>
            <li><b>Save & Organize:</b> drafts, rhymes, and ideas are kept locally.</li>
            <li><b>Export:</b> download .txt or project JSON; print-friendly view.</li>
            <li><b>Local Only:</b> stays on your device unless you choose to share.</li>
          </ul>
        </div>
      </section>
    </div>
  `;
}

function renderRhymeEngine() {
  const key = rhymeKey(state.rhymeQuery);
  
  return `
    <div>
      <h2 class="text-2xl font-extrabold mb-2">Advanced Rhyme Engine</h2>
      <p class="opacity-80 mb-4">Perfect, near/slant, internal, and multi-syllable rhymes. Local algorithm with optional online lookup.</p>

      <div class="flex flex-col md:flex-row gap-2 md:items-center mb-4">
        <input 
          value="${state.rhymeQuery}" 
          onchange="updateRhymeQuery(this.value)"
          oninput="updateRhymeQuery(this.value)"
          placeholder="Enter a word or phrase (e.g., &quot;purple&quot;)" 
          class="flex-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800" 
        />
        <button onclick="searchRhymes()" class="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">Find Rhymes</button>
        <span class="text-sm opacity-80">Rhyme key: <b>${key || "—"}</b></span>
      </div>

      ${state.rhymeLoading ? '<div class="text-sm opacity-80 mb-2">Searching…</div>' : ''}

      ${renderRhymeBuckets()}

      <div class="mt-6 text-sm opacity-80">
        Tip: Try phrases ("${state.rhymeQuery || "night run"}") to get multi-syllable and compound endings.
      </div>
    </div>
  `;
}

function renderRhymeBuckets() {
  const renderBucket = (title, items) => `
    <div class="p-4 rounded-2xl bg-zinc-100/60 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800">
      <div class="text-xs uppercase tracking-wide text-zinc-500 mb-1">${title}</div>
      <div class="flex flex-wrap gap-2">
        ${(items || []).length ? items.map(w => 
          `<span class="px-2 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm">${w}</span>`
        ).join('') : '<span class="opacity-60 text-sm">No suggestions yet.</span>'}
      </div>
    </div>
  `;

  return `
    <div class="grid md:grid-cols-2 gap-4">
      ${renderBucket("Perfect Rhymes", state.rhymeResults.perfect)}
      ${renderBucket("Near / Slant Rhymes", state.rhymeResults.near)}
      ${renderBucket("Multi‑Syllable Endings", state.rhymeResults.multi)}
      ${renderBucket("Internal Rhyme Ideas", state.rhymeResults.internal)}
    </div>
  `;
}

function renderLyricAnalyzer() {
  const lines = (state.analyzerText || "").split(/\\r?\\n/);
  const metrics = analyzeLyrics(lines);
  const beatsPerBar = Number((state.analyzerTimeSig.split("/")[0]) || 4);
  const targetSyll = beatsPerBar * 2 * state.analyzerBarsPerLine;

  return `
    <div>
      <h2 class="text-2xl font-extrabold mb-2">Lyric Analyzer</h2>
      <p class="opacity-80 mb-4">Counts syllables, flags overflows, estimates pacing vs. BPM/time signature, and detects rhyme patterns by line endings.</p>

      <div class="grid md:grid-cols-2 gap-4 mb-4">
        <textarea 
          rows="12" 
          class="w-full px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800"
          onchange="updateAnalyzerText(this.value)"
          oninput="updateAnalyzerText(this.value)"
        >${state.analyzerText}</textarea>
        <div class="space-y-3">
          <div class="grid grid-cols-2 gap-2">
            <label class="text-sm">BPM
              <input 
                type="number" 
                class="w-full mt-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border" 
                value="${state.analyzerBpm}" 
                onchange="updateAnalyzerBpm(this.value)"
              />
            </label>
            <label class="text-sm">Time Sig
              <select 
                class="w-full mt-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border" 
                value="${state.analyzerTimeSig}" 
                onchange="updateAnalyzerTimeSig(this.value)"
              >
                <option ${state.analyzerTimeSig === '4/4' ? 'selected' : ''}>4/4</option>
                <option ${state.analyzerTimeSig === '3/4' ? 'selected' : ''}>3/4</option>
                <option ${state.analyzerTimeSig === '6/8' ? 'selected' : ''}>6/8</option>
              </select>
            </label>
            <label class="text-sm col-span-2">Bars per line
              <input 
                type="number" 
                class="w-full mt-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border" 
                value="${state.analyzerBarsPerLine}" 
                onchange="updateAnalyzerBarsPerLine(this.value)"
              />
            </label>
          </div>
          <div class="p-4 rounded-2xl bg-zinc-100/60 dark:bg-zinc-900/60 border">
            <div class="text-xs uppercase tracking-wide text-zinc-500 mb-1">Guidance</div>
            <div class="text-sm">Target syllables/line (heuristic): <b>${targetSyll}</b></div>
            <div class="text-sm">Avg syllables/line: <b>${metrics.avgSyll.toFixed(1)}</b></div>
            <div class="text-sm">End-rhyme pattern: <b>${metrics.pattern || "—"}</b></div>
          </div>
        </div>
      </div>

      <div class="space-y-2">
        ${lines.map((line, i) => {
          const syl = metrics.byLine[i]?.syll || 0;
          const end = metrics.byLine[i]?.end || "";
          const overflow = syl > targetSyll + 2;
          const near = syl > targetSyll && syl <= targetSyll + 2;
          const borderClass = overflow ? "border-red-500/60 bg-red-500/10" : near ? "border-amber-500/60 bg-amber-500/10" : "border-zinc-300 dark:border-zinc-800";
          const statusClass = overflow ? "text-red-600" : near ? "text-amber-600" : "text-emerald-600";
          const statusText = overflow ? "Overflow" : near ? "Tight" : "Comfortable";
          
          return `
            <div class="p-3 rounded-xl border ${borderClass}">
              <div class="flex items-center justify-between text-sm opacity-80 mb-1">
                <span>Line ${i+1} — syllables: <b>${syl}</b> • end: <b>${end || "—"}</b></span>
                <span class="${statusClass}">${statusText}</span>
              </div>
              <div class="whitespace-pre-wrap">${line || '<span class="opacity-40">(empty)</span>'}</div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;
}

function renderMetronome() {
  const beatsPerBar = Number(state.metronomeTimeSig.split("/")[0]) || 4;
  
  return `
    <div>
      <h2 class="text-2xl font-extrabold mb-2">Metronome & Beat Counter</h2>
      <p class="opacity-80 mb-4">Visual + audio click with tap tempo. Spacebar toggles start/stop.</p>

      <div class="grid sm:grid-cols-3 gap-3 items-end mb-6">
        <label class="text-sm">BPM
          <input 
            type="number" 
            class="w-full mt-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border" 
            value="${state.metronomeBpm}" 
            onchange="updateMetronomeBpm(this.value)"
          />
        </label>
        <label class="text-sm">Time Sig
          <select 
            class="w-full mt-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border" 
            value="${state.metronomeTimeSig}" 
            onchange="updateMetronomeTimeSig(this.value)"
          >
            <option ${state.metronomeTimeSig === '4/4' ? 'selected' : ''}>4/4</option>
            <option ${state.metronomeTimeSig === '3/4' ? 'selected' : ''}>3/4</option>
            <option ${state.metronomeTimeSig === '6/8' ? 'selected' : ''}>6/8</option>
          </select>
        </label>
        <div class="flex gap-2">
          <button onclick="toggleMetronome()" class="flex-1 px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">${state.metronomeRunning ? "Stop" : "Start"}</button>
          <button onclick="tapTempo()" class="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">Tap</button>
        </div>
      </div>

      <div class="h-24 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center gap-2">
        ${Array.from({ length: beatsPerBar }).map((_, i) => {
          const isActive = (state.metronomeBeat % beatsPerBar) === i && state.metronomeRunning;
          return `<div class="w-6 h-6 rounded-full border ${isActive ? "bg-zinc-900 dark:bg-white" : "bg-transparent"}"></div>`;
        }).join('')}
      </div>
    </div>
  `;
}

function renderIdeaGenerator() {
  return `
    <div>
      <h2 class="text-2xl font-extrabold mb-2">Creative Idea Generator</h2>
      <p class="opacity-80 mb-4">Genre-specific prompts for fast starts. Use these as scaffolding; customize to your story.</p>
      <div class="flex gap-2 mb-3">
        <select 
          class="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border" 
          value="${state.ideaGenre}" 
          onchange="updateIdeaGenre(this.value)"
        >
          ${Object.keys(GENRES).map(g => `<option ${state.ideaGenre === g ? 'selected' : ''}>${g}</option>`).join('')}
        </select>
        <button onclick="rollIdea()" class="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">Surprise me</button>
      </div>
      ${state.currentIdea ? `
        <div class="p-4 rounded-2xl bg-zinc-100/60 dark:bg-zinc-900/60 border">
          <div class="text-sm"><b>Theme:</b> ${state.currentIdea.theme}</div>
          <div class="text-sm"><b>Hook seed:</b> "${state.currentIdea.hook}"</div>
          <div class="text-sm"><b>Structure:</b> ${state.currentIdea.struct}</div>
          <div class="text-sm"><b>Pro tips (${state.ideaGenre}):</b> ${state.currentIdea.tips.join(" • ")}</div>
        </div>
      ` : ''}
    </div>
  `;
}

function renderGenres() {
  return `
    <div>
      <h2 class="text-2xl font-extrabold mb-2">Genres</h2>
      <p class="opacity-80 mb-4">Core characteristics and craft notes for each style.</p>
      <div class="grid md:grid-cols-2 gap-4">
        ${Object.entries(GENRES).map(([name, data]) => `
          <div class="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
            <div class="text-xs uppercase tracking-wide text-zinc-500">${name}</div>
            <div class="font-bold mb-1">${data.summary}</div>
            <ul class="list-disc list-inside text-sm opacity-90">
              ${data.techniques.map(t => `<li>${t}</li>`).join('')}
            </ul>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderLearn() {
  const cards = [
    {
      title: "Rhyme Techniques",
      content: "Perfect, near/slant, internal, and multi-syllable rhymes. Combine schemes (e.g., AA/BB, AABA) and let function serve emotion."
    },
    {
      title: "Song Structure", 
      content: "Verse–chorus dynamics, bridge purpose, and arrangement to maintain interest. Contrast sections in melody, rhythm, and imagery."
    },
    {
      title: "Hook Crafting",
      content: "Hooks should be singable and inevitable. Use repetition with slight evolution; place emotional peak in chorus."
    },
    {
      title: "Imagery & Metaphor",
      content: "Write to the five senses. Prefer concrete nouns and verbs. Metaphor should clarify, not decorate."
    },
    {
      title: "Lyrical Themes",
      content: "Universal themes made personal through specific detail. Finding the precise detail makes the emotion believable."
    }
  ];

  return `
    <div>
      <h2 class="text-2xl font-extrabold mb-2">Learning Center</h2>
      <div class="grid md:grid-cols-2 gap-4">
        ${cards.map(card => `
          <div class="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
            <div class="text-sm font-bold mb-1">${card.title}</div>
            <div class="text-sm opacity-90">${card.content}</div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderProjects() {
  const filtered = state.projects.filter(p =>
    (p.title || "").toLowerCase().includes(state.projectFilter.toLowerCase()) || 
    (p.genre || "").toLowerCase().includes(state.projectFilter.toLowerCase())
  );
  
  const active = state.projects.find(p => p.id === state.activeProjectId) || null;

  return `
    <div>
      <div class="flex items-center justify-between mb-3">
        <h2 class="text-2xl font-extrabold">My Projects</h2>
        <div class="flex gap-2">
          <button onclick="createNewProject()" class="px-3 py-2 rounded-xl bg-zinc-900 text-white dark:bg-white dark:text-zinc-900">New</button>
          <button onclick="exportProjectsJson()" class="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">Export JSON</button>
          <label class="px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 cursor-pointer">
            Import JSON
            <input type="file" accept="application/json" class="hidden" onchange="importProjectsJson(event)" />
          </label>
        </div>
      </div>

      <div class="grid md:grid-cols-3 gap-4">
        <div class="md:col-span-1">
          <input 
            value="${state.projectFilter}" 
            onchange="updateProjectFilter(this.value)"
            oninput="updateProjectFilter(this.value)"
            placeholder="Search projects…" 
            class="w-full mb-2 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border" 
          />
          <div class="space-y-2 max-h-[60vh] overflow-auto pr-1">
            ${filtered.map(p => `
              <div 
                class="p-3 rounded-xl border cursor-pointer ${p.id === state.activeProjectId ? "border-zinc-900 dark:border-white" : "border-zinc-200 dark:border-zinc-800"}"
                onclick="setActiveProject('${p.id}')"
              >
                <div class="font-bold truncate">${p.title}</div>
                <div class="text-xs opacity-70">${p.genre || "—"} • ${new Date(p.updatedAt).toLocaleString()}</div>
                <div class="mt-1 text-sm line-clamp-2 opacity-80">${(p.lyrics||"").slice(0,120)}</div>
                <div class="mt-2 flex gap-2">
                  <button onclick="event.stopPropagation(); exportProjectTxt('${p.id}')" class="text-xs px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800">.txt</button>
                  <button onclick="event.stopPropagation(); deleteProject('${p.id}')" class="text-xs px-2 py-1 rounded-lg bg-red-500/10 text-red-600 border border-red-500/30">Delete</button>
                </div>
              </div>
            `).join('')}
            ${!filtered.length ? '<div class="opacity-60 text-sm">No projects yet. Create one!</div>' : ''}
          </div>
        </div>
        <div class="md:col-span-2">
          ${active ? `
            <div class="space-y-3">
              <div class="grid sm:grid-cols-2 gap-3">
                <label class="text-sm">Title
                  <input 
                    class="w-full mt-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border" 
                    value="${active.title}" 
                    onchange="updateActiveProject({ title: this.value })"
                  />
                </label>
                <label class="text-sm">Genre
                  <select 
                    class="w-full mt-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border" 
                    value="${active.genre}" 
                    onchange="updateActiveProject({ genre: this.value })"
                  >
                    <option value=""></option>
                    ${Object.keys(GENRES).map(g => `<option ${active.genre === g ? 'selected' : ''}>${g}</option>`).join('')}
                  </select>
                </label>
                <label class="text-sm">BPM
                  <input 
                    type="number" 
                    class="w-full mt-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border" 
                    value="${active.bpm}" 
                    onchange="updateActiveProject({ bpm: clamp(Number(this.value||0), 40, 240) })"
                  />
                </label>
                <label class="text-sm">Time Sig
                  <select 
                    class="w-full mt-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border" 
                    value="${active.timeSig}" 
                    onchange="updateActiveProject({ timeSig: this.value })"
                  >
                    <option ${active.timeSig === '4/4' ? 'selected' : ''}>4/4</option>
                    <option ${active.timeSig === '3/4' ? 'selected' : ''}>3/4</option>
                    <option ${active.timeSig === '6/8' ? 'selected' : ''}>6/8</option>
                  </select>
                </label>
              </div>
              <label class="text-sm">Lyrics
                <textarea 
                  rows="12" 
                  class="w-full mt-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border" 
                  onchange="updateActiveProject({ lyrics: this.value })"
                >${active.lyrics}</textarea>
              </label>
              <label class="text-sm">Notes
                <textarea 
                  rows="6" 
                  class="w-full mt-1 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-900 border" 
                  onchange="updateActiveProject({ notes: this.value })"
                >${active.notes}</textarea>
              </label>
            </div>
          ` : '<div class="opacity-60">Select or create a project to edit.</div>'}
        </div>
      </div>
    </div>
  `;
}

function renderFooter() {
  return `
    <footer class="border-t border-zinc-200 dark:border-zinc-800 mt-8 py-6 text-sm opacity-80">
      <div class="max-w-6xl mx-auto px-4 md:px-8">
        © 2025 Lyricist. Built with care for creativity.
        <div class="mt-1">Privacy note: local-only by default; optional online rhyme lookup via Datamuse when enabled.</div>
      </div>
    </footer>
  `;
}

// Event handlers
function bindEventListeners() {
  // Global functions for onclick handlers
  window.togglePanels = () => setState({ panelOpen: !state.panelOpen });
  window.toggleTheme = () => setState({ dark: !state.dark });
  window.toggleOnlineRhyme = () => setState({ onlineRhyme: !state.onlineRhyme });
  window.setRoute = (route) => {
    setState({ route });
    window.location.hash = route;
  };

  // Rhyme Engine
  window.updateRhymeQuery = (value) => setState({ rhymeQuery: value });
  window.searchRhymes = async () => {
    if (!state.rhymeQuery.trim()) return;
    
    setState({ rhymeLoading: true });
    
    try {
      const offline = await searchRhymesOffline(state.rhymeQuery.trim());
      
      if (!state.onlineRhyme) {
        setState({ 
          rhymeResults: offline,
          rhymeLoading: false 
        });
        return;
      }

      const word = state.rhymeQuery.trim();
      const url = `https://api.datamuse.com/words?rel_rhy=${encodeURIComponent(word)}&max=100`;
      const urlNear = `https://api.datamuse.com/words?rel_nry=${encodeURIComponent(word)}&max=100`;
      
      const [r1, r2] = await Promise.all([fetch(url), fetch(urlNear)]);
      const [pData, nData] = await Promise.all([r1.json(), r2.json()]);
      
      const perfect = (pData || []).map(d => d.word).slice(0, 100);
      const near = (nData || []).map(d => d.word).slice(0, 100);
      
      setState({
        rhymeResults: { 
          perfect, 
          near, 
          multi: offline.multi, 
          internal: offline.internal 
        },
        rhymeLoading: false
      });
    } catch (e) {
      console.error(e);
      const offline = await searchRhymesOffline(state.rhymeQuery.trim());
      setState({ 
        rhymeResults: offline,
        rhymeLoading: false 
      });
    }
  };

  // Lyric Analyzer
  window.updateAnalyzerText = (value) => setState({ analyzerText: value });
  window.updateAnalyzerBpm = (value) => setState({ analyzerBpm: clamp(Number(value||0), 40, 240) });
  window.updateAnalyzerBarsPerLine = (value) => setState({ analyzerBarsPerLine: clamp(Number(value||0), 1, 8) });
  window.updateAnalyzerTimeSig = (value) => setState({ analyzerTimeSig: value });

  // Metronome
  window.updateMetronomeBpm = (value) => setState({ metronomeBpm: clamp(Number(value||0), 40, 240) });
  window.updateMetronomeTimeSig = (value) => setState({ metronomeTimeSig: value });
  
  // Idea Generator
  window.updateIdeaGenre = (value) => setState({ ideaGenre: value });
  window.rollIdea = () => {
    const theme = rand(SEEDS.themes);
    const hook = rand(SEEDS.hooks);
    const struct = rand(SEEDS.structures);
    const tips = GENRES[state.ideaGenre]?.techniques || [];
    setState({ 
      currentIdea: { 
        theme, 
        hook, 
        struct, 
        tips: sample(tips, 2) 
      } 
    });
  };

  // Projects
  window.updateProjectFilter = (value) => setState({ projectFilter: value });
  window.setActiveProject = (id) => setState({ activeProjectId: id });
  
  window.createNewProject = () => {
    const p = defaultProject();
    setState({ 
      projects: [p, ...state.projects],
      activeProjectId: p.id 
    });
  };
  
  window.updateActiveProject = (patch) => {
    const active = state.projects.find(p => p.id === state.activeProjectId);
    if (!active) return;
    
    const updated = { ...active, ...patch, updatedAt: nowISO() };
    setState({
      projects: state.projects.map(p => p.id === active.id ? updated : p)
    });
  };
  
  window.deleteProject = (id) => {
    const next = state.projects.filter(p => p.id !== id);
    setState({ 
      projects: next,
      activeProjectId: state.activeProjectId === id ? (next[0]?.id || null) : state.activeProjectId
    });
  };
  
  window.exportProjectTxt = (id) => {
    const p = state.projects.find(proj => proj.id === id);
    if (!p) return;
    
    const blob = new Blob([p.lyrics || ""], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; 
    a.download = `${slug(p.title)}.txt`; 
    a.click(); 
    URL.revokeObjectURL(url);
  };
  
  window.exportProjectsJson = () => {
    const blob = new Blob([JSON.stringify(state.projects, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; 
    a.download = `lyricist-projects-${Date.now()}.json`; 
    a.click(); 
    URL.revokeObjectURL(url);
  };
  
  window.importProjectsJson = (ev) => {
    const file = ev.target.files?.[0]; 
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = () => {
      try { 
        const data = JSON.parse(reader.result); 
        if (Array.isArray(data)) setState({ projects: data }); 
      } catch {}
    };
    reader.readAsText(file);
  };
}

// Rhyme search functions
async function searchRhymesOffline(word) {
  if (!word) return { perfect: [], near: [], multi: [], internal: [] };
  
  const tail = rhymeKey(word);
  const onsets = ["b","c","d","f","g","h","j","k","l","m","n","p","r","s","t","v","w","y","z","br","cr","dr","fr","gr","pr","tr","str","pl","gl","cl","sl","bl","fl","sk","sp","st"];
  const perfect = Array.from(new Set(onsets.map(o => o + tail))).filter(w => w !== word.toLowerCase());

  const near = perfect.filter(w => editDistance(rhymeKey(w), tail) <= 1).slice(0, 60);

  const vowels = /[aeiouy]/;
  const splitAt = tail.search(vowels) > 0 ? tail.search(vowels) : 0;
  const core = tail.slice(splitAt);
  const multi = [
    `the ${core}`,
    `${core} time`,
    `in a ${core}`,
    `${core} again`,
    `my ${core}`,
  ];

  const vcore = (core.match(/[aeiouy]+/g) || [core]).join("");
  const internal = [
    `${vcore}… ${vcore}`,
    `…${vcore}…${vcore}…`,
    `${vcore} in the middle, ${vcore} at the end`,
  ];

  return { 
    perfect: perfect.slice(0, 60), 
    near, 
    multi, 
    internal 
  };
}

// Lyric analysis functions
function analyzeLyrics(lines) {
  const byLine = lines.map((ln) => {
    const ws = wordsFrom(ln);
    const syll = ws.reduce((a,w) => a + countSyllables(w), 0);
    const endWord = last(ws) || "";
    const endKey = rhymeKey(endWord);
    return { syll, end: endWord, key: endKey };
  });
  
  const avgSyll = byLine.length ? byLine.reduce((a,x)=>a+x.syll,0)/byLine.length : 0;
  
  const map = new Map();
  let letterCode = 65; // A
  const scheme = byLine.map((x) => {
    if (!x.key) return "-";
    const existing = Array.from(map.entries()).find(([,v]) => editDistance(v, x.key) <= 1);
    if (existing) return existing[0];
    const label = String.fromCharCode(letterCode++);
    map.set(label, x.key);
    return label;
  }).join("");
  
  return { 
    byLine, 
    avgSyll, 
    pattern: scheme.replace(/-+/g, "-") 
  };
}

// Metronome functions
let metronomeInterval = null;
let audioCtx = null;
let nextNoteTime = 0;

function click(time, accent = false) {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.value = accent ? 1000 : 700;
  gain.gain.value = 0.0015;
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + 0.03);
}

function scheduler() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  
  const now = audioCtx.currentTime;
  const beatsPerBar = Number(state.metronomeTimeSig.split("/")[0]) || 4;
  
  while (nextNoteTime < now + 0.1) {
    const isAccent = (state.metronomeBeat % beatsPerBar) === 0;
    click(nextNoteTime, isAccent);
    setState({ metronomeBeat: state.metronomeBeat + 1 });
    const spb = 60 / state.metronomeBpm;
    nextNoteTime += spb;
  }
  
  if (state.metronomeRunning) {
    requestAnimationFrame(scheduler);
  }
}

window.toggleMetronome = () => {
  if (state.metronomeRunning) {
    setState({ 
      metronomeRunning: false,
      metronomeBeat: 0 
    });
  } else {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    nextNoteTime = audioCtx.currentTime + 0.05;
    setState({ metronomeRunning: true });
    scheduler();
  }
};

window.tapTempo = () => {
  const t = performance.now();
  const arr = [...state.metronomeTapTimes.filter(x => t - x < 4000), t];
  setState({ metronomeTapTimes: arr });
  
  if (arr.length >= 2) {
    const diffs = arr.slice(1).map((x,i) => x - arr[i]);
    const avg = diffs.reduce((a,x)=>a+x,0)/diffs.length;
    const bpmEst = clamp(Math.round(60000/avg), 40, 240);
    setState({ metronomeBpm: bpmEst });
  }
};

// Utility functions for idea generator
function rand(arr) { 
  return arr[Math.floor(Math.random() * arr.length)]; 
}

function sample(arr, n) { 
  const c = [...arr]; 
  const out = []; 
  while (c.length && out.length < n) { 
    out.push(c.splice(Math.floor(Math.random() * c.length), 1)[0]); 
  } 
  return out; 
}

function slug(s) {
  return (s||"").toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/(^-|-$)/g,'');
}

// Initialize the app
init();