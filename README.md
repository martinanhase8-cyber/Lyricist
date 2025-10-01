# Lyricist Pro — Professional Songwriting Tools

Professional songwriting tools and guides for writers who want to create music that connects, moves, and lasts.

## 🎵 Project Overview

- **Name**: Lyricist Pro
- **Goal**: Provide comprehensive, privacy-first songwriting tools for professional and amateur songwriters
- **Features**: Advanced rhyme engine, lyric analyzer, professional metronome, idea generator, project management

## 🌍 URLs

- **Live Demo**: https://3000-ie6cng3wut5bc4mz8cfql-6532622b.e2b.dev
- **API Health**: https://3000-ie6cng3wut5bc4mz8cfql-6532622b.e2b.dev/api/health
- **GitHub**: https://github.com/martinanhase8-cyber/Lyricist
- **Production** (after Cloudflare deployment): Will be available at lyricist-pro.pages.dev

## ✨ Core Features

### 🎯 Advanced Rhyme Engine
- **Perfect Rhymes**: Traditional end-rhymes with exact phonetic matching
- **Near/Slant Rhymes**: Close phonetic matches for creative flexibility
- **Multi-syllable Endings**: Complex phrase-based rhymes
- **Internal Rhyme Ideas**: Mid-line rhyme suggestions
- **Online Integration**: Optional Datamuse API for extended vocabulary
- **Local Algorithms**: Privacy-first offline rhyme generation

### 📊 Lyric Analyzer
- **Syllable Counting**: Automatic syllable detection with overflow warnings
- **BPM-based Timing**: Analyze lyric pacing against song tempo
- **Bars-per-line Analysis**: Color-coded feedback for line length
- **Rhyme Scheme Detection**: Automatic pattern recognition (AABA, ABAB, etc.)
- **Visual Feedback**: Red (overflow), amber (tight), green (comfortable) indicators

### 🥁 Professional Metronome
- **Adjustable BPM**: 40–240 beats per minute
- **Time Signatures**: 4/4, 3/4, 6/8 support
- **Tap Tempo**: Calculate BPM by tapping rhythm
- **Spacebar Control**: Quick start/stop with keyboard
- **Visual Beat Indicator**: Accent on downbeats
- **Web Audio API**: Precise scheduling for accurate timing

### 💡 Creative Idea Generator
- **Genre-Specific Prompts**: Pop, Rock, Hip-Hop, Country, Folk, Jazz, Electronic, R&B
- **Theme Seeds**: "leaving home", "second chances", "city at 3 a.m."
- **Hook Concepts**: "Say it like you mean it", "Stuck in the in-between"
- **Structure Suggestions**: Verse-Chorus, AABA, Electronic builds
- **Pro Tips**: Genre-specific songwriting techniques

### 📁 Project Management
- **Local Storage**: All data stays on your device
- **JSON Export/Import**: Backup and share projects
- **TXT Export**: Simple lyric file downloads
- **Search & Filter**: Find projects by title or genre
- **Metadata Tracking**: BPM, time signature, creation dates

## 🏗️ Data Architecture

### Data Models
- **Project**: `{ id, title, genre, lyrics, notes, bpm, timeSig, createdAt, updatedAt }`
- **State Management**: Global state with localStorage persistence
- **Rhyme Results**: `{ perfect, near, multi, internal }`
- **Analyzer Metrics**: `{ byLine, avgSyll, pattern }`

### Storage Services
- **Local Storage**: Primary data persistence (localStorage API)
- **Browser Storage**: Project data, user preferences, cache
- **Optional Online**: Datamuse API for extended rhyme lookup

### Data Flow
1. **User Input** → Global state updates
2. **State Changes** → localStorage persistence
3. **Analysis Engines** → Real-time feedback
4. **Export Functions** → File downloads (JSON/TXT)

## 🎛️ Technology Stack

- **Backend**: Hono framework on Cloudflare Workers
- **Frontend**: Vanilla JavaScript with Tailwind CSS
- **Deployment**: Cloudflare Pages
- **Development**: Vite build system with PM2 process management
- **Audio**: Web Audio API for metronome
- **Storage**: localStorage for data persistence
- **Icons**: Font Awesome via CDN
- **Styling**: Tailwind CSS via CDN

