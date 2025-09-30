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
  search: {
    placeholder: string;
    button: string;
    title: string;
    noResults: string;
    noResultsDescription: string;
    searching: string;
    instructions: string;
    shortcuts: {
      search: string;
      navigate: string;
      select: string;
    };
  }
}
