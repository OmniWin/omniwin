// File: generator.ts
import fs from 'fs';
import path from 'path';

// Function to generate argsSide.ts
export function generateArgsSide({
    linkToken,
    router
}: {
    linkToken: string,
    router: string
}) {
    const argsContent = `
    const args = [
        "${linkToken}",      // LINK Token
        "${router}"         // Router
    ];

    module.exports = args;
    `;
    // Path where the argsSide.ts will be saved
    const filePath = path.join(__dirname, './argsSide.js');
    fs.writeFileSync(filePath, argsContent);
}