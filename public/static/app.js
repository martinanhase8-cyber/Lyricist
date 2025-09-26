// LyricsCraft Frontend Application

let currentSection = 'home';
let genres = {};
let techniques = {};

// Initialize the application
document.addEventListener('DOMContentLoaded', async function() {
    await loadGenres();
    await loadTechniques();
    showSection('home');
    
    // Add event listener for rhyme input
    document.getElementById('rhyme-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            findRhymes();
        }
    });
});

// Navigation functions
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    
    // Show selected section
    document.getElementById(`${section}-section`).classList.remove('hidden');
    
    // Update navigation
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-purple-600', 'text-white');
        btn.classList.add('text-gray-700');
    });
    
    currentSection = section;
}

function scrollToSection(elementId) {
    document.getElementById(elementId).scrollIntoView({ behavior: 'smooth' });
}

// Load and display genres
async function loadGenres() {
    try {
        const response = await axios.get('/api/genres');
        genres = response.data;
        displayGenres();
    } catch (error) {
        console.error('Error loading genres:', error);
    }
}

function displayGenres() {
    const container = document.getElementById('genres-container');
    container.innerHTML = '';
    
    Object.entries(genres).forEach(([key, genre]) => {
        const genreCard = createGenreCard(key, genre);
        container.appendChild(genreCard);
    });
}

function createGenreCard(key, genre) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-lg p-6 card-hover cursor-pointer';
    card.onclick = () => showGenreDetails(key, genre);
    
    card.innerHTML = `
        <div class="text-center mb-4">
            <h3 class="text-2xl font-bold text-purple-600 mb-2">${genre.name}</h3>
            <p class="text-gray-600">${genre.description}</p>
        </div>
        
        <div class="mb-4">
            <h4 class="font-semibold text-gray-800 mb-2">Key Characteristics:</h4>
            <ul class="text-sm text-gray-600 space-y-1">
                ${genre.characteristics.slice(0, 3).map(char => `<li>• ${char}</li>`).join('')}
            </ul>
        </div>
        
        <div class="text-center">
            <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300">
                Learn More
            </button>
        </div>
    `;
    
    return card;
}

