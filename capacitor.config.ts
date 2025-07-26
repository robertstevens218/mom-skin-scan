import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.7871a3c068104146b6bf4d0c58ee107d',
  appName: 'mom-skin-scan',
  webDir: 'dist',
  server: {
    url: 'https://7871a3c0-6810-4146-b6bf-4d0c58ee107d.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    Camera: {
      permissions: ['camera', 'photos']
    }
  }
};

export default config;