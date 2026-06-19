import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Sortie autonome pour une image Docker de production légère.
  output: "standalone",
};

export default nextConfig;
