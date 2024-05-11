// Import the necessary Fastify types.
import { FastifyReply, FastifyRequest } from 'fastify';
// import { CookieSerializeOptions } from '@fastify/cookie';

// Extend Fastify's module declarations to include custom methods and properties.
declare module 'fastify' {
  // Extend FastifyRequest to include the `user` property.
  interface FastifyRequest {
    user?: {
      address: string;
      chainId: number;
    };
  }

  // Extend FastifyReply to include jwtSign, setCookie, and clearCookie.
  interface FastifyReply {
    jwtDecode: () => Promise<any>; // Adjust the return type as needed.
    jwtSign: (payload: any, options?: any) => Promise<string>; // Adjust the payload and options types as needed.
    // setCookie: (name: string, value: string, options?: CookieSerializeOptions) => FastifyReply;
    // clearCookie: (name: string, options?: CookieSerializeOptions) => FastifyReply;
  }
}