## 🚀 User Guide

### Getting Started
1. **Open Tools**: Click "Open Tools" on the homepage
2. **Enable Online Rhymes** (optional): Check the checkbox for Datamuse integration
3. **Navigate**: Use the sidebar to access different tools

### Using the Rhyme Engine
1. Enter a word or phrase in the search box
2. Click "Find Rhymes" to generate suggestions
3. Browse perfect, near, multi-syllable, and internal rhymes
4. Copy suggestions to your lyrics

### Analyzing Lyrics
1. Paste your lyrics in the text area
2. Set BPM and time signature
3. Adjust bars per line for your song structure
4. Review color-coded feedback for each line

### Using the Metronome
1. Set desired BPM (40-240)
2. Choose time signature
3. Click "Start" or press spacebar
4. Use "Tap" to calculate BPM by rhythm

### Managing Projects
1. Go to "My Projects" in the sidebar
2. Click "New" to create a project
3. Fill in title, genre, BPM, lyrics, and notes
4. Use "Export JSON" for backup
5. Use ".txt" button for simple lyric export

## 📋 Currently Completed Features

✅ **Advanced Rhyme Engine** with offline algorithms and online integration
✅ **Lyric Analyzer** with syllable counting and timing analysis  
✅ **Professional Metronome** with Web Audio API precision
✅ **Creative Idea Generator** with 8 genre-specific toolkits
✅ **Project Management** with local storage and export capabilities
✅ **Responsive UI** with dark/light theme support
✅ **Hono Backend** optimized for Cloudflare Workers
✅ **Static File Serving** for optimal performance
✅ **API Health Endpoint** for monitoring

## 🔄 Functional Entry URIs

### Web Pages
- `GET /` - Main application (all tools accessible via hash routing)
  - `#home` - Landing page with feature overview
  - `#rhyme` - Advanced rhyme engine tool
  - `#analyzer` - Lyric analyzer tool  
  - `#metronome` - Metronome and beat counter
  - `#generator` - Creative idea generator
  - `#genres` - Genre guides and techniques
  - `#learn` - Songwriting learning center
  - `#saved` - Project management interface

### API Endpoints
- `GET /api/health` - Health check endpoint
  - Response: `{"status": "ok", "message": "Lyricist API is running"}`
- `GET /static/*` - Static file serving (JavaScript, CSS, assets)

## 🚧 Features Not Yet Implemented

- **Cloudflare Pages Deployment**: Requires API key configuration
- **Advanced Audio Features**: Audio recording, playback integration
- **Collaboration Tools**: Real-time editing, sharing capabilities  
- **Advanced AI Integration**: GPT-powered lyric suggestions
- **Mobile App**: Native iOS/Android applications
- **Cloud Sync**: Cross-device project synchronization
- **Advanced Export**: PDF generation, audio export
- **Plugin System**: DAW integrations (Logic Pro, Ableton, etc.)

## 🎯 Recommended Next Steps

1. **Deploy to Cloudflare Pages**: Configure API key in Deploy tab
2. **User Testing**: Gather feedback from songwriters
3. **Performance Optimization**: Analyze bundle size and load times
4. **Feature Enhancement**: Add chord progression tools
5. **Mobile Optimization**: Improve touch interface
6. **API Expansion**: Add more rhyme and analysis endpoints
7. **Documentation**: Create video tutorials and user guides
8. **Community Features**: User feedback and rating system

## 🛠️ Deployment

### Current Status
- ✅ **Local Development**: Running on sandbox environment
- ✅ **GitHub Repository**: Code pushed to martinanhase8-cyber/Lyricist
- ⚠️ **Cloudflare Pages**: Requires API key setup in Deploy tab

### Local Development
```bash
npm install
npm run build
npm run dev:sandbox
```

### Production Deployment
```bash
# After configuring Cloudflare API key
npm run deploy:prod
```

### Environment Variables
- `NODE_ENV`: Development/production mode
- `CLOUDFLARE_API_TOKEN`: Required for deployment (set via Deploy tab)

**Last Updated**: October 1, 2025

---

Built with ❤️ for songwriters who want to create music that connects, moves, and lasts.