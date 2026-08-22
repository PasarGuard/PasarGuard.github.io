export type CommunityCategoryId =
  | 'subscriptionTemplates'
  | 'databaseTools'
  | 'clients';

export type CommunityProject = {
  repo: string;
  name: string;
  description: string;
  official?: boolean;
  icon?: string;
  banner?: string;
};

export type CommunityCategory = {
  id: CommunityCategoryId;
  projects: CommunityProject[];
};

export const communityCategories: CommunityCategory[] = [
  {
    id: 'subscriptionTemplates',
    projects: [
      {
        repo: 'PasarGuard/subscription-template',
        name: 'subscription-template',
        description:
          'Official PasarGuard subscription page template with responsive design and multi-language support.',
        official: true,
      },
      {
        repo: 'Mrclocks/PGClock',
        name: 'PGClock',
        description: 'Community subscription page template for PasarGuard.',
      },
      {
        repo: 'Mrclocks/PGClockPRO',
        name: 'PGClockPRO',
        description: 'Pro variant of the PGClock subscription page template.',
      },
      {
        repo: 'Mrclocks/PGClockLite',
        name: 'PGClockLite',
        description: 'Lightweight PGClock subscription page template.',
      },
      {
        repo: 'Mrclocks/PGClockPlus',
        name: 'PGClockPlus',
        description: 'Extended PGClock subscription page template.',
      },
      {
        repo: 'MatinDehghanian/CNsubscribtion',
        name: 'CNsubscribtion',
        description:
          'Custom subscription page template for PasarGuard with multi-panel support.',
      },
      {
        repo: 'MatinDehghanian/LightWaySub',
        name: 'LightWaySub',
        description:
          'An optimized, high-performance subscription template leveraging modern web technologies for speed.',
      },
    ],
  },
  {
    id: 'databaseTools',
    projects: [
      {
        repo: 'PasarGuard/db-migrations',
        name: 'db-migrations',
        description:
          'Official tools for migrating PasarGuard data between different database backends.',
        official: true,
      },
      {
        repo: 'Mrclocks/PGClockMG',
        name: 'PGClockMG',
        description: 'Community migration tools for PasarGuard.',
      },
    ],
  },
  {
    id: 'clients',
    projects: [
      {
        repo: 'NodePassProject/Anywhere',
        name: 'Anywhere',
        description:
          'Native proxy client for iOS, iPadOS, macOS, and tvOS that works with PasarGuard subscriptions.',
      },
    ],
  },
];
