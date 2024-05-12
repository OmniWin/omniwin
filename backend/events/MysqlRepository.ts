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
                countViews = 0,
                winnerAddress = null,
                claimedPrize = false,
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
                Number(assetType) + 1,
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

    public async insertBlockchainEvent(eventData: {
        id: string;
        raffleId: string;
        name: string;
        json: any;
        statusParsing: string;
        statusMessage: null;
        createdAt: Date;
    }) {
        const { id, raffleId, name, json, statusParsing, statusMessage, createdAt } = eventData;
        const query = `
            INSERT INTO blockchain_events (id, raffle_id, name, json, status_parsing, status_message, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?);
        `;

        const logEvent = {
            args:json?.args,
            log: json?.log
        }

        const params = [
            id,
            raffleId,
            name,
            this.stringifyBigInts(logEvent),
            statusParsing,
            statusMessage ?? null,
            createdAt
        ];

        console.log('Inserting blockchain event:', params);
        try {
            const result = await conn.execute(query, params);
            console.log('Blockchain event inserted successfully:', result);
        } catch (error) {
            console.error('Failed to insert blockchain event:', error);
            throw error;
        }
    }    

    private stringifyBigInts(obj:any) {
        return JSON.stringify(obj, (key, value) =>
            typeof value === 'bigint'
                ? value.toString()  // Convert BigInt to string
                : value             // Return other values unchanged
        );
    }

    
    public async insertSidechainRaffle(eventData) {
        const { raffleId, chainId, status, receiver } = eventData;
        const query = `
            INSERT INTO sidechain_enable_raffle (raffle_id, chain_id, status, receiver) 
            VALUES (?, ?, ?, ?);
        `;

        const params = [
            raffleId,
            chainId,
            status,
            receiver
        ];
        try {
            const result = await conn.execute(query, params);
            console.log('Blockchain event inserted successfully:', result);
        } catch (error) {
            console.error('Failed to insert blockchain event:', error);
            throw error;
        }
    }  
}

export const mysqlInstance = new MysqlRepository();
