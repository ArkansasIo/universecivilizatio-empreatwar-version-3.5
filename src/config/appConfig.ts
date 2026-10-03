export interface AppConfiguration {
  appName: string;
  version: string;
  environment: 'development' | 'production' | 'staging';
  turnRateSeconds: number;
  maxTurnsCap: number;
  defaultBankInterestRate: number;
  themeConfig: {
    defaultTheme: string;
    allowUserCustomization: boolean;
  };
  sqlConfig: {
    enableInBrowserDb: boolean;
    autoSyncLocalStorage: boolean;
  };
}

export const APP_CONFIG: AppConfiguration = {
  appName: 'Universe Civilization & Stargate Warfare',
  version: '3.8.5-Enterprise',
  environment: 'development',
  turnRateSeconds: 60,
  maxTurnsCap: 1000,
  defaultBankInterestRate: 0.005,
  themeConfig: {
    defaultTheme: 'theme_white_default',
    allowUserCustomization: true,
  },
  sqlConfig: {
    enableInBrowserDb: true,
    autoSyncLocalStorage: true,
  },
};
