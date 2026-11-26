import { cache } from 'react';
import { Star } from 'lucide-react';
import {
  communityCategories,
  type CommunityCategoryId,
  type CommunityProject,
} from '@/data/community-projects';

type Lang = 'en' | 'fa' | 'ru' | 'zh';

const labels: Record<
  Lang,
  Record<CommunityCategoryId | 'official' | 'stars', string>
> = {
  en: {
    subscriptionTemplates: 'Subscription Templates',
    databaseTools: 'Database Tools',
    panelTools: 'Panel Tools',
    clients: 'Clients',
    official: 'Official',
    stars: 'stars',
  },
  fa: {
    subscriptionTemplates: 'قالب‌های سابسکریپشن',
    databaseTools: 'ابزارهای دیتابیس',
    panelTools: 'ابزارهای پنل',
    clients: 'کلاینت‌ها',
    official: 'رسمی',
    stars: 'ستاره',
  },
  ru: {
    subscriptionTemplates: 'Шаблоны подписки',
    databaseTools: 'Инструменты БД',
    panelTools: 'Инструменты панели',
    clients: 'Клиенты',
    official: 'Официальный',
    stars: 'звёзд',
  },
  zh: {
    subscriptionTemplates: '订阅模板',
    databaseTools: '数据库工具',
    panelTools: '面板工具',
    clients: '客户端',
    official: '官方',
    stars: '星标',
  },
};

type ProjectWithStars = CommunityProject & { stars: number };

// Dedupes across locale pages during the same build.
const fetchStars = cache(async (repo: string): Promise<number> => {
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      // Bake into the static page at build time; refresh on the next deploy.
      cache: 'force-cache',
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'PasarGuard-docs',
      },
    });
    if (!res.ok) return 0;
    const data = (await res.json()) as { stargazers_count?: number };
    return data.stargazers_count ?? 0;
  } catch {
    return 0;
  }
});

function ownerOf(repo: string) {
  return repo.split('/')[0] ?? '';
}

function formatStars(n: number) {
  return new Intl.NumberFormat('en', { notation: 'compact' }).format(n);
}

export async function CommunityProjects({ lang = 'en' }: { lang?: Lang }) {
  const t = labels[lang] ?? labels.en;

  const categories = await Promise.all(
    communityCategories.map(async (category) => {
      const projects: ProjectWithStars[] = await Promise.all(
        category.projects.map(async (project) => ({
          ...project,
          stars: await fetchStars(project.repo),
        })),
      );
      projects.sort((a, b) => b.stars - a.stars);
      return { ...category, projects };
    }),
  );

  return (
    <div className="not-prose my-8 space-y-10">
      {categories.map((category) => (
        <section key={category.id} className="space-y-4">
          <h2 className="text-xl font-semibold tracking-tight text-fd-foreground">
            {t[category.id]}
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {category.projects.map((project) => (
              <ProjectCard
                key={project.repo}
                project={project}
                officialLabel={t.official}
                starsLabel={t.stars}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

function ProjectCard({
  project,
  officialLabel,
  starsLabel,
}: {
  project: ProjectWithStars;
  officialLabel: string;
  starsLabel: string;
}) {
  const href = `https://github.com/${project.repo}`;
  const icon = project.icon ?? `https://github.com/${ownerOf(project.repo)}.png`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col overflow-hidden rounded-xl border border-fd-border bg-fd-card/40 transition-colors hover:border-fd-primary/40 hover:bg-fd-accent/40 no-underline"
    >
      {project.banner ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.banner}
          alt=""
          className="h-28 w-full object-cover border-b border-fd-border"
        />
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={icon}
            alt=""
            width={40}
            height={40}
            className="size-10 shrink-0 rounded-lg border border-fd-border bg-fd-muted object-cover"
          />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="m-0 text-base font-semibold text-fd-foreground group-hover:text-fd-primary">
                {project.name}
              </h3>
              {project.official ? (
                <span className="rounded-md bg-fd-primary/10 px-1.5 py-0.5 text-xs font-medium text-fd-primary">
                  {officialLabel}
                </span>
              ) : null}
            </div>
            <p className="m-0 mt-0.5 truncate text-xs text-fd-muted-foreground">
              {project.repo}
            </p>
          </div>
          <span
            className="inline-flex shrink-0 items-center gap-1 rounded-md border border-fd-border px-2 py-1 text-xs text-fd-muted-foreground"
            title={`${project.stars} ${starsLabel}`}
          >
            <Star className="size-3.5 fill-current" aria-hidden />
            {formatStars(project.stars)}
          </span>
        </div>
        <p className="m-0 text-sm leading-relaxed text-fd-muted-foreground">
          {project.description}
        </p>
      </div>
    </a>
  );
}
