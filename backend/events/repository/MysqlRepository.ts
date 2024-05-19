import { PoolConnection } from 'mysql2/promise';
import { RaffleInsert,BlockchainEvent,sideChainInsertEvent, BuyEntryInsertEvent } from "../types";

export default class MysqlRepository {
    constructor() {}

    public async insertRaffle(connection: PoolConnection, _raffleData: RaffleInsert) {
        try {
            const {
                id,
                chainId,
                contractAddress,
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
    
            const formattedTimestamp = new Date(parseInt(blockTimestamp) * 1000).toISOString().slice(0, 19).replace('T', ' ');
    
            const sql = `
                INSERT INTO raffles (id, chain_id, contract_address, status, asset_type, prize_address, prize_number, block_timestamp, owner_address, min_funds_to_raise, count_views, winner_address, claimed_prize, deadline)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
            `;

            const params = [
                id,
                chainId,
                contractAddress,
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
            ]

            await connection.query(sql, params);
        } catch (error) {
            throw new Error(`-> [insertRaffle] Failed to insert raffle data: ${error}`);
        }

        
    }    

    public async insertBlockchainEvent(connection: PoolConnection, eventData: BlockchainEvent) {
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

        try {
            await connection.execute(query, params);
        } catch (error) {
            throw new Error(`-> [insertBlockchainEvent] Failed to insert: ${error}`);
        }
    }    

    private stringifyBigInts(obj:any) {
        return JSON.stringify(obj, (key, value) =>
            typeof value === 'bigint'
                ? value.toString()  // Convert BigInt to string
                : value             // Return other values unchanged
        );
    }

    
    public async insertSidechainRaffle(connection: PoolConnection,eventData: sideChainInsertEvent) {
        const params = [
            eventData.raffleId,
            eventData.chainId,
            eventData.receiver,
            eventData.chainSelector,
            eventData.gasLimit,
            eventData.messageId,
            eventData.status
        ];

        const query = `
            INSERT INTO sidechain_enabled_raffles (raffle_id, chain_id, receiver, chain_selector, gas_limit, message_id, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        
        try {
            await connection.execute(query, params);
        } catch (error) {
            throw new Error(`-> [insertSidechainRaffle] Failed to insert sidechain raffle: ${error}`);
        }
    }  

    public async insertBuyEntry(connection: PoolConnection,eventData: BuyEntryInsertEvent) {
        const { tx, eventId, chainId, raffleId, buyerAddress, numberOfEntries, valueOfTickets, totalEntriesBought, totalRaisedAmount, priceStructureId, claimed, blockNumber, blockTimestamp, hasArrived } = eventData;
        const query = `
            INSERT INTO tickets (tx, event_id, chain_id, raffle_id, buyer_address, number_of_entries, value_of_tickets, total_entries_bought, total_raised_amount, price_structure_id, claimed, block_number, block_timestamp, has_arrived) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            tx,
            eventId,
            chainId,
            raffleId,
            buyerAddress,
            numberOfEntries,
            valueOfTickets,
            totalEntriesBought,
            totalRaisedAmount,
            priceStructureId,
            claimed,
            blockNumber,
            new Date(parseInt(blockTimestamp) * 1000).toISOString().slice(0, 19).replace('T', ' '),
            hasArrived
        ];

        try {
            const result = await connection.execute(query, params);
        } catch (error) {
            throw new Error(`-> [insertBuyEntry] Failed to insert buy entry: ${error}`);
        }
    }
}

export const mysqlRepository = new MysqlRepository();
