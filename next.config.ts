import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  images: {
    domains: ['pwfxluewdlealedfbwgd.supabase.co', 'images.squarespace-cdn.com', 'www.vibe.com'],
  },
};

export default withPWA({
  ...nextConfig,
  pwa: {
    dest: 'public',
  },
});
