
import { FastifyRequest, FastifyReply } from "fastify";
import { HttpError } from '../errors/httpError';
import { NftService } from '../services/nftService';
import { FastifyInstance } from 'fastify';
import util from 'util';

export class SSeController {

    public static async sse(req: FastifyRequest, res: FastifyReply) {
        try {
            // Function to send data to the client
            const sendEvent = (data: any) => {
                const formattedData = `data: ${JSON.stringify(data)}\n\n`;
                res.raw.write(formattedData);
            };

            res.raw.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
            });

            const nftService = new NftService(req.server as FastifyInstance);

            let lastUpdate = new Date() as Date | null;
            const { events, created_at } = await nftService.getEvents(null)

            lastUpdate = created_at;
            if (events.length > 0) {
                sendEvent(created_at);
            }

            // Example: Send current time every 5 seconds
            const intervalId = setInterval(async () => {

                const { events, created_at } = await nftService.getEvents(lastUpdate)

                console.log(util.inspect(events, false, null, true /* enable colors */));


                lastUpdate = created_at;

                if (events.length > 0) {
                    sendEvent(events);
                }
            }, 3000);

            // Keep the connection open
            res.sent = true;

            // Clear interval on client disconnect
            req.raw.on('close', () => {
                clearInterval(intervalId);
            });

        } catch (error: any) {
            console.log(error);
            throw new HttpError(req.server, error.message);
        }
    }

}

