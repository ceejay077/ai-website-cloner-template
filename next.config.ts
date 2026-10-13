import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  // Lets the dev server hydrate pages opened via http://127.0.0.1:3000 as well as localhost.
  allowedDevOrigins: ["127.0.0.1"],
  // Same-origin proxy for WordPress media: the tour brochure PDF needs to read
  // images into a canvas, which the WordPress host's missing CORS headers block.
  async rewrites() {
    return [{ source: "/wp-content/:path*", destination: "https://www.showlanka.com/wp-content/:path*" }];
  },
};

export default nextConfig;
