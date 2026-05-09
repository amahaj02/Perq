import { fileURLToPath } from 'node:url'

const workspaceRoot = fileURLToPath(new URL('./', import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: workspaceRoot,
  },
}

export default nextConfig
