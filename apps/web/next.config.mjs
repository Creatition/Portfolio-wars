/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Transpile the workspace package so Next can bundle it.
  transpilePackages: ["@pw/shared"],
  experimental: {
    typedRoutes: false
  }
};

export default nextConfig;
