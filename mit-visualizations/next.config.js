/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/MITStudyProject',
  images: {
    unoptimized: true,
  },
  reactStrictMode: true,
  trailingSlash: true,
}

module.exports = nextConfig
