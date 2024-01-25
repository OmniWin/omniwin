import { MainABI } from '../types/MainABI'; // Import the TypeChain-generated type

export async function getLotByID(contract: MainABI, lotId: number) {
    const lot = await contract.lots(lotId);

    const lotID = lotId;
    const totalTickets = Number(lot.totalTickets);
    const bonusTickets = Number(lot.bonusTickets);
    const ticketsBought = Number(lot.ticketsBought);
    const ticketPrice = Number(lot.ticketPrice);
    const transactions = Number(lot.transactions);
    const endTimestamp = Number(lot.endTimestamp);
    const fee = Number(lot.fee);
    const closed = lot.closed;
    const buyout = lot.buyout;
    const assetClaimed = lot.assetClaimed;
    const tokensClaimed = lot.tokensClaimed;
    const owner = lot.owner;

    // Accessing the asset struct
    const asset = lot.asset;
    const token = asset.token;
    const tokenID = asset.tokenID.toString(); // Assuming tokenID is a large number
    const amount = asset.amount.toString(); // Assuming amount is a large number
    const assetType = Number(asset.assetType);
    const data = asset.data; // Assuming it's bytes or a string

    const response = {
        lotID,
        totalTickets,
        bonusTickets,
        ticketsBought,
        ticketPrice,
        transactions,
        endTimestamp,
        fee,
        closed,
        buyout,
        assetClaimed,
        tokensClaimed,
        owner,
        token,
        tokenID,
        amount,
        assetType,
        data
    };

    return response;
}
