const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Path to the songs folder and output file
const songsFolder = path.join(__dirname, 'songs');
const outputFile = path.join(__dirname, 'tags-list.njk');

// Function to extract YAML front matter from a file
function extractYaml(fileContent) {
    const yamlStart = fileContent.indexOf('---') + 3;
    const yamlEnd = fileContent.indexOf('---', yamlStart);
    if (yamlStart < 3 || yamlEnd === -1) {
        return null;
    }
    const yamlContent = fileContent.substring(yamlStart, yamlEnd).trim();
    return yaml.safeLoad(yamlContent); // Parse YAML
}

// Function to generate the `.njk` file dynamically
function generateTagsList() {
    const files = fs.readdirSync(songsFolder);
    const items = [];

    // Process each Markdown file in the songs folder
    files.forEach((file) => {
        const filePath = path.join(songsFolder, file);
        if (fs.statSync(filePath).isFile() && file.endsWith('.md')) {
            const content = fs.readFileSync(filePath, 'utf-8');
            const yamlData = extractYaml(content);
            if (yamlData && yamlData.title && yamlData.tags) {
                items.push({ title: yamlData.title, tags: yamlData.tags });
            }
        }
    });

    // Generate the `.njk` file content
    const njkContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Song Tags</title>
</head>
<body>
    <h1>List of Songs and Tags</h1>
    <ul>
        ${items
            .map(
                (item) => `
        <li>
            <strong>${item.title}</strong>
            <ul>
                ${item.tags.map((tag) => `<li>${tag}</li>`).join('')}
            </ul>
        </li>
        `
            )
            .join('')}
    </ul>
</body>
</html>
    `;

    // Write the `.njk` file
    fs.writeFileSync(outputFile, njkContent.trim(), 'utf-8');
    console.log(`File "tags-list.njk" has been created successfully at ${outputFile}`);
}

// Run the script
generateTagsList();
