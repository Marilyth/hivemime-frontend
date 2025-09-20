import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  distDir: "docs",
  basePath: "/hivemime-frontend",
  assetPrefix: "/hivemime-frontend",
};

export default nextConfig;
