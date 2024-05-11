
import conn from '../db/mysql';
import { NFT, NFTMetadata } from '../types/nft';
import { AssetType } from '../types/nft';
import logger from "../log/winston";

export default class MysqlRepository {
    constructor() {
        console.log('MysqlRepository instantiated');
    }

    public async insertRaffle(_raffleData: object) {
        try {
            console.log('test');
           // const { transactionHash, sender, raffleId, value, blockNumber, timestamp } = eventData;
            // const sql = `
            //     INSERT INTO events (transactionHash, senderAddress, raffleId, value, blockNumber, timestamp)
            //     VALUES (?, ?, ?, ?, ?, ?)
            // `;
            // const formattedTimestamp = new Date(timestamp * 1000).toISOString().slice(0, 19).replace('T', ' ');
            // const results = await conn.query(sql, [transactionHash, sender, raffleId.toString(), value.toString(), blockNumber, formattedTimestamp]);
            // console.log('Data inserted successfully:', results);
        } catch (error) {
            console.error('Failed to insert event data:', error);
        }
    }


    public async insertNFT(data: NFT) {
        try {

            const assetType = this.mapIntToAssetType(data.assetType)


            const query = `INSERT INTO Nft (id_lot, total_tickets, bonus_tickets, tickets_bought, ticket_price, transactions, end_timestamp, fee, closed, buyout, asset_claimed, tokens_claimed, owner, token, token_id, amount, asset_type, data, network) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE total_tickets = VALUES(total_tickets), bonus_tickets = VALUES(bonus_tickets), tickets_bought = VALUES(tickets_bought), ticket_price = VALUES(ticket_price), transactions = VALUES(transactions), end_timestamp = VALUES(end_timestamp), fee = VALUES(fee), closed = VALUES(closed), buyout = VALUES(buyout), asset_claimed = VALUES(asset_claimed), tokens_claimed = VALUES(tokens_claimed), owner = VALUES(owner), token = VALUES(token), token_id = VALUES(token_id), amount = VALUES(amount), asset_type = VALUES(asset_type), data = VALUES(data), network = VALUES(network), id_nft = LAST_INSERT_ID(id_nft);`;

            const [rows,] = await conn.query(query, [
                data.lotID, data.totalTickets, data.bonusTickets, data.ticketsBought, data.ticketPrice, data.transactions, data.endTimestamp, data.fee, data.closed, data.buyout, data.assetClaimed, data.tokensClaimed, data.owner, data.token, data.tokenID, data.amount, assetType, data.data, "GOERLI",
            ]);


            const nftID = (rows as any).insertId;
            return nftID;
        }
        catch (error) {
            console.log(error);
            logger.error(`Error insertNFT ${data} ${error}`);
            throw new Error("Error insertNFT");
        }
    }

    public async insertMetadata(nftID: number, lotID: number, metadata: NFTMetadata | null) {
        try {
            if (!metadata) {
                const metadataQuery = `INSERT INTO NftMetadata (id_nft, id_lot, name, collection_name, description, json, image_url, image_local, status) VALUES (?,?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = ?`;

                await conn.query(metadataQuery, [nftID, lotID, null, null, null, null, null, null, "FAILED", "FAILED"]);

                return;
            }

            const metadataQuery = `INSERT INTO NftMetadata (id_nft, id_lot, name, collection_name, description, json, image_url, image_local, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE id_lot = ?, name = ?, description = ?, json = ?, image_url = ?, image_local = ?, status = ?`;

            await conn.query(metadataQuery, [nftID, lotID, metadata?.name || null, metadata?.collectionName || null, metadata?.description || null, JSON.stringify(metadata) || null, null, metadata?.image_local || null, "SUCCESS", lotID, metadata?.name || null, metadata?.description || null, JSON.stringify(metadata) || null, null, metadata?.image_local || null, "SUCCESS"]);

        } catch (error) {
            console.log(error);
            const metadataQuery = `INSERT INTO NftMetadata (id_nft, id_lot, name, collection_name, description, json, image_url, image_local, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = ?`;
            await conn.query(metadataQuery, [nftID, lotID, null, null, null, null, null, null, null, "ERROR", "ERROR"]);
            logger.error(`Error insertMetadata ${nftID} ${lotID} ${metadata} ${error}`);
            throw new Error("Error insertMetadata");
        }

    }

    private mapIntToAssetType(value: number): string {
        switch (value) {
            case AssetType.ERC721:
                return "ERC721";
            case AssetType.ERC1155:
                return "ERC1155";
            case AssetType.ERC20:
                return "ERC20";
            case AssetType.NativeToken:
                return "NATIVE";
            // Handle other cases as needed
            default:
                logger.error(`Invalid mapIntToAssetType AssetType value ${value}`);
                throw new Error(`Invalid mapIntToAssetType AssetType value ${value}`);
        }
    }


