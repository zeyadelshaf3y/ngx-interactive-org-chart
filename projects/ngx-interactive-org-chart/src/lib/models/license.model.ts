// src/lib/models/license.model.ts
export interface LicenseConfig {
  type: 'free' | 'pro' | 'enterprise';
  maxNodes?: number;
  features: {
    unlimitedNodes: boolean;
    customThemes: boolean;
    exportFeatures: boolean;
    advancedAnimations: boolean;
    whiteLabel: boolean;
  };
}

export const FREE_LICENSE: LicenseConfig = {
  type: 'free',
  maxNodes: 50,
  features: {
    unlimitedNodes: false,
    customThemes: false,
    exportFeatures: false,
    advancedAnimations: false,
    whiteLabel: false,
  }
};

export const PRO_LICENSE: LicenseConfig = {
  type: 'pro',
  features: {
    unlimitedNodes: true,
    customThemes: true,
    exportFeatures: true,
    advancedAnimations: true,
    whiteLabel: false,
  }
};

export const ENTERPRISE_LICENSE: LicenseConfig = {
  type: 'enterprise',
  features: {
    unlimitedNodes: true,
    customThemes: true,
    exportFeatures: true,
    advancedAnimations: true,
    whiteLabel: true,
  }
};
