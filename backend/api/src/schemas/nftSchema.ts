export const nftPagination = {
    body: {
        type: "object",
        properties: {
            pagination: {
                type: "object",
                properties: {
                    pageSize: { type: "integer" },
                    cursor: { type: "string" }
                },
                required: ["pageSize", "cursor"]
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
        required: ["pagination", "types"] // Adjust according to your requirements
    },
};
