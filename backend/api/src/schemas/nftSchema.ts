export const nftPagination = {
    body: {
        type: "object",
        properties: {
            pagination: {
                type: "object",
                properties: {
                    pageSize: { type: "integer" },
                    skip: { type: "integer" }
                },
                required: ["pageSize", "skip"]
            },
            types: {
                type: "array",
                items: { type: "string" }
            },
            networks: {
                type: "array",
                items: { type: "string" }
            },
            sortBy: {
                type: "string"
            },
            includeClosed: {
                type: "boolean"
            }
        },
        required: ["pagination", "types"]
    },
};
