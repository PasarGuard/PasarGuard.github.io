const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');
const { glob } = require('glob');

// Register fonts if available
try {
  registerFont(path.join(__dirname, '../public/fonts/Inter-Regular.ttf'), { family: 'Inter' });
  registerFont(path.join(__dirname, '../public/fonts/Inter-Bold.ttf'), { family: 'Inter', weight: 'bold' });
} catch (err) {
  console.log('Custom fonts not found, using system fonts');
}

const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;
const PADDING = 80;
const LOGO_SIZE = 120;

// Dark shadcn zinc gradient color schemes
const COLOR_SCHEMES = {
  website: {
    background: 'linear-gradient(135deg, #18181b 0%, #27272a 50%, #3f3f46 100%)',
    text: '#fafafa',
    subtitle: '#a1a1aa',
    accent: '#71717a',
    cardBg: 'rgba(24, 24, 27, 0.8)',
    cardBorder: 'rgba(113, 113, 122, 0.3)'
  },
  article: {
    background: 'linear-gradient(135deg, #09090b 0%, #18181b 50%, #27272a 100%)',
    text: '#fafafa',
    subtitle: '#a1a1aa',
    accent: '#71717a',
    cardBg: 'rgba(9, 9, 11, 0.8)',
    cardBorder: 'rgba(113, 113, 122, 0.4)'
  }
};

// Helper function to create gradient background
function createGradient(ctx, colors, width, height) {
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  if (colors.includes('#')) {
    // Handle hex colors
    const colorStops = colors.match(/#[a-fA-F0-9]{6}/g);
    if (colorStops) {
      colorStops.forEach((color, index) => {
        gradient.addColorStop(index / (colorStops.length - 1), color);
      });
    }
  }
  return gradient;
}

// Helper function to draw rounded rectangle
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

async function createOGImage(title, description = '', type = 'website') {
  const canvas = createCanvas(OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT);
  const ctx = canvas.getContext('2d');
  
  const colors = COLOR_SCHEMES[type] || COLOR_SCHEMES.website;

  // Create gradient background
  const gradient = createGradient(ctx, colors.background, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT);
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT);

  // Add subtle pattern overlay
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  for (let i = 0; i < 50; i++) {
    const x = Math.random() * OG_IMAGE_WIDTH;
    const y = Math.random() * OG_IMAGE_HEIGHT;
    const size = Math.random() * 3 + 1;
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Load and draw logo with enhanced styling
  try {
    const logoPath = path.join(__dirname, '../public/static/logo.png');
    const logo = await loadImage(logoPath);
    
    // Create logo container with glassmorphism effect
    const logoContainerX = PADDING;
    const logoContainerY = PADDING;
    const logoContainerSize = LOGO_SIZE + 20;
    
    // Logo background
    ctx.fillStyle = colors.cardBg;
    drawRoundedRect(ctx, logoContainerX - 10, logoContainerY - 10, logoContainerSize, logoContainerSize, 20);
    ctx.fill();
    
    // Logo border
    ctx.strokeStyle = colors.cardBorder;
    ctx.lineWidth = 2;
    drawRoundedRect(ctx, logoContainerX - 10, logoContainerY - 10, logoContainerSize, logoContainerSize, 20);
    ctx.stroke();
    
    // Draw logo
    ctx.drawImage(logo, logoContainerX, logoContainerY, LOGO_SIZE, LOGO_SIZE);
  } catch (err) {
    console.log('Logo not found, creating text logo instead');
    // Fallback text logo
    ctx.fillStyle = colors.accent;
    ctx.font = 'bold 60px Inter, system-ui, sans-serif';
    ctx.fillText('PG', PADDING, PADDING + 60);
  }

  // Create content card
  const cardX = PADDING;
  const cardY = PADDING + LOGO_SIZE + 30;
  const cardWidth = OG_IMAGE_WIDTH - (PADDING * 2);
  const cardHeight = OG_IMAGE_HEIGHT - cardY - PADDING - 60;
  
  // Card background with glassmorphism
  ctx.fillStyle = colors.cardBg;
  drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 24);
  ctx.fill();
  
  // Card border
  ctx.strokeStyle = colors.cardBorder;
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, cardX, cardY, cardWidth, cardHeight, 24);
  ctx.stroke();

  // Title styling with better typography
  ctx.font = 'bold 56px Inter, system-ui, sans-serif';
  ctx.fillStyle = colors.text;
  ctx.textAlign = 'left';

  // Calculate text positioning
  const textPadding = 40;
  const maxWidth = cardWidth - (textPadding * 2);
  const titleY = cardY + textPadding + 60;

  // Draw title with word wrapping and better spacing
  const words = title.split(' ');
  let line = '';
  let y = titleY;
  const lineHeight = 70;

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && i > 0) {
      ctx.fillText(line, cardX + textPadding, y);
      line = words[i] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, cardX + textPadding, y);

  // Draw description with enhanced styling
  if (description) {
    y += lineHeight + 30;
    ctx.font = '28px Inter, system-ui, sans-serif';
    ctx.fillStyle = colors.subtitle;
    
    const descWords = description.split(' ');
    let descLine = '';
    const descLineHeight = 36;

    for (let i = 0; i < descWords.length; i++) {
      const testLine = descLine + descWords[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;

      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(descLine, cardX + textPadding, y);
        descLine = descWords[i] + ' ';
        y += descLineHeight;
      } else {
        descLine = testLine;
      }
    }
    ctx.fillText(descLine, cardX + textPadding, y);
  }

  // Draw type badge with modern styling
  if (type) {
    const badgePadding = 24;
    const badgeHeight = 50;
    const badgeText = type.toUpperCase();
    
    ctx.font = 'bold 18px Inter, system-ui, sans-serif';
    const badgeWidth = ctx.measureText(badgeText).width + (badgePadding * 2);
    const badgeX = OG_IMAGE_WIDTH - badgeWidth - PADDING;
    const badgeY = OG_IMAGE_HEIGHT - badgeHeight - PADDING;

    // Badge background with gradient
    const badgeGradient = createGradient(ctx, colors.accent, badgeWidth, badgeHeight);
    drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 25);
    ctx.fillStyle = badgeGradient;
    ctx.fill();

    // Badge text
    ctx.fillStyle = colors.text;
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, badgeX + badgeWidth / 2, badgeY + 32);
  }

  // Add subtle accent line
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(PADDING, OG_IMAGE_HEIGHT - 20);
  ctx.lineTo(PADDING + 100, OG_IMAGE_HEIGHT - 20);
  ctx.stroke();

  return canvas.toBuffer('image/png');
}

