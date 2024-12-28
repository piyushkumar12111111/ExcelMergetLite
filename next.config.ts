// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   env: {
//     RAPIDAPI_KEY: process.env.RAPIDAPI_KEY,
//   },
// };

// export default nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '1000000mb'
    }
  },
  api: {
    bodyParser: {
      sizeLimit: '4mb',
    },
    responseLimit: false,
  },
}

module.exports = nextConfig  