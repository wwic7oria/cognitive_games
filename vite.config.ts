import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/cognitive_games/',
  plugins: [react()],
  // Для удобного импорта
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})

/* для пуша изменений на гитхаб: 
npm run build
npx gh-pages -d dist
*/