// Function to extract frontmatter from MDX files
function extractFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);
  
  if (!match) return {};
  
  const frontmatter = match[1];
  const metadata = {};
  
  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      const value = valueParts.join(':').trim();
      metadata[key.trim()] = value;
    }
  });
  
  return metadata;
}

// Function to get all pages dynamically
async function getAllPages() {
  const pages = [];
  
  // Add main pages (one per page, not per locale)
  pages.push({
    filename: 'home.png',
    title: 'PasarGuard',
    description: 'Censorship-resistant GUI integrated solution',
    type: 'article',
    path: '/'
  });
  
  pages.push({
    filename: 'introduction.png',
    title: 'Documentation',
    description: 'Complete guide to PasarGuard',
    type: 'article',
    path: '/introduction'
  });
  
  // Find all MDX files in content directory and create unique pages
  const mdxFiles = await glob('../content/docs/en/**/*.mdx', { cwd: __dirname });
  const processedPages = new Set(); // To avoid duplicates
  
  console.log(`Found ${mdxFiles.length} MDX files to process`);
  
  for (const file of mdxFiles) {
    try {
      const filePath = path.join(__dirname, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const frontmatter = extractFrontmatter(content);
      
      if (frontmatter.title) {
        // Extract slug from file path (ignore language)
        // Normalize path separators for cross-platform compatibility
        const normalizedFile = file.replace(/\\/g, '/');
        const pathParts = normalizedFile.split('/');
        // Debug: console.log(`Processing file: ${file}, normalizedFile: ${normalizedFile}, pathParts:`, pathParts);
        
        // Skip the index.mdx files as they're handled separately
        if (pathParts[pathParts.length - 1] === 'index.mdx') {
          continue;
        }
        
        // Extract the full path after 'en' and remove .mdx extension
        const pathAfterEn = pathParts.slice(4); // Get everything after 'en'
        const mdxFilename = pathAfterEn[pathAfterEn.length - 1];
        const filenameWithoutExt = mdxFilename.replace('.mdx', '');
        const slug = [...pathAfterEn.slice(0, -1), filenameWithoutExt];
        // Debug: console.log(`slug after processing:`, slug);
        
        // Skip if no valid slug
        if (!slug.length) continue;
        
        // For files like panel/installation.mdx, we want the full path
        // For files like migration/marzban.mdx, we want the full path
        
        const pageKey = slug.join('/');
        
        // Process all individual files (no duplicate checking needed)
        
        const filename = `${slug.join('-')}.png`;
        const pagePath = `/${slug.join('/')}`;
        
        // Debug: console.log(`Adding page: ${filename} -> ${pagePath}`);
        
        pages.push({
          filename,
          title: frontmatter.title,
          description: frontmatter.description || 'PasarGuard Documentation',
          type: 'article',
          path: pagePath
        });
      }
    } catch (error) {
      console.error(`Error processing ${file}:`, error.message);
    }
  }
  
  return pages;
}

async function generateOGImages() {
  console.log('🎨 Generating Open Graph images...');
  
  const outputDir = path.join(__dirname, '../public/og-images');
  
  // Ensure output directory exists
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Get all pages dynamically
  const pages = await getAllPages();
  console.log(`Found ${pages.length} pages to generate OG images for`);

  // Generate images for each page
  for (const page of pages) {
    try {
      const imageBuffer = await createOGImage(page.title, page.description, page.type);
      const outputPath = path.join(outputDir, page.filename);
      fs.writeFileSync(outputPath, imageBuffer);
      console.log(`✅ Generated: ${page.filename} (${page.path})`);
    } catch (error) {
      console.error(`❌ Failed to generate ${page.filename}:`, error.message);
    }
  }

  console.log('🎉 Open Graph images generated successfully!');
}

// Run if called directly
if (require.main === module) {
  generateOGImages().catch(console.error);
}

module.exports = { generateOGImages, createOGImage };
