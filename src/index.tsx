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
    name: "Pop Music",
    description: "Mainstream commercial music designed for mass appeal and radio play",
    detailedDescription: "Pop music is crafted to appeal to the broadest possible audience, emphasizing catchy melodies, relatable lyrics, and polished production. Successful pop songs often become cultural touchstones, with lyrics that speak to universal human experiences while maintaining commercial viability.",
    characteristics: [
      "Verse-Chorus-Verse-Chorus-Bridge-Chorus structure (most common)",
      "3-4 minute song length for radio compatibility",
      "Memorable hooks that stick in listeners' heads",
      "Simple, accessible language avoiding complex metaphors",
      "Strong melodic content with clear vocal lines",
      "Polished, professional production values",
      "Repetitive elements that enhance memorability",
      "Universal themes that resonate across demographics"
    ],
    lyricTips: [
      "Start with a strong opening line that immediately grabs attention - avoid generic statements",
      "Use conversational language as if talking directly to a friend",
      "Create choruses with simple, powerful statements that people want to sing along to",
      "Focus on specific details rather than abstract concepts (instead of 'I feel bad' try 'Coffee tastes like tears this morning')",
      "Use the 'show don't tell' principle - paint pictures with your words",
      "Make every word count - pop songs are short, so each line should serve a purpose",
      "Write from personal experience but make it relatable to others",
      "Use internal rhymes and consonance to create flow and musicality",
      "Build emotional progression - start somewhere and take the listener on a journey",
      "Test your chorus - if you can't remember it after hearing it twice, rewrite it"
    ],
    songStructure: {
      verse1: "Introduce the story, character, or situation. Set the scene with specific details.",
      chorus1: "The emotional and melodic center. Make it memorable and singable.",
      verse2: "Develop the story further or add new perspective. Build on verse 1.",
      chorus2: "Repeat with same lyrics - consistency helps memorability.",
      bridge: "Provide contrast - different melody, different perspective, or resolution.",
      finalChorus: "Often repeated multiple times, sometimes with variations."
    },
    successExamples: [
      "Verse 1: 'She was just seventeen, you know what I mean' - The Beatles (specific detail, relatable)",
      "Chorus: 'I want it that way' - Backstreet Boys (simple, memorable, emotional)",
      "Bridge: 'Is this the real life, is this just fantasy' - Queen (perspective shift, philosophical)"
    ],
    commonMistakes: [
      "Using too many abstract concepts without concrete imagery",
      "Making choruses too complex or wordy",
      "Forgetting that people need to sing along - avoid tongue twisters",
      "Not having a clear emotional arc throughout the song"
    ],
    exampleTopics: [
      "Love and heartbreak (but find fresh angles)",
      "Personal growth and self-discovery",
      "Nostalgia and coming-of-age moments",
      "Dreams, ambitions, and pursuing goals",
      "Friendship and human connections",
      "Overcoming challenges and adversity",
      "Freedom and independence",
      "Party, celebration, and good times"
    ]
  },
  rock: {
    name: "Rock Music", 
    description: "High-energy music emphasizing power, rebellion, and emotional intensity",
    detailedDescription: "Rock music channels raw emotion and energy through powerful instrumentation and commanding vocals. Rock lyrics often explore themes of rebellion, personal struggle, and social commentary, delivered with conviction and passion. The genre demands authenticity and emotional honesty.",
    characteristics: [
      "Powerful, driving rhythm sections with prominent drums and bass",
      "Guitar-driven arrangements with riffs, solos, and power chords",
      "Strong, often aggressive vocal delivery with wide dynamic range",
      "Emphasis on live performance energy and audience connection",
      "Longer song structures allowing for instrumental breaks",
      "Raw, less polished production compared to pop",
      "Themes of rebellion, freedom, and questioning authority",
      "Build-ups and climaxes that create emotional release"
    ],
    lyricTips: [
      "Use active, powerful verbs - 'explode' instead of 'happen', 'shatter' instead of 'break'",
      "Write with conviction - rock lyrics should feel like declarations or battle cries", 
      "Create anthemic choruses that crowds can chant - think stadium singalongs",
      "Use concrete imagery related to struggle: 'climbing mountains', 'breaking chains', 'fighting storms'",
      "Don't be afraid of repetition for emphasis - 'We will rock you' works because of repetition",
      "Channel personal anger, frustration, or passion into universal themes",
      "Use metaphors of war, nature, and physical conflict to convey emotion",
      "Build intensity throughout the song - start strong and get stronger",
      "Address injustice, corruption, or personal demons directly - rock is about truth",
      "Make your point clearly - subtlety takes backseat to power in rock"
    ],
    songStructure: {
      intro: "Often instrumental, building energy with signature riffs or drums",
      verse1: "Set up the conflict, problem, or emotional state with specific imagery",
      chorus1: "Deliver the main message with maximum power and memorability",
      verse2: "Develop the story, add details, or escalate the conflict",
      chorus2: "Repeat for reinforcement - consistency builds anthemic quality",
      bridge: "Often features guitar solo or breakdown, providing contrast",
      finalChorus: "Multiple repetitions with increasing intensity"
    },
    vocalTechniques: [
      "Use dynamic range - whisper to scream within the same song",
      "Employ strategic vocal strain for emotional effect (safely)",
      "Master the art of sustained notes on emotional words",
      "Use vocal breaks and cracks to convey vulnerability or intensity"
    ],
    successExamples: [
      "Verse: 'Is this the real life, is this just fantasy, caught in a landslide' - Queen (existential questioning)",
      "Chorus: 'We are the champions, my friend' - Queen (triumphant declaration)",
      "Anthem: 'We will, we will rock you' - Queen (simple, powerful, participatory)"
    ],
    commonMistakes: [
      "Trying to be rebellious without having something real to rebel against",
      "Using cliché rock imagery without fresh perspective",
      "Sacrificing meaning for attitude - both are needed",
      "Making choruses too complex to sing along with"
    ],
    exampleTopics: [
      "Fighting against oppression or authority",
      "Personal transformation through adversity", 
      "Social injustice and political corruption",
      "Intense romantic relationships (love and betrayal)",
      "Coming of age and finding identity",
      "Brotherhood, loyalty, and friendship",
      "Living life on your own terms",
      "Overcoming addiction or personal demons",
      "Celebrating freedom and independence",
      "Honoring fallen heroes or lost friends"
    ]
  },
  hiphop: {
    name: "Hip-Hop",
    description: "Rhythmic vocal delivery emphasizing wordplay, storytelling, and cultural expression",
    detailedDescription: "Hip-hop is the art of rhythmic speaking over beats, emphasizing clever wordplay, complex rhyme schemes, and authentic storytelling. It originated as a voice for marginalized communities and maintains strong connections to social commentary, personal narrative, and cultural identity. Technical skill in flow, rhyme, and wordplay is highly valued.",
    characteristics: [
      "Complex internal rhyme schemes and multisyllabic rhyming",
      "Emphasis on 'flow' - the rhythmic delivery and timing of lyrics",
      "Storytelling through vivid, cinematic imagery and narratives", 
      "Wordplay, double entendres, and clever metaphors",
      "Cultural references and social commentary",
      "Personal authenticity and 'keeping it real'",
      "Call-and-response elements and audience interaction",
      "Sampling and interpolation of existing musical elements"
    ],
    technicalElements: {
      flow: "The rhythm and cadence of vocal delivery - how words fit with the beat",
      rhymeSchemes: "ABAB, AABA, internal rhymes, multisyllabic patterns, slant rhymes",
      wordplay: "Double meanings, puns, homonyms, and clever word associations",
      storytelling: "Narrative structure, character development, vivid scene-setting"
    },
    lyricTips: [
      "Develop your flow by rapping over different tempos and time signatures",
      "Master internal rhymes - rhyme within lines, not just at the end",
      "Use multisyllabic rhymes: 'incredible/unforgettable', 'education/dedication'",
      "Practice alliteration and assonance for rhythmic effect",
      "Tell specific stories with concrete details - avoid vague generalizations",
      "Use extended metaphors that run throughout entire verses",
      "Study great storytellers like Nas, Biggie, Kendrick for narrative techniques",
      "Develop a unique voice and perspective - authenticity is crucial",
      "Use wordplay sparingly but effectively - don't sacrifice meaning for cleverness",
      "Practice freestyling to develop spontaneous flow and word association skills"
    ],
    rhymePatterns: [
      "AABB (Couplets): 'I grab the mic and then I flow / Everybody wants to know'",
      "ABAB (Alternating): 'Line A rhymes with line C / Line B rhymes with line D'", 
      "Internal rhymes: 'I'm the king of the ring, bringing the sting'",
      "Multisyllabic: 'Spectacular vernacular, dracula molecular'"
    ],
    songStructure: {
      intro: "Set the tone, introduce the theme or establish the vibe",
      verse1: "Tell your story, establish credibility, set up the main narrative",
      hook: "Catchy, memorable section that encapsulates the song's message",
      verse2: "Develop the story, add complexity, show growth or change",
      bridge: "Provide different perspective or energy shift",
      outro: "Conclude the narrative or leave listeners with final thought"
    },
    flowTechniques: [
      "On-beat: Landing rhymes exactly on the beat for emphasis",
      "Off-beat: Placing rhymes between beats for syncopated feel",
      "Triplets: Three syllable groupings that create rolling rhythm",
      "Double-time: Rapid delivery that fits twice as many syllables per bar"
    ],
    successExamples: [
      "Storytelling: 'I went from negative to positive' - Big Daddy Kane (clear narrative arc)",
      "Wordplay: 'It was all a dream, I used to read Word Up magazine' - Biggie (nostalgic storytelling)",
      "Flow: 'Now I get around' - Tupac (perfect rhythmic placement)"
    ],
    commonMistakes: [
      "Forcing rhymes that don't make sense just to maintain pattern",
      "Prioritizing technical complexity over emotional connection",
      "Using outdated slang or cultural references without understanding",
      "Copying other artists' flow patterns instead of developing your own"
    ],
    exampleTopics: [
      "Personal struggle and overcoming obstacles",
      "Social inequality and systemic injustice",
      "Success, wealth, and the cost of fame",
      "Street life and urban experiences",
      "Cultural pride and identity",
      "Relationships and romance from authentic perspective",
      "Mental health and personal growth",
      "Community, loyalty, and friendship",
      "Political awareness and activism",
      "Artistic legacy and influence on culture"
    ]
  },
  country: {
    name: "Country Music",
    description: "Authentic storytelling music celebrating traditional values, rural life, and honest emotion",
    detailedDescription: "Country music prioritizes authentic storytelling with clear narratives, relatable characters, and honest emotion. It celebrates traditional American values while addressing universal themes of love, loss, hard work, and family. The best country songs tell complete stories with specific details that make listeners feel like they know the characters personally.",
    characteristics: [
      "Strong narrative structure with clear beginning, middle, and end",
      "Conversational, accessible language that sounds natural when sung",
      "Specific geographic and cultural details that create authenticity", 
      "Acoustic instrumentation highlighting vocals and lyrics",
      "Themes connecting to rural, small-town, or working-class experiences",
      "Honest emotional expression without pretension",
      "Traditional song structures with emphasis on storytelling",
      "Character-driven narratives with relatable protagonists"
    ],
    lyricTips: [
      "Create complete stories with specific characters, settings, and conflicts",
      "Use conversational language - write like you're talking to a friend at a diner",
      "Include specific details: brand names, place names, actual jobs and activities",
      "Focus on universal emotions expressed through particular experiences",
      "Use simple metaphors drawn from rural or working-class life",
      "Develop characters listeners can relate to or aspire to be",
      "Show character growth or change through the narrative arc",
      "Use dialect and regional language sparingly but effectively",
      "Ground abstract concepts in concrete, physical reality",
      "Let the story unfold naturally - don't rush to make your point"
    ],
    storytellingElements: [
      "Setting: Establish time, place, and atmosphere in opening lines",
      "Character: Create protagonists with clear motivations and flaws",
      "Conflict: Present problems or challenges the character must face",
      "Resolution: Show how the character changes or what they learn"
    ],
    successExamples: [
      "Character detail: 'She's got a smile that it seems to me, reminds me of childhood memories' - Guns N' Roses (Sweet Child O' Mine)",
      "Specific setting: 'It's Friday night in a small town' - common country opening",
      "Honest emotion: 'Friends in Low Places' - Garth Brooks (relatable situation)"
    ],
    exampleTopics: [
      "Small-town life and community values",
      "Blue-collar work and pride in honest labor", 
      "Family traditions and generational wisdom",
      "Love found and lost in authentic settings",
      "Coming home after time away",
      "Rural landscapes and connection to land",
      "Overcoming hardship through determination",
      "Faith, spirituality, and moral guidance"
    ]
  },
  folk: {
    name: "Folk Music",
    description: "Traditional storytelling music emphasizing social consciousness, cultural preservation, and communal values",
    detailedDescription: "Folk music serves as the voice of communities, preserving cultural stories while addressing contemporary social issues. It emphasizes accessibility - both in musical simplicity and lyrical clarity - so that songs can be easily learned, shared, and passed down. Folk lyrics often carry messages of social justice, historical awareness, and human solidarity.",
    characteristics: [
      "Simple, memorable melodies that are easy to learn and sing",
      "Acoustic instrumentation emphasizing vocals and lyrics",
      "Social and political awareness woven into personal narratives",
      "Historical consciousness and cultural preservation",
      "Community-oriented themes promoting solidarity and change",
      "Accessible language that speaks to common experiences",
      "Traditional song structures that enhance memorability",
      "Emphasis on message and meaning over commercial appeal"
    ],
    lyricTips: [
      "Write songs that bring communities together around shared values",
      "Use simple, clear language that translates across educational levels", 
      "Connect personal stories to larger social or political themes",
      "Draw inspiration from historical events and figures",
      "Address current issues through timeless human experiences",
      "Create refrains that groups can easily sing together",
      "Use narrative techniques that make complex issues accessible",
      "Honor tradition while speaking to contemporary concerns",
      "Employ metaphors drawn from nature, work, and daily life",
      "Let the message emerge naturally from the story"
    ],
    messageElements: [
      "Personal becomes political: Individual stories reflecting larger issues",
      "Historical perspective: Learning from past struggles and triumphs", 
      "Call to action: Inspiring listeners to engage in positive change",
      "Community building: Creating shared identity through common concerns"
    ],
    successExamples: [
      "Social commentary: 'The Times They Are A-Changin'' - Bob Dylan",
      "Historical narrative: 'The Night They Drove Old Dixie Down' - The Band",
      "Environmental: 'Big Yellow Taxi' - Joni Mitchell"
    ],
    exampleTopics: [
      "Social justice and civil rights movements",
      "Environmental protection and climate change",
      "Workers' rights and economic inequality",
      "Peace movements and anti-war sentiment",
      "Cultural heritage and tradition preservation",
      "Immigration and displacement",
      "Community solidarity and mutual aid",
      "Historical events and their modern relevance"
    ]
  },
  blues: {
    name: "Blues Music",
    description: "Deeply emotional music expressing personal struggle, resilience, and the full spectrum of human experience",
    detailedDescription: "Blues music transforms personal pain into universal art, using specific musical and lyrical structures to express deep emotion. The blues acknowledges life's hardships while maintaining dignity and hope. It's characterized by honest emotional expression, repetitive structures that build intensity, and metaphorical language drawn from everyday experience.",
    characteristics: [
      "12-bar blues progression providing familiar harmonic structure",
      "AAB lyrical pattern (statement, restatement, resolution/answer)",
      "Call and response between voice and instruments",
      "Bent notes and blue notes expressing emotional tension",
      "Personal testimony about struggle, loss, and perseverance",
      "Metaphorical language using weather, travel, and relationships",
      "Repetition used for emphasis and emotional building",
      "Raw, honest emotional expression without pretense"
    ],
    lyricStructure: {
      AAB: "First line states the problem, second line repeats with variation, third line provides response or resolution",
      example: "A: 'Woke up this morning, blues around my bed' / A: 'Woke up this morning, blues around my bed' / B: 'Went to eat my breakfast, blues was in my bread'"
    },
    lyricTips: [
      "Use the AAB structure to build emotional intensity through repetition",
      "Be brutally honest about personal pain and struggle",
      "Transform specific personal experiences into universal truths",
      "Use metaphors from everyday life: weather, transportation, food, work",
      "Let the emotion drive the language - don't intellectualize the pain",
      "Use simple, direct language that cuts straight to the emotional core",
      "Include physical details that make abstract emotions concrete",
      "Show resilience even in the depths of despair",
      "Use repetition strategically for emotional emphasis",
      "Ground metaphors in real, tangible experiences"
    ],
    commonMetaphors: [
      "Weather: storms, rain, sunshine representing emotional states",
      "Travel: trains, roads, crossroads representing life's journey",
      "Home: leaving, returning, being lost or found",
      "Work: jobs, money troubles, daily grind",
      "Relationships: love, betrayal, loneliness, connection"
    ],
    successExamples: [
      "AAB structure: 'Sweet home Chicago' - Robert Johnson",
      "Metaphor: 'Stormy Monday' - T-Bone Walker (weather as emotion)",
      "Personal testimony: 'The Thrill is Gone' - B.B. King"
    ],
    exampleTopics: [
      "Romantic heartbreak and betrayal",
      "Financial hardship and poverty", 
      "Addiction and personal demons",
      "Loss of loved ones and grief",
      "Workplace struggles and exploitation",
      "Feeling displaced or homeless",
      "Injustice and discrimination",
      "Hope and resilience despite adversity",
      "Spiritual searching and redemption",
      "Getting older and facing mortality"
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
  // Comprehensive rhyme dictionary for professional songwriting
  
  // Basic emotions and feelings
  love: ["above", "dove", "glove", "shove", "thereof", "enough", "rough", "tough", "stuff", "bluff"],
  heart: ["part", "start", "art", "smart", "cart", "apart", "dart", "chart", "depart", "restart"],
  pain: ["rain", "gain", "main", "chain", "plane", "strain", "brain", "drain", "Spain", "train", "Jane", "lane", "sane", "vain"],
  soul: ["whole", "goal", "roll", "control", "hole", "console", "bowl", "pole", "stroll", "toll", "patrol", "parole"],
  dream: ["seem", "beam", "team", "stream", "cream", "extreme", "theme", "scheme", "supreme", "gleam"],
  
  // Time and seasons  
  time: ["rhyme", "climb", "prime", "crime", "sublime", "chime", "lime", "mime", "dime", "thyme"],
  night: ["light", "bright", "flight", "sight", "might", "right", "fight", "height", "tight", "white", "write", "bite"],
  day: ["way", "say", "play", "stay", "pray", "away", "may", "pay", "bay", "gray", "clay", "ray"],
  year: ["clear", "dear", "fear", "hear", "near", "tear", "beer", "cheer", "gear", "here", "peer", "steer"],
  
  // Common words songwriters use
  free: ["be", "see", "key", "tree", "me", "we", "flee", "knee", "sea", "tea", "agree", "degree"],
  fire: ["desire", "inspire", "require", "wire", "tire", "higher", "choir", "liar", "buyer", "flyer"],
  road: ["load", "code", "mode", "node", "showed", "glowed", "flowed", "slowed", "bestowed", "explode"],
  home: ["roam", "dome", "foam", "Rome", "chrome", "comb", "loam", "tome", "genome"],
  
  // Action words
  run: ["sun", "fun", "gun", "done", "won", "one", "ton", "son", "none", "begun"],
  go: ["show", "know", "flow", "glow", "grow", "throw", "blow", "slow", "below", "shadow"],
  take: ["make", "break", "wake", "shake", "fake", "lake", "sake", "brake", "snake", "mistake"],
  give: ["live", "forgive", "active", "native", "positive", "negative", "relative", "creative"],
  
  // Body parts and physical
  hand: ["stand", "land", "band", "sand", "grand", "brand", "command", "demand", "expand", "understand"],
  eyes: ["skies", "lies", "tries", "flies", "cries", "dies", "rise", "size", "wise", "surprise"],
  face: ["place", "race", "space", "grace", "chase", "case", "base", "trace", "embrace", "replace"],
  
  // Colors
  blue: ["true", "new", "you", "who", "through", "flew", "grew", "knew", "drew", "view"],
  red: ["said", "head", "bed", "led", "fed", "dead", "bread", "read", "thread", "instead"],
  black: ["back", "track", "pack", "lack", "crack", "stack", "attack", "exact", "contact"],
  white: ["light", "bright", "night", "flight", "sight", "might", "right", "fight", "height", "tight"],
  
  // Nature and weather
  rain: ["pain", "gain", "main", "chain", "plane", "strain", "brain", "drain", "Spain", "train"],
  sun: ["run", "fun", "gun", "done", "won", "one", "ton", "son", "none", "begun"],
  wind: ["sinned", "pinned", "thinned", "grinned", "skinned", "chinned", "binned", "spinning"],
  snow: ["go", "show", "know", "flow", "glow", "grow", "throw", "blow", "slow", "below"],
  
  // Simple words that often need rhymes
  cat: ["hat", "bat", "rat", "sat", "fat", "flat", "mat", "pat", "chat", "that"],
  hat: ["cat", "bat", "rat", "sat", "fat", "flat", "mat", "pat", "chat", "that"],
  man: ["can", "plan", "ran", "fan", "tan", "ban", "span", "began", "Japan"],
  way: ["day", "say", "play", "stay", "pray", "away", "may", "pay", "bay", "gray"],
  
  // Relationships
  friend: ["end", "send", "bend", "mend", "tend", "spend", "blend", "defend", "extend", "pretend"],
  girl: ["world", "curl", "swirl", "pearl", "whirl", "unfurl", "twirl"],
  boy: ["joy", "toy", "destroy", "employ", "enjoy", "annoy", "deploy", "decoy"],
  
  // States and feelings
  sad: ["bad", "had", "mad", "glad", "dad", "add", "pad", "lad", "brad"],
  happy: ["snappy", "sappy", "nappy", "scrappy", "slappy", "crappy"],
  mad: ["sad", "bad", "had", "glad", "dad", "add", "pad", "lad", "brad"],
  glad: ["sad", "bad", "had", "mad", "dad", "add", "pad", "lad", "brad"],
  
  // Common song themes
  money: ["honey", "funny", "sunny", "bunny", "dummy", "tummy", "mummy"],
  peace: ["release", "increase", "decrease", "police", "fleece", "lease", "crease", "geese"],
  war: ["more", "door", "floor", "shore", "store", "before", "explore", "ignore"],
  
  // Music and art
  song: ["long", "strong", "wrong", "along", "belong", "prolong", "throng"],
  dance: ["chance", "romance", "advance", "glance", "France", "stance", "trance", "enhance"],
  music: ["acoustic", "therapeutic", "dramatic", "automatic", "systematic"],
  
  // Movement and travel
  fly: ["sky", "high", "try", "why", "buy", "cry", "dry", "die", "lie", "tie"],
  walk: ["talk", "chalk", "stalk", "balk", "hawk", "gawk", "caulk"],
  move: ["prove", "groove", "improve", "remove", "approve", "disapprove"],
  
  // Common endings that songwriters need
  ing: ["sing", "ring", "bring", "spring", "thing", "wing", "king", "swing", "sting"],
  tion: ["nation", "station", "creation", "vacation", "education", "celebration", "information"],
  ed: ["said", "head", "bed", "led", "fed", "dead", "bread", "read", "thread", "instead"],
  
  // Party and celebration
  party: ["hearty", "smarty", "arty"],
  fun: ["run", "sun", "gun", "done", "won", "one", "ton", "son", "none", "begun"],
  
  // Technology and modern life
  phone: ["alone", "stone", "bone", "tone", "zone", "known", "shown", "grown", "thrown", "own"],
  car: ["far", "star", "bar", "jar", "scar", "guitar", "cigar", "bizarre", "radar"],
  
  // Simple but important
  yes: ["bless", "stress", "mess", "dress", "press", "guess", "less", "success", "express"],
  no: ["go", "show", "know", "flow", "glow", "grow", "throw", "blow", "slow", "below"]
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
                    <p class="text-xl mb-8">Master the Art of Songwriting - Learn Techniques, Explore Genres, Create Amazing Lyrics!</p>
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
  const selectedTheme = theme || genre.exampleTopics[0];
  const genreKey = Object.keys(genres).find(key => genres[key] === genre);
  
  // Professional title concepts based on successful songwriting patterns
  const titleStrategies = {
    pop: [
      "What We Used to Be", "Midnight Confessions", "Golden Hour", "Almost Famous", "Electric Dreams",
      "Paper Hearts", "Neon Nights", "Wild & Free", "Borrowed Time", "Dancing Alone"
    ],
    rock: [
      "Fire in the Sky", "Breaking Point", "Rebel Heart", "Thunder Road", "Last Stand",
      "Bulletproof", "Iron Will", "Shattered Glass", "Phoenix Rising", "Blood & Stone"
    ],
    hiphop: [
      "City Lights", "Grind Time", "Real Talk", "Dream Chaser", "Street Wisdom",
      "Rise Up", "Hustle & Flow", "Gold Standard", "Mind Over Matter", "Legacy"
    ],
    country: [
      "Dirt Road Memories", "Small Town Pride", "Whiskey & Rain", "Backyard Heroes", "Simple Life",
      "Hometown Girl", "Dusty Boots", "Southern Nights", "Country Strong", "Fields of Gold"
    ],
    folk: [
      "Winds of Change", "Voice of the People", "Ancient Stories", "Rivers Run Deep", "Mountain Song",
      "Common Ground", "Times Like These", "Seeds of Tomorrow", "Ballad of the Brave", "Circle of Life"
    ],
    blues: [
      "Midnight Train", "Crossroads Blues", "Heavy Heart", "Lonesome Highway", "Stormy Weather",
      "Lost & Found", "Devil at the Door", "Broken Promises", "Soul Survivor", "Blues for You"
    ]
  };

  // Professional concept frameworks
  const conceptStrategies = {
    pop: [
      "A story of personal transformation told through relatable metaphors",
      "Celebrating resilience after heartbreak with an empowering message",
      "Nostalgic reflection on youth with universal appeal"
    ],
    rock: [
      "An anthem about breaking free from limitations and finding your power",
      "A defiant statement against injustice with a call to action",
      "Personal struggle transformed into collective strength"
    ],
    hiphop: [
      "A narrative journey from struggle to success with authentic detail",
      "Social commentary woven through personal experience",
      "Celebration of culture and community with clever wordplay"
    ],
    country: [
      "A character-driven story about someone you'd want to know",
      "Multi-generational tale connecting past wisdom to present choices",
      "Honest portrayal of working-class life with dignity and respect"
    ],
    folk: [
      "Historical event connected to contemporary social issues",
      "Environmental message told through personal relationship to nature", 
      "Community organizing story that inspires collective action"
    ],
    blues: [
      "Personal testimony of loss transformed into wisdom",
      "Metaphorical journey using travel or weather imagery",
      "Raw emotional confession that universal audiences can relate to"
    ]
  };

  // Professional opening line strategies
  const openingStrategies = {
    pop: [
      "Start with a specific moment: 'Three AM and the phone won't stop ringing'",
      "Use contrast: 'They said I'd never make it past the city line'", 
      "Set a scene: 'Coffee shop on Fifth Street, same time every day'"
    ],
    rock: [
      "Make a declaration: 'I've been waiting my whole life for this moment'",
      "Challenge the listener: 'Tell me what you're fighting for'",
      "Paint action: 'Kicked down the door, never looking back'"
    ],
    hiphop: [
      "Establish credibility: 'Started from the basement, now we own the building'",
      "Use wordplay: 'They say money talks, but mine's been giving speeches'",
      "Set the scene: 'Corner store philosophy, learned from the elders'"
    ],
    country: [
      "Introduce character: 'My grandfather's hands could fix anything but time'",
      "Establish setting: 'Population 847, everybody knows your name'",
      "Create intimacy: 'Sitting on the porch, watching storms roll in'"
    ],
    folk: [
      "Historical reference: 'Back when the river ran clean and the mill ran strong'",
      "Call to awareness: 'Listen close, I've got a story needs telling'",
      "Community voice: 'We gathered in the square like our mothers did before'"
    ],
    blues: [
      "State the problem: 'Woke up this morning, world turned upside down'",
      "Use metaphor: 'Storm clouds gathering where my heart used to be'",
      "Personal confession: 'Forty years of living, still don't know my name'"
    ]
  };

  // Writing prompts for development
  const writingPrompts = {
    pop: [
      "What moment changed everything for you? Write about the before and after.",
      "Describe a feeling everyone has but no one talks about.",
      "What would you tell your younger self? Make it a conversation."
    ],
    rock: [
      "What system or authority needs to be challenged? Why are you the one to do it?",
      "Describe a moment when you found your power. What did it cost?",
      "Write about brotherhood/sisterhood in the face of adversity."
    ],
    hiphop: [
      "Tell the story of your neighborhood through one character's day.",
      "What lesson did the streets teach you that school never could?",
      "Create a cipher with three different perspectives on the same issue."
    ],
    country: [
      "Write about three generations of your family in one song.",
      "Describe someone who taught you what integrity looks like.",
      "Tell the story of a place that shaped who you are."
    ],
    folk: [
      "Connect a historical injustice to something happening today.",
      "Write about a time when the community came together.",
      "Describe the environment through the eyes of someone who depends on it."
    ],
    blues: [
      "What loss taught you the most about yourself?",
      "Describe heartbreak using only weather and travel metaphors.",
      "Write about a crossroads moment where everything could have gone different."
    ]
  };

  return {
    titles: titleStrategies[genreKey] || titleStrategies.pop,
    concepts: conceptStrategies[genreKey] || conceptStrategies.pop,
    firstLines: openingStrategies[genreKey] || openingStrategies.pop,
    writingPrompts: writingPrompts[genreKey] || writingPrompts.pop,
    themes: theme ? [theme] : genre.exampleTopics.slice(0, 3),
    genreSpecificTips: [
      `Study successful ${genre.name} artists and analyze what makes their songs memorable`,
      `Practice the specific techniques that define ${genre.name} songwriting`,
      `Connect with the emotional core that drives the best ${genre.name} music`
    ]
  };
}

export default app