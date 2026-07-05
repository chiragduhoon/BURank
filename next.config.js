/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["assets.leetcode.com"],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // Clickjacking: nobody may embed this site in a frame
          { key: "X-Frame-Options", value: "DENY" },
          // Never MIME-sniff responses
          { key: "X-Content-Type-Options", value: "nosniff" },
          // Don't leak full URLs to external sites
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // No unnecessary browser APIs
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
