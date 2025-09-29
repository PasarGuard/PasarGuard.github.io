export type Locale = 'en' | 'fa' | 'ru' | 'zh';

export interface Translations {
  appName: string;
  appDescription: string;
  version: string;
  documentation: string;
  github: string;
  panel: {
    title: string;
    description: string;
  };
  node: {
    title: string;
    description: string;
  };
  commands: {
    title: string;
    description: string;
  };
}
