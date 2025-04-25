const fs = require('fs');
const path = require('path');

// Path to the `songs` folder
const songsFolderPath = path.join(__dirname, 'songs');

// Function to count occurrences of "published: true"
function countPublishedSongs(folderPath) {
  let count = 0;

  // Read all files in the folder
  const files = fs.readdirSync(folderPath);

  files.forEach((file) => {
    const filePath = path.join(folderPath, file);

    // Check if it's a file or subfolder
    if (fs.lstatSync(filePath).isFile()) {
      const fileContent = fs.readFileSync(filePath, 'utf8');

      // Check if the file contains the text "published: true"
      if (fileContent.includes('published: true')) {
        count++;
      }
    } else if (fs.lstatSync(filePath).isDirectory()) {
      // Recursively search subfolders
      count += countPublishedSongs(filePath);
    }
  });

  return count;
}

// Run the function and log the result
try {
  const publishedCount = countPublishedSongs(songsFolderPath);
  console.log(`Number of published songs: ${publishedCount}`);
} catch (error) {
  console.error('Error reading files:', error);
}
