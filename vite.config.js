// vite.config.js
export default {
  base: './', // Use relative paths for deployment
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined // Don't split into chunks for now
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
}