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
    icon: "🎵",
    color: "from-pink-500 to-rose-500",
    techniques: [
      "Strong hook within first 60 seconds",
      "Simple, universal themes",
      "Contrast between verse (narrative) and chorus (thesis)",
      "Melodic contour that lifts into the chorus",
    ],
  },
  "Rock": {
    summary: "Guitar-driven energy, riffs, dynamic builds, live feel.",
    icon: "🎸",
    color: "from-red-500 to-orange-500",
    techniques: [
      "Riff or motif to anchor sections",
      "Verse tension → explosive chorus",
      "Bridge introduces harmonic shift",
      "Lyric authenticity over polish",
    ],
  },
  "Hip-Hop": {
    summary: "Rhythm-forward, intricate rhyme schemes, flow and pocket.",
    icon: "🎤",
    color: "from-purple-500 to-indigo-500",
    techniques: [
      "Multi-syllable and internal rhymes",
      "Flow switches between sections",
      "Punchlines, imagery, wordplay",
      "Hook with rhythm + slogan",
    ],
  },
  "Country": {
    summary: "Storytelling, conversational tone, vivid specifics.",
    icon: "🤠",
    color: "from-amber-500 to-yellow-500",
    techniques: [
      "Concrete details (time, place, objects)",
      "Clear moral or turn in the bridge",
      "Chorus sums the heart of the story",
      "Strong prosody: lyric matches melody",
    ],
  },
  "Folk": {
    summary: "Lyric-first, human-scale stories, simple forms.",
    icon: "🪕",
    color: "from-green-500 to-emerald-500",
    techniques: [
      "Narrative verses with evolving detail",
      "Choruses act as refrain or mantra",
      "Acoustic textures, intimate voice",
      "Metaphor tied to nature/people",
    ],
  },
  "Jazz": {
    summary: "Sophisticated harmony, phrasing freedom, scat/swing.",
    icon: "🎺",
    color: "from-blue-500 to-cyan-500",
    techniques: [
      "Extensions (9ths, 13ths) and modal color",
      "Lyric phrasing plays with barlines",
      "Vocalese, internal rhymes tastefully",
      "Standard forms: AABA, 32-bar",
    ],
  },
  "Electronic": {
    summary: "Beat/texture-driven, builds/drops, repetition artfully used.",
    icon: "🎛️",
    color: "from-cyan-500 to-blue-500",
    techniques: [
      "Motif evolves via sound design",
      "Sparse verses → big chorus/drop",
      "Topline simplicity over dense beats",
      "Hook = melodic + timbral idea",
    ],
  },
  "R&B": {
    summary: "Soulful vocals, grooves, call-and-response, melisma.",
    icon: "🎶",
    color: "from-violet-500 to-purple-500",
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
    "running out of time", "the last summer night", "empty highways", "neon dreams",
    "broken promises", "midnight confessions", "golden hour memories", "lost in translation"
  ],
  hooks: [
    "Say it like you mean it", "Stuck in the in-between", "I keep the light on",
    "We were louder than the silence", "Tell me when to let go", "Dancing with shadows",
    "Chasing yesterday", "Swimming in starlight", "Burning bright tonight", "Take me higher"
  ],
  structures: [
    "Verse–Pre–Chorus–Chorus–Verse–Pre–Chorus–Chorus–Bridge–Chorus",
    "Verse–Chorus–Verse–Chorus–Bridge–Chorus",
    "Intro–Verse–Chorus–Drop–Verse–Chorus–Outro",
    "AABA (32-bar classic)",
    "Verse–Verse–Chorus–Verse–Chorus–Bridge–Chorus–Outro"
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
  analyzerText: "I keep the light on when I can't find home\\nYou keep the fight on till the last echo\\n— Draft verse",
  analyzerBpm: 120,
  analyzerBarsPerLine: 1,
  analyzerTimeSig: "4/4",
  
  // Metronome State
  metronomeBpm: 120,
  metronomeTimeSig: "4/4",
  metronomeRunning: false,
  metronomeBeat: 0,
  metronomeTapTimes: [],
  
  // Idea Generator State
  ideaGenre: "Pop",
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
    <div class="flex min-h-screen">
      ${state.panelOpen ? renderSidebar() : ''}
      <main class="flex-1 transition-all duration-300 ${state.panelOpen ? 'ml-0' : 'ml-0'}">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          ${renderRoute()}
        </div>
      </main>
    </div>
  `;
  
  // Bind event listeners after render
  bindEventListeners();
}

function renderHeader() {
  return `
    <header class="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 border-b border-neutral-200/50 dark:border-neutral-800/50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-4">
            <button 
              onclick="togglePanels()" 
              class="lg:hidden p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </button>
            
            <a href="#home" class="flex items-center space-x-3">
              <div class="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">L</span>
              </div>
              <div>
                <h1 class="font-black text-xl gradient-text">Lyricist Pro</h1>
                <p class="text-xs text-neutral-500 dark:text-neutral-400 -mt-1">Professional Studio</p>
              </div>
            </a>
            
            <nav class="hidden md:flex items-center space-x-1 ml-8">
              <a href="#home" class="px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</a>
              <a href="#rhyme" class="px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Tools</a>
              <a href="#learn" class="px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Learn</a>
              <a href="#genres" class="px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Genres</a>
              <a href="#saved" class="px-3 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Projects</a>
            </nav>
          </div>
          
          <div class="flex items-center space-x-3">
            <label class="hidden sm:flex items-center space-x-2 text-sm">
              <input 
                type="checkbox" 
                ${state.onlineRhyme ? 'checked' : ''} 
                onchange="toggleOnlineRhyme()" 
                class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500 focus:ring-2"
              />
              <span class="text-neutral-600 dark:text-neutral-400">Online Rhymes</span>
            </label>
            
            <button 
              onclick="toggleTheme()" 
              class="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              title="Toggle theme"
            >
              ${state.dark ? 
                '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path></svg>' :
                '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>'
              }
            </button>
          </div>
        </div>
      </div>
    </header>
  `;
}

function renderSidebar() {
  const linkClass = (key) => `flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
    state.route === key 
      ? "bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-r-2 border-primary-500" 
      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100"
  }`;
  
  return `
    <aside class="w-64 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm border-r border-neutral-200/50 dark:border-neutral-800/50 ${state.panelOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform lg:translate-x-0 lg:static fixed inset-y-0 left-0 z-40">
      <div class="p-4 space-y-6">
        <div class="space-y-1">
          <p class="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Tools</p>
          <nav class="space-y-1">
            <button class="${linkClass('rhyme')}" onclick="setRoute('rhyme')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              <span>Rhyme Engine</span>
            </button>
            <button class="${linkClass('analyzer')}" onclick="setRoute('analyzer')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              <span>Lyric Analyzer</span>
            </button>
            <button class="${linkClass('metronome')}" onclick="setRoute('metronome')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>Metronome</span>
            </button>
            <button class="${linkClass('generator')}" onclick="setRoute('generator')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <span>Idea Generator</span>
            </button>
          </nav>
        </div>
        
        <div class="space-y-1">
          <p class="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">Resources</p>
          <nav class="space-y-1">
            <button class="${linkClass('genres')}" onclick="setRoute('genres')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
              </svg>
              <span>Genres</span>
            </button>
            <button class="${linkClass('learn')}" onclick="setRoute('learn')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
              </svg>
              <span>Learn</span>
            </button>
            <button class="${linkClass('saved')}" onclick="setRoute('saved')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              <span>My Projects</span>
            </button>
            <button class="${linkClass('home')}" onclick="setRoute('home')">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span>Home</span>
            </button>
          </nav>
        </div>
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
    <div class="space-y-16">
      <!-- Hero Section -->
      <div class="text-center space-y-8">
        <div class="space-y-4">
          <h1 class="text-4xl md:text-6xl font-black leading-tight">
            <span class="gradient-text">Professional Songwriting</span><br>
            <span class="text-neutral-900 dark:text-neutral-100">Made Simple</span>
          </h1>
          <p class="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto leading-relaxed">
            Advanced rhyme engine, intelligent lyric analysis, precision metronome, and creative inspiration tools. Everything you need to write music that connects.
          </p>
        </div>
        
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="#rhyme" class="btn-primary text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg">
            Start Writing Now
          </a>
          <button onclick="toggleOnlineRhyme()" class="flex items-center space-x-2 px-6 py-4 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
            <input type="checkbox" ${state.onlineRhyme ? 'checked' : ''} class="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500" />
            <span class="text-neutral-700 dark:text-neutral-300">Enhanced Online Mode</span>
          </button>
        </div>
      </div>

      <!-- Feature Cards -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="card-hover bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
          <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">Advanced Rhyme Engine</h3>
          <p class="text-neutral-600 dark:text-neutral-400 text-sm mb-4">Perfect, near, internal, and multi-syllable rhymes with intelligent suggestions.</p>
          <a href="#rhyme" class="text-primary-600 dark:text-primary-400 font-medium text-sm hover:underline">Try Rhyme Engine →</a>
        </div>

        <div class="card-hover bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
          <div class="w-12 h-12 bg-gradient-to-br from-accent-500 to-accent-600 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">Lyric Analyzer</h3>
          <p class="text-neutral-600 dark:text-neutral-400 text-sm mb-4">Real-time analysis of syllables, timing, and rhyme patterns with visual feedback.</p>
          <a href="#analyzer" class="text-primary-600 dark:text-primary-400 font-medium text-sm hover:underline">Try Analyzer →</a>
        </div>

        <div class="card-hover bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
          <div class="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">Precision Metronome</h3>
          <p class="text-neutral-600 dark:text-neutral-400 text-sm mb-4">Professional metronome with tap tempo and visual beat indicators.</p>
          <a href="#metronome" class="text-primary-600 dark:text-primary-400 font-medium text-sm hover:underline">Try Metronome →</a>
        </div>

        <div class="card-hover bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
          <div class="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mb-4">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">Creative Generator</h3>
          <p class="text-neutral-600 dark:text-neutral-400 text-sm mb-4">Genre-specific prompts, themes, and structure suggestions for instant inspiration.</p>
          <a href="#generator" class="text-primary-600 dark:text-primary-400 font-medium text-sm hover:underline">Get Inspired →</a>
        </div>
      </div>

      <!-- Stats Section -->
      <div class="bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 rounded-3xl p-8 md:p-12 text-white">
        <div class="grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div class="text-3xl md:text-4xl font-black mb-2">50K+</div>
            <div class="text-primary-100">Rhymes Generated</div>
          </div>
          <div>
            <div class="text-3xl md:text-4xl font-black mb-2">8</div>
            <div class="text-primary-100">Genre Toolkits</div>
          </div>
          <div>
            <div class="text-3xl md:text-4xl font-black mb-2">100%</div>
            <div class="text-primary-100">Privacy Protected</div>
          </div>
        </div>
      </div>

      <!-- CTA Section -->
      <div class="text-center space-y-6 py-16">
        <h2 class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">Ready to Write Your Next Hit?</h2>
        <p class="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">Join thousands of songwriters who trust Lyricist Pro for their creative process.</p>
        <a href="#saved" class="btn-primary text-white px-8 py-4 rounded-xl font-semibold text-lg shadow-lg inline-block">
          Start Your First Project
        </a>
      </div>
    </div>
  `;
}

function renderRhymeEngine() {
  const key = rhymeKey(state.rhymeQuery);
  
  return `
    <div class="space-y-8">
      <div class="text-center space-y-4">
        <h1 class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">Advanced Rhyme Engine</h1>
        <p class="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Discover perfect, near, internal, and multi-syllable rhymes with our intelligent algorithm
        </p>
      </div>

      <div class="max-w-4xl mx-auto">
        <div class="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
          <div class="space-y-4">
            <div class="flex flex-col sm:flex-row gap-4">
              <input 
                value="${state.rhymeQuery}" 
                onchange="updateRhymeQuery(this.value)"
                oninput="updateRhymeQuery(this.value)"
                placeholder="Enter a word or phrase (e.g., 'purple', 'night sky')" 
                class="flex-1 px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 input-focus transition-all font-mono"
              />
              <button 
                onclick="searchRhymes()" 
                class="btn-primary text-white px-6 py-3 rounded-xl font-medium shadow-sm flex items-center space-x-2"
                ${state.rhymeLoading ? 'disabled' : ''}
              >
                ${state.rhymeLoading ? 
                  '<svg class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>' :
                  '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>'
                }
                <span>${state.rhymeLoading ? 'Searching...' : 'Find Rhymes'}</span>
              </button>
            </div>
            
            ${key ? `
              <div class="flex items-center space-x-2 text-sm">
                <span class="text-neutral-500 dark:text-neutral-400">Rhyme key:</span>
                <code class="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded font-mono text-primary-600 dark:text-primary-400">${key}</code>
              </div>
            ` : ''}
          </div>
        </div>

        ${renderRhymeBuckets()}

        <div class="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-8">
          💡 Pro tip: Try phrases like "${state.rhymeQuery || "midnight dreams"}" for multi-syllable and compound rhymes
        </div>
      </div>
    </div>
  `;
}

function renderRhymeBuckets() {
  const renderBucket = (title, items, color, icon) => `
    <div class="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
      <div class="flex items-center space-x-2 mb-4">
        <div class="w-8 h-8 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center">
          <span class="text-white text-sm">${icon}</span>
        </div>
        <h3 class="font-semibold text-neutral-900 dark:text-neutral-100">${title}</h3>
        <span class="text-xs text-neutral-500 dark:text-neutral-400">(${(items || []).length})</span>
      </div>
      <div class="space-y-2">
        ${(items || []).length ? 
          `<div class="flex flex-wrap gap-2">
            ${items.map(w => 
              `<span class="px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-lg text-sm font-mono cursor-pointer transition-colors" onclick="navigator.clipboard?.writeText('${w}')" title="Click to copy">${w}</span>`
            ).join('')}
          </div>` : 
          '<p class="text-neutral-500 dark:text-neutral-400 text-sm italic">No suggestions yet. Try entering a word above.</p>'
        }
      </div>
    </div>
  `;

  return `
    <div class="grid md:grid-cols-2 gap-6 mt-8">
      ${renderBucket("Perfect Rhymes", state.rhymeResults.perfect, "from-green-500 to-emerald-500", "🎯")}
      ${renderBucket("Near & Slant Rhymes", state.rhymeResults.near, "from-blue-500 to-cyan-500", "🎨")}
      ${renderBucket("Multi-Syllable", state.rhymeResults.multi, "from-purple-500 to-violet-500", "🎵")}
      ${renderBucket("Internal Rhyme Ideas", state.rhymeResults.internal, "from-orange-500 to-amber-500", "💫")}
    </div>
  `;
}

// Continue with other render functions...
function renderLyricAnalyzer() {
  const lines = (state.analyzerText || "").split(/\\r?\\n/);
  const metrics = analyzeLyrics(lines);
  const beatsPerBar = Number((state.analyzerTimeSig.split("/")[0]) || 4);
  const targetSyll = beatsPerBar * 2 * state.analyzerBarsPerLine;

  return `
    <div class="space-y-8">
      <div class="text-center space-y-4">
        <h1 class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">Lyric Analyzer</h1>
        <p class="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Real-time analysis of syllables, timing, and rhyme patterns with intelligent feedback
        </p>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Lyric Input -->
        <div class="lg:col-span-2">
          <div class="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
            <h3 class="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Your Lyrics</h3>
            <textarea 
              rows="16" 
              class="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 input-focus transition-all font-mono resize-none"
              onchange="updateAnalyzerText(this.value)"
              oninput="updateAnalyzerText(this.value)"
              placeholder="Paste your lyrics here for real-time analysis..."
            >${state.analyzerText}</textarea>
          </div>
        </div>

        <!-- Controls & Metrics -->
        <div class="space-y-6">
          <div class="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
            <h3 class="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Analysis Settings</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">BPM</label>
                <input 
                  type="number" 
                  min="40" max="240"
                  class="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 input-focus" 
                  value="${state.analyzerBpm}" 
                  onchange="updateAnalyzerBpm(this.value)"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Time Signature</label>
                <select 
                  class="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 input-focus" 
                  value="${state.analyzerTimeSig}" 
                  onchange="updateAnalyzerTimeSig(this.value)"
                >
                  <option ${state.analyzerTimeSig === '4/4' ? 'selected' : ''}>4/4</option>
                  <option ${state.analyzerTimeSig === '3/4' ? 'selected' : ''}>3/4</option>
                  <option ${state.analyzerTimeSig === '6/8' ? 'selected' : ''}>6/8</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Bars per Line</label>
                <input 
                  type="number" 
                  min="1" max="8"
                  class="w-full px-3 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 input-focus" 
                  value="${state.analyzerBarsPerLine}" 
                  onchange="updateAnalyzerBarsPerLine(this.value)"
                />
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
            <h3 class="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Analysis Results</h3>
            <div class="space-y-3">
              <div class="flex justify-between">
                <span class="text-sm text-neutral-600 dark:text-neutral-400">Target syllables/line:</span>
                <span class="text-sm font-mono font-medium">${targetSyll}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-neutral-600 dark:text-neutral-400">Average syllables:</span>
                <span class="text-sm font-mono font-medium">${metrics.avgSyll.toFixed(1)}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-neutral-600 dark:text-neutral-400">Rhyme scheme:</span>
                <span class="text-sm font-mono font-medium">${metrics.pattern || "—"}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-neutral-600 dark:text-neutral-400">Total lines:</span>
                <span class="text-sm font-mono font-medium">${lines.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Line Analysis -->
      <div class="space-y-4">
        <h3 class="text-xl font-semibold text-neutral-900 dark:text-neutral-100">Line-by-Line Analysis</h3>
        <div class="space-y-3">
          ${lines.map((line, i) => {
            const syl = metrics.byLine[i]?.syll || 0;
            const end = metrics.byLine[i]?.end || "";
            const overflow = syl > targetSyll + 2;
            const near = syl > targetSyll && syl <= targetSyll + 2;
            
            let borderClass, bgClass, statusClass, statusText, statusIcon;
            if (overflow) {
              borderClass = "border-red-200 dark:border-red-800";
              bgClass = "bg-red-50 dark:bg-red-900/20";
              statusClass = "text-red-600 dark:text-red-400";
              statusText = "Overflow";
              statusIcon = "⚠️";
            } else if (near) {
              borderClass = "border-amber-200 dark:border-amber-800";
              bgClass = "bg-amber-50 dark:bg-amber-900/20";
              statusClass = "text-amber-600 dark:text-amber-400";
              statusText = "Tight";
              statusIcon = "⚡";
            } else {
              borderClass = "border-green-200 dark:border-green-800";
              bgClass = "bg-green-50 dark:bg-green-900/20";
              statusClass = "text-green-600 dark:text-green-400";
              statusText = "Good";
              statusIcon = "✅";
            }
            
            return `
              <div class="rounded-xl border ${borderClass} ${bgClass} p-4 transition-all">
                <div class="flex items-center justify-between mb-2 text-sm">
                  <span class="text-neutral-600 dark:text-neutral-400">
                    Line ${i+1} • <span class="font-mono">${syl} syllables</span> • End: <span class="font-mono">"${end || "—"}"</span>
                  </span>
                  <span class="${statusClass} font-medium flex items-center space-x-1">
                    <span>${statusIcon}</span>
                    <span>${statusText}</span>
                  </span>
                </div>
                <div class="font-mono text-neutral-900 dark:text-neutral-100 whitespace-pre-wrap">
                  ${line || '<span class="text-neutral-400 italic">(empty line)</span>'}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </div>
  `;
}

function renderMetronome() {
  const beatsPerBar = Number(state.metronomeTimeSig.split("/")[0]) || 4;
  
  return `
    <div class="space-y-8">
      <div class="text-center space-y-4">
        <h1 class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">Precision Metronome</h1>
        <p class="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Professional metronome with visual indicators, tap tempo, and keyboard control
        </p>
      </div>

      <div class="max-w-2xl mx-auto space-y-8">
        <!-- Controls -->
        <div class="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-sm border border-neutral-200 dark:border-neutral-800">
          <div class="grid sm:grid-cols-3 gap-6 mb-8">
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">BPM</label>
              <input 
                type="number" 
                min="40" max="240"
                class="w-full px-4 py-3 text-center text-2xl font-bold rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 input-focus font-mono" 
                value="${state.metronomeBpm}" 
                onchange="updateMetronomeBpm(this.value)"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Time Signature</label>
              <select 
                class="w-full px-4 py-3 text-center text-lg rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 input-focus" 
                value="${state.metronomeTimeSig}" 
                onchange="updateMetronomeTimeSig(this.value)"
              >
                <option ${state.metronomeTimeSig === '4/4' ? 'selected' : ''}>4/4</option>
                <option ${state.metronomeTimeSig === '3/4' ? 'selected' : ''}>3/4</option>
                <option ${state.metronomeTimeSig === '6/8' ? 'selected' : ''}>6/8</option>
              </select>
            </div>
            <div class="flex flex-col justify-end">
              <button 
                onclick="tapTempo()" 
                class="w-full px-4 py-3 rounded-xl border-2 border-dashed border-neutral-300 dark:border-neutral-700 hover:border-primary-500 dark:hover:border-primary-400 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium"
              >
                Tap Tempo
              </button>
            </div>
          </div>
          
          <!-- Play/Stop Button -->
          <div class="text-center">
            <button 
              onclick="toggleMetronome()" 
              class="${state.metronomeRunning ? 'bg-red-500 hover:bg-red-600' : 'btn-primary'} text-white px-12 py-4 rounded-2xl font-bold text-xl shadow-lg transition-all transform hover:scale-105"
            >
              ${state.metronomeRunning ? '⏸ Stop' : '▶ Start'}
            </button>
            <p class="text-sm text-neutral-500 dark:text-neutral-400 mt-2">Press spacebar to toggle</p>
          </div>
        </div>

        <!-- Visual Beat Indicator -->
        <div class="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-sm border border-neutral-200 dark:border-neutral-800">
          <div class="flex items-center justify-center space-x-4 h-32">
            ${Array.from({ length: beatsPerBar }).map((_, i) => {
              const isActive = (state.metronomeBeat % beatsPerBar) === i && state.metronomeRunning;
              const isDownbeat = i === 0;
              return `
                <div class="relative">
                  <div class="w-16 h-16 rounded-full border-4 transition-all duration-100 ${
                    isActive 
                      ? (isDownbeat ? 'bg-primary-500 border-primary-500 animate-pulse-glow scale-110' : 'bg-accent-500 border-accent-500 scale-110') 
                      : (isDownbeat ? 'border-primary-300 dark:border-primary-700' : 'border-neutral-300 dark:border-neutral-700')
                  }"></div>
                  <div class="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-neutral-500 dark:text-neutral-400">
                    ${i + 1}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Info -->
        <div class="text-center text-sm text-neutral-500 dark:text-neutral-400">
          <p>⚡ Tip: Use spacebar for quick start/stop control while you play</p>
        </div>
      </div>
    </div>
  `;
}

function renderIdeaGenerator() {
  const genre = GENRES[state.ideaGenre];
  
  return `
    <div class="space-y-8">
      <div class="text-center space-y-4">
        <h1 class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">Creative Idea Generator</h1>
        <p class="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Genre-specific inspiration to kickstart your songwriting process
        </p>
      </div>

      <div class="max-w-4xl mx-auto space-y-8">
        <!-- Genre Selection -->
        <div class="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
          <div class="flex flex-col sm:flex-row items-center gap-4">
            <div class="flex-1">
              <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Choose Genre</label>
              <select 
                class="w-full px-4 py-3 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 input-focus text-lg" 
                value="${state.ideaGenre}" 
                onchange="updateIdeaGenre(this.value)"
              >
                ${Object.entries(GENRES).map(([name, data]) => 
                  `<option value="${name}" ${state.ideaGenre === name ? 'selected' : ''}>${data.icon} ${name}</option>`
                ).join('')}
              </select>
            </div>
            <div class="flex-shrink-0 pt-6">
              <button 
                onclick="rollIdea()" 
                class="btn-primary text-white px-8 py-3 rounded-xl font-semibold shadow-sm flex items-center space-x-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                <span>Generate Ideas</span>
              </button>
            </div>
          </div>
        </div>

        <!-- Genre Info -->
        ${genre ? `
          <div class="bg-gradient-to-br ${genre.color} rounded-2xl p-8 text-white">
            <div class="flex items-center space-x-3 mb-4">
              <span class="text-3xl">${genre.icon}</span>
              <div>
                <h3 class="text-2xl font-bold">${state.ideaGenre}</h3>
                <p class="text-white/80">${genre.summary}</p>
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Generated Idea -->
        ${state.currentIdea ? `
          <div class="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-sm border border-neutral-200 dark:border-neutral-800 space-y-6">
            <h3 class="text-xl font-bold text-neutral-900 dark:text-neutral-100 flex items-center space-x-2">
              <span>✨</span>
              <span>Your Creative Spark</span>
            </h3>
            
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <div>
                  <h4 class="font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Theme</h4>
                  <p class="text-lg text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 px-4 py-3 rounded-xl">"${state.currentIdea.theme}"</p>
                </div>
                
                <div>
                  <h4 class="font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Hook Seed</h4>
                  <p class="text-lg text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 px-4 py-3 rounded-xl italic">"${state.currentIdea.hook}"</p>
                </div>
              </div>
              
              <div class="space-y-4">
                <div>
                  <h4 class="font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Suggested Structure</h4>
                  <p class="text-sm text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-800 px-4 py-3 rounded-xl font-mono">${state.currentIdea.struct}</p>
                </div>
                
                <div>
                  <h4 class="font-semibold text-neutral-700 dark:text-neutral-300 mb-2">${state.ideaGenre} Pro Tips</h4>
                  <ul class="space-y-2">
                    ${state.currentIdea.tips.map(tip => 
                      `<li class="flex items-start space-x-2 text-sm">
                        <span class="text-primary-500 mt-0.5">•</span>
                        <span class="text-neutral-700 dark:text-neutral-300">${tip}</span>
                      </li>`
                    ).join('')}
                  </ul>
                </div>
              </div>
            </div>
            
            <div class="pt-4 border-t border-neutral-200 dark:border-neutral-800">
              <button 
                onclick="createProjectFromIdea()" 
                class="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Start Project with This Idea
              </button>
            </div>
          </div>
        ` : `
          <div class="text-center py-16">
            <div class="text-6xl mb-4">🎭</div>
            <h3 class="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Ready for Inspiration?</h3>
            <p class="text-neutral-500 dark:text-neutral-400">Click "Generate Ideas" to get started with ${state.ideaGenre}-specific prompts</p>
          </div>
        `}
      </div>
    </div>
  `;
}

function renderGenres() {
  return `
    <div class="space-y-8">
      <div class="text-center space-y-4">
        <h1 class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">Genre Guides</h1>
        <p class="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Master the craft of different musical genres with professional techniques and insights
        </p>
      </div>

      <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        ${Object.entries(GENRES).map(([name, data]) => `
          <div class="card-hover bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-sm border border-neutral-200 dark:border-neutral-800">
            <div class="bg-gradient-to-br ${data.color} p-6 text-white">
              <div class="flex items-center space-x-3 mb-3">
                <span class="text-3xl">${data.icon}</span>
                <h3 class="text-xl font-bold">${name}</h3>
              </div>
              <p class="text-white/90 text-sm">${data.summary}</p>
            </div>
            
            <div class="p-6">
              <h4 class="font-semibold text-neutral-900 dark:text-neutral-100 mb-3">Key Techniques</h4>
              <ul class="space-y-2">
                ${data.techniques.map(technique => 
                  `<li class="flex items-start space-x-2 text-sm">
                    <span class="text-primary-500 mt-1 flex-shrink-0">•</span>
                    <span class="text-neutral-700 dark:text-neutral-300">${technique}</span>
                  </li>`
                ).join('')}
              </ul>
              
              <div class="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-800">
                <button 
                  onclick="setIdeaGenre('${name}')" 
                  class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm transition-colors"
                >
                  Generate ${name} Ideas →
                </button>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

function renderLearn() {
  const learningModules = [
    {
      title: "Rhyme Techniques",
      icon: "🎯",
      color: "from-blue-500 to-cyan-500",
      content: "Master perfect, near/slant, internal, and multi-syllable rhymes. Learn when to use each type and how to combine different rhyme schemes for maximum impact.",
      techniques: [
        "Perfect rhymes for strong endings",
        "Slant rhymes for subtle sophistication", 
        "Internal rhymes for rhythmic flow",
        "Multi-syllable for complexity"
      ]
    },
    {
      title: "Song Structure",
      icon: "🏗️",
      color: "from-green-500 to-emerald-500",
      content: "Understand verse-chorus dynamics, bridge purpose, and arrangement principles that keep listeners engaged from start to finish.",
      techniques: [
        "Verse builds tension and narrative",
        "Chorus delivers emotional payoff",
        "Bridge provides harmonic/melodic contrast", 
        "Intro/outro frame the experience"
      ]
    },
    {
      title: "Hook Crafting",
      icon: "🪝",
      color: "from-purple-500 to-violet-500",
      content: "Create memorable, singable hooks that stick in listeners' minds. Learn the psychology of repetition and emotional peaks.",
      techniques: [
        "Repetition with subtle variation",
        "Emotional peak placement",
        "Melodic and rhythmic memorability",
        "Universal yet specific themes"
      ]
    },
    {
      title: "Imagery & Metaphor", 
      icon: "🎨",
      color: "from-orange-500 to-red-500",
      content: "Paint vivid pictures with words. Learn to engage all five senses and use metaphor to clarify rather than complicate.",
      techniques: [
        "Concrete over abstract language",
        "Five-senses imagery",
        "Metaphor for clarity",
        "Show don't tell principle"
      ]
    },
    {
      title: "Lyrical Themes",
      icon: "💭",
      color: "from-pink-500 to-rose-500",
      content: "Transform universal emotions into personal stories. Find the specific details that make broad themes feel authentic and relatable.",
      techniques: [
        "Universal themes, specific details",
        "Personal authenticity",
        "Emotional truth over literal truth",
        "Cultural relevance and timelessness"
      ]
    },
    {
      title: "Prosody & Flow",
      icon: "🌊",
      color: "from-teal-500 to-cyan-500",
      content: "Master the marriage of lyric and melody. Learn how syllable stress, phrasing, and rhythm create natural, flowing vocals.",
      techniques: [
        "Natural speech patterns",
        "Syllable stress alignment",
        "Phrasing with breathing in mind",
        "Rhythm serves emotion"
      ]
    }
  ];

  return `
    <div class="space-y-8">
      <div class="text-center space-y-4">
        <h1 class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">Learning Center</h1>
        <p class="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Master the fundamentals of professional songwriting with expert guidance and practical techniques
        </p>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        ${learningModules.map(module => `
          <div class="card-hover bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-sm border border-neutral-200 dark:border-neutral-800">
            <div class="bg-gradient-to-br ${module.color} p-6 text-white">
              <div class="flex items-center space-x-3 mb-3">
                <span class="text-3xl">${module.icon}</span>
                <h3 class="text-xl font-bold">${module.title}</h3>
              </div>
              <p class="text-white/90 text-sm leading-relaxed">${module.content}</p>
            </div>
            
            <div class="p-6">
              <h4 class="font-semibold text-neutral-900 dark:text-neutral-100 mb-4">Key Concepts</h4>
              <ul class="space-y-3">
                ${module.techniques.map(technique => 
                  `<li class="flex items-start space-x-3">
                    <div class="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 flex-shrink-0"></div>
                    <span class="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">${technique}</span>
                  </li>`
                ).join('')}
              </ul>
            </div>
          </div>
        `).join('')}
      </div>

      <!-- Practice Exercises -->
      <div class="bg-gradient-to-br from-primary-500 via-primary-600 to-accent-600 rounded-2xl p-8 text-white">
        <div class="text-center space-y-4">
          <h2 class="text-2xl font-bold">Ready to Practice?</h2>
          <p class="text-primary-100 max-w-2xl mx-auto">
            Apply these concepts using our professional songwriting tools. Start with the rhyme engine to explore creative possibilities.
          </p>
          <a href="#rhyme" class="inline-block bg-white text-primary-600 px-8 py-3 rounded-xl font-semibold hover:bg-neutral-100 transition-colors">
            Start Practicing Now
          </a>
        </div>
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
    <div class="space-y-8">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-neutral-100">My Projects</h1>
          <p class="text-neutral-600 dark:text-neutral-400 mt-2">Organize and manage your songwriting projects</p>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            onclick="createNewProject()" 
            class="btn-primary text-white px-6 py-2.5 rounded-lg font-medium shadow-sm"
          >
            + New Project
          </button>
          <button 
            onclick="exportProjectsJson()" 
            class="px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm"
          >
            Export All
          </button>
          <label class="px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer text-sm">
            Import
            <input type="file" accept="application/json" class="hidden" onchange="importProjectsJson(event)" />
          </label>
        </div>
      </div>

      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Project List -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
            <div class="mb-4">
              <input 
                value="${state.projectFilter}" 
                onchange="updateProjectFilter(this.value)"
                oninput="updateProjectFilter(this.value)"
                placeholder="Search projects..." 
                class="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 input-focus text-sm"
              />
            </div>
            
            <div class="space-y-3 max-h-96 overflow-y-auto">
              ${filtered.length ? filtered.map(p => `
                <div 
                  class="p-4 rounded-xl border cursor-pointer transition-all hover:shadow-sm ${
                    p.id === state.activeProjectId 
                      ? "border-primary-300 dark:border-primary-700 bg-primary-50 dark:bg-primary-900/20" 
                      : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                  }"
                  onclick="setActiveProject('${p.id}')"
                >
                  <div class="flex items-start justify-between mb-2">
                    <h3 class="font-semibold text-neutral-900 dark:text-neutral-100 truncate flex-1">${p.title}</h3>
                    <div class="flex items-center space-x-1 ml-2">
                      <button 
                        onclick="event.stopPropagation(); exportProjectTxt('${p.id}')" 
                        class="text-xs px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                        title="Export lyrics"
                      >
                        TXT
                      </button>
                      <button 
                        onclick="event.stopPropagation(); deleteProject('${p.id}')" 
                        class="text-xs px-2 py-1 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        title="Delete project"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div class="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                    ${p.genre || "No genre"} • ${new Date(p.updatedAt).toLocaleDateString()}
                  </div>
                  <div class="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                    ${(p.lyrics || "No lyrics yet...").substring(0, 100)}${(p.lyrics || "").length > 100 ? "..." : ""}
                  </div>
                </div>
              `).join('') : `
                <div class="text-center py-8 text-neutral-500 dark:text-neutral-400">
                  <div class="text-4xl mb-3">📝</div>
                  <p class="text-sm">No projects yet.</p>
                  <p class="text-xs">Create your first project to get started!</p>
                </div>
              `}
            </div>
          </div>
        </div>

        <!-- Project Editor -->
        <div class="lg:col-span-2">
          ${active ? `
            <div class="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-800">
              <div class="space-y-6">
                <div class="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Project Title</label>
                    <input 
                      class="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 input-focus" 
                      value="${active.title}" 
                      onchange="updateActiveProject({ title: this.value })"
                      placeholder="Enter project title..."
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Genre</label>
                    <select 
                      class="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 input-focus" 
                      value="${active.genre}" 
                      onchange="updateActiveProject({ genre: this.value })"
                    >
                      <option value="">Select a genre...</option>
                      ${Object.entries(GENRES).map(([name, data]) => 
                        `<option value="${name}" ${active.genre === name ? 'selected' : ''}>${data.icon} ${name}</option>`
                      ).join('')}
                    </select>
                  </div>
                </div>
                
                <div class="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">BPM</label>
                    <input 
                      type="number" 
                      min="40" max="240"
                      class="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 input-focus" 
                      value="${active.bpm}" 
                      onchange="updateActiveProject({ bpm: clamp(Number(this.value||0), 40, 240) })"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Time Signature</label>
                    <select 
                      class="w-full px-4 py-2.5 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 input-focus" 
                      value="${active.timeSig}" 
                      onchange="updateActiveProject({ timeSig: this.value })"
                    >
                      <option ${active.timeSig === '4/4' ? 'selected' : ''}>4/4</option>
                      <option ${active.timeSig === '3/4' ? 'selected' : ''}>3/4</option>
                      <option ${active.timeSig === '6/8' ? 'selected' : ''}>6/8</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Lyrics</label>
                  <textarea 
                    rows="12" 
                    class="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 input-focus font-mono text-sm resize-none" 
                    onchange="updateActiveProject({ lyrics: this.value })"
                    placeholder="Write your lyrics here..."
                  >${active.lyrics}</textarea>
                </div>
                
                <div>
                  <label class="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">Notes & Ideas</label>
                  <textarea 
                    rows="4" 
                    class="w-full px-4 py-3 rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 input-focus resize-none" 
                    onchange="updateActiveProject({ notes: this.value })"
                    placeholder="Add notes, chord progressions, or other ideas..."
                  >${active.notes}</textarea>
                </div>
                
                <div class="flex items-center justify-between pt-4 border-t border-neutral-200 dark:border-neutral-800">
                  <div class="text-xs text-neutral-500 dark:text-neutral-400">
                    Created: ${new Date(active.createdAt).toLocaleDateString()} • 
                    Updated: ${new Date(active.updatedAt).toLocaleDateString()}
                  </div>
                  <div class="flex items-center space-x-3">
                    <button 
                      onclick="analyzeProjectLyrics()" 
                      class="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium text-sm"
                    >
                      Analyze Lyrics
                    </button>
                    <button 
                      onclick="exportProjectTxt('${active.id}')" 
                      class="px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors text-sm"
                    >
                      Export TXT
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ` : `
            <div class="bg-white dark:bg-neutral-900 rounded-2xl p-12 shadow-sm border border-neutral-200 dark:border-neutral-800 text-center">
              <div class="text-6xl mb-4">📝</div>
              <h3 class="text-xl font-semibold text-neutral-700 dark:text-neutral-300 mb-2">Select a Project</h3>
              <p class="text-neutral-500 dark:text-neutral-400 mb-6">Choose a project from the list or create a new one to start writing.</p>
              <button 
                onclick="createNewProject()" 
                class="btn-primary text-white px-6 py-3 rounded-xl font-medium"
              >
                Create New Project
              </button>
            </div>
          `}
        </div>
      </div>
    </div>
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
  
  window.setIdeaGenre = (genre) => {
    setState({ ideaGenre: genre });
    setRoute('generator');
  };
  
  window.createProjectFromIdea = () => {
    if (!state.currentIdea) return;
    const p = defaultProject();
    p.title = `${state.currentIdea.theme} (${state.ideaGenre})`;
    p.genre = state.ideaGenre;
    p.lyrics = `# ${state.currentIdea.hook}\\n\\n[Verse]\\n${state.currentIdea.theme}\\n\\n[Chorus]\\n${state.currentIdea.hook}\\n\\n# Notes: ${state.currentIdea.struct}`;
    setState({ 
      projects: [p, ...state.projects],
      activeProjectId: p.id,
      route: 'saved'
    });
    window.location.hash = 'saved';
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
    if (!confirm('Are you sure you want to delete this project?')) return;
    const next = state.projects.filter(p => p.id !== id);
    setState({ 
      projects: next,
      activeProjectId: state.activeProjectId === id ? (next[0]?.id || null) : state.activeProjectId
    });
  };
  
  window.exportProjectTxt = (id) => {
    const p = state.projects.find(proj => proj.id === id);
    if (!p) return;
    
    const content = `${p.title}\\n${p.genre ? `Genre: ${p.genre}` : ''}\\n${p.bpm ? `BPM: ${p.bpm}` : ''}\\n${p.timeSig ? `Time: ${p.timeSig}` : ''}\\n\\n${p.lyrics || ""}\\n\\n${p.notes ? `Notes:\\n${p.notes}` : ''}`;
    
    const blob = new Blob([content], { type: "text/plain" });
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
        if (Array.isArray(data)) {
          setState({ projects: [...state.projects, ...data] }); 
          alert(`Imported ${data.length} projects successfully!`);
        }
      } catch {
        alert('Invalid project file format.');
      }
    };
    reader.readAsText(file);
  };
  
  window.analyzeProjectLyrics = () => {
    const active = state.projects.find(p => p.id === state.activeProjectId);
    if (!active || !active.lyrics) return;
    
    setState({ 
      analyzerText: active.lyrics,
      analyzerBpm: active.bpm,
      analyzerTimeSig: active.timeSig,
      route: 'analyzer'
    });
    window.location.hash = 'analyzer';
  };
}

// Rhyme search functions (keep existing implementation)
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
    `no more ${core}`,
    `${core} tonight`
  ];

  const vcore = (core.match(/[aeiouy]+/g) || [core]).join("");
  const internal = [
    `${vcore}… ${vcore}`,
    `…${vcore}…${vcore}…`,
    `${vcore} in the middle, ${vcore} at the end`,
    `${vcore} and ${vcore}`,
  ];

  return { 
    perfect: perfect.slice(0, 60), 
    near, 
    multi, 
    internal 
  };
}

// Lyric analysis functions (keep existing implementation)
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

// Metronome functions (keep existing implementation but improve UX)
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
  gain.gain.value = 0.002;
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + 0.05);
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

// Utility functions for idea generator (keep existing implementation)
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