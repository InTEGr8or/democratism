import axios from 'axios';
import * as cheerio from 'cheerio';

async function checkSubfolderContent(url: string): Promise<boolean> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // Look for the section that contains child panels
    // This assumes the structure is <div class="grid ..."> with ContentPanel elements inside
    const contentPanels = $('div.grid div h2'); // Targeting h2 inside ContentPanel's div

    if (contentPanels.length > 0) {
      console.log(`Found ${contentPanels.length} content panels on ${url}.`);
      contentPanels.each((i, el) => {
        console.log(`  - Panel Title: ${$(el).text()}`);
      });
      return true;
    } else {
      console.log(`No content panels found on ${url}.`);
      return false;
    }
  } catch (error: any) {
    console.error(`Error checking URL ${url}: ${error.message}`);
    return false;
  }
}

// ESM-compatible check for running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2];
  if (!url) {
    console.error('Usage: node dist/scripts/check-subfolder-content.js <URL>');
    process.exit(1);
  }
  checkSubfolderContent(url)
    .then((found) => {
      console.log(`Check complete. Subfolder content found: ${found}`);
      process.exit(found ? 0 : 1);
    })
    .catch((err) => {
      console.error('Script failed:', err);
      process.exit(1);
    });
}