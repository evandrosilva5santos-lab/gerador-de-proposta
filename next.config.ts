import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/",
        destination: "/index.html",
      },
      {
        source: "/proposta/:slug",
        destination: "/Proposta.html?p=:slug",
      },
      {
        source: "/p/:slug",
        destination: "/Proposta START.html?p=:slug",
      },
      {
        source: "/proposta-start/:slug",
        destination: "/Proposta START.html?p=:slug",
      },
    ];
  },
};

export default nextConfig;
