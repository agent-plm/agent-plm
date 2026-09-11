import path from "node:path";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  output: "standalone",
  outputFileTracingRoot: path.join(__dirname, "../../.."),
  eslint: {
    ignoreDuringBuilds: process.env.DOCKER_BUILD === "true",
  },
  typescript: {
    ignoreBuildErrors: process.env.DOCKER_BUILD === "true",
  },
};

export default nextConfig;
