// File: generator.ts
import fs from 'fs';
import path from 'path';

// Function to generate argsMain.ts
export function generateArgsMain({
    vrfCoordinator,
    linkToken,
    keyHash,
    mainnetFee,
    router,
    subscriptionId
}: {
    vrfCoordinator: string,
    linkToken: string,
    keyHash: string,
    mainnetFee: boolean,
    router: string,
    subscriptionId: number
}) {
    const argsContent = `
    const args = [
        "${vrfCoordinator}", // VRF Coordinator
        "${linkToken}",      // LINK Token
        "${keyHash}",        // Key Hash
        ${mainnetFee},       // Mainnet Fee (boolean)
        "${router}",         // Router
        ${subscriptionId}    // Subscription ID (integer)
    ];

    module.exports = args;
    `;
    // Path where the argsMain.ts will be saved
    const filePath = path.join(__dirname, './argsMain.js');
    fs.writeFileSync(filePath, argsContent);
}
