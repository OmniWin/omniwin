import { RowDataPacket } from 'mysql2';
import conn from '../db/mysql';
import { NFT, NFTMetadata } from '../types/nft';
import { AssetType } from '../types/nft';

export default class MysqlRepository {
    constructor() {

    }

    public async insertNFT(data: NFT, metadata: NFTMetadata | null) {
        try {

            const assetType = this.mapIntToAssetType(data.assetType)

            const query = `INSERT INTO NFT (id_lot, total_tickets, bonus_tickets, tickets_bought, ticket_price, transactions, end_timestamp, fee, closed, buyout, asset_claimed, tokens_claimed, owner, token, token_id, amount, asset_type, data, network) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE network = ?`;
            const [rows,] = await conn.query(query, [data.lotID, data.totalTickets, data.bonusTickets, data.ticketsBought, data.ticketPrice, data.transactions, data.endTimestamp, data.fee, data.closed, data.buyout, data.assetClaimed, data.tokensClaimed, data.owner, data.token, data.tokenID, data.amount, assetType, data.data, "GOERLI", "GOERLI"]);

            const nftID = (rows as RowDataPacket).insertId;

            await this.insertMetadata(nftID, data.lotID, metadata);

            return rows;
        }
        catch (error) {
            console.log("error insertNFT: ", error);
            process.exit(1);
        }
    }


    public async insertMetadata(nftID: number, lotID: number, metadata: NFTMetadata | null) {
        try {

            if (!metadata) {
                const metadataQuery = `INSERT INTO NFTMetadata (id_nft,id_lot, name, image, json, image_url, image_local, status) VALUES (?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE status = ?`;
                await conn.query(metadataQuery, [nftID, lotID, "", "", "", "", "", "FAILED", "FAILED"]);

                return;
            }

            const metadataQuery = `INSERT INTO NFTMetadata (id_nft, id_lot, name, image, json, image_url, image_local, status) VALUES (?,?,?,?,?,?,?,?) ON DUPLICATE status = ?`;
            await conn.query(metadataQuery, [nftID, lotID, metadata?.name || "", metadata?.image || "", JSON.stringify(metadata), "", "", "SUCCESS", "SUCCESS"]);
        } catch (error) {
            const metadataQuery = `INSERT INTO NFTMetadata (id_nft, id_lot, name, image, json, image_url, image_local, status) VALUES (?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE status = ?`;
            await conn.query(metadataQuery, [nftID, lotID, "", "", JSON.stringify({}), "", "", "ERROR", "ERROR"]);
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
            // Handle other cases as needed
            default:
                throw new Error("Invalid AssetType value");
        }
    }


}


export const mysqlInstance = new MysqlRepository();
