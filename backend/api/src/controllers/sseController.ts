
import { FastifyRequest, FastifyReply } from "fastify";
import { HttpError } from '../errors/httpError';
import { NftService } from '../services/nftService';
import { FastifyInstance } from 'fastify';
import util from 'util';

export class SSeController {

    public static async sse(req: FastifyRequest, res: FastifyReply) {
        try {

            const sendHeartbeat = () => {
                res.raw.write(':heartbeat\n\n');
            };



            const sendEvent = (data: any) => {
                const formattedData = `data: ${JSON.stringify(data)}\n\n`;
                res.raw.write(formattedData);
            };

            //if this already set, it's not first event
            if (!res.raw.headersSent) {
                res.raw.setHeader('Content-Type', 'text/event-stream');
                res.raw.setHeader('Cache-Control', 'no-cache, no-transform');
                res.raw.setHeader('Connection', 'keep-alive');
            }

            const nftService = new NftService(req.server as FastifyInstance);

            let lastUpdate = new Date() as Date | null;
            const { events, created_at } = await nftService.getEvents(null)

            lastUpdate = created_at;
            if (events.length > 0) {
                sendEvent(created_at);
            }

            // Example: Send current time every 5 seconds
            const intervalId = setInterval(async () => {
                const { events, created_at } = await nftService.getEvents(lastUpdate);
                console.log(util.inspect(events, false, null, true /* enable colors */));

                if (events.length > 0) {
                    lastUpdate = created_at;
                    sendEvent(events);
                } else {
                    sendHeartbeat();
                }
            }, 3000);

            // Prevent Fastify from closing the connection
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

