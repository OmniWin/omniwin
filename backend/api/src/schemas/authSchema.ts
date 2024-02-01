export const authSchema = {
    body: {
        type: "object",
        properties: {
            siwe: {
                type: "string",
            },
            signature: {
                type: "string",
            },
            daoLogin: {
                type: "boolean",
            },
            resolveEns: {
                type: "boolean",
            },
            resolveLens: {
                type: "boolean",
            },

        },
        required: ["siwe", "signature", "daoLogin", "resolveEns", "resolveLens"]
    },
};
