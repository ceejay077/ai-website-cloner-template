import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // Lets the dev server hydrate pages opened via http://127.0.0.1:3000 as well as localhost.
  allowedDevOrigins: ["127.0.0.1"],
};

export default nextConfig;
