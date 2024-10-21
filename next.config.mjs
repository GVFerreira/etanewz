/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: '/api/uploads/:path*', // Redireciona para a rota API
      },
    ]
  },
  images: {
    domains: ['localhost', 'etanz.com.br'], // Adicione os domínios permitidos aqui
  },
}

export default nextConfig;
