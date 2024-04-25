export const userData = [
    {
        id: 1,
        avatar: "/User1.png",
        messages: [
            {
                id: 1,
                avatar: "/User1.png",
                name: "Jane Doe",
                message: "Hey, Jakob",
                createdAt: "2021-09-01T12:00:00",
            },
            {
                id: 2,
                avatar: "/LoggedInUser.jpg",
                name: "Jakob Hoeg",
                message: "Hey!",
                createdAt: "2021-09-01T12:00:00",
            },
            {
                id: 3,
                avatar: "/User1.png",
                name: "Jane Doe",
                message: "How are you?",
                createdAt: "2021-09-01T12:00:00",
            },
            {
                id: 4,
                avatar: "/LoggedInUser.jpg",
                name: "Jakob Hoeg",
                message: "I am good, you?",
                createdAt: "2021-09-01T12:00:00",
            },
            {
                id: 5,
                avatar: "/User1.png",
                name: "Jane Doe",
                message: "I am good too!",
                createdAt: "2021-09-01T12:00:00",
            },
            {
                id: 6,
                avatar: "/LoggedInUser.jpg",
                name: "Jakob Hoeg",
                message: "That is good to hear!",
                createdAt: "2021-09-01T12:00:00",
            },
            {
                id: 7,
                avatar: "/User1.png",
                name: "Jane Doe",
                message: "How has your day been so far?",
                createdAt: "2021-09-01T12:00:00",
            },
            {
                id: 8,
                avatar: "/LoggedInUser.jpg",
                name: "Jakob Hoeg",
                message: "It has been good. I went for a run this morning and then had a nice breakfast. How about you?",
                createdAt: "2021-09-01T12:00:00",
            },
            {
                id: 9,
                avatar: "/User1.png",
                name: "Jane Doe",
                message: "I had a relaxing day. Just catching up on some reading.",
                createdAt: "2021-09-01T12:00:00",
            },
        ],
        name: "Jane Doe",
    },
    {
        id: 2,
        avatar: "/User2.png",
        name: "John Doe",
    },
    {
        id: 3,
        avatar: "/User3.png",
        name: "Elizabeth Smith",
    },
    {
        id: 4,
        avatar: "/User4.png",
        name: "John Smith",
    },
];

export type UserData = (typeof userData)[number];

export const loggedInUserData = {
    id: 5,
    avatar: "/LoggedInUser.jpg",
    name: "Jakob Hoeg",
};

export type LoggedInUserData = typeof loggedInUserData;

export interface Message {
    id: number;
    avatar: string;
    name: string;
    message: string;
    createdAt?: string;
}

export interface User {
    id: number;
    avatar: string;
    messages: Message[];
    name: string;
}
