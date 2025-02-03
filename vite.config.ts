import { defineConfig } from 'vite'
import EnvironmentPlugin from "vite-plugin-environment"
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  base: '',
  plugins: [react(), EnvironmentPlugin("all")],
})
