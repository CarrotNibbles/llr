import createNextIntlPlugin from "next-intl/plugin";
import createMDX from '@next/mdx';
import remarkGfm from 'remark-gfm';

const withMDX = createMDX({
  extension: /\.mdx$/,
  options: {
    remarkPlugins: [
      remarkGfm,
    ],
  },
});

const withNextIntl = createNextIntlPlugin("./src/lib/i18n/index.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jbgcbfblivbtdnhbkfab.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
      };
    }

    return config;
  },
};

export default withMDX(withNextIntl(nextConfig));
