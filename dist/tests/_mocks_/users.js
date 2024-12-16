"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mockUsers = [
    {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        password: '123456',
        favorite_movies: []
    },
    {
        id: 2,
        name: 'Jhonny Doe',
        email: 'jhony@example.com',
        password: '123456',
        favorite_movies: [
            {
                Title: "Harry Potter and the Deathly Hallows: Part 2",
                Year: "2018",
                imdbID: "tt1201608",
                Poster: "https://m.media-amazon.com/images/M/MV5BOTA1Mzc2N2ItZWRiNS00MjQzLTlmZDQtMjU0NmY1YWRkMGQ4XkEyXkFqcGc@._V1_SX300.jpg",
                Genre: "suspense",
                Plot: "a"
            }
        ]
    }
];
exports.default = mockUsers;
