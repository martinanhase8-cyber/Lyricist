import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Enable CORS for any API routes we might add later
app.use('/api/*', cors())

// Serve static files from public directory
app.use('/static/*', serveStatic({ root: './public' }))

// Main route - serve the Lyricist application
app.get('/', (c) => {
  return c.html(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Lyricist — Professional Songwriting Tools & Guides</title>
  <meta name="description" content="Professional songwriting tools and guides for writers who want to create music that connects, moves, and lasts." />
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎵</text></svg>">
  
  <!-- Tailwind CSS CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          colors: {
            zinc: {
              50: '#fafafa',
              100: '#f4f4f5',
              200: '#e4e4e7',
              300: '#d4d4d8',
              400: '#a1a1aa',
              500: '#71717a',
              600: '#52525b',
              700: '#3f3f46',
              800: '#27272a',
              900: '#18181b',
              950: '#09090b'
            }
          }
        }
      }
    }
  </script>
  
  <style>
    .line-clamp-2 {
      overflow: hidden;
      display: -webkit-box;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
    }
    
    .prose {
      color: inherit;
    }
    
    .prose ul {
      list-style-type: disc;
      padding-left: 1.5rem;
    }
    
    .prose li {
      margin: 0.25rem 0;
    }
  </style>
</head>

<body class="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
  <div id="app"></div>

  <script src="/static/lyricist.js"></script>
</body>
</html>`)
})

// API route for future rhyme engine integrations
app.get('/api/health', (c) => {
  return c.json({ status: 'ok', message: 'Lyricist API is running' })
})

export default app
