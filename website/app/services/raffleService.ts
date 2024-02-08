import { RaffleResponse, RaffleParticipantsResponse } from '../types/index';

export const fetchRaffleData = async (id: string): Promise<RaffleResponse['data']> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/nfts/${id}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resp = await response.json() as { data: RaffleResponse['data'] };

    return resp.data;
};

export const fetchRaffleParticipants = async (id: string, limit: string, cursor: string): Promise<RaffleParticipantsResponse['data']> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/nfts/${id}/tickets?limit=${limit}&cursor=${cursor}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resp = await response.json() as { data: RaffleParticipantsResponse['data'] };

    return resp.data;
};
