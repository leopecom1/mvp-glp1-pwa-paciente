import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [{ source: "/paciente", destination: "/", permanent: false }];
  },
  async rewrites() {
    return [
      { source: "/ficha-minima", destination: "/ficha" },
      { source: "/paciente/ficha-minima", destination: "/ficha" },
      { source: "/paciente/ficha", destination: "/ficha" },
    ];
  },
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Content-Type",
            value: "application/javascript; charset=utf-8",
          },
          {
            key: "Cache-Control",
            value: "no-cache, no-store, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
