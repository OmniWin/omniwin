import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()
async function main() {
    await prisma.$connect()
    await calculateTrendingScores();
}

main()
    .catch(e => {
        throw e
    })
    .finally(async () => {
        await prisma.$disconnect()
    })


async function calculateTrendingScores() {

    const nfts = await prisma.nft.findMany();
    for (const nft of nfts) {
        // Calculate the score based on your algorithm
        const score = calculateScore(nft); // Implement this function based on your scoring logic

        console.log(`Updating trending score for NFT ${nft.id_nft} to ${score}`);
        try {
            // Update the NFT with the new score
            await prisma.nft.update({
                where: { id_nft: nft.id_nft },
                data: { trendingScore: score }, // Add a trendingScore field to your Nft model
            });
        }
        catch (e) {
            console.error(e)
            console.error(`Error updating trending score for NFT ${nft.id_nft}, with score ${score}`);
        }
    }
}

function calculateScore(nft: any) {
    const USDC_decimals = 6;
    const ticket_price = Number(nft.ticket_price) / Math.pow(10, USDC_decimals);
    const nftValue = (Number(nft.ticket_price) / Math.pow(10, USDC_decimals)) * nft.total_tickets;
    const minNftValue = 500;
    const maxNftValue = 100000;
    const valueScore = (nftValue - minNftValue) / (maxNftValue - minNftValue);


    const minTicketPrice = 1;
    const maxEntryPrice = nftValue;
    const entryPriceScore = 1 - (ticket_price - minTicketPrice) / (maxEntryPrice - minTicketPrice)

    const ticketSales = nft.tickets_bought;
    const totalTickets = nft.total_tickets;
    const ticketSalesScore = ticketSales / totalTickets

    const raffleStart = nft.created_at;
    const endTimetamp = nft.end_timestamp;
    //timestamp into days
    const MaxDays = timestampToDaysInSeconds(endTimetamp)
    const recencyScore = 1 - (raffleStart / MaxDays)

    const valueWeight = 0.5;
    const entryPriceWeight = 0.2;
    const ticketSalesWeight = 0.2;
    const recencyWeight = 0.1;

    // Calculate the final score using the weights
    const totalScore = (valueScore * valueWeight) + (entryPriceScore * entryPriceWeight) + (ticketSalesScore * ticketSalesWeight) + (recencyScore * recencyWeight)

    return totalScore;
}

function timestampToDaysInSeconds(timestampInSeconds: any) {
    const millisecondsPerDay = 1000 * 60 * 60 * 24;
    const timestampInMilliseconds = timestampInSeconds * 1000;
    return timestampInMilliseconds / millisecondsPerDay;
}



//   cron.schedule('* * */1 * *', () => { // This runs every hour, adjust as needed
//     console.log('Calculating trending scores...');
//     calculateTrendingScores();
//   });