# LyricsCraft - Master the Art of Songwriting

## Project Overview
- **Name**: LyricsCraft
- **Goal**: An comprehensive web application that teaches songwriting techniques and provides interactive tools for creating lyrics across different music genres
- **Features**: 
  - Genre-specific songwriting guides (Pop, Rock, Hip-Hop, Country, Folk, Blues)
  - Interactive songwriting technique tutorials
  - Rhyme finder tool with suggestions
  - Lyric analyzer with metrics and insights
  - AI-powered song idea generator
  - Responsive, modern web interface

## Live URLs
- **Development**: https://3000-ie6cng3wut5bc4mz8cfql-6532622b.e2b.dev
- **API Health Check**: https://3000-ie6cng3wut5bc4mz8cfql-6532622b.e2b.dev/api/genres
- **GitHub**: (To be deployed)

## Current Features (✅ Completed)

### 1. Genre Guides & Education
- **Endpoint**: `/api/genres` - Get all genres
- **Endpoint**: `/api/genres/{genre}` - Get specific genre info
- **Coverage**: Pop, Rock, Hip-Hop, Country, Folk, Blues
- **Content**: Characteristics, lyric tips, common topics, writing techniques

### 2. Songwriting Techniques
- **Endpoint**: `/api/techniques` - Get all techniques  
- **Endpoint**: `/api/techniques/{category}` - Get specific category
- **Categories**: Song structure, rhyme schemes, melody/rhythm, storytelling
- **Interactive**: Detailed explanations with practical tips

### 3. Writing Tools
- **Rhyme Finder**: `/api/rhymes/{word}` - Find rhymes for any word
- **Lyric Analyzer**: `/api/analyze-lyrics` - Analyze word count, syllables, rhyme scheme, insights
- **Features**: Real-time analysis, suggestions for improvement

### 4. Song Idea Generator
- **Endpoint**: `/api/generate-idea` - Generate song concepts
- **Input**: Genre selection, optional theme
- **Output**: Title ideas, opening lines, concepts, themes to explore

### 5. Interactive Web Interface
- **Navigation**: Smooth single-page application
- **Responsive**: Mobile-friendly design with Tailwind CSS
- **Features**: Modal dialogs, clipboard copy, keyboard shortcuts
- **Accessibility**: FontAwesome icons, clear typography

## Functional Entry Points

### Web Interface
- **GET** `/` - Main application interface
- **Features**: Genre explorer, technique library, writing tools, idea generator

### API Endpoints
- **GET** `/api/genres` - List all music genres with writing guidelines
- **GET** `/api/genres/{pop|rock|hiphop|country|folk|blues}` - Specific genre details
- **GET** `/api/techniques` - All songwriting techniques and methods  
- **GET** `/api/techniques/{structure|rhyming|melody|storytelling}` - Specific technique category
- **GET** `/api/rhymes/{word}` - Find rhymes for any word (e.g., `/api/rhymes/love`)
- **POST** `/api/analyze-lyrics` - Analyze lyrics text (JSON body: `{"lyrics": "text"}`)
- **POST** `/api/generate-idea` - Generate song ideas (JSON body: `{"genre": "pop", "theme": "optional"}`)

## Data Architecture
- **Data Models**: 
  - Genres with characteristics, tips, and example topics
  - Songwriting techniques categorized by type
  - Rhyme dictionary with common word patterns
  - Analysis metrics (word count, syllables, rhyme scheme)
- **Storage Services**: In-memory data structures (no persistent database needed)
- **Data Flow**: RESTful API serves educational content → Frontend displays interactively

## User Guide

### Getting Started
1. **Explore Genres**: Click "Genres" to learn about different music styles
2. **Learn Techniques**: Visit "Techniques" section for songwriting methods
3. **Use Tools**: Try the rhyme finder and lyric analyzer in "Tools"
4. **Generate Ideas**: Get inspiration with the "Idea Generator"

### Writing Workflow
1. Choose your genre from the genres section
2. Read the specific lyric tips and characteristics  
3. Use the idea generator to get song concepts
4. Write your lyrics using the techniques learned
5. Use the rhyme finder to enhance your word choices
6. Analyze your finished lyrics for improvements

### Advanced Features
- **Keyboard Shortcuts**: Ctrl/Cmd + 1-5 for quick navigation
- **Copy to Clipboard**: Click any generated idea to copy it
- **Modal Details**: Click genre cards for comprehensive guides

## Deployment

### Platform
- **Development**: Cloudflare Pages with Wrangler dev server
- **Status**: ✅ Active (Local Development)
- **Tech Stack**: Hono + TypeScript + Tailwind CSS + Vite
- **Last Updated**: 2024-09-25

### Local Development
```bash
# Build the project
npm run build

# Start development server
pm2 start ecosystem.config.cjs

# Test the application
curl http://localhost:3000
```

### Production Deployment (Ready)
```bash
# Setup Cloudflare authentication
wrangler login

# Create Cloudflare Pages project  
wrangler pages project create lyrics-maker --production-branch main

# Deploy to production
npm run deploy:prod
```

## Next Steps & Enhancements

### Planned Features (🔄 Next Phase)
1. **User Accounts & Saving**: Personal lyric library and saved ideas
2. **Advanced Rhyme Engine**: More sophisticated rhyme patterns and near-rhymes
3. **Collaboration Tools**: Share lyrics and get feedback from other writers
4. **Audio Integration**: Record melody ideas alongside lyrics
5. **Genre Expansion**: Add more genres (Jazz, R&B, Indie, Electronic)
6. **AI Enhancements**: More intelligent lyric suggestions and completions
7. **Mobile App**: Native mobile application
8. **Social Features**: Community of songwriters, contests, challenges

### Technical Improvements
1. **Database Integration**: Cloudflare D1 for persistent user data
2. **Authentication**: User login and profile management
3. **Performance**: Caching and optimization for large-scale use
4. **Testing**: Comprehensive test suite
5. **Analytics**: Usage tracking and user behavior insights

## Development Notes
- Built with Hono framework for lightweight, fast backend
- Uses Cloudflare Workers for edge deployment
- Frontend uses vanilla JavaScript with Axios for API calls
- Responsive design with Tailwind CSS
- No external dependencies for core functionality
- Extensible architecture for easy feature additions

---

**LyricsCraft empowers songwriters of all levels to master their craft through education, tools, and inspiration. Start your songwriting journey today!**