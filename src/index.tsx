import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS for API routes
app.use('/api/*', cors())

// Serve static files
app.use('/static/*', serveStatic({ root: './public' }))

// Songwriting data - genres, techniques, and educational content
const genres = {
  pop: {
    name: "Pop",
    description: "Catchy, accessible songs with broad appeal",
    characteristics: [
      "Simple, memorable hooks",
      "Verse-Chorus structure", 
      "3-4 minute length",
      "Relatable themes",
      "Clear melody lines"
    ],
    lyricTips: [
      "Write about universal emotions and experiences",
      "Use simple, conversational language",
      "Create memorable hooks and choruses",
      "Focus on storytelling that connects with listeners",
      "Keep metaphors accessible and relatable"
    ],
    exampleTopics: [
      "Love and relationships",
      "Self-empowerment",
      "Party and fun times",
      "Growing up and nostalgia",
      "Dreams and aspirations"
    ]
  },
  rock: {
    name: "Rock",
    description: "Powerful, energetic music with strong rhythms",
    characteristics: [
      "Strong, driving rhythms",
      "Guitar-centric arrangements",
      "Powerful vocals",
      "Rebellious or intense themes",
      "Dynamic build-ups"
    ],
    lyricTips: [
      "Use strong, powerful language",
      "Express rebellion, passion, or intensity",
      "Create anthemic choruses people can sing along to",
      "Tell stories of struggle, triumph, or defiance",
      "Use metaphors related to power, freedom, and strength"
    ],
    exampleTopics: [
      "Rebellion and freedom",
      "Social issues and protest",
      "Personal struggles",
      "Love and heartbreak",
      "Coming of age"
    ]
  },
  hiphop: {
    name: "Hip-Hop",
    description: "Rhythmic spoken word with strong beats",
    characteristics: [
      "Complex wordplay and rhymes",
      "Strong rhythmic patterns",
      "Storytelling and narrative",
      "Social commentary",
      "Personal expression"
    ],
    lyricTips: [
      "Master internal rhymes and multisyllabic patterns",
      "Tell vivid stories with detailed imagery",
      "Use wordplay, metaphors, and double meanings",
      "Express authentic personal experiences",
      "Create strong rhythmic flow with your words"
    ],
    exampleTopics: [
      "Personal journey and growth",
      "Social justice and inequality",
      "Street life and experiences",
      "Success and ambition",
      "Cultural identity and pride"
    ]
  },
  country: {
    name: "Country",
    description: "Storytelling music rooted in traditional American themes",
    characteristics: [
      "Strong narrative storytelling",
      "Rural and small-town themes",
      "Simple, honest language",
      "Traditional values",
      "Acoustic instruments"
    ],
    lyricTips: [
      "Tell detailed, specific stories with clear characters",
      "Use simple, conversational language",
      "Focus on family, home, and traditional values",
      "Paint vivid pictures of rural life and landscapes",
      "Include specific details that make stories feel real"
    ],
    exampleTopics: [
      "Family and relationships",
      "Small town life",
      "Hard work and values",
      "Love and heartbreak",
      "Rural landscapes and nature"
    ]
  },
  folk: {
    name: "Folk",
    description: "Traditional storytelling music with social consciousness",
    characteristics: [
      "Acoustic instrumentation",
      "Social and political themes",
      "Traditional melodies",
      "Storytelling focus",
      "Cultural preservation"
    ],
    lyricTips: [
      "Tell stories that matter to communities",
      "Use simple, powerful language",
      "Address social issues and human experiences",
      "Create songs that people can easily learn and sing",
      "Draw from tradition while speaking to current issues"
    ],
    exampleTopics: [
      "Social justice and change",
      "Historical events and people",
      "Environmental concerns",
      "Working class struggles",
      "Cultural traditions"
    ]
  },
  blues: {
    name: "Blues",
    description: "Emotional music expressing life's struggles and joys",
    characteristics: [
      "12-bar blues structure",
      "Call and response patterns",
      "Emotional expression",
      "Personal struggles",
      "Repetitive lyrical patterns"
    ],
    lyricTips: [
      "Express deep emotions and personal struggles",
      "Use the AAB lyrical pattern (repeat first line, then resolve)",
      "Be honest and authentic about pain and hardship",
      "Include references to everyday life and work",
      "Use metaphors related to weather, travel, and relationships"
    ],
    exampleTopics: [
      "Heartbreak and loss",
      "Financial struggles",
      "Betrayal and disappointment",
      "Hope and resilience",
      "Life's hardships"
    ]
  }
};

