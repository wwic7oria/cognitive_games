import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/cognitive_games/',
  plugins: [react()],
})

/* для пуша изменений на гитхаб: 
npm run build
npx gh-pages -d dist
*/
