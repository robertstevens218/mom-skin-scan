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
    },
    Geolocation: {
      permissions: ['location']
    }
  },
  android: {
    permissions: [
      'android.permission.CAMERA',
      'android.permission.READ_EXTERNAL_STORAGE',
      'android.permission.WRITE_EXTERNAL_STORAGE',
      'android.permission.ACCESS_FINE_LOCATION',
      'android.permission.ACCESS_COARSE_LOCATION',
      'android.permission.INTERNET'
    ]
  },
  ios: {
    permissions: [
      'NSCameraUsageDescription',
      'NSLocationWhenInUseUsageDescription'
    ]
  }
};

export default config;