function showGenreDetails(key, genre) {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.onclick = (e) => {
        if (e.target === modal) closeModal(modal);
    };
    
    modal.innerHTML = `
        <div class="bg-white rounded-xl max-w-4xl max-h-90vh overflow-y-auto p-8">
            <div class="flex justify-between items-center mb-6">
                <h2 class="text-3xl font-bold text-purple-600">${genre.name} Songwriting Guide</h2>
                <button onclick="closeModal(this.closest('.fixed'))" class="text-gray-500 hover:text-gray-700 text-2xl">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            
            <div class="grid md:grid-cols-2 gap-8">
                <div>
                    <h3 class="text-xl font-bold mb-4 text-gray-800">Characteristics</h3>
                    <ul class="space-y-2 mb-6">
                        ${genre.characteristics.map(char => `<li class="flex items-start"><i class="fas fa-check text-green-500 mr-2 mt-1"></i>${char}</li>`).join('')}
                    </ul>
                    
                    <h3 class="text-xl font-bold mb-4 text-gray-800">Popular Topics</h3>
                    <div class="flex flex-wrap gap-2 mb-6">
                        ${genre.exampleTopics.map(topic => `<span class="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">${topic}</span>`).join('')}
                    </div>
                </div>
                
                <div>
                    <h3 class="text-xl font-bold mb-4 text-gray-800">Lyric Writing Tips</h3>
                    <ul class="space-y-3">
                        ${genre.lyricTips.map(tip => `<li class="flex items-start"><i class="fas fa-lightbulb text-yellow-500 mr-2 mt-1"></i><span class="text-gray-700">${tip}</span></li>`).join('')}
                    </ul>
                </div>
            </div>
            
            <div class="mt-8 text-center">
                <button onclick="generateGenreIdea('${key}')" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 mr-4">
                    <i class="fas fa-lightbulb mr-2"></i>Generate Song Ideas
                </button>
                <button onclick="closeModal(this.closest('.fixed')); showSection('techniques')" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                    <i class="fas fa-book mr-2"></i>Learn Techniques
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function generateGenreIdea(genreKey) {
    document.getElementById('idea-genre').value = genreKey;
    closeModal(document.querySelector('.fixed'));
    showSection('generator');
    generateIdea();
}

// Load and display techniques
async function loadTechniques() {
    try {
        const response = await axios.get('/api/techniques');
        techniques = response.data;
        displayTechniques();
    } catch (error) {
        console.error('Error loading techniques:', error);
    }
}

function displayTechniques() {
    const container = document.getElementById('techniques-container');
    container.innerHTML = '';
    
    Object.entries(techniques).forEach(([key, category]) => {
        const categoryCard = createTechniqueCategory(key, category);
        container.appendChild(categoryCard);
    });
}

function createTechniqueCategory(key, category) {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-xl shadow-lg p-8 mb-8';
    
    card.innerHTML = `
        <h3 class="text-2xl font-bold text-blue-600 mb-6">
            <i class="fas fa-cog mr-2"></i>${category.name}
        </h3>
        
        <div class="grid md:grid-cols-2 gap-6">
            ${category.techniques.map(technique => `
                <div class="border-l-4 border-blue-500 pl-4 py-3">
                    <h4 class="font-bold text-gray-800 mb-2">${technique.name}</h4>
                    <p class="text-gray-600 mb-2">${technique.description}</p>
                    <p class="text-sm text-blue-600 font-medium">💡 ${technique.tips}</p>
                </div>
            `).join('')}
        </div>
    `;
    
    return card;
}

// Rhyme finder functionality
async function findRhymes() {
    const word = document.getElementById('rhyme-input').value.trim();
    if (!word) return;
    
    try {
        const response = await axios.get(`/api/rhymes/${encodeURIComponent(word)}`);
        displayRhymes(response.data);
    } catch (error) {
        console.error('Error finding rhymes:', error);
        displayRhymes({ word, rhymes: [] });
    }
}

function displayRhymes(data) {
    const resultsDiv = document.getElementById('rhyme-results');
    const wordSpan = document.getElementById('rhyme-word');
    const listDiv = document.getElementById('rhyme-list');
    
    wordSpan.textContent = data.word;
    listDiv.innerHTML = '';
    
    if (!data.rhymes || data.rhymes.length === 0) {
        listDiv.innerHTML = '<p class="text-gray-500">No rhymes found for this word. Try a different word!</p>';
    } else {
        // Show engine info and total count
        if (data.totalFound && data.engineVersion) {
            listDiv.innerHTML = `
                <div class="mb-4 p-3 bg-blue-50 rounded-lg">
                    <p class="text-sm text-blue-600">
                        <i class="fas fa-cog mr-1"></i> ${data.engineVersion} • Found ${data.totalFound} rhymes
                    </p>
                </div>
            `;
        }
        
        // Display Perfect Rhymes section
        if (data.perfectRhymes && data.perfectRhymes.length > 0) {
            const perfectSection = document.createElement('div');
            perfectSection.className = 'mb-4';
            perfectSection.innerHTML = `
                <h5 class="font-semibold text-green-600 mb-2">
                    <i class="fas fa-bullseye mr-1"></i> Perfect Rhymes (${data.perfectRhymes.length})
                </h5>
                <div class="flex flex-wrap gap-2 mb-3"></div>
            `;
            
            const perfectContainer = perfectSection.querySelector('div:last-child');
            data.perfectRhymes.forEach(rhyme => {
                const span = createRhymeSpan(rhyme, 'bg-green-100 text-green-700 hover:bg-green-200');
                perfectContainer.appendChild(span);
            });
            listDiv.appendChild(perfectSection);
        }
        
        // Display Near Rhymes section
        if (data.nearRhymes && data.nearRhymes.length > 0) {
            const nearSection = document.createElement('div');
            nearSection.className = 'mb-4';
            nearSection.innerHTML = `
                <h5 class="font-semibold text-blue-600 mb-2">
                    <i class="fas fa-adjust mr-1"></i> Near Rhymes (${data.nearRhymes.length})
                </h5>
                <div class="flex flex-wrap gap-2 mb-3"></div>
            `;
            
            const nearContainer = nearSection.querySelector('div:last-child');
            data.nearRhymes.forEach(rhyme => {
                const span = createRhymeSpan(rhyme, 'bg-blue-100 text-blue-700 hover:bg-blue-200');
                nearContainer.appendChild(span);
            });
            listDiv.appendChild(nearSection);
        }
        
        // Fallback: show all rhymes if categorized data not available
        if ((!data.perfectRhymes && !data.nearRhymes) && data.rhymes.length > 0) {
            const allSection = document.createElement('div');
            allSection.innerHTML = '<div class="flex flex-wrap gap-2"></div>';
            const container = allSection.querySelector('div');
            
            data.rhymes.slice(0, 25).forEach(rhyme => {
                const span = createRhymeSpan(rhyme, 'bg-purple-100 text-purple-700 hover:bg-purple-200');
                container.appendChild(span);
            });
            listDiv.appendChild(allSection);
        }
        
        // Add usage tip
        const tipDiv = document.createElement('div');
        tipDiv.className = 'mt-4 p-3 bg-yellow-50 rounded-lg';
        tipDiv.innerHTML = `
            <p class="text-sm text-yellow-700">
                <i class="fas fa-lightbulb mr-1"></i> 
                <strong>Tip:</strong> Click any rhyme to find rhymes for that word. Perfect rhymes sound identical, near rhymes offer creative alternatives.
            </p>
        `;
        listDiv.appendChild(tipDiv);
    }
    
    resultsDiv.classList.remove('hidden');
}

function createRhymeSpan(rhyme, className) {
    const span = document.createElement('span');
    span.className = `${className} px-3 py-1 rounded-full text-sm cursor-pointer transition duration-200`;
    span.textContent = rhyme;
    span.onclick = () => {
        document.getElementById('rhyme-input').value = rhyme;
        findRhymes();
    };
    span.title = `Click to find rhymes for "${rhyme}"`;
    return span;
}

// Lyric analyzer functionality
async function analyzeLyrics() {
    const lyrics = document.getElementById('lyrics-input').value.trim();
    if (!lyrics) {
        alert('Please enter some lyrics to analyze');
        return;
    }
    
    try {
        const response = await axios.post('/api/analyze-lyrics', { lyrics });
        displayLyricAnalysis(response.data);
    } catch (error) {
        console.error('Error analyzing lyrics:', error);
        alert('Error analyzing lyrics. Please try again.');
    }
}

function displayLyricAnalysis(analysis) {
    const resultsDiv = document.getElementById('analysis-results');
    
    resultsDiv.innerHTML = `
        <div class="bg-gray-50 p-6 rounded-lg">
            <h4 class="text-xl font-bold mb-4 text-blue-600">Analysis Results</h4>
            
            <div class="grid md:grid-cols-3 gap-6 mb-6">
                <div class="text-center">
                    <div class="text-2xl font-bold text-purple-600">${analysis.wordCount}</div>
                    <div class="text-gray-600">Words</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-blue-600">${analysis.lineCount}</div>
                    <div class="text-gray-600">Lines</div>
                </div>
                <div class="text-center">
                    <div class="text-2xl font-bold text-green-600">${analysis.syllableCount}</div>
                    <div class="text-gray-600">Syllables</div>
                </div>
            </div>
            
            <div class="grid md:grid-cols-2 gap-6">
                <div>
                    <h5 class="font-bold mb-2">Rhyme Scheme:</h5>
                    <p class="bg-white p-3 rounded font-mono text-lg">${analysis.rhymeScheme}</p>
                </div>
                <div>
                    <h5 class="font-bold mb-2">Reading Time:</h5>
                    <p class="bg-white p-3 rounded">${analysis.readingTime} minute(s)</p>
                </div>
            </div>
            
            ${analysis.analysis && analysis.analysis.length > 0 ? `
                <div class="mt-6">
                    <h5 class="font-bold mb-3">Insights & Suggestions:</h5>
                    <ul class="space-y-2">
                        ${analysis.analysis.map(insight => `<li class="flex items-start"><i class="fas fa-lightbulb text-yellow-500 mr-2 mt-1"></i><span>${insight}</span></li>`).join('')}
                    </ul>
                </div>
            ` : ''}
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
}

