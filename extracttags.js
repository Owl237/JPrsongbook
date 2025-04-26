const fs = require("fs");
const path = require("path");

// Path to the songs directory
const songsDirectory = path.join(__dirname, "songs");

// Function to extract tags from a file
function extractTagsFromFile(filePath) {
    const fileContent = fs.readFileSync(filePath, "utf-8");

    const yamlStart = fileContent.indexOf("---") + 3;
    const yamlEnd = fileContent.indexOf("---", yamlStart);

    if (yamlStart < 3 || yamlEnd === -1) {
        console.error(`No valid YAML front matter found in: ${filePath}`);
        return null;
    }

    const yamlContent = fileContent.substring(yamlStart, yamlEnd).trim();

    // Extract tags using regex
    const tagsMatch = yamlContent.match(/tags:\s*\n([\s\S]*?)(?=^\S|\z)/m);
    if (tagsMatch) {
        const tagsList = tagsMatch[1]
            .split("\n")
            .map((tag) => tag.trim().replace("-", "").trim())
            .filter((tag) => tag !== "");
        return tagsList;
    }

    return [];
}

// Function to process all files in the songs directory
function processSongsDirectory(directory) {
    const files = fs.readdirSync(directory);

    const tagsByFile = {};
    files.forEach((file) => {
        const filePath = path.join(directory, file);

        if (fs.statSync(filePath).isFile() && file.endsWith(".md")) {
            const tags = extractTagsFromFile(filePath);
            tagsByFile[file] = tags;
        }
    });

    return tagsByFile;
}

// Process the songs directory and log the results
const tagsByFile = processSongsDirectory(songsDirectory);
console.log("Tags by File:", tagsByFile);
