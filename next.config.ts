import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow other devices on the LAN to load dev assets (HMR socket, fonts,
  // chunks). Without this, the HTML renders but hydration silently fails
  // for any request that didn't come from localhost.
  allowedDevOrigins: ["192.168.1.150"],
};

export default nextConfig;