// Song idea generator
async function generateIdea() {
    const genre = document.getElementById('idea-genre').value;
    const theme = document.getElementById('idea-theme').value.trim();
    
    try {
        const response = await axios.post('/api/generate-idea', { genre, theme });
        displayGeneratedIdeas(response.data);
    } catch (error) {
        console.error('Error generating ideas:', error);
        alert('Error generating ideas. Please try again.');
    }
}

function displayGeneratedIdeas(ideas) {
    const resultsDiv = document.getElementById('idea-results');
    
    resultsDiv.innerHTML = `
        <div class="bg-gray-50 p-6 rounded-lg">
            <h4 class="text-xl font-bold mb-6 text-green-600">
                <i class="fas fa-lightbulb mr-2"></i>Professional Song Ideas & Writing Prompts
            </h4>
            
            <div class="grid lg:grid-cols-3 gap-6">
                <!-- Column 1: Titles and Opening Lines -->
                <div>
                    <h5 class="font-bold mb-3 text-purple-600">
                        <i class="fas fa-tag mr-2"></i>Professional Titles
                    </h5>
                    <ul class="space-y-2 mb-6">
                        ${ideas.titles.slice(0, 5).map(title => `<li class="bg-white p-3 rounded shadow cursor-pointer hover:bg-gray-100 transition duration-200" onclick="copyToClipboard('${title}')" title="Click to copy">${title}</li>`).join('')}
                    </ul>
                    
                    <h5 class="font-bold mb-3 text-blue-600">
                        <i class="fas fa-quote-left mr-2"></i>Opening Line Strategies
                    </h5>
                    <ul class="space-y-2">
                        ${ideas.firstLines.map(line => `<li class="bg-white p-3 rounded shadow text-sm">${line}</li>`).join('')}
                    </ul>
                </div>
                
                <!-- Column 2: Concepts and Tips -->
                <div>
                    <h5 class="font-bold mb-3 text-orange-600">
                        <i class="fas fa-brain mr-2"></i>Song Concepts
                    </h5>
                    <ul class="space-y-2 mb-6">
                        ${ideas.concepts.map(concept => `<li class="bg-white p-3 rounded shadow text-sm">${concept}</li>`).join('')}
                    </ul>
                    
                    ${ideas.genreSpecificTips ? `
                    <h5 class="font-bold mb-3 text-indigo-600">
                        <i class="fas fa-star mr-2"></i>Pro Tips
                    </h5>
                    <ul class="space-y-2">
                        ${ideas.genreSpecificTips.map(tip => `<li class="bg-white p-3 rounded shadow text-sm">${tip}</li>`).join('')}
                    </ul>
                    ` : ''}
                </div>
                
                <!-- Column 3: Writing Prompts and Themes -->
                <div>
                    ${ideas.writingPrompts ? `
                    <h5 class="font-bold mb-3 text-teal-600">
                        <i class="fas fa-pen-fancy mr-2"></i>Writing Exercises
                    </h5>
                    <ul class="space-y-2 mb-6">
                        ${ideas.writingPrompts.map(prompt => `<li class="bg-white p-3 rounded shadow text-sm">${prompt}</li>`).join('')}
                    </ul>
                    ` : ''}
                    
                    <h5 class="font-bold mb-3 text-red-600">
                        <i class="fas fa-heart mr-2"></i>Explore Themes
                    </h5>
                    <div class="space-y-2">
                        ${ideas.themes.map(theme => `<span class="block bg-white px-3 py-2 rounded shadow text-sm cursor-pointer hover:bg-gray-100 transition duration-200" onclick="exploreTheme('${theme}')">${theme}</span>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="mt-8 p-4 bg-blue-50 rounded-lg">
                <h6 class="font-bold text-blue-800 mb-2">💡 How to Use These Ideas:</h6>
                <ul class="text-sm text-blue-700 space-y-1">
                    <li>• <strong>Titles:</strong> Click to copy and use as inspiration or starting points</li>
                    <li>• <strong>Concepts:</strong> Choose one that resonates and develop it into a full song</li>
                    <li>• <strong>Opening Lines:</strong> Use these patterns with your own specific details</li>
                    <li>• <strong>Writing Exercises:</strong> Complete these prompts to generate original material</li>
                </ul>
            </div>
            
            <div class="mt-6 text-center">
                <button onclick="generateIdea()" class="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 mr-4">
                    <i class="fas fa-sync-alt mr-2"></i>Generate New Ideas
                </button>
                <button onclick="showSection('tools')" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300">
                    <i class="fas fa-tools mr-2"></i>Use Writing Tools
                </button>
            </div>
        </div>
    `;
    
    resultsDiv.classList.remove('hidden');
}

// Utility functions
function closeModal(modal) {
    document.body.removeChild(modal);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // Show temporary success message
        const toast = document.createElement('div');
        toast.className = 'fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        toast.textContent = 'Copied to clipboard!';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
}

function exploreTheme(theme) {
    document.getElementById('idea-theme').value = theme;
    generateIdea();
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    }
});

// Add some keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case '1':
                e.preventDefault();
                showSection('home');
                break;
            case '2':
                e.preventDefault();
                showSection('genres');
                break;
            case '3':
                e.preventDefault();
                showSection('techniques');
                break;
            case '4':
                e.preventDefault();
                showSection('tools');
                break;
            case '5':
                e.preventDefault();
                showSection('generator');
                break;
        }
    }
});

// Initialize tooltips and animations
function initializeAnimations() {
    // Add entrance animations
    const cards = document.querySelectorAll('.card-hover');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });
}

// Call initialization when page loads
document.addEventListener('DOMContentLoaded', initializeAnimations);