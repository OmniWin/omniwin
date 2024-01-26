export const nftPagination = {
    body: {
        type: "object",
        properties: {
            pagination: {
                type: "object",
                properties: {
                    pageSize: { type: "integer" },
                    offset: { type: "integer" }
                },
                required: ["pageSize", "offset"]
            },
            types: {
                type: "array",
                items: { type: "string" }
            },
            networks: {
                type: "array",
                items: { type: "string" }
            }
        },
        required: ["pagination", "types"] // Adjust according to your requirements
    },
};
