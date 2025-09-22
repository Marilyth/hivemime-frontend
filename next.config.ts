import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  distDir: "docs"
};

module.exports = {
    images: {
        unoptimized: true
    }
}

export default nextConfig;
