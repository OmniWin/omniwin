import conn from './mysql';
export default class MysqlRepository {
    constructor() {
        console.log('MysqlRepository instantiated');
    }

    public async insertRaffle(_raffleData) {
        try {
            const {
                id,
                chainId,
                status,
                assetType,
                prizeAddress,
                prizeNumber,
                blockTimestamp,
                ownerAddress,
                minFundsToRaise,
                countViews = 0, // Default value if not provided
                winnerAddress = null, // Default value if not provided
                claimedPrize = false, // Default value if not provided
                deadline
            } = _raffleData;
    
            const formattedTimestamp = new Date(blockTimestamp * 1000).toISOString().slice(0, 19).replace('T', ' ');
    
            const sql = `
                INSERT INTO raffles (id, chain_id, status, asset_type, prize_address, prize_number, block_timestamp, owner_address, min_funds_to_raise, count_views, winner_address, claimed_prize, deadline)
                VALUES (?,?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;

            const results = await conn.query(sql, [
                id,
                chainId,
                status,
                assetType,
                prizeAddress,
                prizeNumber,
                formattedTimestamp,
                ownerAddress,
                minFundsToRaise,
                countViews,
                winnerAddress,
                claimedPrize,
                deadline
            ]);
    
            console.log('Data inserted successfully:', results);
        } catch (error) {
            console.error('Failed to insert raffle data:', error);
        }
    }    
}

export const mysqlInstance = new MysqlRepository();
