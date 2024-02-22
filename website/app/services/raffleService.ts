import { RaffleResponse, RaffleParticipantsResponse, RaffleActivityResponse } from '../types/index';

export const fetchRaffleData = async (id: string): Promise<RaffleResponse['data']> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/nfts/${id}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resp = await response.json() as { data: RaffleResponse['data'] };

    return resp.data;
};

export const fetchRaffleParticipants = async (id: string, limit: string, cursor: string, order: string): Promise<RaffleParticipantsResponse['data']> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/nfts/${id}/tickets?order=${order}&limit=${limit}&cursor=${cursor}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resp = await response.json() as { data: RaffleParticipantsResponse['data'] };

    return resp.data;
};

export const fetchRaffleActivity = async (id: string, limit: number, offset: number | undefined) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/nfts/${id}/activity?limit=${limit}&offset=${offset}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resp: RaffleActivityResponse = await response.json();

    return resp.data;
}

export const fetchRaffleEntrants = async (id: string, limit: number, offset: number): Promise<RaffleParticipantsResponse['data']> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/nfts/${id}/entrants?limit=${limit}&offset=${offset}`;
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resp = await response.json() as { data: RaffleParticipantsResponse['data'] };

    return resp.data;
}

export const addFavorite = async (id: string): Promise<{ message: string, success: boolean }> => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/v1/nfts/${id}/favorite`;
    const response = await fetch(url, { method: 'POST' });

    const result = await response.json();

    return result;
}