import { exec } from 'child_process';
import * as path from 'path';

async function captureScreenshot(url: string, outputPath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const outputDir = path.dirname(outputPath);
    const fileName = path.basename(outputPath); // fileName is unused, but keeping for now

    // Ensure the output directory exists
    exec(`mkdir -p ${outputDir}`, (mkdirError) => {
      if (mkdirError) {
        console.error(`Error creating output directory: ${mkdirError.message}`);
        return reject(mkdirError);
      }

      // Use urllog to capture screenshot
      // urllog expects output directory, so we pass the directory of the outputPath
      const command = `urllog ${url} --output-dir ${outputDir}`;
      console.log(`Executing: ${command}`);

      exec(command, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error capturing screenshot: ${error.message}`);
          console.error(`stderr: ${stderr}`);
          return reject(error);
        }
        console.log(`Screenshot captured for ${url} to ${outputPath}`);
        console.log(`stdout: ${stdout}`);
        resolve();
      });
    });
  });
}

// ESM-compatible check for running directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const url = process.argv[2];
  const outputPath = process.argv[3];

  if (!url || !outputPath) {
    console.error('Usage: node dist/scripts/capture-screenshot.js <URL> <OUTPUT_PATH>');
    process.exit(1);
  }

  captureScreenshot(url, outputPath)
    .then(() => {
      console.log('Screenshot script finished.');
      process.exit(0);
    })
    .catch((err) => {
      console.error('Screenshot script failed:', err);
      process.exit(1);
    });
}