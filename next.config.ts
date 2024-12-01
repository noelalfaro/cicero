// const nextConfig = {
//   // webpack: (config) => {
//   //   config.resolve.alias = {
//   //     ...config.resolve.alias,
//   //     '@': path.resolve(__dirname, './'),
//   //   };

//   //   return config;
//   // },
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'lh3.googleusercontent.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'avatars.githubusercontent.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'ak-static.cms.nba.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'i.pinimg.com',
//       },
//       {
//         protocol: 'https',
//         hostname: 'utfs.io',
//       },
//     ],
//   },
// };

// export default nextConfig;
import path from 'path';
import { fileURLToPath } from 'url';

// const __dirname = new URL('.', import.meta.url).pathname;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    // ignoreDuringBuilds: true,
  },
  // experimental: {
  //   turbo: {},
  // },
  // webpack: (config: any) => {
  //   config.resolve.alias = {
  //     ...config.resolve.alias,
  //     '@': path.resolve(__dirname, './'),
  //   };
  //   return config;
  // },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'ak-static.cms.nba.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pinimg.com',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
    ],
  },
};
export default nextConfig;
