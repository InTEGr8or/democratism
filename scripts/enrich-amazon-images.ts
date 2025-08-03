import * as fs from 'fs/promises';
import * as path from 'path';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { createWriteStream } from 'fs'; // Import createWriteStream from 'fs'

const AMAZON_IMAGE_BASE_URL = 'https://m.media-amazon.com/images/I/';
const IMAGE_SIZE_SUFFIX = '._SY342_.jpg'; // Consistent with AmazonBook.astro
const PUBLIC_IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'enrichment');
const CONTENT_DIRS = [
  path.join(process.cwd(), 'src', 'posts'),
  path.join(process.cwd(), 'src', 'pages'),
  path.join(process.cwd(), 'src', 'components'),
];
const ASIN_IMAGE_MAP_PATH = path.join(process.cwd(), 'src', 'data', 'amazonImageMap.json');

interface AmazonLinkInfo {
  asin: string;
  link: string;
  imageId?: string; // Add imageId to the interface
}

async function ensureDirectoryExists(dirPath: string) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function getAmazonLinksFromContent(dir: string): Promise<AmazonLinkInfo[]> {
  let amazonLinks: AmazonLinkInfo[] = [];
  const files = await fs.readdir(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory()) {
      amazonLinks = amazonLinks.concat(await getAmazonLinksFromContent(fullPath));
    } else if (file.isFile() && (file.name.endsWith('.md') || file.name.endsWith('.astro'))) {
      const content = await fs.readFile(fullPath, 'utf-8');
      const regex = /https?:\/\/(?:www\.)?amazon\.com\/.*?(?:\/dp\/|\/gp\/product\/)([A-Z0-9]{10})/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        if (match[1]) { // Ensure match[1] is not undefined
          amazonLinks.push({ asin: match[1], link: match[0] });
        }
      }
    }
  }
  return amazonLinks;
}

async function getImageIdFromAmazonPage(amazonLink: string): Promise<string | null> {
  try {
    const response = await axios.get(amazonLink, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });
    const $ = cheerio.load(response.data);

    // Prioritize #imgTagWrapperId, then other common selectors
    const imgTagWrapper = $('#imgTagWrapperId');
    let imageUrl = imgTagWrapper.find('img').attr('src'); // Get src from img inside wrapper

    if (!imageUrl) {
      imageUrl = $('#landingImage').attr('src') || $('#imgBlkFront').attr('src') || $('#main-image').attr('src');
    }

    if (imageUrl) {
      // Extract imageId from the URL (e.g., https://m.media-amazon.com/images/I/51HhfFBJfLL._SY466_.jpg)
      const imageIdMatch = imageUrl.match(/\/images\/I\/([A-Za-z0-9]+)\./);
      if (imageIdMatch && imageIdMatch[1]) {
        return imageIdMatch[1];
      }
    }
    return null;
  } catch (error: any) {
    console.error(`Error fetching or parsing Amazon page for ${amazonLink}: ${error.message}`);
    return null;
  }
}

async function downloadImage(url: string, filePath: string): Promise<boolean> {
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });

    if (response.status === 200) {
      const writer = createWriteStream(filePath); // Use createWriteStream from 'fs'
      response.data.pipe(writer);
      return new Promise((resolve, reject) => {
        writer.on('finish', () => {
          console.log(`Downloaded: ${url} to ${filePath}`);
          resolve(true);
        });
        writer.on('error', (err: NodeJS.ErrnoException) => { // Explicitly type err
          console.error(`Error downloading ${url}: ${err.message}`);
          reject(false);
        });
      });
    } else {
      console.warn(`Failed to download ${url}. Status: ${response.status}`);
      return false;
    }
  } catch (error: any) {
    console.error(`Error fetching ${url}: ${error.message}`);
    return false;
  }
}

async function enrichAmazonImages() {
  console.log('Starting Amazon image enrichment process...');
  await ensureDirectoryExists(PUBLIC_IMAGES_DIR);
  await ensureDirectoryExists(path.dirname(ASIN_IMAGE_MAP_PATH)); // Ensure data directory exists

  let allAmazonLinks: AmazonLinkInfo[] = [];
  for (const dir of CONTENT_DIRS) {
    console.log(`Scanning directory: ${dir}`);
    allAmazonLinks = allAmazonLinks.concat(await getAmazonLinksFromContent(dir));
  }

  // Use a Map to store unique ASINs and their corresponding imageIds
  const asinToImageIdMap = new Map<string, string>();

  for (const linkInfo of allAmazonLinks) {
    if (!asinToImageIdMap.has(linkInfo.asin)) {
      console.log(`Fetching image ID for ASIN: ${linkInfo.asin} from ${linkInfo.link}`);
      const imageId = await getImageIdFromAmazonPage(linkInfo.link);
      if (imageId) {
        asinToImageIdMap.set(linkInfo.asin, imageId);
      } else {
        console.warn(`Could not determine image ID for ASIN: ${linkInfo.asin}. Skipping image download.`);
      }
    }
  }

  console.log(`Found ${asinToImageIdMap.size} unique ASINs with image IDs.`);

  // Save the ASIN-to-ImageId map to a JSON file
  const mapObject = Object.fromEntries(asinToImageIdMap);
  await fs.writeFile(ASIN_IMAGE_MAP_PATH, JSON.stringify(mapObject, null, 2), 'utf-8');
  console.log(`ASIN-to-ImageId map saved to ${ASIN_IMAGE_MAP_PATH}`);

  for (const [asin, imageId] of asinToImageIdMap.entries()) {
    const imageFileName = `${imageId}.jpg`; // Use imageId for file name
    const imageFilePath = path.join(PUBLIC_IMAGES_DIR, imageFileName);

    try {
      await fs.access(imageFilePath);
      // console.log(`Image for imageId ${imageId} (ASIN ${asin}) already exists: ${imageFilePath}`);
    } catch (error) {
      // Image does not exist, attempt to download
      const imageUrl = `${AMAZON_IMAGE_BASE_URL}${imageId}${IMAGE_SIZE_SUFFIX}`;
      console.log(`Attempting to download image for imageId ${imageId} (ASIN ${asin}) from ${imageUrl}`);
      const success = await downloadImage(imageUrl, imageFilePath);
      if (!success) {
        console.warn(`Could not fetch image for imageId: ${imageId} (ASIN ${asin}). It will fall back to CDN.`);
      }
    }
  }
  console.log('Amazon image enrichment process completed.');
}

enrichAmazonImages().catch(console.error);