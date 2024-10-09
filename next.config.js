/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'mangadex.org',
            },
        ],
    },
}

module.exports = nextConfig
