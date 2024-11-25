/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*', // Redireciona para a rota API
      },
      {
        source: '/eta/:path*',
        destination: '/api/eta/:path*', // Redireciona para a rota API
      },
    ]
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3010',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'etanz.com.br',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig;
