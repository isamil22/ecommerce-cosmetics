const { en } = require('./src/translations/en.js');
const { fr } = require('./src/translations/fr.js');

function checkLeafNodes(obj, path = '') {
    for (const key in obj) {
        const val = obj[key];
        const newPath = path ? `${path}.${key}` : key;
        
        if (typeof val === 'object' && val !== null) {
            checkLeafNodes(val, newPath);
        } else if (typeof val !== 'string') {
            console.error(`Error: Key "${newPath}" has type ${typeof val} (expected string or object)`);
            console.log('Value:', val);
        }
    }
}

console.log('--- Checking English Translations ---');
checkLeafNodes(en);
console.log('--- Checking French Translations ---');
checkLeafNodes(fr);
console.log('--- Checks Complete ---');
