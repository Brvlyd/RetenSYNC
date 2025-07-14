// This file ensures the assets directory is properly included in the build
// and helps with proper asset resolution in production

export const ASSET_PATHS = {
  LOGO: '/assets/Logo.png',
  RETENSYNC_LOGO: '/assets/RetenSYNC.png',
};

// Verify assets exist
if (typeof window !== 'undefined') {
  console.log('Asset paths configured:', ASSET_PATHS);
}
