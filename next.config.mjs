/** @type {import('next').NextConfig} */
const nextConfig = {
  // Node.js 런타임 사용을 명시
  experimental: {
    serverActions: true,
  },
  runtime: "nodejs",
  // 나머지 설정 유지
  output: "standalone",
  images: {
    domains: ["rymesndbhkasxusysszb.supabase.co"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
        port: "",
        pathname: "**",
      },
    ],
  },
};

export default nextConfig;