const songwritingTechniques = {
  structure: {
    name: "Song Structure",
    techniques: [
      {
        name: "Verse-Chorus-Verse-Chorus-Bridge-Chorus",
        description: "The most common pop song structure",
        tips: "Verses tell the story, chorus delivers the main message, bridge provides contrast"
      },
      {
        name: "AABA Structure", 
        description: "Two verses (A), chorus (B), verse (A)",
        tips: "Classic structure used in many standards and folk songs"
      },
      {
        name: "12-Bar Blues",
        description: "Traditional blues structure with specific chord progression",
        tips: "Perfect for expressing emotion and storytelling in blues style"
      }
    ]
  },
  rhyming: {
    name: "Rhyme Schemes",
    techniques: [
      {
        name: "Perfect Rhymes",
        description: "Words that sound exactly the same (cat/hat, love/dove)",
        tips: "Strong and satisfying, but can sound predictable if overused"
      },
      {
        name: "Near Rhymes",
        description: "Words that sound similar but not identical (heart/part, soul/whole)",
        tips: "More subtle and sophisticated, allows for more word choices"
      },
      {
        name: "Internal Rhymes",
        description: "Rhymes within lines rather than at the end",
        tips: "Creates flow and rhythm, especially effective in hip-hop and rap"
      },
      {
        name: "Multisyllabic Rhymes",
        description: "Rhyming multiple syllables (incredible/unforgettable)",
        tips: "Shows technical skill and creates complex rhythmic patterns"
      }
    ]
  },
  melody: {
    name: "Melody and Rhythm",
    techniques: [
      {
        name: "Prosody",
        description: "Matching the natural rhythm of words to the musical rhythm",
        tips: "Read lyrics aloud to find natural stress patterns, then match with music"
      },
      {
        name: "Syllable Counting",
        description: "Ensuring consistent syllable counts for smooth melody",
        tips: "Count syllables in each line to maintain consistent phrasing"
      },
      {
        name: "Vowel Sounds",
        description: "Using open vowels for high notes, closed for low notes",
        tips: "Words like 'love' and 'up' work well for high notes"
      }
    ]
  },
  storytelling: {
    name: "Storytelling Techniques",
    techniques: [
      {
        name: "Show Don't Tell",
        description: "Use specific details and imagery instead of general statements",
        tips: "Instead of 'I was sad,' try 'Rain fell like tears on my window'"
      },
      {
        name: "Character Development",
        description: "Create clear, relatable characters in your songs",
        tips: "Give characters specific traits, backgrounds, and motivations"
      },
      {
        name: "Setting the Scene",
        description: "Use vivid imagery to create a specific time and place",
        tips: "Include sensory details - what characters see, hear, smell, feel"
      },
      {
        name: "Conflict and Resolution",
        description: "Every good story has tension that gets resolved",
        tips: "Present a problem or conflict, then show how it's resolved or what's learned"
      }
    ]
  }
};

const rhymeDictionary = {
  // Common rhyming patterns for songwriters
  love: ["above", "dove", "glove", "shove", "thereof"],
  heart: ["part", "start", "art", "smart", "cart", "apart"],
  time: ["rhyme", "climb", "prime", "crime", "sublime"],
  night: ["light", "bright", "flight", "sight", "might", "right"],
  day: ["way", "say", "play", "stay", "pray", "away"],
  free: ["be", "see", "key", "tree", "me", "we"],
  pain: ["rain", "gain", "main", "chain", "plane", "strain"],
  fire: ["desire", "inspire", "require", "wire", "tire", "higher"],
  dream: ["seem", "beam", "team", "stream", "cream", "extreme"],
  soul: ["whole", "goal", "roll", "control", "hole", "console"]
};

// API Routes

// Get all genres
app.get('/api/genres', (c) => {
  return c.json(genres);
});

// Get specific genre info
app.get('/api/genres/:genre', (c) => {
  const genre = c.req.param('genre');
  if (genres[genre]) {
    return c.json(genres[genre]);
  }
  return c.json({ error: 'Genre not found' }, 404);
});

// Get songwriting techniques
app.get('/api/techniques', (c) => {
  return c.json(songwritingTechniques);
});

// Get techniques by category
app.get('/api/techniques/:category', (c) => {
  const category = c.req.param('category');
  if (songwritingTechniques[category]) {
    return c.json(songwritingTechniques[category]);
  }
  return c.json({ error: 'Category not found' }, 404);
});

// Rhyme finder API
app.get('/api/rhymes/:word', (c) => {
  const word = c.req.param('word').toLowerCase();
  const rhymes = rhymeDictionary[word] || [];
  return c.json({ word, rhymes });
});