    public async createLot(data: {
        lotID: string,
        token: string,
        tokenID: string,
        amount: string,
        assetType: number,
        data: string,
        owner: string,
        signer: string,
        totalTickets: string,
        ticketPrice: string,
        endTimestamp: string,
    }) {
        try {
            const assetType = this.mapIntToAssetType(data.assetType)

            const query = `INSERT INTO Nft (id_lot, token, token_id, amount, asset_type, data, owner, signer, total_tickets, ticket_price, end_timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE token = VALUES(token), token_id = VALUES(token_id), amount = VALUES(amount), asset_type = VALUES(asset_type), data = VALUES(data), owner = VALUES(owner), signer = VALUES(signer), total_tickets = VALUES(total_tickets), ticket_price = VALUES(ticket_price), end_timestamp = VALUES(end_timestamp);`;

            const [rows,] = await conn.query(query, [
                data.lotID, data.token, data.tokenID, data.amount, assetType, data.data, data.owner, data.signer, data.totalTickets, data.ticketPrice, data.endTimestamp, 0
            ]);

            return rows;
        } catch (error) {
            logger.error(`Error createLot ${data} ${error}`);
            console.log(`${data} ${error}`);
            throw new Error(`Error createLot ${data} ${error}`);
        }
    }

    public async buyTickets(data: {
        lotID: number,
        recipient: string,
        totalTickets: number,
        amount: number,
        tokensSpent: number,
        bonus: number,
        uniqueID: string,
        block: number,
        transactionHash: string,
        network: string
    }) {
        try {
            const query = `INSERT INTO Tickets (id_lot, unique_id, recipient, total_tickets, amount, tokens_spent, bonus, block, transaction_hash, network) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE recipient = VALUES(recipient), total_tickets = VALUES(total_tickets), amount = VALUES(amount), tokens_spent = VALUES(tokens_spent), bonus = VALUES(bonus), block = VALUES(block), transaction_hash = VALUES(transaction_hash), network = VALUES(network), updated_at = CURRENT_TIMESTAMP()
            ;`;

            const [rows,] = await conn.query(query, [
                data.lotID, data.uniqueID, data.recipient, data.totalTickets, data.amount, data.tokensSpent, data.bonus, data.block, data.transactionHash, data.network
            ]);

            return rows;
        } catch (error) {
            logger.error(`Error buyTickets ${data} ${error}`);
            throw new Error("Error buyTickets");
        }
    }

    public async incrementTotalTickets(lotID: number) {
        try {
            const query = `UPDATE Nft SET total_tickets = total_tickets + 1 WHERE id_lot = ?`;

            const [rows,] = await conn.query(query, [
                lotID,
            ]);

            return rows;
        } catch (error) {
            logger.error(`Error incrementTotalTickets ${lotID} ${error}`);
            throw new Error("Error incrementTotalTickets");
        }
    }

    public async getTicketsByLotID(lotID: number) {
        try {
            const query = `SELECT id_ticket, id_lot, recipient, total_tickets, amount, tokens_spent, bonus, created_at,updated_at,unique_id FROM Tickets WHERE id_lot = ?;`;

            const [rows,] = await conn.query(query, [
                lotID,
            ]);

            return rows as {
                id_ticket: number,
                id_lot: number,
                recipient: string,
                totalTickets: number,
                amount: number,
                tokensSpent: number,
                bonus: number,
                created_at: Date,
                updated_at: Date,
                uniqueID: string,
            }[];
        } catch (error) {
            logger.error(`Error getTicketsByLotID ${lotID} ${error}`);
            throw new Error("Error getTicketsByLotID");
        }
    }


    public async ticketExists(uniqueId: string) {
        try {
            const query = `SELECT unique_id FROM Tickets WHERE unique_id = ?`;
            const [rows,] = await conn.query(query, [
                uniqueId,
            ]);

            return (rows as unknown as string[]).length > 0;
        } catch (error) {
            logger.error(`Error getTicketsByUniqueID ${uniqueId} ${error}`);
            throw new Error("Error getTicketsByUniqueID");
        }
    }

    public async updateTotalTickets(lotID: number, totalTickets: number) {
        try {
            const query = `UPDATE Nft SET total_tickets = ? WHERE id_lot = ?`;

            const [rows,] = await conn.query(query, [
                totalTickets, lotID,
            ]);

            return rows;
        } catch (error) {
            logger.error(`Error updateTotalTickets ${lotID} ${totalTickets} ${error}`);
            throw new Error("Error updateTotalTickets");
        }
    }
}

export const mysqlInstance = new MysqlRepository();
