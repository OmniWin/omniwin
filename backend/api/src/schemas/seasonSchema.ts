export const seasonSchema = {
    body: {
        type: "object",
        properties: {
            end_date: {
                type: "string"
            }
        },
        required: ["end_date"]
    }
};
