/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable JSON imports
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
      '.jsx': ['.jsx', '.tsx'],
    }
    return config
  },
}

module.exports = nextConfig

