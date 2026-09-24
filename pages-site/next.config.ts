import type { NextConfig } from "next";

const config: NextConfig = {
  output: "export",
  assetPrefix: process.env.PAGES_BASE_PATH || undefined,
  images: { unoptimized: true },
};
export default config;
