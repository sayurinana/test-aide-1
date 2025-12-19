import { defineConfig } from 'vite'

// GitHub Pages 部署时自动设置 base 路径
const base = process.env.GITHUB_ACTIONS
  ? `/${process.env.GITHUB_REPOSITORY?.split('/')[1] || ''}/`
  : './'

export default defineConfig({
  base,
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
