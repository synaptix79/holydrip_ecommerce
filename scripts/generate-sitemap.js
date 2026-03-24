import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Setup URL
const hostname = 'https://holydripofficial.com';

async function generateSitemap() {
  console.log('Generando sitemap.xml...');

  const smStream = new SitemapStream({ hostname });
  const writeStream = createWriteStream(resolve(__dirname, '../public/sitemap.xml'));

  smStream.pipe(writeStream);

  // Core static routes
  smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });
  smStream.write({ url: '/shop', changefreq: 'daily', priority: 0.9 });
  smStream.write({ url: '/nosotros', changefreq: 'weekly', priority: 0.8 });

  // Fetch products from Firestore REST API
  try {
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
    if (!projectId) {
      throw new Error("VITE_FIREBASE_PROJECT_ID no está definido en .env.local");
    }

    const url = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/products?pageSize=100`;
    const response = await fetch(url);
    
    if (response.ok) {
      const data = await response.json();
      if (data.documents) {
        data.documents.forEach(doc => {
          // Parse Firestore Document mapping
          const fields = doc.fields;
          const isVisible = fields.isVisible ? fields.isVisible.booleanValue : true;
          
          if (isVisible !== false) {
            // Priority to slug, fallback to document ID
            const slug = fields.slug?.stringValue;
            const docId = doc.name.split('/').pop();
            const identifier = slug || docId;
            
            smStream.write({
              url: `/product/${identifier}`,
              changefreq: 'weekly',
              priority: 0.7
            });
          }
        });
        console.log(`Se agregaron ${data.documents.length} productos al sitemap.`);
      }
    } else {
      console.error('Error fetching products from REST API:', response.statusText);
    }
  } catch (error) {
    console.error('Error generando las urls de productos:', error.message);
  }

  smStream.end();

  await streamToPromise(smStream);
  console.log('✨ Sitemap.xml generado exitosamente en public/sitemap.xml');
}

generateSitemap();
