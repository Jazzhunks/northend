const fs = require('fs');
const path = require('path');
const { SitemapStream, streamToPromise } = require('sitemap');

// Set your absolute production root tracking domain
const BASE_URL = 'https://northendedu.com';

// Define all active frontend routing paths matching your App.jsx maps
const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'monthly', priority: 0.6 },
  { url: '/courses', changefreq: 'weekly', priority: 0.8 },
  { url: '/scholarship', changefreq: 'weekly', priority: 0.8 },
  { url: '/wath', changefreq: 'weekly', priority: 0.9 },
  { url: '/enroll', changefreq: 'monthly', priority: 0.7 },
  { url: '/jobs', changefreq: 'weekly', priority: 0.6 },
  { url: '/centers', changefreq: 'monthly', priority: 0.5 },
  { url: '/results', changefreq: 'weekly', priority: 0.7 },
  { url: '/notices', changefreq: 'daily', priority: 0.7 },
  { url: '/contact', changefreq: 'monthly', priority: 0.5 },
  { url: '/login', changefreq: 'monthly', priority: 0.4 },
  { url: '/register', changefreq: 'monthly', priority: 0.4 },
  { url: '/privacy', changefreq: 'yearly', priority: 0.2 }
];

async function generate() {
  try {
    const stream = new SitemapStream({ hostname: BASE_URL });
    links.forEach(link => stream.write(link));
    stream.end();

    const sitemapOutput = await streamToPromise(stream);
    
    // Write directly into the public folder so it's bundled on every compilation
    const destination = path.join(__dirname, 'public', 'sitemap.xml');
    fs.writeFileSync(destination, sitemapOutput.toString());
    
    console.log('✅ Production sitemap.xml generated successfully in public folder!');
  } catch (error) {
    console.error('❌ Sitemap compilation failed:', error);
  }
}

generate();