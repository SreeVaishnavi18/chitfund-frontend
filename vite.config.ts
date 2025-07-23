import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': {
      NODE_ENV: JSON.stringify('production')
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/react-components/RajOtpWrapper.tsx'),
      name: 'RajOtpWrapper',
      formats: ['iife'],
      fileName: () => 'raj-otp-wrapper.js'
    },
    outDir: 'src/assets/react-build',
    emptyOutDir: true
  }
});
