import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      {
        protocol: "https",
        hostname: "*.merchize.com", // Cho phép tất cả subdomain merchize
      },
      {
        protocol: "https",
        hostname: "static.merchize.com",
      },
      {
        protocol: "https",
        hostname: "img.merchize.com",
      },
      // Thêm các domain CDN khác nếu ảnh của bạn nằm ở đó (vd: s3.amazonaws.com)
    ],
  },
};

export default nextConfig;
