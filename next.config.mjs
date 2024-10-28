/** @type {import('next').NextConfig} */
const nextConfig = {
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
