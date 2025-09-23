# PasarGuard Documentation

Welcome to the PasarGuard documentation site built with Hugo and the Hextra theme.

## 🌐 Multilingual Support

This documentation is available in multiple languages:
- 🇺🇸 **English** (en) - Default
- 🇮🇷 **Persian/Farsi** (fa) - فارسی
- 🇷🇺 **Russian** (ru) - Русский
- 🇨🇳 **Chinese** (zh) - 中文

## 🚀 Quick Start

### Prerequisites

- [Hugo Extended](https://gohugo.io/installation/) (v0.147.9 or later)
- [Go](https://golang.org/dl/) (v1.21 or later)

### Local Development

1. Clone this repository:
   ```bash
   git clone https://github.com/PasarGuard/PasarGuard.github.io.git
   cd PasarGuard.github.io
   ```

2. Install Go dependencies:
   ```bash
   go mod download
   ```

3. Start the development server:
   ```bash
   hugo server -D
   ```

4. Open your browser and visit `http://localhost:1313`

### Building for Production

```bash
hugo --gc --minify
```

The built site will be in the `public/` directory.

## 📁 Content Structure

```
content/
├── en/          # English content
│   ├── _index.md
│   └── node/
├── fa/          # Persian content
│   ├── _index.md
│   └── node/
├── ru/          # Russian content
│   ├── _index.md
│   └── node/
└── zh/          # Chinese content
    ├── _index.md
    └── node/
```

## 🎨 Theme

This site uses the [Hextra](https://github.com/imfing/hextra) theme, which provides:
- Fast and modern design
- Built-in search functionality
- Mobile-responsive layout
- Dark/light mode toggle
- Multilingual support
- Code syntax highlighting

## 📝 Adding Content

### Creating New Pages

1. Add a new Markdown file in the appropriate language directory
2. Include frontmatter at the top:
   ```yaml
   ---
   title: "Page Title"
   type: docs
   weight: 1
   ---
   ```

### Multilingual Content

For each new page, create corresponding files in all language directories:
- `content/en/new-page.md`
- `content/fa/new-page.md`
- `content/ru/new-page.md`
- `content/zh/new-page.md`

## 🔧 Configuration

The main configuration is in `hugo.yaml`. Key settings include:
- Site title and description for each language
- Menu configurations
- Theme parameters
- Multilingual settings

## 🚀 Deployment

This site is automatically deployed to GitHub Pages using GitHub Actions when you push to the `main` branch. The workflow is defined in `.github/workflows/pages.yaml`.

## 📄 License

This project is licensed under the same license as the PasarGuard project.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add/edit content in all supported languages
4. Test locally with `hugo server`
5. Submit a pull request

## 📞 Support

For questions about the documentation site, please open an issue in this repository.
For questions about PasarGuard itself, please visit the [main PasarGuard repository](https://github.com/PasarGuard/panel).