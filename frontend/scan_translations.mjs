import fs from 'fs';
import path from 'path';

const pagesDir = './src/pages/admin';
const translationKeys = [];

function scanFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    let hasUntranslated = false;
    
    // Simple regex to find text inside JSX tags that isn't wrapped in {t(...)}
    // Matches: >Some Text< but ignores >{...}<
    const textRegex = />([^<>{]+)</g; 
    
    // Matches: placeholder="Some Text"
    const placeholderRegex = /placeholder="([^"]+)"/g;

    let match;
    while ((match = textRegex.exec(content)) !== null) {
        const text = match[1].trim();
        if (text && !text.includes('t(') && !text.match(/^[0-9\s\W]+$/)) { // Ignore numbers/symbols
             // console.log(`[${path.basename(filePath)}] Possible untranslated: "${text}"`);
             hasUntranslated = true;
        }
    }
    
    while ((match = placeholderRegex.exec(content)) !== null) {
         const text = match[1].trim();
         if (text && !text.includes('t(')) {
             hasUntranslated = true;
         }
    }

    return hasUntranslated;
}

console.log('--- Scanning for Untranslated Files ---');
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.jsx'));
const untranslatedFiles = [];

files.forEach(file => {
    if (scanFile(path.join(pagesDir, file))) {
        untranslatedFiles.push(file);
    }
});

console.log('Files potentially needing translation:');
untranslatedFiles.forEach(f => console.log(f));
console.log(`Total: ${untranslatedFiles.length} files.`);
