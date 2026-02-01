import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/bgdntsv.github.io/myValentine/', // Важливо для коректних шляхів
  plugins: [react()],
})
