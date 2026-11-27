/** @type {import('next').NextConfig} */
const nextConfig = {
  // Let phones and other devices on the same Wi-Fi open the dev server by this PC's address
  // (e.g. http://192.168.1.5:4000). Without this, Next blocks their dev connection and the page never starts.
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "172.*.*.*"],
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
