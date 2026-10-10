/** @type {import('next').NextConfig} */
const nextConfig = {
  // Cloudinary/Unsplash URLs are transformed at the CDN (see lib/images.js), so skip Next's optimizer.
  images: {
    unoptimized: true,
  },
  poweredByHeader: false,
  compress: true,
  async headers() {
    return [
      {
        source: '/:path(.*\\.(?:jpg|jpeg|png|webp|svg|ico))',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]
  },
}

module.exports = nextConfig
