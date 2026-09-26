import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  appType: 'mpa',
  clearScreen: false,
  server: {
    port: 5173,
    open: '/index.html',
    strictPort: true,
    // ⭐⭐⭐ YE SABSE IMPORTANT LINE HAI ⭐⭐⭐
    middlewareMode: false,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        index: resolve(process.cwd(), 'index.html'),
        login: resolve(process.cwd(), 'login.html'),
        signup: resolve(process.cwd(), 'signup.html'),
        feed: resolve(process.cwd(), 'feed.html'),
        explore: resolve(process.cwd(), 'explore.html'),
        courses: resolve(process.cwd(), 'courses.html'),
        course: resolve(process.cwd(), 'course.html'),
        profile: resolve(process.cwd(), 'profile.html'),
        messages: resolve(process.cwd(), 'messages.html'),
        notifications: resolve(process.cwd(), 'notifications.html'),
        settings: resolve(process.cwd(), 'settings.html'),
        skills: resolve(process.cwd(), 'skills.html'),
        english: resolve(process.cwd(), 'english.html'),
      }
    }
  }
});