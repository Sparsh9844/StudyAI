import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],

  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },

  // Expose NEXT_PUBLIC_* env vars (existing naming convention) to import.meta.env
  envPrefix: ['VITE_', 'NEXT_PUBLIC_'],

  // Allow JSX in .js files (migrated from Next.js)
  esbuild: {
    loader: 'jsx',
    include: [/src\/.*\.jsx?$/],
    exclude: [/node_modules/],
  },
  optimizeDeps: {
    esbuildOptions: { loader: { '.js': 'jsx' } },
  },

  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': { target: 'http://localhost:5001', changeOrigin: true },
    },
  },

  build: {
    outDir: 'dist',

    // Raise warning threshold — we handle splitting manually
    chunkSizeWarningLimit: 600,

    rollupOptions: {
      output: {
        // ── Manual chunk groups ───────────────────────────────
        // Only libraries needed on (almost) every page are pinned to
        // named chunks so they cache independently. Everything else
        // (jsPDF, react-markdown, …) is left to Rollup so it stays
        // inside the lazy route / dynamic import that actually uses it.
        // A catch-all "vendor-misc" group must NOT be used here: it
        // merges lazy-only deps with eager ones and forces the whole
        // group (and anything it references) into the initial load.
        manualChunks(id) {
          if (!id.includes('node_modules/')) return

          // React core — most stable, longest cache
          if (id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/scheduler/')) {
            return 'vendor-react'
          }

          // React Router — stable, rarely changes
          if (id.includes('node_modules/react-router') ||
              id.includes('node_modules/@remix-run/')) {
            return 'vendor-router'
          }

          // Supabase — auth & DB client (loaded right after first paint)
          if (id.includes('node_modules/@supabase/')) {
            return 'vendor-supabase'
          }
        },

        // Deterministic output file names with content hash for cache busting
        entryFileNames:  'assets/[name]-[hash].js',
        chunkFileNames:  'assets/[name]-[hash].js',
        assetFileNames:  'assets/[name]-[hash][extname]',
      },
    },

    // Minification — esbuild is faster, terser gives ~5% smaller output.
    // Use esbuild for speed on every build.
    minify: 'esbuild',

    // Inline tiny assets (< 4 KB) as base64 to save round trips
    assetsInlineLimit: 4096,

    // Generate sourcemaps only for production debugging (disable to save size)
    sourcemap: false,

    // Target modern browsers — avoids legacy polyfills
    target: ['es2020', 'chrome87', 'firefox78', 'safari14'],

    // CSS code splitting — each route chunk gets only its own CSS
    cssCodeSplit: true,
  },
})
