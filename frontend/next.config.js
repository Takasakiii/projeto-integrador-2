/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["localhost", "127.0.0.1", "projeto-integrador-api.takasaki.dev"],
  },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
