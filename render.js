const nunjucks = require('nunjucks');
const fs = require('fs');
const path = require('path');

// Configure Nunjucks to look for templates in the current directory
nunjucks.configure('.', { autoescape: false });

// Path to the songs directory
const songsDirectory = path.join(__dirname, 'songs');

// Dynamically generate the list of Markdown files from the `/songs` directory
const songs = fs.readdirSync(songsDirectory)
  .filter(file => file.endsWith('.md')) // Only include `.md` files
  .map(file => path.join('songs', file)); // Keep the relative path for Nunjucks

// Render the template with the dynamically generated list
const output = nunjucks.render('combine-songs.njk', { songs });

// Write the output to a file
const outputFile = path.join(__dirname, 'all_songs_combined.md');
fs.writeFileSync(outputFile, output, 'utf-8');

console.log(`All songs have been combined into ${outputFile}`);
