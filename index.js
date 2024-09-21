const fs = require('fs-extra');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

// Directory where videos are stored
const videoDir = './videos';

// Function to convert video to GIF
const convertVideoToGif = (inputPath, outputPath) => {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .output(outputPath)
        .outputOptions([
          '-vf', 'fps=10,scale=320:-1:flags=lanczos', // Resize and apply a filter for better quality
          '-c:v', 'gif'  // Specify GIF codec
        ])
        .on('end', () => {
          console.log(`Conversion finished: ${outputPath}`);
          resolve();
        })
        .on('error', (err) => {
          console.error(`Error: ${err.message}`);
          reject(err);
        })
        .run();
    });
  };
  

// Main function to process all videos in the directory
const processVideos = async () => {
  try {
    // Ensure the video directory exists
    if (!fs.existsSync(videoDir)) {
      console.error(`Directory ${videoDir} does not exist.`);
      return;
    }

    // Read all files in the directory
    const files = await fs.readdir(videoDir);

    // Filter for video files (you may want to adjust the extensions as needed)
    const videoFiles = files.filter(file =>
      ['.mp4', '.avi', '.mov', '.mkv'].includes(path.extname(file).toLowerCase())
    );

    if (videoFiles.length === 0) {
      console.log('No video files found in the directory.');
      return;
    }

    // Convert each video file to GIF
    for (const file of videoFiles) {
      const inputPath = path.join(videoDir, file);
      const outputPath = path.join(videoDir, `${path.basename(file, path.extname(file))}.gif`);
      try {
        await convertVideoToGif(inputPath, outputPath);
      } catch (err) {
        console.error(`Failed to convert ${file}: ${err.message}`);
      }
    }

    console.log('All videos have been processed.');

  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
};

// Execute the main function
processVideos();