// Lyric analysis API
app.post('/api/analyze-lyrics', async (c) => {
  try {
    const { lyrics } = await c.req.json();
    
    if (!lyrics) {
      return c.json({ error: 'Lyrics required' }, 400);
    }

    const lines = lyrics.split('\n').filter(line => line.trim() !== '');
    const wordCount = lyrics.split(/\s+/).filter(word => word !== '').length;
    const syllableCount = estimateSyllables(lyrics);
    const rhymeScheme = analyzeRhymeScheme(lines);

    return c.json({
      wordCount,
      lineCount: lines.length,
      syllableCount,
      rhymeScheme,
      readingTime: Math.ceil(wordCount / 150), // Assuming 150 words per minute
      analysis: generateLyricAnalysis(lyrics, lines)
    });
  } catch (error) {
    return c.json({ error: 'Analysis failed' }, 500);
  }
});

// Song idea generator API
app.post('/api/generate-idea', async (c) => {
  try {
    const { genre, theme } = await c.req.json();
    const selectedGenre = genres[genre] || genres.pop;
    
    const ideas = generateSongIdeas(selectedGenre, theme);
    return c.json(ideas);
  } catch (error) {
    return c.json({ error: 'Generation failed' }, 500);
  }
});

// Main page route
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>LyricsCraft - Master the Art of Songwriting</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
        <style>
          .gradient-bg { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); }
          .card-hover { transition: transform 0.3s ease, box-shadow 0.3s ease; }
          .card-hover:hover { transform: translateY(-5px); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
          .genre-card { background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%); }
          .technique-card { background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%); }
          .tool-card { background: linear-gradient(45deg, #43e97b 0%, #38f9d7 100%); }
        </style>
    </head>
    <body class="bg-gray-50">
        <!-- Header -->
        <header class="gradient-bg text-white">
            <div class="container mx-auto px-6 py-8">
                <div class="text-center">
                    <h1 class="text-5xl font-bold mb-4">
                        <i class="fas fa-music mr-3"></i>
                        LyricsCraft
                    </h1>
                    <p class="text-xl mb-8">Master the Art of Songwriting - Learn Techniques, Explore Genres, Create Amazing Lyrics</p>
                    <button onclick="scrollToSection('features')" class="bg-white text-purple-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition duration-300">
                        Start Your Journey <i class="fas fa-arrow-down ml-2"></i>
                    </button>
                </div>
            </div>
        </header>

        <!-- Navigation -->
        <nav class="bg-white shadow-lg sticky top-0 z-50">
            <div class="container mx-auto px-6">
                <div class="flex justify-center space-x-8 py-4">
                    <button onclick="showSection('home')" class="nav-btn text-gray-700 hover:text-purple-600 px-4 py-2 rounded transition duration-200">
                        <i class="fas fa-home mr-2"></i>Home
                    </button>
                    <button onclick="showSection('genres')" class="nav-btn text-gray-700 hover:text-purple-600 px-4 py-2 rounded transition duration-200">
                        <i class="fas fa-guitar mr-2"></i>Genres
                    </button>
                    <button onclick="showSection('techniques')" class="nav-btn text-gray-700 hover:text-purple-600 px-4 py-2 rounded transition duration-200">
                        <i class="fas fa-book mr-2"></i>Techniques
                    </button>
                    <button onclick="showSection('tools')" class="nav-btn text-gray-700 hover:text-purple-600 px-4 py-2 rounded transition duration-200">
                        <i class="fas fa-tools mr-2"></i>Tools
                    </button>
                    <button onclick="showSection('generator')" class="nav-btn text-gray-700 hover:text-purple-600 px-4 py-2 rounded transition duration-200">
                        <i class="fas fa-lightbulb mr-2"></i>Idea Generator
                    </button>
                </div>
            </div>
        </nav>

        <!-- Main Content -->
        <main class="container mx-auto px-6 py-8">
            <!-- Home Section -->
            <section id="home-section" class="section">
                <div id="features" class="grid md:grid-cols-3 gap-8 mb-12">
                    <div class="genre-card text-white p-8 rounded-xl card-hover">
                        <div class="text-center">
                            <i class="fas fa-music text-4xl mb-4"></i>
                            <h3 class="text-2xl font-bold mb-4">Explore Genres</h3>
                            <p class="mb-6">Learn the unique characteristics and writing techniques for Pop, Rock, Hip-Hop, Country, Folk, and Blues.</p>
                            <button onclick="showSection('genres')" class="bg-white text-purple-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300">
                                Explore Genres
                            </button>
                        </div>
                    </div>

                    <div class="technique-card text-white p-8 rounded-xl card-hover">
                        <div class="text-center">
                            <i class="fas fa-pen-fancy text-4xl mb-4"></i>
                            <h3 class="text-2xl font-bold mb-4">Master Techniques</h3>
                            <p class="mb-6">Discover advanced songwriting techniques including rhyme schemes, song structure, and storytelling methods.</p>
                            <button onclick="showSection('techniques')" class="bg-white text-blue-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300">
                                Learn Techniques
                            </button>
                        </div>
                    </div>

                    <div class="tool-card text-white p-8 rounded-xl card-hover">
                        <div class="text-center">
                            <i class="fas fa-cogs text-4xl mb-4"></i>
                            <h3 class="text-2xl font-bold mb-4">Writing Tools</h3>
                            <p class="mb-6">Use our rhyme finder, lyric analyzer, and song idea generator to enhance your creative process.</p>
                            <button onclick="showSection('tools')" class="bg-white text-green-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition duration-300">
                                Try Tools
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- Genres Section -->
            <section id="genres-section" class="section hidden">
                <h2 class="text-4xl font-bold text-center mb-12 text-gray-800">
                    <i class="fas fa-guitar mr-3"></i>Music Genres & Songwriting Styles
                </h2>
                <div id="genres-container" class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <!-- Genres will be loaded here -->
                </div>
            </section>

            <!-- Techniques Section -->
            <section id="techniques-section" class="section hidden">
                <h2 class="text-4xl font-bold text-center mb-12 text-gray-800">
                    <i class="fas fa-book-open mr-3"></i>Songwriting Techniques & Methods
                </h2>
                <div id="techniques-container">
                    <!-- Techniques will be loaded here -->
                </div>
            </section>

            <!-- Tools Section -->
            <section id="tools-section" class="section hidden">
                <h2 class="text-4xl font-bold text-center mb-12 text-gray-800">
                    <i class="fas fa-tools mr-3"></i>Songwriting Tools
                </h2>
                
                <!-- Rhyme Finder -->
                <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h3 class="text-2xl font-bold mb-6 text-purple-600">
                        <i class="fas fa-search mr-2"></i>Rhyme Finder
                    </h3>
                    <div class="flex gap-4 mb-6">
                        <input type="text" id="rhyme-input" placeholder="Enter a word to find rhymes..." 
                               class="flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <button onclick="findRhymes()" class="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition duration-300">
                            Find Rhymes
                        </button>
                    </div>
                    <div id="rhyme-results" class="hidden">
                        <h4 class="font-semibold mb-3">Rhymes for "<span id="rhyme-word"></span>":</h4>
                        <div id="rhyme-list" class="flex flex-wrap gap-2"></div>
                    </div>
                </div>

                <!-- Lyric Analyzer -->
                <div class="bg-white rounded-xl shadow-lg p-8 mb-8">
                    <h3 class="text-2xl font-bold mb-6 text-blue-600">
                        <i class="fas fa-chart-bar mr-2"></i>Lyric Analyzer
                    </h3>
                    <textarea id="lyrics-input" rows="8" placeholder="Paste your lyrics here for analysis..." 
                              class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"></textarea>
                    <button onclick="analyzeLyrics()" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                        Analyze Lyrics
                    </button>
                    <div id="analysis-results" class="hidden mt-6"></div>
                </div>
            </section>

            <!-- Idea Generator Section -->
            <section id="generator-section" class="section hidden">
                <h2 class="text-4xl font-bold text-center mb-12 text-gray-800">
                    <i class="fas fa-lightbulb mr-3"></i>Song Idea Generator
                </h2>
                
                <div class="bg-white rounded-xl shadow-lg p-8">
                    <div class="grid md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Select Genre:</label>
                            <select id="idea-genre" class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                                <option value="pop">Pop</option>
                                <option value="rock">Rock</option>
                                <option value="hiphop">Hip-Hop</option>
                                <option value="country">Country</option>
                                <option value="folk">Folk</option>
                                <option value="blues">Blues</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Theme (optional):</label>
                            <input type="text" id="idea-theme" placeholder="e.g., love, freedom, nostalgia..." 
                                   class="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
                        </div>
                    </div>
                    <button onclick="generateIdea()" class="bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-700 transition duration-300">
                        Generate Song Ideas
                    </button>
                    <div id="idea-results" class="hidden mt-8"></div>
                </div>
            </section>
        </main>

        <!-- Footer -->
        <footer class="bg-gray-800 text-white py-12 mt-16">
            <div class="container mx-auto px-6 text-center">
                <h3 class="text-2xl font-bold mb-4">
                    <i class="fas fa-music mr-2"></i>LyricsCraft
                </h3>
                <p class="text-gray-400 mb-6">Empowering songwriters to create amazing lyrics and master their craft</p>
                <p class="text-gray-500">&copy; 2024 LyricsCraft. Built with passion for music and creativity.</p>
            </div>
        </footer>

        <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
        <script src="/static/app.js"></script>
    </body>
    </html>
  `);
});

// Utility functions
function estimateSyllables(text) {
  // Simple syllable estimation
  const words = text.toLowerCase().match(/[a-z]+/g) || [];
  let syllables = 0;
  
  words.forEach(word => {
    const vowelMatches = word.match(/[aeiouy]+/g);
    syllables += vowelMatches ? vowelMatches.length : 1;
    if (word.endsWith('e')) syllables--;
    if (syllables === 0) syllables = 1;
  });
  
  return syllables;
}

function analyzeRhymeScheme(lines) {
  // Basic rhyme scheme analysis
  const scheme = [];
  const rhymeMap = new Map();
  let currentLetter = 'A';
  
  lines.forEach(line => {
    const lastWord = line.trim().split(/\s+/).pop()?.toLowerCase().replace(/[^\w]/g, '');
    if (!lastWord) {
      scheme.push('-');
      return;
    }
    
    const rhymeKey = lastWord.slice(-2); // Simple rhyme detection
    if (rhymeMap.has(rhymeKey)) {
      scheme.push(rhymeMap.get(rhymeKey));
    } else {
      rhymeMap.set(rhymeKey, currentLetter);
      scheme.push(currentLetter);
      currentLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
    }
  });
  
  return scheme.join('');
}

function generateLyricAnalysis(lyrics, lines) {
  const analysis = [];
  
  // Check for repetition
  const uniqueLines = new Set(lines.map(line => line.trim().toLowerCase()));
  if (uniqueLines.size < lines.length * 0.8) {
    analysis.push("Good use of repetition for emphasis and memorability");
  }
  
  // Check length
  if (lines.length < 8) {
    analysis.push("Consider adding more verses or a bridge to develop your story");
  } else if (lines.length > 32) {
    analysis.push("Song might be lengthy - consider condensing for better impact");
  }
  
  // Check for imagery
  const imageWords = ['see', 'look', 'bright', 'dark', 'color', 'shine', 'shadow', 'light'];
  const hasImagery = imageWords.some(word => lyrics.toLowerCase().includes(word));
  if (hasImagery) {
    analysis.push("Great use of visual imagery to paint pictures with words");
  } else {
    analysis.push("Try adding more visual imagery to make your lyrics more vivid");
  }
  
  return analysis;
}

function generateSongIdeas(genre, theme) {
  const ideas = {
    titles: [],
    concepts: [],
    firstLines: [],
    themes: theme ? [theme] : genre.exampleTopics.slice(0, 3)
  };
  
  // Generate title ideas based on genre
  const titleTemplates = {
    pop: ["${theme} Tonight", "Dancing Through ${theme}", "${theme} in Neon Lights"],
    rock: ["Break the ${theme}", "${theme} Revolution", "Scream for ${theme}"],
    hiphop: ["${theme} Chronicles", "Rise Above ${theme}", "${theme} Freestyle"],
    country: ["${theme} Road", "Backyard ${theme}", "${theme} and Old Blue Jeans"],
    folk: ["Song of ${theme}", "${theme} Ballad", "Tales of ${theme}"],
    blues: ["${theme} Blues", "Crying for ${theme}", "${theme} on My Mind"]
  };
  
  const selectedTheme = theme || genre.exampleTopics[0];
  const templates = titleTemplates[Object.keys(genres).find(key => genres[key] === genre)] || titleTemplates.pop;
  
  ideas.titles = templates.map(template => template.replace('${theme}', selectedTheme));
  
  // Generate concept ideas
  ideas.concepts = [
    \`A \${genre.name.toLowerCase()} song about \${selectedTheme} from the perspective of someone who just experienced it\`,
    \`An upbeat \${genre.name.toLowerCase()} track celebrating \${selectedTheme} with a positive message\`,
    \`A reflective \${genre.name.toLowerCase()} ballad exploring the deeper meaning of \${selectedTheme}\`
  ];
  
  // Generate first line ideas
  ideas.firstLines = [
    \`When I think about \${selectedTheme}, I remember...\`,
    \`There's something about \${selectedTheme} that makes me...\`,
    \`In a world full of \${selectedTheme}, I found...\`
  ];
  
  return ideas;
}

export default app