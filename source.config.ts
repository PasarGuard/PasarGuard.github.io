import {
  defineConfig,
  defineDocs,
  frontmatterSchema,
  metaSchema,
} from 'fumadocs-mdx/config';
import { rehypeCodeDefaultOptions } from 'fumadocs-core/mdx-plugins';

// You can customise Zod schemas for frontmatter and `meta.json` here
// see https://fumadocs.dev/mdx/collections
export const docs = defineDocs({
  docs: {
    schema: frontmatterSchema,
    postprocess: {
      includeProcessedMarkdown: true,
    },
  },
  meta: {
    schema: metaSchema,
  },
});

export default defineConfig({
  mdxOptions: {
    // MDX options
    remarkPlugins: [],
    rehypePlugins: [],
    rehypeCodeOptions: {
      ...rehypeCodeDefaultOptions,
      langs: [
        'javascript',
        'typescript',
        'jsx',
        'tsx',
        'bash',
        'sh',
        'python',
        'go',
        'json',
        'yaml',
        'yml',
        'markdown',
        'md',
        'mdx',
        'html',
        'css',
        'ini',
        'nginx',
      ],
      // Map unsupported languages to supported ones
      langAlias: {
        'conf': 'ini',
        'caddy': 'nginx',
        'env': 'ini',
        'cfg': 'ini',
      },
    },
  }
});
